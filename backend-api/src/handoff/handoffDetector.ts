import type { Registry } from "../agents/registry.js";
import { findEntry } from "../agents/registry.js";

/**
 * Phase 3.3 - Hand-off detector.
 *
 * A specialist may emit, at most once per turn, a structured block of the form:
 *
 *   <CREATIVEDGE_HANDOFF>
 *   {"handoff":"<slug>","reason":"<short justification>"}
 *   </CREATIVEDGE_HANDOFF>
 *
 * The block signals: "this turn is better answered by <slug>". The detector:
 *   1. Locates the FIRST block (we ignore any subsequent ones to keep the
 *      contract simple - any second block becomes part of cleanedText).
 *   2. Strips it from the rendered text so the user never sees protocol noise.
 *   3. Normalizes the raw target through ALIAS_MAP (Phase 3.3 patch). The
 *      specialist may use a persona name ("echo"), a domain word ("audio"),
 *      or the canonical slug ("music-audio") - all resolve to the same
 *      registered specialist.
 *   4. Validates the JSON payload, the target slug against the registry, and
 *      the originating slug (no self-handoffs, no orchestrator targets).
 *   5. Returns a discriminated result: "none", "valid", or "ignored".
 *
 * The detector is pure: no network, no DB, no file IO. All routing,
 * persistence, and anti-ping-pong are decided by the caller (chat route).
 */

const HANDOFF_BLOCK_RE =
  /<CREATIVEDGE_HANDOFF>\s*([\s\S]*?)\s*<\/CREATIVEDGE_HANDOFF>/i;

/**
 * Phase 3.3 patch - canonical-slug alias map.
 *
 * Specialists in the wild use their persona names (Lumi, Echo, Reel, ...)
 * or short domain words (audio, photo, ...) rather than registry slugs.
 * We normalize a candidate handoff target through this table before
 * registry lookup so the protocol is forgiving of natural language.
 *
 * Keys are already-normalized (lowercase, dash-separated). Values are the
 * canonical registry slug. Unknown keys are NOT auto-accepted - they fall
 * through to a direct registry lookup so future specialists added to the
 * registry but missing from this table still work via their canonical slug.
 */
const ALIAS_MAP: Record<string, string> = {
  "nexus": "nexus",
  // Lumi - graphics-design
  "lumi": "graphics-design",
  "graphics": "graphics-design",
  "design": "graphics-design",
  "graphics-design": "graphics-design",
  // Bit - programming-tech
  "bit": "programming-tech",
  "programming": "programming-tech",
  "tech": "programming-tech",
  "programming-tech": "programming-tech",
  // Buzz - digital-marketing
  "buzz": "digital-marketing",
  "marketing": "digital-marketing",
  "digital-marketing": "digital-marketing",
  // Reel - video-animation
  "reel": "video-animation",
  "video": "video-animation",
  "animation": "video-animation",
  "video-animation": "video-animation",
  // Lex - writing-translation
  "lex": "writing-translation",
  "writing": "writing-translation",
  "translation": "writing-translation",
  "writing-translation": "writing-translation",
  // Echo - music-audio
  "echo": "music-audio",
  "music": "music-audio",
  "audio": "music-audio",
  "sound": "music-audio",
  "music-audio": "music-audio",
  // Vera - business
  "vera": "business",
  "business": "business",
  // Cash - finance
  "cash": "finance",
  "finance": "finance",
  // Sage - ai-services
  "sage": "ai-services",
  "ai": "ai-services",
  "ai-services": "ai-services",
  // Bloom - personal-growth
  "bloom": "personal-growth",
  "personal-growth": "personal-growth",
  // Atlas - consulting
  "atlas": "consulting",
  "consulting": "consulting",
  // Quant - data
  "quant": "data",
  "data": "data",
  // Iris - photography
  "iris": "photography",
  "photo": "photography",
  "photography": "photography",
};

/**
 * Normalize a raw target string to the form used as a key in ALIAS_MAP.
 * Lowercases, collapses runs of non-alphanumerics into a single dash,
 * and trims leading/trailing dashes.
 *
 *   "Echo"           -> "echo"
 *   "music audio"    -> "music-audio"
 *   "Music & Audio"  -> "music-audio"
 *   "  ai_services " -> "ai-services"
 *   "@@@"            -> ""
 */
