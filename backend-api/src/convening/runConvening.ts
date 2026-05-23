import { randomUUID } from "node:crypto";
import type { ServerResponse } from "node:http";

import type { Registry } from "../agents/registry.js";
import { findEntry } from "../agents/registry.js";
import { buildAgentRuntimeContext } from "../agents/agentRuntimeContext.js";
import type { Provider } from "../providers/Provider.js";

/**
 * Phase 3.2 - convening runner.
 *
 *   1. Fan out to 2-3 specialists in PARALLEL using the existing provider.
 *      Each call is internal: no SSE chunks to the user, no `messages` rows.
 *      `Promise.allSettled` so one failure doesn't kill the convening.
 *
 *   2. Build a synthesis prompt for Nexus from the successful drafts.
 *
 *   3. Stream the synthesis through the SSE response writer the caller
 *      already opened. Caller persists ONE assistant message containing
 *      the full synthesized text.
 *
 *   4. If synthesis itself fails (auth, timeout, empty), fall back to a
 *      deterministic labeled stitch of whatever drafts succeeded so the
 *      user always gets a useful answer.
 *
 * All Claude calls go through the existing provider abstraction. The
 * runner never imports Anthropic SDK, never reads an API key, never opens
 * a network socket directly. Mock fallback still works honestly.
 */

const SPECIALIST_TIMEOUT_MS = 75_000;
/** Phase 3.2 patch: default raised from 90s to 150s; caller passes the real value from providers.claude.conveningSynthesisTimeoutMs. */
const DEFAULT_SYNTHESIS_TIMEOUT_MS = 150_000;
const MAX_DRAFT_CHARS = 1_500; // Phase 3.2 patch: compact drafts so synthesis input stays small and the model completes within the synthesis timeout

const SPECIALIST_INSTRUCTION =
  "You are one of several CreativEdge specialists Nexus has convened on this turn. " +
  "Answer ONLY from your specialist perspective. Be concise (about 300 words max). " +
  "Do not mention that you are one of several unless useful for the user's question. " +
  "Do not include your name/emoji header — Nexus will label your draft when synthesizing.";

export interface ConveningRunnerArgs {
  message: string;
  registry: Registry;
  /** Slugs to convene. Must be valid specialist slugs (caller dedupes/caps). */
  convenedSlugs: string[];
  /** Provider used for both fan-out and synthesis. Caller chooses Claude vs Mock. */
  provider: Provider;
  /** True if the provider is the mock fallback (drives meta degraded flag). */
  degraded: boolean;
  projectRoot: string;
  runtimeAgentsDir: string;
  requestId: string;
  /** Phase 3.2 patch: synthesis hard timeout in ms. Caller threads this through
   *  from providers.claude.conveningSynthesisTimeoutMs. */
  synthesisTimeoutMs?: number;
  /** Phase 4.2: number of trailing episodic-memory entries each specialist
   *  drafter should see. Threaded through from providers.claude.recentEpisodicLimit.
   *  Default 10 in buildAgentRuntimeContext when omitted. */
  episodicLimit?: number;
  /** Hijacked SSE response writer. The runner streams synthesis chunks onto it. */
  raw: ServerResponse;
  /** Writes one SSE event onto `raw`. */
  writeSse: (event: string, data: unknown) => void;
}

export interface ConvenedDraftRecord {
  slug: string;
  name: string;
  emoji: string;
  domain: string;
  success: boolean;
  draft: string;          // possibly truncated for synthesis input
  bytesUsed: number;
  durationMs: number;
  usage?: unknown;
  error?: string;
  /** Phase 4.2: runtime-context counters from buildAgentRuntimeContext.
   *  Counts/booleans only - never memory content. Surfaced in usage_json
   *  for observability. */
  coreMemoryLoaded?: boolean;
  episodicEntries?: number;
  episodicChars?: number;
}

