import { Router } from "express";
import { getDb } from "./db";
import { widgets, messages, documentChunks, conversations } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { chatCompletion, type AIProviderConfig, type ChatMessage } from "./aiProvider";

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
        // Voice assistant config (public-facing settings only, no keys)
        voiceEnabled: w.voiceEnabled,
        voiceActivationMode: w.voiceActivationMode,
        voiceIdleOpacity: w.voiceIdleOpacity,
        voiceActiveOpacity: w.voiceActiveOpacity,
        voiceScope: w.voiceScope,
        voiceLanguageMode: w.voiceLanguageMode,
        voiceLanguages: w.voiceLanguages,
        voicePosition: w.voicePosition,
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

  // Send message and get AI response (public) — uses unified AI provider
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
      const chatMessages: ChatMessage[] = [
        { role: "system", content: fullSystemPrompt },
        ...history.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ];

      // Build AI provider config from widget settings
      const providerConfig: AIProviderConfig = {
        provider: (w.aiProvider as any) || "manus",
        apiBaseUrl: w.aiApiBaseUrl,
        apiKey: w.aiApiKey,
        model: w.aiModel,
        ollamaEndpoint: w.ollamaEndpoint,
        ollamaModel: w.ollamaModel,
      };

      // Call the unified AI provider
      let aiResponse = "I'm sorry, I couldn't process your request. Please try again.";
      let showContactBar = false;
      try {
        const result = await chatCompletion(providerConfig, chatMessages);
        aiResponse = result.content;

        if (aiResponse.includes("[QUALIFIED_FOR_HUMAN_HELP]")) {
          showContactBar = true;
          aiResponse = aiResponse.replace("[QUALIFIED_FOR_HUMAN_HELP]", "").trim();
          await db.update(conversations).set({ status: "qualified" }).where(eq(conversations.id, conversationId));
        }
      } catch (error: any) {
        console.error("[AI Provider] Error:", error?.message);
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

  // Demo chat endpoint — uses Manus built-in LLM directly (no widget ID required)
  router.post("/api/widget/demo/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      // Import invokeLLM from the core module
      const { invokeLLM } = await import("./_core/llm");

      // Build messages array from history + new message
      const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        {
          role: "system",
          content: `You are Hansen AI, a helpful conversational assistant. You are running as a live demo on the Hansen platform — a self-hosted, white-label AI chat widget with RAG knowledge base, accessibility overlay, and voice assistant capabilities.

Key facts about Hansen:
- Named in honor of Rick Hansen, Canadian accessibility advocate
- Offers 3 widget themes: Liquid Glass, Warm Neutral, Aurora Soft
- Features: RAG knowledge base, accessibility overlay, voice assistant eye, multi-channel escalation
- Always-free tier available (not a trial — genuinely free forever)
- Can be self-hosted with Ollama/vLLM or use hosted AI service
- Supports on-premises deployment via Docker Compose

Be helpful, concise, and friendly. If the user asks to "talk to a human" or requests human help, include [QUALIFIED_FOR_HUMAN_HELP] at the end of your response.`,
        },
      ];

      // Add conversation history
      if (Array.isArray(history)) {
        for (const msg of history.slice(-10)) {
          if (msg.role === "user" || msg.role === "assistant") {
            chatMessages.push({ role: msg.role, content: msg.content });
          }
        }
      }

      // Add the new user message
      chatMessages.push({ role: "user", content: message });

      const result = await invokeLLM({
        messages: chatMessages,
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
      });

      let aiResponse = result.choices?.[0]?.message?.content || "I couldn't generate a response.";
      if (typeof aiResponse !== "string") {
        aiResponse = JSON.stringify(aiResponse);
      }

      let showContactBar = false;
      if (aiResponse.includes("[QUALIFIED_FOR_HUMAN_HELP]")) {
        showContactBar = true;
        aiResponse = aiResponse.replace("[QUALIFIED_FOR_HUMAN_HELP]", "").trim();
      }

      res.json({
        response: aiResponse,
        showContactBar,
        contactInfo: showContactBar ? {
          whatsappNumber: "+1-555-0123",
          phoneNumber: "+1-555-0456",
          emailAddress: "support@hansen.ai",
        } : null,
      });
    } catch (err: any) {
      console.error("[Demo Chat] Error:", err?.message);
      res.status(500).json({
        response: "I'm currently experiencing high demand. Please try again in a moment, or sign up free to connect your own AI provider.",
        showContactBar: false,
        contactInfo: null,
      });
    }
  });

  return router;
}
