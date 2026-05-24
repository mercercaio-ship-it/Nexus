import type {
  Provider,
  ProviderReadiness,
  ProviderMessage,
  ProviderCallOptions,
  ProviderChunk,
} from "./Provider.js";

/**
 * OpenRouterProvider – implements the Provider interface using the
 * OpenRouter HTTP API (https://openrouter.ai/api/v1/chat/completions).
 *
 * Uses Node 20+ native fetch (no external dependency).
 * Returns an AsyncIterable<ProviderChunk> to match the existing Provider contract.
 */
export class OpenRouterProvider implements Provider {
  readonly name = "openrouter";

  private apiKey: string;
  private model: string;
  private baseUrl = "https://openrouter.ai/api/v1/chat/completions";

  constructor(config: { apiKey?: string; model?: string; [k: string]: unknown }) {
    if (!config.apiKey) throw new Error("OpenRouterProvider requires apiKey");
    if (!config.model) throw new Error("OpenRouterProvider requires model");
    this.apiKey = config.apiKey;
    this.model = config.model;
  }

  /* ─── readiness check ─── */

  async checkReady(): Promise<ProviderReadiness> {
    try {
      const resp = await fetch("https://openrouter.ai/api/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(8_000),
      });
      if (resp.ok) {
        return { ready: true };
      }
      return { ready: false, reason: `OpenRouter /models returned HTTP ${resp.status}` };
    } catch (err) {
      return {
        ready: false,
        reason: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /* ─── chat completion (non-streaming → wrapped as AsyncIterable) ─── */

  async *call(
    messages: ProviderMessage[],
    options: ProviderCallOptions
  ): AsyncIterable<ProviderChunk> {
    const timeoutMs = options.timeoutMs ?? 120_000;

    const payload = {
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };

    let resp: Response;
    try {
      resp = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://creativedge.local",
          "X-Title": "CreativEdge Nexus",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      yield {
        type: "error",
        text: `OpenRouter fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      };
      yield { type: "done" };
      return;
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => "(unreadable body)");
      yield {
        type: "error",
        text: `OpenRouter HTTP ${resp.status}: ${body}`,
      };
      yield { type: "done" };
      return;
    }

    let data: any;
    try {
      data = await resp.json();
    } catch {
      yield { type: "error", text: "OpenRouter returned non-JSON response" };
      yield { type: "done" };
      return;
    }

    // Extract assistant text
    const content: string | undefined =
      data?.choices?.[0]?.message?.content;

    if (content) {
      yield { type: "text", text: content };
    } else {
      yield {
        type: "error",
        text: `Unexpected OpenRouter response shape: ${JSON.stringify(data).slice(0, 500)}`,
      };
    }

    // Emit usage metadata if present
    if (data?.usage) {
      yield {
        type: "usage",
        data: {
          inputTokens: data.usage.prompt_tokens,
          outputTokens: data.usage.completion_tokens,
          model: data.model ?? this.model,
        },
      };
    }

    yield { type: "done" };
  }
}

export default OpenRouterProvider;
