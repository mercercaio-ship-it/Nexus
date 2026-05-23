/**
 * Provider abstraction - every model backend (Claude local runtime, mock,
 * OpenAI later, Ollama later) exposes the same `call(messages, options)`
 * AsyncIterable surface.
 *
 * Phase 2.2:
 *   - ClaudeProvider  delegates checkReady() to a local-runtime probe
 *     (`claude --version`). No API call. No API key. No .env.
 *   - MockProvider    always ready - used for /healthz and local validation
 *                     and as the only fallback for /chat while Claude local
 *                     runtime is not verified.
 *
 * Out of scope until later phases: OpenAI provider, Ollama provider,
 * real Claude streaming.
 */

export interface ProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ProviderCallOptions {
  requestId: string;
  agentSlug?: string;
  timeoutMs?: number;
}

export interface ProviderChunk {
  type: "text" | "meta" | "error" | "done" | "usage";
  text?: string;
  /** Free-form payload. For "usage" chunks (Phase 2.6) this carries the
   *  compact usage / cost metadata extracted from the CLI's result event. */
  data?: unknown;
}

export interface ProviderReadiness {
  ready: boolean;
  reason?: string;
  /** Local-runtime probe fields (optional, set by Phase 2.2 ClaudeProvider). */
  installed?: boolean;
  authStatus?: "unknown" | "authenticated" | "unauthenticated";
  mode?: string;
  version?: string | null;
  setupRequired?: boolean;
  setupHint?: string;
  durationMs?: number;
}

export interface Provider {
  readonly name: string;
  checkReady(): Promise<ProviderReadiness>;
  call(
    messages: ProviderMessage[],
    options: ProviderCallOptions
  ): AsyncIterable<ProviderChunk>;
}
