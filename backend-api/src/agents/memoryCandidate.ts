/**
 * Phase 5.2 - user-confirmed memory-worthy fact promotion: detector.
 *
 * Deterministic, regex-based, pure function. Given a raw user message and
 * the routing decision's selected agent slug, returns a `MemoryCandidate`
 * when the message contains a safe, durable preference / identity fact /
 * explicit memory directive. Returns `null` otherwise.
 *
 * Hard constraints carried from the Phase 4 → Phase 5 bridge spec:
 *
 *   - Auto-write is OUT OF SCOPE. This module produces a CANDIDATE only.
 *     The actual write must go through `POST /agents/:slug/memory/promote`
 *     with `confirmed:true` set by the user.
 *   - Sensitive content is dropped silently. We reuse the existing
 *     `containsSensitiveContent` guard from `agentRuntimeContext.ts` so the
 *     filter matches the Phase 4.1 episodic-summary precedent (credit-card-
 *     like, SSN-like, API-key/bearer-token-like, PEM private keys).
 *   - Transient phrasings ("today I ...", "tomorrow ...", "right now ...")
 *     are rejected up front; the detector only fires on durable wording.
 *   - No LLM call. No network. No filesystem IO.
 *
 * The detector is intentionally conservative: it prefers false negatives
 * (no candidate) over false positives (a candidate that shouldn't have
 * been suggested). The user can always re-phrase if they want a fact
 * promoted to core memory.
 */

import { containsSensitiveContent } from "./agentRuntimeContext.js";

export type MemoryCandidateType = "directive" | "identity" | "preference";

export interface MemoryCandidate {
  /** Coarse-grained category - used by the UI to pick a confirmation prompt. */
  type: MemoryCandidateType;
  /** Cleaned, sanitized candidate text - never longer than `MAX_TEXT_CHARS`. */
  text: string;
  /** Short label for which pattern matched. Safe to log. Never the full regex. */
  pattern: string;
  /** The agent slug this candidate would be promoted into (from the route decision). */
  agentSlug: string;
}

/** Hard cap on the suggested candidate text. Same cap the episodic-summary
 *  gist uses (180 chars) but a touch longer here since the user picked the
 *  wording deliberately and a sentence-long preference shouldn't be cut. */
const MAX_TEXT_CHARS = 280;
/** Hard cap on the message length we even look at. Beyond this we skip
 *  detection entirely - long pastes are almost never memory-worthy and the
 *  cost grows quadratically with regex backtracking. The /chat route already
 *  bounds messages to 8000 chars; this is a defense-in-depth cap. */
const MAX_INPUT_CHARS = 4000;
const MIN_INPUT_CHARS = 8;

/**
 * Transient-signal recognizer. If the message contains any of these tokens
 * we refuse to detect a candidate, even if a "preference"-shaped pattern
 * also matches. "Today I prefer chicken" is not a durable preference.
 *
 * Word-boundary anchored, case-insensitive.
 */
const TRANSIENT_RE =
  /\b(?:today|tomorrow|yesterday|tonight|this\s+(?:morning|afternoon|evening|week|month|year)|last\s+(?:night|week|month|year)|right\s+now|just\s+(?:now|today)|currently|at\s+the\s+moment|for\s+now|temporarily)\b/i;

/**
 * Ordered pattern catalog. First match wins. Each entry produces a candidate
 * of `type` with `text` extracted from the captured group (or the matched
 * span when `useFullMatch` is true). `label` is a short, leak-safe
 * description for logging and for the SSE payload.
 *
 * Wording choices:
 *   - "remember (that)? I/my/me/we/our" - explicit memory directive.
 *   - "my name is", "call me" - identity.
 *   - "I (always|usually|generally|typically) X" - habitual preference.
 *   - "I prefer X" / "I don't (like|use|want) X" - preference (positive/negative).
 *   - "my (favorite|preferred|default) X is Y" - preference (structured).
 *
 * What we deliberately DO NOT include:
 *   - "I'm a <profession>" - too easily transient ("I'm a wreck today",
 *     "I'm a little tired"). Profession capture is left for Phase 5.3 with
 *     a curated profession list.
 *   - "I want X" / "I need X" - request, not preference.
 *   - Third-party statements ("she prefers X").
 *   - Imperatives without "remember" ("save this", "note that").
 *     Those will land in Phase 5.3 once the SSE round-trip is exercised on
 *     real traffic and we know which directives users actually use.
 */
interface PatternRule {
  type: MemoryCandidateType;
  label: string;
  regex: RegExp;
  /** Index of the capture group that holds the extractable fact. */
  group: number;
}