export function normalizeSlugCandidate(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a candidate target string to a canonical registry slug.
 * Tries the alias table first, then falls back to a direct registry lookup
 * on the normalized form so newly-registered specialists don't require an
 * alias-table edit.
 *
 * Returns null when the candidate cannot be resolved to anything.
 */
export function resolveCanonicalSlug(
  candidate: string,
  reg: Registry
): string | null {
  const norm = normalizeSlugCandidate(candidate);
  if (!norm) return null;
  if (norm in ALIAS_MAP) return ALIAS_MAP[norm]!;
  // Fallback: if the normalized form is itself a registry slug, accept it.
  if (findEntry(reg, norm)) return norm;
  return null;
}

export type HandoffIgnoreStatus =
  | "ignored_malformed_json"
  | "ignored_missing_reason"
  | "ignored_invalid_slug"
  | "ignored_same_slug"
  | "ignored_nexus_target";

export type HandoffDetection =
  | { kind: "none"; cleanedText: string }
  | {
      kind: "valid";
      toSlug: string;       // canonical registry slug
      rawSlug: string;      // exactly what the specialist wrote
      reason: string;
      cleanedText: string;
    }
  | {
      kind: "ignored";
      status: HandoffIgnoreStatus;
      ignoredReason: string;
      rawSlug?: string;     // present when a string slug was attempted
      cleanedText: string;
    };

function stripBlock(text: string, match: RegExpMatchArray): string {
  const idx = match.index ?? text.indexOf(match[0]);
  if (idx < 0) return text;
  const before = text.slice(0, idx).trimEnd();
  const after = text.slice(idx + match[0].length).trimStart();
  if (!before) return after;
  if (!after) return before;
  return before + "\n\n" + after;
}

/**
 * Detect a handoff block in the given specialist response text.
 *
 *   - fromSlug: the slug of the specialist who produced `text` (anti-self).
 *   - reg:      registry used to validate the handoff target.
 *
 * `cleanedText` is the text with the handoff block stripped (whether valid
 * or ignored). The caller is free to ship `cleanedText` directly to the user
 * when handoff is "none" or "ignored", and to ignore `cleanedText` when
 * handoff is "valid" (because the visible reply will come from the target).
 */
export function detectHandoff(
  text: string,
  fromSlug: string,
  reg: Registry
): HandoffDetection {
  const m = text.match(HANDOFF_BLOCK_RE);
  if (!m) return { kind: "none", cleanedText: text };

  const rawJson = m[1] ?? "";
  const cleanedText = stripBlock(text, m);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return {
      kind: "ignored",
      status: "ignored_malformed_json",
      ignoredReason: "handoff JSON could not be parsed",
      cleanedText,
    };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      kind: "ignored",
      status: "ignored_malformed_json",
      ignoredReason: "handoff payload was not a JSON object",
      cleanedText,
    };
  }
  const obj = parsed as Record<string, unknown>;
  const rawSlug = typeof obj.handoff === "string" ? obj.handoff.trim() : "";
  const reason = typeof obj.reason === "string" ? obj.reason.trim() : "";

  if (!reason) {
    return {
      kind: "ignored",
      status: "ignored_missing_reason",
      ignoredReason: "handoff block missing non-empty reason",
      rawSlug: rawSlug || undefined,
      cleanedText,
    };
  }
  if (!rawSlug) {
    return {
      kind: "ignored",
      status: "ignored_invalid_slug",
      ignoredReason: "handoff slug missing",
      cleanedText,
    };
  }

  // Phase 3.3 patch - normalize persona names / domain words to canonical
  // registry slugs BEFORE the self/orchestrator/registry checks. If the
  // candidate can't be resolved at all we report it as invalid; this is the
  // only place an "unknown alias" can come back as ignored_invalid_slug.
  const canonical = resolveCanonicalSlug(rawSlug, reg);
  if (!canonical) {
    return {
      kind: "ignored",
      status: "ignored_invalid_slug",
      ignoredReason: `handoff target "${rawSlug}" did not resolve to any registered specialist`,
      rawSlug,
      cleanedText,
    };
  }

  if (canonical === fromSlug) {
    return {
      kind: "ignored",
      status: "ignored_same_slug",
      ignoredReason: `handoff target "${rawSlug}" -> "${canonical}" equals originating specialist`,
      rawSlug,
      cleanedText,
    };
  }
  const target = findEntry(reg, canonical);
  if (!target || target.role !== "specialist") {
    return {
      kind: "ignored",
      status:
        target?.role === "orchestrator"
          ? "ignored_nexus_target"
          : "ignored_invalid_slug",
      ignoredReason:
        target?.role === "orchestrator"
          ? `handoff target "${rawSlug}" resolved to the orchestrator (Nexus); handoffs go specialist -> specialist only`
          : `handoff target "${rawSlug}" -> "${canonical}" is not a registered specialist`,
      rawSlug,
      cleanedText,
    };
  }

  return {
    kind: "valid",
    toSlug: canonical,
    rawSlug,
    reason: reason.slice(0, 400),
    cleanedText,
  };
}

/**
 * Anti-ping-pong helper. If a downstream specialist (the handoff TARGET)
 * itself emits a handoff block, we strip it silently. We do NOT chain
 * handoffs; the cap is exactly one per turn.
 */
export function stripAnyHandoffBlock(
  text: string
): { stripped: string; hadBlock: boolean } {
  const m = text.match(HANDOFF_BLOCK_RE);
  if (!m) return { stripped: text, hadBlock: false };
  return { stripped: stripBlock(text, m), hadBlock: true };
}