export interface ConveningRunnerResult {
  /** Full text streamed to the user (synthesis, plus header). */
  assistantText: string;
  /** Per-specialist outcome - used by the caller to build agent_events.usage_json. */
  drafts: ConvenedDraftRecord[];
  /** True if the final visible answer came from the synthesis call.
   *  False if all drafts failed AND we emitted a deterministic apology. */
  synthesisOk: boolean;
  /** "claude" or "mock" - whichever produced the visible synthesis chunks. */
  visibleProvider: string;
  /** Synthesis-call usage data (if the provider emitted any). */
  synthesisUsage?: unknown;
  /** Phase 3.2 patch: short, user-safe reason when synthesis didn't succeed.
   *  One of: "synthesis timeout" | "no assistant text" | "auth error" |
   *  "all drafts failed" | "synthesis provider error" | "synthesis unavailable". */
  synthesisError?: string;
}

// ---------------------------------------------------------------------------
// Specialist draft
// ---------------------------------------------------------------------------

async function callOneSpecialistDraft(
  slug: string,
  args: ConveningRunnerArgs
): Promise<ConvenedDraftRecord> {
  const entry = findEntry(args.registry, slug);
  const name = entry?.name ?? slug;
  const emoji = entry?.emoji ?? "🤖";
  const domain = entry?.domain ?? slug;
  const startedAt = Date.now();

  // Phase 4.2: per-specialist drafter now uses the shared runtime-context
  // assembly so convening, single-specialist, and handoff turns share one
  // codepath. Convened drafters get project context + system prompt + core
  // memory + recent episodic memory + the convening-specific addendum.
  const runtimeContext = await buildAgentRuntimeContext({
    slug,
    registryEntry: entry,
    projectRoot: args.projectRoot,
    runtimeAgentsDir: args.runtimeAgentsDir,
    systemPromptAddendum:
      "\n\n----- convening note -----\n" + SPECIALIST_INSTRUCTION,
    episodicLimit: args.episodicLimit,
  });
  const systemContent = runtimeContext.systemContent;

  const messages = [
    { role: "system" as const, content: systemContent },
    { role: "user" as const, content: args.message },
  ];

  let draft = "";
  let usage: unknown = undefined;
  let errorText: string | undefined;
  let ok = false;

  try {
    for await (const ch of args.provider.call(messages, {
      requestId: "convene-" + args.requestId.slice(0, 8) + "-" + slug,
      timeoutMs: SPECIALIST_TIMEOUT_MS,
      agentSlug: slug,
    })) {
      if (ch.type === "text" && typeof ch.text === "string") draft += ch.text;
      else if (ch.type === "usage") usage = ch.data;
      else if (ch.type === "error") errorText = ch.text ?? "specialist draft error";
      // "done" terminates the for-await naturally.
    }
    ok = draft.trim().length > 0 && !errorText;
  } catch (err) {
    errorText = err instanceof Error ? err.message : String(err);
  }

  return {
    slug,
    name,
    emoji,
    domain,
    success: ok,
    draft: ok ? draft.slice(0, MAX_DRAFT_CHARS) : "",
    bytesUsed: ok ? Buffer.byteLength(draft, "utf-8") : 0,
    durationMs: Date.now() - startedAt,
    usage,
    error: errorText,
    coreMemoryLoaded: runtimeContext.coreMemoryLoaded,
    episodicEntries: runtimeContext.episodicEntriesLoaded,
    episodicChars: runtimeContext.episodicCharsUsed,
  };
}

async function fanOut(args: ConveningRunnerArgs): Promise<ConvenedDraftRecord[]> {
  const promises = args.convenedSlugs.map((slug) =>
    callOneSpecialistDraft(slug, args)
  );
  const settled = await Promise.allSettled(promises);
  return settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const slug = args.convenedSlugs[i]!;
    const entry = findEntry(args.registry, slug);
    return {
      slug,
      name: entry?.name ?? slug,
      emoji: entry?.emoji ?? "🤖",
      domain: entry?.domain ?? slug,
      success: false,
      draft: "",
      bytesUsed: 0,
      durationMs: 0,
      error: r.reason instanceof Error ? r.reason.message : String(r.reason),
    };
  });
}

