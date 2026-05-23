import { appendFile } from "node:fs/promises";
import { join } from "node:path";

import { findEntry, type Registry, type RegistryEntry } from "./registry.js";
import { readAgentSnapshot } from "./agentReader.js";
import { loadProjectContext } from "./projectContext.js";

/**
 * Phase 4.1 - per-agent runtime context assembly.
 *
 * Centralizes how every specialist invocation builds its system prompt so
 * the three call sites (chat.ts specialist branch, runConvening drafter,
 * runHandoff target) share the same layout and can never drift from one
 * another. Layout, top to bottom:
 *
 *   1. project context  (orchestrator/creativedge_context.md)
 *   2. ----- you are -----
 *   3. <agent>/system_prompt.md
 *   4. ----- core memory -----        (if non-empty)
 *   5. ----- recent episodic memory ----- (last N entries, if any)
 *   6. <caller-supplied addendum>     (e.g. HANDOFF_INSTRUCTION,
 *                                     convening "you are one of several" note,
 *                                     handoff transfer note)
 *
 * The function is pure on inputs other than the filesystem - no DB, no
 * network, no provider call. It does NOT compose the user/assistant
 * transcript; that stays in chat.ts where the SQLite budgeting lives.
 */

const DEFAULT_EPISODIC_LIMIT = 10;
const MAX_EPISODIC_LINE_CHARS = 400;
const MAX_EPISODIC_TOTAL_CHARS = 4000;

export interface BuildAgentRuntimeContextArgs {
  slug: string;
  /** Pre-resolved registry entry (saves a lookup). Optional. */
  registryEntry?: RegistryEntry;
  /** When registryEntry is omitted, supply the registry to look it up. */
  registry?: Registry;
  projectRoot: string;
  runtimeAgentsDir: string;
  /** Appended verbatim to the system prompt. Caller controls leading newlines. */
  systemPromptAddendum?: string;
  /** Number of trailing episodic entries (## blocks) to include. Default 10.
   *  Pass 0 to disable episodic injection entirely. */
  episodicLimit?: number;
}

export interface AgentRuntimeContext {
  systemContent: string;
  coreMemoryLoaded: boolean;
  episodicEntriesLoaded: number;
  episodicCharsUsed: number;
}

export async function buildAgentRuntimeContext(
  args: BuildAgentRuntimeContextArgs
): Promise<AgentRuntimeContext> {
  const entry =
    args.registryEntry ??
    (args.registry ? findEntry(args.registry, args.slug) : undefined);
  const snap = await readAgentSnapshot(
    args.projectRoot,
    args.runtimeAgentsDir,
    args.slug,
    entry
  );
  const projectContext = await loadProjectContext(args.projectRoot);

  const limit =
    typeof args.episodicLimit === "number" && args.episodicLimit >= 0
      ? args.episodicLimit
      : DEFAULT_EPISODIC_LIMIT;
  const episodic = limit > 0
    ? extractRecentEpisodicEntries(snap.memory.episodic ?? "", limit)
    : { body: "", entries: 0 };

  const fallbackPrompt = `You are ${entry?.name ?? args.slug}.`;
  const parts: string[] = [];

  if (projectContext) {
    parts.push(projectContext);
    parts.push("\n\n----- you are -----\n");
  }
  parts.push(snap.systemPrompt ?? fallbackPrompt);

  const coreMemoryLoaded = !!(
    snap.memory.core && snap.memory.core.trim().length > 0
  );
  if (coreMemoryLoaded) {
    parts.push("\n\n----- core memory -----\n" + snap.memory.core);
  }

  if (episodic.body) {
    parts.push("\n\n----- recent episodic memory -----\n" + episodic.body);
  }

  if (args.systemPromptAddendum) {
    parts.push(args.systemPromptAddendum);
  }

  return {
    systemContent: parts.filter((x) => typeof x === "string" && x.length > 0).join(""),
    coreMemoryLoaded,
    episodicEntriesLoaded: episodic.entries,
    episodicCharsUsed: episodic.body.length,
  };
}