const RULES: PatternRule[] = [
  // ---------------- directive ----------------
  {
    type: "directive",
    label: "remember-that",
    // "please remember that ...", "remember I ...", "remember my ...", "remember we ..."
    regex:
      /\b(?:please\s+)?remember\s+(?:that\s+)?((?:I|my|me|we|our|you\s+should)\b[\s\S]{2,200})/i,
    group: 1,
  },
  {
    type: "directive",
    label: "for-future-reference",
    regex:
      /\bfor\s+future\s+reference[,:]?\s+([\s\S]{3,240})/i,
    group: 1,
  },
  // ---------------- identity -----------------
  // Lead-in tokens use `[Mm]y` / `[Cc]all` char classes so the rule matches
  // case-insensitively at sentence start ("My name is ...") and after a
  // lowercase intro ("by the way, my name is ..."). The capture group stays
  // CASE-SENSITIVE on the first character (`[A-Z]`) so we don't promote
  // common-noun phrases like "my name is the same as before" as identity
  // facts. JS RegExp flags apply to the whole pattern, so we can't mix a
  // case-insensitive lead-in with a case-sensitive capture via `/.../i`.
  {
    type: "identity",
    label: "my-name-is",
    regex:
      /\b[Mm]y\s+[Nn]ame\s+(?:[Ii]s|'[sS])\s+([A-Z][A-Za-z'\-]{1,40}(?:\s+[A-Z][A-Za-z'\-]{1,40}){0,3})\b/,
    group: 1,
  },
  {
    type: "identity",
    label: "call-me",
    regex:
      /\b(?:[Pp]lease\s+)?[Cc]all\s+me\s+([A-Z][A-Za-z'\-]{1,40}(?:\s+[A-Z][A-Za-z'\-]{1,40}){0,2})\b/,
    group: 1,
  },
  // ---------------- preference (habitual) ----
  {
    type: "preference",
    label: "I-always-X",
    regex:
      /\bI\s+(?:always|usually|generally|typically|tend\s+to|prefer\s+to)\s+([\s\S]{3,200})/i,
    group: 1,
  },
  // ---------------- preference (structured) --
  {
    type: "preference",
    label: "my-favorite-X-is-Y",
    regex:
      /\bmy\s+(?:favorite|preferred|default|go-to)\s+([a-z][a-z\s/&\-]{1,40}?)\s+(?:is|are)\s+([\s\S]{2,120})/i,
    // Capture the whole "X is Y" span so the candidate is meaningful.
    group: 0,
  },
  // ---------------- preference (direct) ------
  {
    type: "preference",
    label: "I-prefer",
    regex:
      /\bI\s+prefer\s+(?!to\b)([\s\S]{3,200})/i,
    group: 1,
  },
  {
    type: "preference",
    label: "I-dont-like-X",
    regex:
      /\bI\s+(?:don't|do\s+not)\s+(?:like|want|use)\s+([\s\S]{3,200})/i,
    group: 1,
  },
];

/**
 * Normalize the extracted candidate text: collapse whitespace, trim, drop
 * trailing sentence terminators that came from greedy `[\s\S]{...}` matches,
 * cap to `MAX_TEXT_CHARS`. Never returns an empty string when given a
 * non-empty input (the caller already verified a match).
 */
function cleanText(s: string): string {
  let t = s.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  // Cut at the first end-of-sentence punctuation followed by a capitalized
  // new sentence, so "I prefer dark mode. Btw, hello" becomes
  // "I prefer dark mode."
  const cutAt = t.search(/[.!?](\s+[A-Z]|$)/);
  if (cutAt > 0) {
    t = t.slice(0, cutAt + 1);
  }
  if (t.length > MAX_TEXT_CHARS) {
    t = t.slice(0, MAX_TEXT_CHARS - 1).trimEnd() + "…";
  }
  return t;
}

/**
 * Detect a memory-worthy candidate in `message`. Returns null when:
 *   - message is too short, too long, or empty
 *   - message contains sensitive content (credit cards, SSN-like, API keys,
 *     bearer tokens, PEM private keys)
 *   - message contains a transient signal (today, tomorrow, right now, ...)
 *   - no pattern in `RULES` fires
 *
 * The returned object is safe to embed in the SSE `done` payload. Its
 * `text` field has already been sanitized and capped; its `pattern` field
 * is a short label, not a regex source. The caller (chat.ts) is
 * responsible for NEVER writing the candidate to disk on its own. The
 * write path is `POST /agents/:slug/memory/promote` with `confirmed:true`.
 */
export function detectMemoryCandidate(
  message: string,
  agentSlug: string
): MemoryCandidate | null {
  if (typeof message !== "string") return null;
  const len = message.length;
  if (len < MIN_INPUT_CHARS || len > MAX_INPUT_CHARS) return null;
  if (typeof agentSlug !== "string" || agentSlug.length === 0) return null;
  if (containsSensitiveContent(message)) return null;
  if (TRANSIENT_RE.test(message)) return null;

  for (const rule of RULES) {
    const m = rule.regex.exec(message);
    if (!m) continue;
    const raw = rule.group === 0 ? (m[0] ?? "") : (m[rule.group] ?? "");
    if (!raw || raw.trim().length === 0) continue;
    const text = cleanText(raw);
    if (!text) continue;
    // Defense in depth: the captured fact itself must also pass the
    // sensitive-content guard. Pathological inputs could embed a token
    // inside an otherwise innocuous-looking preference phrase.
    if (containsSensitiveContent(text)) return null;
    return {
      type: rule.type,
      text,
      pattern: rule.label,
      agentSlug,
    };
  }
  return null;
}