// ---------------------------------------------------------------------------
// Synthesis
// ---------------------------------------------------------------------------

function buildSynthesisSystemPrompt(): string {
  return [
    "You are 🌐 Nexus, the CreativEdge orchestrator. Several specialists were convened",
    "in parallel and produced draft answers (below, in the user message). Your job:",
    "",
    "  1. Open with one short line acknowledging that this spans multiple domains.",
    "  2. For each specialist whose draft is non-empty, include a labeled section",
    "     using their emoji + name + domain as a header, with their answer underneath",
    "     (lightly edited for flow if needed; preserve their substance).",
    "  3. Close with a concise final recommendation and the suggested next step.",
    "  4. If a specialist draft was unavailable, note that one perspective was",
    "     unavailable only if it's useful to the user.",
    "",
    "Output user-facing markdown. Do not mention Claude Code, skills, hooks, plugins, MCP,",
    "or any tool internals. Do not invent new specialists or claim there were more drafts",
    "than you were given.",
  ].join("\n");
}

function buildSynthesisUserMessage(
  originalMessage: string,
  drafts: ConvenedDraftRecord[]
): string {
  const successful = drafts.filter((d) => d.success && d.draft.trim().length > 0);
  const lines: string[] = [
    `User's original message:`,
    originalMessage,
    "",
    "Specialist drafts to synthesize (use these labels verbatim):",
    "",
  ];
  for (const d of successful) {
    lines.push(`[${d.emoji} ${d.name} - ${d.domain}]`);
    lines.push(d.draft.trim());
    lines.push("");
  }
  const failures = drafts.filter((d) => !d.success);
  if (failures.length > 0) {
    lines.push("(Unavailable specialists this turn:");
    for (const f of failures) lines.push(`  - ${f.emoji} ${f.name} - ${f.domain}`);
    lines.push(")");
  }
  return lines.join("\n");
}

async function streamSynthesis(
  args: ConveningRunnerArgs,
  drafts: ConvenedDraftRecord[]
): Promise<{ ok: boolean; text: string; usage?: unknown; errorText?: string; errorCode?: string }> {
  const systemContent = buildSynthesisSystemPrompt();
  const userContent = buildSynthesisUserMessage(args.message, drafts);
  const messages = [
    { role: "system" as const, content: systemContent },
    { role: "user" as const, content: userContent },
  ];

  let visibleText = "";
  let usage: unknown = undefined;
  let rawErrorText: string | undefined;

  const synthesisTimeout = args.synthesisTimeoutMs ?? DEFAULT_SYNTHESIS_TIMEOUT_MS;

  try {
    for await (const ch of args.provider.call(messages, {
      requestId: "synth-" + args.requestId.slice(0, 8),
      timeoutMs: synthesisTimeout,
      agentSlug: "nexus",
    })) {
      if (ch.type === "text" && typeof ch.text === "string") {
        visibleText += ch.text;
        args.writeSse("chunk", { text: ch.text });
      } else if (ch.type === "usage") {
        usage = ch.data;
      } else if (ch.type === "error") {
        rawErrorText = ch.text ?? "synthesis provider error";
        // Don't emit the raw provider error to the user; we'll fall back below.
      }
    }
  } catch (err) {
    rawErrorText = err instanceof Error ? err.message : String(err);
  }

  const ok = !rawErrorText && visibleText.trim().length > 0;
  return {
    ok,
    text: visibleText,
    usage,
    errorText: rawErrorText,
    errorCode: classifySynthesisFailure(rawErrorText, visibleText),
  };
}

/**
 * Translate the noisy provider error string into a short, user-safe code.
 * These are the only values that should ever surface in `done.synthesisError`
 * or in `usage_json.synthesis_error`. Raw stack traces / CLI paths stay out
 * of consumer-visible payloads.
 */
