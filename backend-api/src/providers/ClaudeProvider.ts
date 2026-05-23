import type {
  Provider,
  ProviderCallOptions,
  ProviderChunk,
  ProviderMessage,
  ProviderReadiness,
} from "./Provider.js";
import type { ProviderEntryConfig } from "../config/runtimeConfig.js";
import { probeLocalClaudeRuntime } from "./localClaudeRuntime.js";
import { callLocalClaudeCliWithRetry, type RetryHook } from "./claudeCli.js";

/**
 * ClaudeProvider - integration point for the local Claude Code / Cowork /
 * Desktop runtime.
 *
 *   - checkReady() spawns `claude --version` once at boot. No model call,
 *     no API key, no .env. We still report `ready: false` even when the
 *     binary is present because we cannot verify auth non-interactively;
 *     `installed: true` is the strongest signal we surface.
 *
 *   - call() spawns the local `claude` CLI in non-interactive print mode
 *     (`-p --output-format stream-json --verbose [--system-prompt <s>]`)
 *     and streams stdout JSON events as ProviderChunks. The chat layer
 *     treats `installed === true` as the green light to attempt this path;
 *     if the CLI returns an `error` (e.g. "Not logged in . Please run
 *     /login") or the first-assistant-text timeout fires, the chat layer
 *     transparently falls back to MockProvider.
 *
 * Timeouts and budgets are configurable via ~/.creativedge/providers.json.
 *
 * Anthropic API is intentionally NOT used here, ever. No API key, no .env,
 * no external HTTP. The only network calls Claude Code makes are those it
 * makes itself under the user's own local authentication.
 */

const DEFAULT_FIRST_CHUNK_MS = 60_000;
const DEFAULT_TURN_MS = 120_000;
const DEFAULT_MAX_CONTEXT_CHARS = 120_000;
const DEFAULT_RESERVED_RESPONSE_CHARS = 12_000;
const DEFAULT_RECENT_MESSAGE_LIMIT = 20;
/** Phase 3.2 reliability patch: synthesis defaults to 150s (above the 120s
 *  default `turnTimeoutMs`) because synthesis has to read several drafts
 *  AND generate a long composite answer. */
const DEFAULT_CONVENING_SYNTHESIS_MS = 150_000;
/** Phase 4.1 default: load the 10 most recent episodic-memory entries on
 *  every specialist invocation. Configurable via providers.json. */
const DEFAULT_RECENT_EPISODIC_LIMIT = 10;

function readPositiveNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : fallback;
}

function readNonNegativeNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
}

export interface ClaudeProviderTimeouts {
  firstChunkTimeoutMs: number;
  turnTimeoutMs: number;
}

export interface ClaudeProviderBudget {
  maxContextChars: number;
  reservedResponseChars: number;
  recentMessageLimit: number;
}

export class ClaudeProvider implements Provider {
  readonly name = "claude";
  readonly timeouts: ClaudeProviderTimeouts;
  readonly budget: ClaudeProviderBudget;
  /** Phase 3.2 patch: synthesis timeout (ms) for multi-specialist convening. */
  readonly conveningSynthesisTimeoutMs: number;
  /** Phase 4.1: how many recent episodic-memory entries to load into a
   *  specialist's system prompt. 0 disables episodic injection. */
  readonly recentEpisodicLimit: number;
  /** Optional retry-event hook. Wired by the chat route at runtime so we
   *  can log retries through Fastify's pino instance without coupling this
   *  module to the logger. */
  retryHook?: RetryHook;

  constructor(config: ProviderEntryConfig = {}) {
    this.timeouts = {
      firstChunkTimeoutMs: readPositiveNumber(config.firstChunkTimeoutMs, DEFAULT_FIRST_CHUNK_MS),
      turnTimeoutMs:       readPositiveNumber(config.turnTimeoutMs,       DEFAULT_TURN_MS),
    };
    this.budget = {
      maxContextChars:       readPositiveNumber(config.maxContextChars,       DEFAULT_MAX_CONTEXT_CHARS),
      reservedResponseChars: readPositiveNumber(config.reservedResponseChars, DEFAULT_RESERVED_RESPONSE_CHARS),
      recentMessageLimit:    readPositiveNumber(config.recentMessageLimit,    DEFAULT_RECENT_MESSAGE_LIMIT),
    };
    this.conveningSynthesisTimeoutMs = readPositiveNumber(
      config.conveningSynthesisTimeoutMs,
      DEFAULT_CONVENING_SYNTHESIS_MS
    );
    this.recentEpisodicLimit = readNonNegativeNumber(
      config.recentEpisodicLimit,
      DEFAULT_RECENT_EPISODIC_LIMIT
    );
  }

  async checkReady(): Promise<ProviderReadiness> {
    const probe = await probeLocalClaudeRuntime();
    return {
      ready: probe.ready,
      reason: probe.reason,
      installed: probe.installed,
      authStatus: probe.authStatus,
      mode: probe.mode,
      version: probe.version,
      setupRequired: probe.setupRequired,
      setupHint: probe.setupHint,
      durationMs: probe.durationMs,
    };
  }

  async *call(
    messages: ProviderMessage[],
    options: ProviderCallOptions
  ): AsyncIterable<ProviderChunk> {
    yield* callLocalClaudeCliWithRetry({
      messages,
      timeoutMs:           options.timeoutMs ?? this.timeouts.turnTimeoutMs,
      firstChunkTimeoutMs: this.timeouts.firstChunkTimeoutMs,
      onRetry:             this.retryHook,
    });
  }
}
