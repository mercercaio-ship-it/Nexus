import type { SpecialistScore } from "./keywordRouter.js";

/**
 * Phase 3.1 - explicit overlap rules from `orchestrator/routing_rules.md`.
 *
 * Each rule fires only when BOTH of its slugs appear in the keyword shortlist
 * (so we never invent a route the keyword pass didn't think of). When the
 * rule fires, it returns the slug that should win, plus a human-readable
 * rationale and the rule id (persisted to routing_events.applied_rules_json).
 *
 * Rules are deterministic on `(message, shortlist)` - no LLM call.
 */

export interface OverrideRuleResult {
  selectedSlug: string;
  appliedRule: string;
  rationale: string;
}

interface RuleSpec {
  id: string;
  /** Both slugs must be present in the shortlist for the rule to consider. */
  pair: [string, string];
  /** Token bag for each slug. The rule picks whichever slug's bag has hits
   *  (and the other doesn't) using word-boundary regex (case-insensitive). */
  signals: Record<string, string[]>;
  rationaleTemplate: (winner: string) => string;
}

const RULES: RuleSpec[] = [
  {
    id: "lumi-vs-iris",
    pair: ["graphics-design", "photography"],
    signals: {
      "graphics-design": [
        "logo", "brand", "color palette", "typography", "layout",
        "ui mock", "ui", "poster", "icon", "illustration",
      ],
      photography: [
        "lens", "camera", "exposure", "raw", "shoot", "shoot list",
        "portrait shoot", "photo shoot", "lighting",
      ],
    },
    rationaleTemplate: (w) =>
      w === "graphics-design"
        ? "composed visual deliverable (logo/brand/layout/UI) -> Lumi"
        : "captured visual deliverable (lens/camera/exposure/shoot) -> Iris",
  },
  {
    id: "vera-vs-atlas",
    pair: ["business", "consulting"],
    signals: {
      business: [
        "business model", "pricing", "okr", "gtm", "go-to-market",
        "fundraising narrative", "fundraising",
      ],
      consulting: [
        "framework", "problem framing", "stakeholder", "workshop",
        "decision memo", "executive deck", "mece",
      ],
    },
    rationaleTemplate: (w) =>
      w === "business"
        ? "founder/operator framing (pricing/OKR/GTM/business model) -> Vera"
        : "advising-someone-else framing (framework/workshop/stakeholder/MECE) -> Atlas",
  },
  {
    id: "sage-vs-bit",
    pair: ["ai-services", "programming-tech"],
    signals: {
      "ai-services": [
        "llm", "rag", "agent", "prompt engineering", "fine-tune",
        "embedding", "vector db", "ai workflow",
      ],
      "programming-tech": [
        "code", "bug", "stack", "framework", "api", "refactor",
        "deploy", "devops", "library",
      ],
    },
    rationaleTemplate: (w) =>
      w === "ai-services"
        ? "AI/LLM IS the system being built -> Sage"
        : "general engineering that happens to touch AI -> Bit",
  },
  {
    id: "buzz-vs-lex",
    pair: ["digital-marketing", "writing-translation"],
    signals: {
      "digital-marketing": [
        "ads", "campaign", "seo", "funnel", "growth", "conversion",
        "audience", "positioning",
      ],
      "writing-translation": [
        "article", "essay", "translation", "localization", "ghostwrite",
        "edit prose", "tone", "blog post",
      ],
    },
    rationaleTemplate: (w) =>
      w === "digital-marketing"
        ? "conversion / audience-growth goal -> Buzz"
        : "craft / voice / long-form goal -> Lex",
  },
  {
    id: "echo-vs-reel",
    pair: ["music-audio", "video-animation"],
    signals: {
      "music-audio": [
        "voice-over", "podcast audio", "mix", "master", "sound design",
        "score", "song", "ambient",
      ],
      "video-animation": [
        "video", "edit", "animation", "motion graphics", "storyboard",
        "shot list", "reel", "after effects", "premiere",
      ],
    },
    rationaleTemplate: (w) =>
      w === "music-audio"
        ? "audio-first deliverable (mix/master/podcast audio/sound design) -> Echo"
        : "moving-image deliverable (video/animation/storyboard/motion graphics) -> Reel",
  },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenInMessage(message: string, token: string): boolean {
  return new RegExp("\\b" + escapeRegex(token) + "\\b", "i").test(message);
}

/**
 * Apply override rules in order. The first rule that:
 *   1. has both pair slugs in the shortlist
 *   2. has token hits for exactly one side of the pair
 * wins. Returns null if no rule decisively breaks the tie.
 */
export function applyOverrideRules(
  message: string,
  shortlist: SpecialistScore[]
): OverrideRuleResult | null {
  const slugs = new Set(shortlist.map((s) => s.slug));
  for (const rule of RULES) {
    if (!slugs.has(rule.pair[0]) || !slugs.has(rule.pair[1])) continue;
    const [a, b] = rule.pair;
    const aHit = (rule.signals[a] ?? []).some((tok) => tokenInMessage(message, tok));
    const bHit = (rule.signals[b] ?? []).some((tok) => tokenInMessage(message, tok));
    if (aHit && !bHit) {
      return {
        selectedSlug: a,
        appliedRule: rule.id,
        rationale: rule.rationaleTemplate(a),
      };
    }
    if (bHit && !aHit) {
      return {
        selectedSlug: b,
        appliedRule: rule.id,
        rationale: rule.rationaleTemplate(b),
      };
    }
  }
  return null;
}

/**
 * Returns short human-readable descriptions of the rules that are *relevant*
 * to the current shortlist - used as context for the LLM tie-breaker so it
 * has the same project knowledge as the deterministic layer.
 */
export function describeRelevantRules(shortlist: SpecialistScore[]): string[] {
  const slugs = new Set(shortlist.map((s) => s.slug));
  const summaries: string[] = [];
  for (const r of RULES) {
    if (!slugs.has(r.pair[0]) || !slugs.has(r.pair[1])) continue;
    const [a, b] = r.pair;
    summaries.push(
      `${a} vs ${b}: ${r.rationaleTemplate(a)} ; otherwise ${r.rationaleTemplate(b)}`
    );
  }
  return summaries;
}