/**
 * Pull the trailing N entries out of an episodic memory markdown file.
 * Entries are level-2 headings (`## ...`) plus their following body.
 * Light sanitization: strip control characters, cap per-line length,
 * cap overall block length. Never throws on malformed input.
 */
function extractRecentEpisodicEntries(
  raw: string,
  limit: number
): { body: string; entries: number } {
  if (!raw || raw.trim().length === 0) return { body: "", entries: 0 };

  // Strip control chars except CR/LF/TAB.
  const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  // Slice into `## ...` blocks.
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of cleaned.split("\n")) {
    if (line.startsWith("## ")) {
      if (current.length > 0 && current[0]?.startsWith("## ")) {
        blocks.push(current.join("\n"));
      }
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0 && current[0]?.startsWith("## ")) {
    blocks.push(current.join("\n"));
  }
  if (blocks.length === 0) return { body: "", entries: 0 };

  const kept = blocks.slice(-limit);

  const sanitized = kept.map((b) =>
    b
      .split("\n")
      .map((l) => (l.length > MAX_EPISODIC_LINE_CHARS ? l.slice(0, MAX_EPISODIC_LINE_CHARS) : l))
      .join("\n")
      .trim()
  );

  let body = sanitized.join("\n\n");
  if (body.length > MAX_EPISODIC_TOTAL_CHARS) {
    body = body.slice(-MAX_EPISODIC_TOTAL_CHARS);
    const firstH2 = body.indexOf("## ");
    if (firstH2 > 0) body = body.slice(firstH2);
  }
  return { body, entries: kept.length };
}

// ---------------------------------------------------------------------------
// Phase 4.1 - episodic summary writer
// ---------------------------------------------------------------------------

const SENSITIVE_PATTERNS: RegExp[] = [
  // 13-19 digit number sequences with optional space/hyphen grouping (credit card-like).
  /\b(?:\d[ \-]?){13,19}\b/,
  // SSN-like NNN-NN-NNNN
  /\b\d{3}-\d{2}-\d{4}\b/,
  // Common API key / token prefixes
  /\b(?:sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|xox[abp]-[A-Za-z0-9\-]{20,})/i,
  /\bapi[_-]?key\s*[:=]\s*[\w.\-]{12,}/i,
  /\bbearer\s+[A-Za-z0-9._\-]{16,}/i,
  // PEM private keys
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
];

export function containsSensitiveContent(text: string): boolean {
  for (const re of SENSITIVE_PATTERNS) {
    if (re.test(text)) return true;
  }
  return false;
}

export interface AppendEpisodicSummaryArgs {
  runtimeAgentsDir: string;
  /** The agent that "owns" this episodic entry. */
  slug: string;
  sessionId: string;
  /** Raw user message; used (truncated) for the gist. Scanned for sensitive content. */
  userMessage: string;
  wasHandoff: boolean;
}

export interface AppendEpisodicSummaryResult {
  written: boolean;
  /** When `written` is false, a short non-sensitive reason. */
  skipped?: string;
  /** Resolved path that was (would have been) appended. */
  path: string;
}

/**
 * Append a single one-block episodic-memory entry. Deterministic - never
 * calls an LLM. Skips silently when the user message looks sensitive
 * (credit cards, SSN-like, API keys, private keys).
 *
 * Errors during append are caught and reported via `skipped`; the chat
 * route should never crash because of memory IO.
 */
export async function appendEpisodicSummary(
  args: AppendEpisodicSummaryArgs
): Promise<AppendEpisodicSummaryResult> {
  const path = join(args.runtimeAgentsDir, args.slug, "memory", "episodic_memory.md");
  if (containsSensitiveContent(args.userMessage)) {
    return { written: false, skipped: "sensitive-content guard", path };
  }
  const gist = args.userMessage
    .slice(0, 180)
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const block =
    `\n## ${new Date().toISOString()}\n` +
    `- session: ${args.sessionId}\n` +
    `- gist: ${gist}\n` +
    `- was_handoff: ${args.wasHandoff ? "true" : "false"}\n`;
  try {
    await appendFile(path, block, "utf-8");
    return { written: true, path };
  } catch (err) {
    return {
      written: false,
      skipped: "append failed: " + (err instanceof Error ? err.message : String(err)),
      path,
    };
  }
}
