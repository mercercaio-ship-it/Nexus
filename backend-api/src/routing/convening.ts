import { findEntry, type Registry } from "../agents/registry.js";
import type { SpecialistScore } from "./keywordRouter.js";

/**
 * Phase 3.2 - convening detection + specialist selection.
 *
 * Two trigger paths:
 *
 *   A. "explicit_multi" - the user asked in plain English for multiple
 *      perspectives. e.g. "compare from both angles", "design AND marketing",
 *      "bring in the team", "two specialists".
 *
 *   B. "cross_domain"  - the request implicitly spans multiple domains by
 *      naming a known cross-domain deliverable. e.g. "brand launch",
 *      "AI product pitch", "logo and video", "pitch deck".
 *
 * Convening is opt-in: simple single-domain asks ("I need a logo",
 * "fix this API bug") must NOT trip these patterns. The detector is
 * deterministic - no LLM call.
 */

const MAX_CONVENED = 3;

export interface ConveningDetection {
  trigger: "explicit_multi" | "cross_domain";
  matchedPattern: string;
  convenedSlugs: string[];
  rationale: string;
}

// --- Domain alias map (singular, lowercase tokens) --------------------------

const DOMAIN_ALIASES: Record<string, string[]> = {
  "graphics-design":     ["design", "graphics", "graphic design", "logo design", "brand design", "visual design", "ui design", "ux design", "branding"],
  "digital-marketing":   ["marketing", "ads", "advertising", "campaign", "growth marketing", "seo"],
  "business":            ["business", "strategy", "go-to-market", "gtm", "ops", "operations"],
  "programming-tech":    ["code", "coding", "engineering", "technical", "tech", "programming", "backend", "frontend", "devops", "security"],
  "ai-services":         ["ai", "ml", "llm", "machine learning", "ai services", "ai engineering"],
  "writing-translation": ["writing", "copy", "copywriting", "wording", "translation", "editorial", "prose"],
  "photography":         ["photography", "photo"],
  "video-animation":     ["video", "animation", "motion graphics", "motion"],
  "music-audio":         ["music", "audio", "sound"],
  "data":                ["data", "analytics", "statistics", "stats"],
  "consulting":          ["consulting", "advisory"],
  "finance":             ["finance", "tax", "investing", "accounting"],
  "personal-growth":     ["habit", "habits", "productivity", "self-improvement"],
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Returns the set of slugs whose alias tokens appear (as whole words) in `message`. */
function slugsMentionedByName(message: string): string[] {
  const found: string[] = [];
  for (const [slug, aliases] of Object.entries(DOMAIN_ALIASES)) {
    for (const a of aliases) {
      const re = new RegExp("\\b" + escapeRegex(a) + "\\b", "i");
      if (re.test(message)) { found.push(slug); break; }
    }
  }
  // Deduplicate, preserve insertion order
  return Array.from(new Set(found));
}

// --- Explicit multi-perspective phrases -------------------------------------

const EXPLICIT_PHRASES: Array<{ re: RegExp; label: string }> = [
  { re: /\bcompare\s+(?:this|these)\b/i,                                   label: "compare this" },
  { re: /\bfrom\s+both\s+angles\b/i,                                       label: "from both angles" },
  { re: /\bboth\s+angles?\b/i,                                             label: "both angles" },
  { re: /\bmultiple\s+perspectives\b/i,                                    label: "multiple perspectives" },
  { re: /\bseveral\s+specialists\b/i,                                      label: "several specialists" },
  { re: /\btwo\s+specialists\b/i,                                          label: "two specialists" },
  { re: /\bthree\s+specialists\b/i,                                        label: "three specialists" },
  { re: /\bbring\s+in\s+(?:the\s+)?team\b/i,                               label: "bring in the team" },
  { re: /\bconvene\b/i,                                                    label: "convene" },
  { re: /\bpros\s+and\s+cons\b/i,                                          label: "pros and cons" },
  { re: /\bfrom\s+(?:both\s+)?[a-z][\w-]+\s+and\s+[a-z][\w-]+\s+angles?\b/i, label: "from X and Y angles" },
  { re: /\b[a-z][\w-]+\s+and\s+[a-z][\w-]+\s+feedback\b/i,                 label: "X and Y feedback" },
];

// --- Cross-domain deliverable triggers (ordered; first match wins) ---------

interface CrossDomainTrigger {
  /** Human-readable label used in routing_events.rationale and tests. */
  label: string;
  /** Regex on the lowercased message. */
  test: (m: string) => boolean;
  /** Slugs to convene (capped to 3 elsewhere). */
  slugs: string[];
}

const CROSS_DOMAIN_TRIGGERS: CrossDomainTrigger[] = [
  {
    label: "brand launch",
    test: (m) => /\bbrand\s+launch\b/.test(m),
    slugs: ["graphics-design", "digital-marketing", "business"],
  },
  {
    label: "product launch",
    test: (m) => /\bproduct\s+launch\b/.test(m) || /\bapp\s+launch\b/.test(m),
    slugs: ["graphics-design", "digital-marketing", "business"],
  },
  {
    label: "AI product pitch",
    test: (m) => /\b(?:ai|llm)\s+product\s+pitch\b/.test(m) || /\bpitch\s+(?:an\s+)?ai\s+product\b/.test(m),
    slugs: ["ai-services", "business", "writing-translation"],
  },
  {
    label: "pitch deck",
    test: (m) => /\bpitch\s+deck\b/.test(m) || /\binvestor\s+(?:deck|pitch)\b/.test(m),
    slugs: ["business", "writing-translation", "graphics-design"],
  },
  {
    label: "website launch campaign",
    test: (m) => (/\b(?:landing\s+page|website|web\s+site|marketing\s+site)\b/.test(m) && /\bcampaign\b/.test(m))
      || /\bgo-to-market\s+website\b/.test(m),
    slugs: ["programming-tech", "graphics-design", "digital-marketing"],
  },
  {
    label: "logo + video",
    test: (m) => /\blogo\b/.test(m) && /\b(?:video|animation|animated)\b/.test(m),
    slugs: ["graphics-design", "video-animation"],
  },
  {
    label: "code + security",
    test: (m) => /\bcode\b/.test(m) && /\bsecurity\b/.test(m),
    slugs: ["programming-tech", "consulting"],
  },
  {
    label: "business and technical",
    test: (m) => /\b(?:business\s+and\s+technical|technical\s+and\s+business)\b/.test(m),
    slugs: ["business", "programming-tech"],
  },
];

// --- Public API -------------------------------------------------------------

/**
 * Decide whether to convene and, if so, which specialists. Returns null when
 * the message should follow the normal single-specialist pipeline.
 *
 * The function is deterministic and cheap (no LLM call). It uses both the
 * raw user message and the keyword shortlist as inputs.
 */
export function detectConvening(
  message: string,
  shortlist: SpecialistScore[],
  reg: Registry
): ConveningDetection | null {
  const lc = message.toLowerCase();
  const validSlugs = new Set(
    reg.entries.filter((e) => e.role === "specialist").map((e) => e.slug)
  );
  const ranked = shortlist.map((s) => s.slug).filter((s) => validSlugs.has(s));

  // --- A. Explicit multi-perspective ask -----------------------------------
  for (const ph of EXPLICIT_PHRASES) {
    if (!ph.re.test(message)) continue;

    // Prefer slugs the user named explicitly; fall back to the top of the shortlist.
    const named = slugsMentionedByName(message).filter((s) => validSlugs.has(s));
    let chosen: string[] = [];
    if (named.length >= 2) {
      chosen = named.slice(0, MAX_CONVENED);
    } else if (named.length === 1) {
      chosen = [named[0]!, ...ranked.filter((s) => s !== named[0])].slice(0, MAX_CONVENED);
    } else if (ranked.length >= 2) {
      chosen = ranked.slice(0, MAX_CONVENED);
    } else {
      // Phrase fired but nothing to convene -> let the normal pipeline handle.
      return null;
    }

    return {
      trigger: "explicit_multi",
      matchedPattern: ph.label,
      convenedSlugs: dedupCap(chosen),
      rationale: `explicit multi-perspective ask ("${ph.label}") -> ${chosen.join(", ")}`,
    };
  }

  // --- B. Cross-domain deliverable -----------------------------------------
  for (const t of CROSS_DOMAIN_TRIGGERS) {
    if (!t.test(lc)) continue;
    const chosen = dedupCap(t.slugs.filter((s) => validSlugs.has(s)));
    if (chosen.length < 2) continue;
    return {
      trigger: "cross_domain",
      matchedPattern: t.label,
      convenedSlugs: chosen,
      rationale: `cross-domain deliverable (${t.label}) requires ${chosen.join(", ")}`,
    };
  }

  // --- C. Soft signal: shortlist has 3+ specialists AND the user explicitly
  //        names 2+ of them by domain alias. Only fires for clearly cross-
  //        domain asks; avoids over-triggering on single keyword overlap.
  const named = slugsMentionedByName(message).filter((s) => validSlugs.has(s));
  if (named.length >= 2 && ranked.length >= 2) {
    const intersection = named.filter((s) => ranked.includes(s));
    if (intersection.length >= 2) {
      const chosen = dedupCap(intersection);
      return {
        trigger: "explicit_multi",
        matchedPattern: "two-or-more-domains-named",
        convenedSlugs: chosen,
        rationale: `user named ${chosen.length} domains by alias -> ${chosen.join(", ")}`,
      };
    }
  }

  return null;
}

function dedupCap(slugs: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of slugs) {
    if (s === "nexus") continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= MAX_CONVENED) break;
  }
  return out;
}

/** Build a one-line human-readable rationale from a registry entry list. */
export function describeConvenedSlugs(reg: Registry, slugs: string[]): string {
  return slugs
    .map((s) => {
      const e = findEntry(reg, s);
      return e ? `${e.emoji} ${e.name} (${e.domain ?? s})` : s;
    })
    .join(", ");
}
