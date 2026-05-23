import { findEntry, type Registry } from "../agents/registry.js";
import type { Provider } from "../providers/Provider.js";
import { scoreSpecialists, type SpecialistScore } from "./keywordRouter.js";
import { applyOverrideRules, describeRelevantRules } from "./overrideRules.js";
import { llmTieBreaker } from "./tieBreaker.js";
import { detectConvening, describeConvenedSlugs } from "./convening.js";

export type RouteDecisionType =
  | "specialist"
  | "clarify"
  | "out_of_domain"
  | "nexus_fallback"
  | "convene";

export type RouteSource =
  | "keyword"
  | "override_rule"
  | "llm_tiebreaker"
  | "clarification"
  | "out_of_domain"
  | "fallback"
  | "explicit_multi"
  | "cross_domain";

export interface RouteShortlistEntry {
  slug: string;
  score: number;
  hits: string[];
  rationale?: string;
}

export interface RouteDecision {
  type: RouteDecisionType;
  selectedSlug: string;
  selectedName?: string;
  score: number;
  confidence: "high" | "medium" | "low";
  routeHits: string[];
  shortlist: RouteShortlistEntry[];
  rationale: string;
  source: RouteSource;
  clarificationQuestion?: string;
  convenedSlugs?: string[];
  appliedRules: string[];
}

export interface RoutingThresholds {
  highConfidenceMinScore: number;
  clearWinnerMargin: number;
  ambiguousMargin: number;
  outOfDomainMinScore: number;
}

export const DEFAULT_THRESHOLDS: RoutingThresholds = {
  highConfidenceMinScore: 5,
  clearWinnerMargin: 3,
  ambiguousMargin: 2,
  outOfDomainMinScore: 3,
};

export interface RoutingInput {
  message: string;
  registry: Registry;
  /** When provided, ambiguous cases get one chance at the LLM tie-breaker.
   *  When absent (e.g. Claude not installed in this environment), ambiguous
   *  cases fall straight through to the clarification path. */
  tieBreakerProvider?: Provider;
  /** Override defaults. Missing fields fall back to DEFAULT_THRESHOLDS. */
  thresholds?: Partial<RoutingThresholds>;
  /** Master switch for the tie-breaker stage (default true). Lets tests
   *  skip the LLM stage deterministically. */
  enableLlmTieBreaker?: boolean;
}

/**
 * Phase 3.1 routing pipeline.
 *
 * Layered, deterministic, side-effect free except for the optional LLM
 * tie-breaker call. The result is a RouteDecision that `chat.ts` uses to
 * pick the SSE behavior (full provider call vs deterministic Nexus reply)
 * and to fill a `routing_events` row.
 */
