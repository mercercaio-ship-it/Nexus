import type { Registry, RegistryEntry } from "../agents/registry.js";

export interface RouteResult {
  slug: string;
  score: number;
  hits: string[];
  confident: boolean;
  reason: string;
}

const CONFIDENCE_THRESHOLD = 3;

/**
 * Escape a string for use inside a RegExp literal.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Word-boundary, case-insensitive keyword matcher with common-English suffix
 * tolerance.
 *
 * Phase 2.4 fix: substring matching caused false positives where a short
 * keyword embedded inside a longer word would route incorrectly. Most
 * notoriously:
 *
 *   - "Explain in one short paragraph what CreativEdge is."
 *     -> the substring "rag" inside "paragraph" matched the AI-services
 *        keyword "RAG", routing the prompt to ai-services.
 *
 * Other latent traps that this matcher prevents:
 *   - "rapidly"     no longer matches "API"
 *   - "aiming"      no longer matches "AI"
 *   - "taxonomy"    no longer matches "tax"
 *   - "redesign"    no longer matches "design"
 *
 * Behavior:
 *   - Requires a word boundary on both sides of the keyword stem.
 *   - Allows common English suffixes (s, es, ed, er, ers, ing, y, ies)
 *     after the stem so plurals / conjugations still match.
 *     e.g. "agent" -> "agents", "agentry" (no - missing word boundary),
 *          "design" -> "designs", "designing", "designed".
 *   - Case-insensitive throughout.
 *   - Regex metacharacters in the keyword are escaped (handles "A/B test",
 *     "C++", etc. defensively even though we don't currently ship those).
 *
 * Regression cases (kept inline so the contract stays visible):
 *   keywordMatches("paragraph", "RAG")        === false
 *   keywordMatches("RAG vs fine-tune", "RAG") === true
 *   keywordMatches("agents", "agent")         === true
 *   keywordMatches("redesign", "design")      === false
 *   keywordMatches("taxonomy", "tax")         === false
 *   keywordMatches("rapidly typing", "API")   === false
 */
function keywordMatches(haystack: string, kw: string): boolean {
  if (!kw) return false;
  const re = new RegExp(
    "\\b" + escapeRegex(kw) + "(?:s|es|ed|er|ers|ing|y|ies)?\\b",
    "i"
  );
  return re.test(haystack);
}

/**
 * Deterministic keyword-based router. Ported from console.html.
 *
 *   +3 per registry routing_keyword that matches with word boundaries
 *   +2 per soft hit on the specialist name or domain
 *
 * Highest-scoring specialist wins; ties are broken by registry order
 * (we only replace `best` on a strictly greater score). If nothing scores
 * at all, fall back to the orchestrator (Nexus) for a clarification.
 *
 * Phase 2.4 swap: word-boundary regex replaces the old `q.includes(kw)`
 * substring scan.
 */
export function routeMessage(message: string, reg: Registry): RouteResult {
  const specialists = reg.entries.filter((e) => e.role === "specialist");

  let best: { entry: RegistryEntry; score: number; hits: string[] } | null = null;

  for (const e of specialists) {
    let score = 0;
    const hits: string[] = [];
    for (const kw of e.routing_keywords ?? []) {
      if (keywordMatches(message, kw)) {
        score += 3;
        hits.push(kw);
      }
    }
    for (const soft of [e.domain, e.name].filter(
      (x): x is string => typeof x === "string"
    )) {
      if (keywordMatches(message, soft)) {
        score += 2;
        hits.push(soft);
      }
    }
    if (score > 0 && (best === null || score > best.score)) {
      best = { entry: e, score, hits };
    }
  }

  if (!best) {
    const nexus = reg.entries.find((e) => e.role === "orchestrator");
    return {
      slug: nexus?.slug ?? "nexus",
      score: 0,
      hits: [],
      confident: false,
      reason:
        "no specialist keyword matched; routing to orchestrator for clarification",
    };
  }
  return {
    slug: best.entry.slug,
    score: best.score,
    hits: best.hits,
    confident: best.score >= CONFIDENCE_THRESHOLD,
    reason: `matched ${best.hits.length} signal(s) -> ${best.entry.slug}`,
  };
}


// ---------------------------------------------------------------------------
// Phase 3.1 - Ranked-shortlist exporter for the routing pipeline.
// ---------------------------------------------------------------------------

export interface SpecialistScore {
  slug: string;
  name: string;
  domain?: string;
  score: number;
  hits: string[];
}

/**
 * Score every specialist (role: "specialist") against `message` using the same
 * +3-per-keyword / +2-per-soft-hit (name|domain) word-boundary regex as
 * `routeMessage`. Returns only specialists with score > 0, sorted descending.
 *
 * Used by the Phase 3.1 routing pipeline. `routeMessage` (single-winner)
 * stays exported for backward compatibility with any old caller.
 */
export function scoreSpecialists(message: string, reg: Registry): SpecialistScore[] {
  const specialists = reg.entries.filter((e) => e.role === "specialist");
  const out: SpecialistScore[] = [];
  for (const e of specialists) {
    let score = 0;
    const hits: string[] = [];
    for (const kw of e.routing_keywords ?? []) {
      if (keywordMatches(message, kw)) {
        score += 3;
        hits.push(kw);
      }
    }
    for (const soft of [e.domain, e.name].filter(
      (x): x is string => typeof x === "string"
    )) {
      if (keywordMatches(message, soft)) {
        score += 2;
        hits.push(soft);
      }
    }
    if (score > 0) {
      out.push({ slug: e.slug, name: e.name, domain: e.domain, score, hits });
    }
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}