function classifySynthesisFailure(
  rawError: string | undefined,
  visibleText: string
): string | undefined {
  if (!rawError && visibleText.trim().length > 0) return undefined; // success
  if (!rawError) return "no assistant text";
  const t = rawError.toLowerCase();
  if (t.includes("hard turn timeout") || t.includes("timed out") || t.includes("timeout"))
    return "synthesis timeout";
  if (t.includes("no assistant text within")) return "synthesis timeout";
  if (t.includes("not logged in") || t.includes("authentication_failed"))
    return "auth error";
  if (t.includes("binary not found")) return "synthesis unavailable";
  if (t.includes("provider error") || t.includes("exited with code"))
    return "synthesis provider error";
  return "synthesis provider error";
}

// ---------------------------------------------------------------------------
// Deterministic fallback (when synthesis can't run)
// ---------------------------------------------------------------------------

function buildDeterministicStitch(drafts: ConvenedDraftRecord[]): string {
  const successful = drafts.filter((d) => d.success && d.draft.trim().length > 0);
  if (successful.length === 0) {
    return (
      "I tried to convene specialists for this but none of them returned a draft this turn. " +
      "Please retry, or rephrase to point at one specific specialist."
    );
  }
  const lines: string[] = [
    "Convening synthesis was unavailable this turn — here are the specialist drafts I collected, lightly stitched:",
    "",
  ];
  for (const d of successful) {
    lines.push(`## ${d.emoji} ${d.name} — ${d.domain}`);
    lines.push("");
    lines.push(d.draft.trim());
    lines.push("");
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export async function runConvening(
  args: ConveningRunnerArgs
): Promise<ConveningRunnerResult> {
  // Stream a Nexus header up front so the user sees who is speaking.
  const headerText = `🌐 Nexus — convening ${args.convenedSlugs.length} specialists\n\n`;
  args.writeSse("chunk", { text: headerText });

  // 1) Fan-out (internal; no SSE chunks emitted)
  const drafts = await fanOut(args);

  // 2) Synthesis
  let assistantText = headerText;
  let synthesisOk = false;
  let synthesisUsage: unknown = undefined;

  const anySuccessful = drafts.some((d) => d.success);
  let synthesisError: string | undefined;
  if (anySuccessful) {
    const synth = await streamSynthesis(args, drafts);
    if (synth.ok) {
      synthesisOk = true;
      synthesisUsage = synth.usage;
      assistantText += synth.text;
    } else {
      synthesisError = synth.errorCode ?? "synthesis unavailable";
      const stitch = buildDeterministicStitch(drafts);
      args.writeSse("chunk", { text: stitch });
      assistantText += stitch;
    }
  } else {
    synthesisError = "all drafts failed";
    const stitch = buildDeterministicStitch(drafts);
    args.writeSse("chunk", { text: stitch });
    assistantText += stitch;
  }

  return {
    assistantText,
    drafts,
    synthesisOk,
    visibleProvider: args.provider.name,
    synthesisUsage,
    synthesisError,
  };
}

/** Strips draft text from records before storing on agent_events.usage_json.
 *  Phase 4.2: also exposes compact runtime-context counters
 *  (`core_memory_loaded`, `episodic_entries`, `episodic_chars`) so the
 *  observability story for convening matches the single-specialist path.
 *  Counts/booleans only - never memory or draft content. */
export function summarizeDraftsForUsage(
  drafts: ConvenedDraftRecord[]
): unknown {
  return {
    convening: true,
    specialists: drafts.map((d) => ({
      slug: d.slug,
      success: d.success,
      duration_ms: d.durationMs,
      bytes: d.bytesUsed,
      usage: d.usage,
      ...(d.error ? { error: d.error.slice(0, 200) } : {}),
      ...(typeof d.coreMemoryLoaded === "boolean"
        ? { core_memory_loaded: d.coreMemoryLoaded }
        : {}),
      ...(typeof d.episodicEntries === "number"
        ? { episodic_entries: d.episodicEntries }
        : {}),
      ...(typeof d.episodicChars === "number"
        ? { episodic_chars: d.episodicChars }
        : {}),
    })),
  };
}
