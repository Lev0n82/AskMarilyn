import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import axios from "axios";

/**
 * AI Provider Router
 * Kept as "ollamaRouter" for backward compatibility with existing imports,
 * but now supports all providers (Ollama, vLLM, OpenAI-compatible).
 * Manus LLM models are handled directly in the widgets router.
 */
export const ollamaRouter = router({
  // List available models from an Ollama endpoint
  listModels: protectedProcedure
    .input(z.object({
      endpoint: z.string().default("http://localhost:11434"),
    }))
    .query(async ({ input }) => {
      try {
        const response = await axios.get(`${input.endpoint}/api/tags`, { timeout: 10000 });
        const models = response.data?.models || [];
        return models.map((m: any) => ({
          name: m.name,
          model: m.model,
          size: m.size,
          digest: m.digest,
          modifiedAt: m.modified_at,
          details: m.details,
        }));
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to connect to Ollama at ${input.endpoint}: ${error?.message || "Connection refused"}`,
        });
      }
    }),

  // Test connection to an Ollama endpoint
  testConnection: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await axios.get(`${input.endpoint}/api/tags`, { timeout: 10000 });
        const models = response.data?.models || [];
        return {
          success: true,
          modelCount: models.length,
          models: models.map((m: any) => m.name),
        };
      } catch (error: any) {
        return {
          success: false,
          modelCount: 0,
          models: [],
          error: error?.message || "Connection failed",
        };
      }
    }),

  // Pull a model (trigger download) — Ollama-specific
  pullModel: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
      model: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await axios.post(`${input.endpoint}/api/pull`, {
          name: input.model,
          stream: false,
        }, { timeout: 300000 });
        return { success: true, message: `Model ${input.model} pulled successfully` };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to pull model: ${error?.message || "Unknown error"}`,
        });
      }
    }),

  // Get model info — Ollama-specific
  getModelInfo: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
      model: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const response = await axios.post(`${input.endpoint}/api/show`, {
          name: input.model,
        }, { timeout: 10000 });
        return response.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to get model info: ${error?.message || "Unknown error"}`,
        });
      }
    }),

  // List models from OpenAI-compatible endpoint (vLLM, LM Studio, LocalAI, etc.)
  listOpenAIModels: protectedProcedure
    .input(z.object({
      baseUrl: z.string(),
      apiKey: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        let url = input.baseUrl.replace(/\/$/, "");
        if (!url.endsWith("/v1/models")) {
          if (!url.endsWith("/v1")) url += "/v1";
          url += "/models";
        }
        const headers: Record<string, string> = {};
        if (input.apiKey) headers["Authorization"] = `Bearer ${input.apiKey}`;
        const response = await axios.get(url, { headers, timeout: 10000 });
        return (response.data?.data || []).map((m: any) => ({
          id: m.id,
          name: m.id,
          ownedBy: m.owned_by,
        }));
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to list models: ${error?.message || "Connection refused"}`,
        });
      }
    }),

  // Test connection to OpenAI-compatible endpoint
  testOpenAIConnection: protectedProcedure
    .input(z.object({
      baseUrl: z.string(),
      apiKey: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        let url = input.baseUrl.replace(/\/$/, "");
        if (!url.endsWith("/v1/models")) {
          if (!url.endsWith("/v1")) url += "/v1";
          url += "/models";
        }
        const headers: Record<string, string> = {};
        if (input.apiKey) headers["Authorization"] = `Bearer ${input.apiKey}`;
        const response = await axios.get(url, { headers, timeout: 10000 });
        const models = response.data?.data || [];
        return {
          success: true,
          modelCount: models.length,
          models: models.map((m: any) => m.id),
        };
      } catch (error: any) {
        return {
          success: false,
          modelCount: 0,
          models: [],
          error: error?.message || "Connection failed",
        };
      }
    }),
});
