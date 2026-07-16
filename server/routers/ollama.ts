import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import axios from "axios";

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

  // Pull a model (trigger download)
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
        }, { timeout: 300000 }); // 5 min timeout for model downloads
        return { success: true, message: `Model ${input.model} pulled successfully` };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to pull model: ${error?.message || "Unknown error"}`,
        });
      }
    }),

  // Get model info
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
});
