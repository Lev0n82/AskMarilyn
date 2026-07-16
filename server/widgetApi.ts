import { Router } from "express";
import { getDb } from "./db";
import { widgets, messages, documentChunks, conversations } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import axios from "axios";

export function createWidgetApiRouter() {
  const router = Router();

  // Get widget config (public, no auth)
  router.get("/api/widget/:id/config", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const result = await db.select().from(widgets).where(eq(widgets.id, parseInt(req.params.id))).limit(1);
      const w = result[0];
      if (!w || !w.isActive) return res.status(404).json({ error: "Widget not found" });
      res.json({
        id: w.id,
        name: w.name,
        theme: w.theme,
        greeting: w.greeting,
        suggestionChips: w.suggestionChips,
        whatsappNumber: w.whatsappNumber,
        phoneNumber: w.phoneNumber,
        emailAddress: w.emailAddress,
        accessibilityEnabled: w.accessibilityEnabled,
      });
    } catch (err) {
      res.status(500).json({ error: "Internal error" });
    }
  });

  // Start a conversation (public)
  router.post("/api/widget/conversation/start", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const { widgetId, visitorId } = req.body;
      await db.insert(conversations).values({ widgetId, visitorId, status: "active" });
      const result = await db.select().from(conversations)
        .where(eq(conversations.visitorId, visitorId))
        .orderBy(desc(conversations.createdAt))
        .limit(1);
      res.json(result[0]);
    } catch (err) {
      res.status(500).json({ error: "Internal error" });
    }
  });

  // Send message and get AI response (public)
  router.post("/api/widget/conversation/message", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });
      const { conversationId, widgetId, content } = req.body;

      const widget = await db.select().from(widgets).where(eq(widgets.id, widgetId)).limit(1);
      if (!widget[0]) return res.status(404).json({ error: "Widget not found" });
      const w = widget[0];

      // Save user message
      await db.insert(messages).values({ conversationId, role: "user", content });

      // RAG: keyword search for relevant chunks
      let ragContext = "";
      const allChunks = await db.select().from(documentChunks).where(eq(documentChunks.widgetId, widgetId));
      if (allChunks.length > 0) {
        const queryWords = content.toLowerCase().split(/\s+/);
        const scored = allChunks.map((chunk: any) => {
          const text = chunk.content.toLowerCase();
          const score = queryWords.reduce((acc: number, word: string) => acc + (text.includes(word) ? 1 : 0), 0);
          return { ...chunk, score };
        });
        const topChunks = scored.filter((c: any) => c.score > 0).sort((a: any, b: any) => b.score - a.score).slice(0, 3);
        if (topChunks.length > 0) ragContext = topChunks.map((c: any) => c.content).join("\n\n---\n\n");
      }

      // Build prompt
      const systemPrompt = w.systemPrompt || "You are a helpful assistant.";
      const qualificationPrompt = w.qualificationPrompt
        ? `\n\nIMPORTANT: ${w.qualificationPrompt}\nWhen the user is qualified for human assistance or explicitly asks for help, respond with [QUALIFIED_FOR_HUMAN_HELP] at the end of your message.`
        : "";
      const contextSection = ragContext ? `\n\nRelevant knowledge base context:\n${ragContext}` : "";
      const fullSystemPrompt = `${systemPrompt}${qualificationPrompt}${contextSection}`;

      // Get conversation history
      const history = await db.select().from(messages).where(eq(messages.conversationId, conversationId));
      const ollamaMessages = [
        { role: "system", content: fullSystemPrompt },
        ...history.map((m: any) => ({ role: m.role, content: m.content })),
      ];

      // Call Ollama
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
        if (aiResponse.includes("[QUALIFIED_FOR_HUMAN_HELP]")) {
          showContactBar = true;
          aiResponse = aiResponse.replace("[QUALIFIED_FOR_HUMAN_HELP]", "").trim();
          await db.update(conversations).set({ status: "qualified" }).where(eq(conversations.id, conversationId));
        }
      } catch (error: any) {
        console.error("[Ollama] Error:", error?.message);
        aiResponse = "I'm currently unable to connect to the AI service. Please try again later or contact support.";
      }

      // Save AI response
      await db.insert(messages).values({ conversationId, role: "assistant", content: aiResponse, ragContext: ragContext || null });

      res.json({
        response: aiResponse,
        showContactBar,
        contactInfo: showContactBar ? {
          whatsappNumber: w.whatsappNumber,
          phoneNumber: w.phoneNumber,
          emailAddress: w.emailAddress,
        } : null,
      });
    } catch (err: any) {
      console.error("[Widget Message] Error:", err?.message);
      res.status(500).json({ error: "Internal error" });
    }
  });

  return router;
}
