/**
 * Unified AI Provider Service
 * Routes chat completions to the configured provider:
 * - "manus": Uses Manus built-in LLM (demo/hosted mode)
 * - "ollama": Uses Ollama REST API (local, CPU-friendly)
 * - "vllm": Uses vLLM OpenAI-compatible endpoint (local GPU inference)
 * - "openai_compatible": Any OpenAI-format API (LM Studio, LocalAI, Together, etc.)
 */

import axios from "axios";
import { ENV } from "./_core/env";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProviderConfig {
  provider: "manus" | "ollama" | "vllm" | "openai_compatible";
  apiBaseUrl?: string | null;
  apiKey?: string | null;
  model?: string | null;
  // Legacy fields
  ollamaEndpoint?: string | null;
  ollamaModel?: string | null;
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  provider: string;
  tokensUsed?: number;
}

/**
 * Send a chat completion request to the configured AI provider
 */
export async function chatCompletion(
  config: AIProviderConfig,
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number; timeout?: number }
): Promise<ChatCompletionResult> {
  const timeout = options?.timeout || 60000;
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 2048;

  switch (config.provider) {
    case "manus":
      return callManusLLM(messages, temperature, maxTokens, timeout);
    case "ollama":
      return callOllama(config, messages, temperature, maxTokens, timeout);
    case "vllm":
      return callOpenAICompatible(config, messages, temperature, maxTokens, timeout, "vllm");
    case "openai_compatible":
      return callOpenAICompatible(config, messages, temperature, maxTokens, timeout, "openai_compatible");
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}

/**
 * Manus Built-in LLM (for hosted demo)
 * Uses the Forge API with OpenAI-compatible chat completions
 */
async function callManusLLM(
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number,
  timeout: number
): Promise<ChatCompletionResult> {
  const apiUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!apiUrl || !apiKey) {
    throw new Error("Manus LLM not configured. Set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY.");
  }

  try {
    const response = await axios.post(
      `${apiUrl}/v1/chat/completions`,
      {
        model: "claude-sonnet-4-20250514",
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout,
      }
    );

    const choice = response.data?.choices?.[0];
    return {
      content: choice?.message?.content || "I couldn't generate a response.",
      model: response.data?.model || "claude-sonnet-4-20250514",
      provider: "manus",
      tokensUsed: response.data?.usage?.total_tokens,
    };
  } catch (error: any) {
    console.error("[Manus LLM] Error:", error?.response?.data || error?.message);
    throw new Error(`Manus LLM error: ${error?.response?.data?.error?.message || error?.message || "Unknown error"}`);
  }
}

/**
 * Ollama REST API (local inference, CPU-friendly)
 * Prioritizes locally run models like Granite 4, Llama 3, Mistral
 */
async function callOllama(
  config: AIProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number,
  timeout: number
): Promise<ChatCompletionResult> {
  const endpoint = config.apiBaseUrl || config.ollamaEndpoint || "http://localhost:11434";
  const model = config.model || config.ollamaModel || "granite3.3:2b";

  try {
    const response = await axios.post(
      `${endpoint}/api/chat`,
      {
        model,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      },
      { timeout }
    );

    return {
      content: response.data?.message?.content || "I couldn't generate a response.",
      model,
      provider: "ollama",
      tokensUsed: response.data?.eval_count,
    };
  } catch (error: any) {
    console.error("[Ollama] Error:", error?.message);
    throw new Error(`Ollama error at ${endpoint}: ${error?.message || "Connection refused"}`);
  }
}

/**
 * OpenAI-Compatible API (vLLM, LM Studio, LocalAI, Together, etc.)
 * Standard /v1/chat/completions endpoint
 */
async function callOpenAICompatible(
  config: AIProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number,
  timeout: number,
  providerLabel: string
): Promise<ChatCompletionResult> {
  const baseUrl = config.apiBaseUrl;
  if (!baseUrl) {
    throw new Error(`${providerLabel} requires an API base URL to be configured.`);
  }

  const model = config.model || "default";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  }

  try {
    // Normalize base URL - ensure it ends with /v1/chat/completions
    let url = baseUrl.replace(/\/$/, "");
    if (!url.endsWith("/v1/chat/completions")) {
      if (!url.endsWith("/v1")) {
        url += "/v1";
      }
      url += "/chat/completions";
    }

    const response = await axios.post(
      url,
      {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      { headers, timeout }
    );

    const choice = response.data?.choices?.[0];
    return {
      content: choice?.message?.content || "I couldn't generate a response.",
      model: response.data?.model || model,
      provider: providerLabel,
      tokensUsed: response.data?.usage?.total_tokens,
    };
  } catch (error: any) {
    console.error(`[${providerLabel}] Error:`, error?.response?.data || error?.message);
    throw new Error(`${providerLabel} error: ${error?.response?.data?.error?.message || error?.message || "Unknown error"}`);
  }
}

/**
 * List available models from any provider
 */
export async function listModels(config: AIProviderConfig): Promise<Array<{ id: string; name: string; size?: number }>> {
  switch (config.provider) {
    case "manus":
      return [
        { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4 (Recommended)" },
        { id: "claude-haiku-3-5", name: "Claude Haiku 3.5 (Fast)" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini (Efficient)" },
      ];

    case "ollama": {
      const endpoint = config.apiBaseUrl || config.ollamaEndpoint || "http://localhost:11434";
      try {
        const response = await axios.get(`${endpoint}/api/tags`, { timeout: 10000 });
        return (response.data?.models || []).map((m: any) => ({
          id: m.name,
          name: m.name,
          size: m.size,
        }));
      } catch {
        return [];
      }
    }

    case "vllm":
    case "openai_compatible": {
      const baseUrl = config.apiBaseUrl;
      if (!baseUrl) return [];
      try {
        let url = baseUrl.replace(/\/$/, "");
        if (!url.endsWith("/v1/models")) {
          if (!url.endsWith("/v1")) url += "/v1";
          url += "/models";
        }
        const headers: Record<string, string> = {};
        if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey}`;
        const response = await axios.get(url, { headers, timeout: 10000 });
        return (response.data?.data || []).map((m: any) => ({
          id: m.id,
          name: m.id,
        }));
      } catch {
        return [];
      }
    }

    default:
      return [];
  }
}

/**
 * Test connection to any provider
 */
export async function testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string; models?: string[] }> {
  try {
    const models = await listModels(config);
    if (config.provider === "manus") {
      return { success: true, message: "Connected to Hansen Cloud AI", models: models.map(m => m.name) };
    }
    if (models.length === 0 && config.provider === "ollama") {
      return { success: true, message: "Connected but no models installed. Pull a model first.", models: [] };
    }
    return { success: true, message: `Connected. ${models.length} model(s) available.`, models: models.map(m => m.name) };
  } catch (error: any) {
    return { success: false, message: error?.message || "Connection failed" };
  }
}