export async function routeMessageThroughPipeline(
  input: RoutingInput
): Promise<RouteDecision> {
  const T: RoutingThresholds = { ...DEFAULT_THRESHOLDS, ...(input.thresholds ?? {}) };

  const nexusEntry = input.registry.entries.find((e) => e.role === "orchestrator");
  const nexusSlug = nexusEntry?.slug ?? "nexus";

  const scored = scoreSpecialists(input.message, input.registry);
  const shortlist: RouteShortlistEntry[] = scored.slice(0, 4).map((s) => ({
    slug: s.slug,
    score: s.score,
    hits: s.hits,
  }));

  // 0) Phase 3.2 - convening detection runs first. If an explicit multi-
  //    perspective phrase fires OR a known cross-domain deliverable is
  //    named, we short-circuit the normal specialist pipeline and return
  //    a "convene" decision. The chat layer then fans out + synthesizes.
  const convene = detectConvening(input.message, scored, input.registry);
  if (convene) {
    return {
      type: "convene",
      selectedSlug: nexusSlug,
      selectedName: nexusEntry?.name,
      score: 0,
      confidence: convene.trigger === "explicit_multi" ? "high" : "high",
      routeHits: scored[0]?.hits ?? [],
      shortlist,
      rationale: `${convene.rationale} (specialists: ${describeConvenedSlugs(input.registry, convene.convenedSlugs)})`,
      source: convene.trigger,
      appliedRules: convene.matchedPattern ? [convene.matchedPattern] : [],
      convenedSlugs: convene.convenedSlugs,
    };
  }

  // 1) No keyword hits at all -> Nexus answers from project context.
  if (scored.length === 0) {
    return {
      type: "nexus_fallback",
      selectedSlug: nexusSlug,
      selectedName: nexusEntry?.name,
      score: 0,
      confidence: "low",
      routeHits: [],
      shortlist,
      rationale:
        "no specialist keyword matched; routing to Nexus so it can answer from creativedge_context.md",
      source: "fallback",
      appliedRules: [],
    };
  }

  const top = scored[0]!;
  const second = scored[1];

  // 2) Only soft hits (no real keyword) -> out-of-domain with adjacent suggestion.
  if (top.score < T.outOfDomainMinScore) {
    return {
      type: "out_of_domain",
      selectedSlug: nexusSlug,
      selectedName: nexusEntry?.name,
      score: top.score,
      confidence: "low",
      routeHits: top.hits,
      shortlist,
      rationale: `top score ${top.score} below out_of_domain threshold ${T.outOfDomainMinScore}; closest adjacent specialist is ${top.slug}`,
      source: "out_of_domain",
      appliedRules: [],
    };
  }

  // 3) Clear winner -> route directly with high confidence.
  const margin = top.score - (second?.score ?? 0);
  if (top.score >= T.highConfidenceMinScore && margin >= T.clearWinnerMargin) {
    return {
      type: "specialist",
      selectedSlug: top.slug,
      selectedName: top.name,
      score: top.score,
      confidence: "high",
      routeHits: top.hits,
      shortlist,
      rationale: `clear winner: ${top.slug} score=${top.score} margin=${margin} hits=[${top.hits.join(", ")}]`,
      source: "keyword",
      appliedRules: [],
    };
  }

  // 4) Ambiguous (top and second are close): override rules -> tie-breaker -> clarify.
  if (second && margin <= T.ambiguousMargin) {
    const override = applyOverrideRules(input.message, scored);
    if (override) {
      const entry = findEntry(input.registry, override.selectedSlug);
      const winnerScore = scored.find((s) => s.slug === override.selectedSlug)?.score ?? top.score;
      return {
        type: "specialist",
        selectedSlug: override.selectedSlug,
        selectedName: entry?.name,
        score: winnerScore,
        confidence: "high",
        routeHits: scored.find((s) => s.slug === override.selectedSlug)?.hits ?? top.hits,
        shortlist,
        rationale: override.rationale,
        source: "override_rule",
        appliedRules: [override.appliedRule],
      };
    }

    // LLM tie-breaker (only when a real Claude provider is available).
    if ((input.enableLlmTieBreaker ?? true) && input.tieBreakerProvider) {
      const rulesSummary = describeRelevantRules(scored);
      const tb = await llmTieBreaker(
        input.message,
        scored,
        rulesSummary,
        input.tieBreakerProvider
      );
      if (tb) {
        const entry = findEntry(input.registry, tb.slug);
        const winnerScore = scored.find((s) => s.slug === tb.slug)?.score ?? top.score;
        return {
          type: "specialist",
          selectedSlug: tb.slug,
          selectedName: entry?.name,
          score: winnerScore,
          confidence: tb.confidence,
          routeHits: scored.find((s) => s.slug === tb.slug)?.hits ?? top.hits,
          shortlist,
          rationale: "llm tie-breaker: " + tb.rationale,
          source: "llm_tiebreaker",
          appliedRules: [],
        };
      }
    }

    // No override fired and no usable tie-breaker -> ask the user one short question.
    return {
      type: "clarify",
      selectedSlug: nexusSlug,
      selectedName: nexusEntry?.name,
      score: top.score,
      confidence: "medium",
      routeHits: top.hits,
      shortlist,
      rationale: `ambiguous candidates: ${top.slug}(${top.score}) vs ${second.slug}(${second.score}); asking for clarification`,
      source: "clarification",
      clarificationQuestion: buildClarificationQuestion(input.registry, top.slug, second.slug),
      appliedRules: [],
    };
  }

  // 5) Single moderate winner (>= outOfDomainMinScore but below clear-winner bar).
  return {
    type: "specialist",
    selectedSlug: top.slug,
    selectedName: top.name,
    score: top.score,
    confidence: top.score >= T.highConfidenceMinScore ? "high" : "medium",
    routeHits: top.hits,
    shortlist,
    rationale: `top match ${top.slug} score=${top.score} above threshold ${T.outOfDomainMinScore}`,
    source: "keyword",
    appliedRules: [],
  };
}

function buildClarificationQuestion(
  reg: Registry,
  slugA: string,
  slugB: string
): string {
  const a = findEntry(reg, slugA);
  const b = findEntry(reg, slugB);
  const labelA = a ? `${a.emoji} ${a.name} (${a.domain ?? "?"})` : slugA;
  const labelB = b ? `${b.emoji} ${b.name} (${b.domain ?? "?"})` : slugB;
  return `🌐 Nexus: this could go two ways — do you want ${labelA}, or ${labelB}? A one-line clarification will tell me which one to bring in.`;
}

/**
 * Build the deterministic Nexus reply for an out-of-domain decision. Picks
 * the closest adjacent specialist (top of the shortlist) as a hint.
 */
export function buildOutOfDomainReply(
  reg: Registry,
  decision: RouteDecision
): string {
  const adjSlug = decision.shortlist[0]?.slug;
  const adj = adjSlug ? findEntry(reg, adjSlug) : undefined;
  const hint = adj
    ? ` The closest fit in the current roster might be ${adj.emoji} ${adj.name} (${adj.domain ?? "?"}), but rephrasing with the kind of help you want will route more cleanly.`
    : " Rephrasing with the kind of help you want will route more cleanly.";
  return `🌐 Nexus: I do not see a strong match to the current CreativEdge specialists for this.${hint}`;
}
