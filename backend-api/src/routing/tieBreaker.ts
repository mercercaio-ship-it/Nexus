import { randomUUID } from "node:crypto";

import type { Provider } from "../providers/Provider.js";
import type { SpecialistScore } from "./keywordRouter.js";

/**
 * Phase 3.1 - internal LLM tie-breaker.
 *
 * INVARIANTS this module MUST preserve:
 *   - Calls the local Claude runtime (`ClaudeProvider.call()`). NEVER touches
 *     `api.anthropic.com`, an API key, `.env`, or any external HTTP client.
 *   - NEVER emits SSE chunks. The call happens inside the routing pipeline
 *     before `/chat` writes anything to `reply.raw`.
 *   - NEVER persists to `sessions.messages`. The call uses its own throwaway
 *     `requestId` ("tiebreak-<uuid>") and is not tied to the user's session.
 *   - System prompt is minimal: no `creativedge_context.md`, no specialist
 *     personality. Just the shortlist + the relevant overlap rules + a
 *     strict-JSON instruction.
 *   - Failure (JSON parse, invalid slug, timeout, auth error) returns null
 *     and the pipeline falls back to a deterministic clarification.
 */

export interface TieBreakerResult {
  slug: string;
  confidence: "high" | "medium" | "low";
  rationale: string;
}

const TIEBREAKER_TIMEOUT_MS = 30_000;
const SHORTLIST_CAP = 4;

function buildSystemPrompt(
  shortlist: SpecialistScore[],
  rulesSummary: string[]
): string {
  const lines: string[] = [
    "You are the routing orchestrator for CreativEdge, a local multi-agent chatbot.",
    "Your ONLY job right now is to pick ONE specialist slug from the shortlist below.",
    "",
    "Shortlist (these are the only valid `slug` values you may return):",
    ...shortlist.map((s) => `  - ${s.slug}: ${s.domain ?? s.name}`),
    "",
  ];
  if (rulesSummary.length > 0) {
    lines.push("Routing rules to honor:");
    for (const r of rulesSummary) lines.push("  - " + r);
    lines.push("");
  }
  lines.push(
    "Reply with STRICT JSON ONLY, exactly this shape:",
    '  {"slug": "<one of the shortlist slugs>", "confidence": "high"|"medium"|"low", "rationale": "<one short sentence>"}',
    "",
    "Do not output anything else. No prose. No markdown. No code fences. No tool calls."
  );
  return lines.join("\n");
}

function extractJson(raw: string): unknown | null {
  let text = raw.trim();
  // Strip markdown code fences if the model wrapped its answer.
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Returns a TieBreakerResult on success, or null on any failure (auth,
 * timeout, malformed JSON, slug not in shortlist, etc.). Callers MUST be
 * prepared for null and fall back to a deterministic clarification.
 */
export async function llmTieBreaker(
  message: string,
  shortlist: SpecialistScore[],
  rulesSummary: string[],
  provider: Provider
): Promise<TieBreakerResult | null> {
  if (shortlist.length === 0) return null;
  const trimmed = shortlist.slice(0, SHORTLIST_CAP);
  const systemPrompt = buildSystemPrompt(trimmed, rulesSummary);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: message },
  ];

  let raw = "";
  let sawError = false;
  try {
    for await (const ch of provider.call(messages, {
      requestId: "tiebreak-" + randomUUID(),
      timeoutMs: TIEBREAKER_TIMEOUT_MS,
    })) {
      if (ch.type === "text" && typeof ch.text === "string") raw += ch.text;
      if (ch.type === "error") sawError = true;
      // "usage" chunks deliberately ignored - we don't persist tie-breaker telemetry.
    }
  } catch {
    return null;
  }
  if (sawError && !raw.trim()) return null;

  const parsed = extractJson(raw);
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;

  const slug = typeof obj.slug === "string" ? obj.slug : null;
  if (!slug) return null;
  if (!trimmed.some((s) => s.slug === slug)) return null;

  const c = obj.confidence;
  const confidence: "high" | "medium" | "low" =
    c === "high" || c === "medium" || c === "low" ? c : "medium";

  const rationale =
    typeof obj.rationale === "string" && obj.rationale.length > 0
      ? obj.rationale.slice(0, 400)
      : "llm tie-breaker selected " + slug;

  return { slug, confidence, rationale };
}
