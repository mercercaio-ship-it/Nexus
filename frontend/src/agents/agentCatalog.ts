// CreativEdge Phase 6-E validation patch (2026-05-20) - agent catalog.
//
// Maps the 14 agent slugs to friendly display names + the `@alias`
// shorthand accepted by `/remember @<alias> <text>`. Single source of
// truth for the modal target selector and the slash parser.
//
// Slug values must match the backend's `agents/registry.json`.

export interface AgentEntry {
  slug: string;
  name: string;
  alias: string;
}

export const AGENT_CATALOG: readonly AgentEntry[] = [
  { slug: "nexus", name: "Nexus", alias: "nexus" },
  { slug: "programming-tech", name: "Bit", alias: "bit" },
  { slug: "graphics-design", name: "Lumi", alias: "lumi" },
  { slug: "ai-services", name: "Sage", alias: "sage" },
  { slug: "business", name: "Vera", alias: "vera" },
  { slug: "finance", name: "Cash", alias: "cash" },
  { slug: "writing-translation", name: "Lex", alias: "lex" },
  { slug: "video-animation", name: "Reel", alias: "reel" },
  { slug: "digital-marketing", name: "Buzz", alias: "buzz" },
  { slug: "music-audio", name: "Echo", alias: "echo" },
  { slug: "personal-growth", name: "Bloom", alias: "bloom" },
  { slug: "consulting", name: "Atlas", alias: "atlas" },
  { slug: "data", name: "Quant", alias: "quant" },
  { slug: "photography", name: "Iris", alias: "iris" },
];

export const DEFAULT_AGENT_SLUG = "nexus";

const aliasToSlug = new Map<string, string>(
  AGENT_CATALOG.map((e) => [e.alias.toLowerCase(), e.slug])
);
const slugToName = new Map<string, string>(
  AGENT_CATALOG.map((e) => [e.slug, e.name])
);
const knownSlugs = new Set<string>(AGENT_CATALOG.map((e) => e.slug));

/** Resolve an `@<alias>` to its canonical slug. Accepts the canonical
 *  alias (`@nexus`, `@bit`, …) and falls back to an exact slug match
 *  (`@programming-tech`) so power users aren't blocked.
 *
 *  Returns null when the alias is not recognised; the caller surfaces
 *  a friendly inline warning instead of calling the backend. */
export function resolveAliasToSlug(alias: string): string | null {
  const lc = alias.toLowerCase().trim();
  if (lc.length === 0) return null;
  const direct = aliasToSlug.get(lc);
  if (direct) return direct;
  if (knownSlugs.has(lc)) return lc;
  return null;
}

/** Friendly display name for a slug; falls back to the slug itself
 *  when the slug isn't in the catalog (defensive — should never
 *  happen with the 14 known agents). */
export function nameForSlug(slug: string): string {
  return slugToName.get(slug) ?? slug;
}

/** True when the slug is one of the 14 known agents. */
export function isKnownSlug(slug: string): boolean {
  return knownSlugs.has(slug);
}

/** Comma-separated list of known aliases, used in error messages. */
export function knownAliasesHint(): string {
  return AGENT_CATALOG.map((e) => `@${e.alias}`).join(", ");
}
