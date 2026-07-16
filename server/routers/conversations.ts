import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { conversations, messages, widgets, documentChunks } from "../../drizzle/schema";
import axios from "axios";

export const conversationRouter = router({
  // Dashboard: list conversations for a widget
  list: protectedProcedure
    .input(z.object({ widgetId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const widget = await db.select().from(widgets).where(eq(widgets.id, input.widgetId)).limit(1);
      if (!widget[0] || widget[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return db.select().from(conversations).where(eq(conversations.widgetId, input.widgetId)).orderBy(desc(conversations.createdAt));
    }),

  // Dashboard: get messages for a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(messages).where(eq(messages.conversationId, input.conversationId));
    }),

  // Widget: start a new conversation
  start: publicProcedure
    .input(z.object({
      widgetId: z.number(),
      visitorId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(conversations).values({
        widgetId: input.widgetId,
        visitorId: input.visitorId,
        status: "active",
      });

      const result = await db.select().from(conversations)
        .where(eq(conversations.visitorId, input.visitorId))
        .orderBy(desc(conversations.createdAt))
        .limit(1);

      return result[0];
    }),

  // Widget: send a message and get AI response
  sendMessage: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      widgetId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Get widget config
      const widget = await db.select().from(widgets).where(eq(widgets.id, input.widgetId)).limit(1);
      if (!widget[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      const w = widget[0];

      // Save user message
      await db.insert(messages).values({
        conversationId: input.conversationId,
        role: "user",
        content: input.content,
      });

      // RAG: Search for relevant context
      let ragContext = "";
      const allChunks = await db.select().from(documentChunks).where(eq(documentChunks.widgetId, input.widgetId));
      if (allChunks.length > 0) {
        const queryWords = input.content.toLowerCase().split(/\s+/);
        const scored = allChunks.map(chunk => {
          const content = chunk.content.toLowerCase();
          const score = queryWords.reduce((acc, word) => acc + (content.includes(word) ? 1 : 0), 0);
          return { ...chunk, score };
        });
        const topChunks = scored.filter(c => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
        if (topChunks.length > 0) {
          ragContext = topChunks.map(c => c.content).join("\n\n---\n\n");
        }
      }

      // Build prompt with RAG context
      const systemPrompt = w.systemPrompt || "You are a helpful assistant.";
      const qualificationPrompt = w.qualificationPrompt
        ? `\n\nIMPORTANT: ${w.qualificationPrompt}\nWhen the user is qualified for human assistance or explicitly asks for help, respond with [QUALIFIED_FOR_HUMAN_HELP] at the end of your message.`
        : "";

      const contextSection = ragContext
        ? `\n\nRelevant knowledge base context:\n${ragContext}`
        : "";

      const fullSystemPrompt = `${systemPrompt}${qualificationPrompt}${contextSection}`;

      // Get conversation history
      const history = await db.select().from(messages).where(eq(messages.conversationId, input.conversationId));
      const ollamaMessages = [
        { role: "system", content: fullSystemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
      ];

      // Call Ollama API
      let aiResponse = "I'm sorry, I couldn't process your request. Please try again.";
      let showContactBar = false;

      try {
        const ollamaEndpoint = w.ollamaEndpoint || "http://localhost:11434";
        const model = w.ollamaModel || "llama3.2";

        const response = await axios.post(`${ollamaEndpoint}/api/chat`, {
          model,
          messages: ollamaMessages,
          stream: false,
        }, { timeout: 60000 });

        aiResponse = response.data?.message?.content || aiResponse;

        // Check if AI qualified the user for human help
        if (aiResponse.includes("[QUALIFIED_FOR_HUMAN_HELP]")) {
          showContactBar = true;
          aiResponse = aiResponse.replace("[QUALIFIED_FOR_HUMAN_HELP]", "").trim();
          // Update conversation status
          await db.update(conversations).set({ status: "qualified" }).where(eq(conversations.id, input.conversationId));
        }
      } catch (error: any) {
        console.error("[Ollama] Error:", error?.message || error);
        aiResponse = "I'm currently unable to connect to the AI service. Please try again later or contact support.";
      }

      // Save AI response
      await db.insert(messages).values({
        conversationId: input.conversationId,
        role: "assistant",
        content: aiResponse,
        ragContext: ragContext || null,
      });

      return {
        response: aiResponse,
        showContactBar,
        contactInfo: showContactBar ? {
          whatsappNumber: w.whatsappNumber,
          phoneNumber: w.phoneNumber,
          emailAddress: w.emailAddress,
        } : null,
      };
    }),
});
