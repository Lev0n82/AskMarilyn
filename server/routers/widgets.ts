import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { widgets } from "../../drizzle/schema";
import { listModels, testConnection } from "../aiProvider";

const aiProviderEnum = z.enum(["manus", "ollama", "vllm", "openai_compatible"]);
const voiceActivationEnum = z.enum(["with_overlay", "separate_toggle", "always_visible"]);
const voiceScopeEnum = z.enum(["accessibility", "chat", "both"]);
const voiceLanguageModeEnum = z.enum(["auto_detect", "pre_selected", "user_chosen"]);
const voicePositionEnum = z.enum(["top_left", "top_right", "bottom_left", "bottom_right", "center"]);

export const widgetRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(widgets).where(eq(widgets.userId, ctx.user.id)).orderBy(desc(widgets.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const result = await db.select().from(widgets).where(eq(widgets.id, input.id)).limit(1);
      if (!result[0] || result[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }
      return result[0];
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      theme: z.enum(["Liquid Glass", "Warm Neutral", "Aurora Soft"]).default("Warm Neutral"),
      greeting: z.string().optional(),
      suggestionChips: z.array(z.string()).optional(),
      // AI Provider
      aiProvider: aiProviderEnum.default("manus"),
      aiApiBaseUrl: z.string().optional(),
      aiApiKey: z.string().optional(),
      aiModel: z.string().optional(),
      // Legacy Ollama
      ollamaEndpoint: z.string().optional(),
      ollamaModel: z.string().optional(),
      systemPrompt: z.string().optional(),
      // Communication
      whatsappNumber: z.string().optional(),
      phoneNumber: z.string().optional(),
      emailAddress: z.string().optional(),
      qualificationPrompt: z.string().optional(),
      accessibilityEnabled: z.boolean().optional(),
      // Voice Assistant
      voiceEnabled: z.boolean().optional(),
      voiceActivationMode: voiceActivationEnum.optional(),
      voiceIdleOpacity: z.number().min(5).max(100).optional(),
      voiceActiveOpacity: z.number().min(50).max(100).optional(),
      voiceScope: voiceScopeEnum.optional(),
      voiceLanguageMode: voiceLanguageModeEnum.optional(),
      voiceLanguages: z.array(z.string()).optional(),
      voicePosition: voicePositionEnum.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(widgets).values({
        userId: ctx.user.id,
        tenantId: ctx.user.tenantId,
        name: input.name,
        theme: input.theme,
        greeting: input.greeting || "Hi there! How can I help you today?",
        suggestionChips: input.suggestionChips || ["Get Started", "Pricing", "Support"],
        // AI Provider
        aiProvider: input.aiProvider || "manus",
        aiApiBaseUrl: input.aiApiBaseUrl || null,
        aiApiKey: input.aiApiKey || null,
        aiModel: input.aiModel || null,
        // Legacy
        ollamaEndpoint: input.ollamaEndpoint || "http://localhost:11434",
        ollamaModel: input.ollamaModel || null,
        systemPrompt: input.systemPrompt || "You are a helpful assistant.",
        // Communication
        whatsappNumber: input.whatsappNumber || null,
        phoneNumber: input.phoneNumber || null,
        emailAddress: input.emailAddress || null,
        qualificationPrompt: input.qualificationPrompt || null,
        accessibilityEnabled: input.accessibilityEnabled ?? true,
        // Voice
        voiceEnabled: input.voiceEnabled ?? false,
        voiceActivationMode: input.voiceActivationMode || "separate_toggle",
        voiceIdleOpacity: input.voiceIdleOpacity ?? 30,
        voiceActiveOpacity: input.voiceActiveOpacity ?? 90,
        voiceScope: input.voiceScope || "both",
        voiceLanguageMode: input.voiceLanguageMode || "auto_detect",
        voiceLanguages: input.voiceLanguages || ["en", "fr", "es"],
        voicePosition: input.voicePosition || "bottom_left",
      });

      const result = await db.select().from(widgets).where(eq(widgets.userId, ctx.user.id)).orderBy(desc(widgets.createdAt)).limit(1);
      return result[0];
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      theme: z.enum(["Liquid Glass", "Warm Neutral", "Aurora Soft"]).optional(),
      greeting: z.string().optional(),
      suggestionChips: z.array(z.string()).optional(),
      // AI Provider
      aiProvider: aiProviderEnum.optional(),
      aiApiBaseUrl: z.string().nullable().optional(),
      aiApiKey: z.string().nullable().optional(),
      aiModel: z.string().nullable().optional(),
      // Legacy
      ollamaEndpoint: z.string().optional(),
      ollamaModel: z.string().optional(),
      systemPrompt: z.string().optional(),
      // Communication
      whatsappNumber: z.string().nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      emailAddress: z.string().nullable().optional(),
      qualificationPrompt: z.string().nullable().optional(),
      accessibilityEnabled: z.boolean().optional(),
      isActive: z.boolean().optional(),
      // Voice Assistant
      voiceEnabled: z.boolean().optional(),
      voiceActivationMode: voiceActivationEnum.optional(),
      voiceIdleOpacity: z.number().min(5).max(100).optional(),
      voiceActiveOpacity: z.number().min(50).max(100).optional(),
      voiceScope: voiceScopeEnum.optional(),
      voiceLanguageMode: voiceLanguageModeEnum.optional(),
      voiceLanguages: z.array(z.string()).optional(),
      voicePosition: voicePositionEnum.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(widgets).where(eq(widgets.id, input.id)).limit(1);
      if (!existing[0] || existing[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }

      const { id, ...updateData } = input;
      const cleanData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));

      if (Object.keys(cleanData).length > 0) {
        await db.update(widgets).set(cleanData).where(eq(widgets.id, id));
      }

      const result = await db.select().from(widgets).where(eq(widgets.id, id)).limit(1);
      return result[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(widgets).where(eq(widgets.id, input.id)).limit(1);
      if (!existing[0] || existing[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }

      await db.delete(widgets).where(eq(widgets.id, input.id));
      return { success: true };
    }),

  // AI Provider operations
  testAIConnection: protectedProcedure
    .input(z.object({
      provider: aiProviderEnum,
      apiBaseUrl: z.string().optional(),
      apiKey: z.string().optional(),
      model: z.string().optional(),
      ollamaEndpoint: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return testConnection({
        provider: input.provider,
        apiBaseUrl: input.apiBaseUrl,
        apiKey: input.apiKey,
        model: input.model,
        ollamaEndpoint: input.ollamaEndpoint,
      });
    }),

  listAIModels: protectedProcedure
    .input(z.object({
      provider: aiProviderEnum,
      apiBaseUrl: z.string().optional(),
      apiKey: z.string().optional(),
      ollamaEndpoint: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return listModels({
        provider: input.provider,
        apiBaseUrl: input.apiBaseUrl,
        apiKey: input.apiKey,
        ollamaEndpoint: input.ollamaEndpoint,
      });
    }),

  // Public endpoint for the embedded widget to fetch config
  getPublicConfig: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const result = await db.select().from(widgets).where(eq(widgets.id, input.id)).limit(1);
      if (!result[0] || !result[0].isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }
      const w = result[0];
      return {
        id: w.id,
        name: w.name,
        theme: w.theme,
        greeting: w.greeting,
        suggestionChips: w.suggestionChips,
        whatsappNumber: w.whatsappNumber,
        phoneNumber: w.phoneNumber,
        emailAddress: w.emailAddress,
        accessibilityEnabled: w.accessibilityEnabled,
        voiceEnabled: w.voiceEnabled,
        voiceActivationMode: w.voiceActivationMode,
        voiceIdleOpacity: w.voiceIdleOpacity,
        voiceActiveOpacity: w.voiceActiveOpacity,
        voiceScope: w.voiceScope,
        voiceLanguageMode: w.voiceLanguageMode,
        voiceLanguages: w.voiceLanguages,
        voicePosition: w.voicePosition,
      };
    }),
});
