// CreativEdge Phase 6-C/6-E - slash command parser.
//
// Pure module — no React, no fetch. The dispatcher in `App.tsx`
// decides what to do with each parsed command.
//
// Supported commands:
//   /agent <slug> <message>           → safe routing-hint rewrite
//   /forget core <text>               → forget core (modal-gated)
//   /forget episodic <text>           → forget episodic (modal-gated)
//   /remember [@alias] <text>         → promote to core (modal-gated)
//   /compact status                   → GET /compact/status
//   /compact preview                  → POST /compact/preview (no apply)
//   /backup status                    → GET /backup/status
//
// Phase 6-E validation patch (2026-05-20):
//   `/remember` now accepts an optional leading `@<alias>` to pick the
//   target agent without first sending a normal chat message. Unknown
//   aliases surface a friendly inline warning instead of reaching the
//   backend. The modal still lets the user change the target before
//   confirming.

import {
  knownAliasesHint,
  resolveAliasToSlug,
} from "../agents/agentCatalog";
import type { SlashCommand } from "../types";

const SLUG_RE = /^[a-z][a-z0-9-]{0,40}$/;

export function parseSlashCommand(input: string): SlashCommand | null {
  if (!input.startsWith("/")) return null;
  const raw = input;
  const body = input.slice(1);
  const [headRaw, ...rest] = body.split(/\s+/);
  const head = (headRaw ?? "").toLowerCase();
  const restJoined = rest.join(" ").trim();

  switch (head) {
    case "agent": {
      const [slug, ...msgWords] = rest;
      const message = msgWords.join(" ").trim();
      if (!slug || !SLUG_RE.test(slug)) {
        return { kind: "incomplete", raw, reason: "agent: expected /agent <slug> <message>" };
      }
      if (!message) {
        return { kind: "incomplete", raw, reason: "agent: expected a message after the slug" };
      }
      return { kind: "agent", slug, message };
    }
    case "forget": {
      const [sub, ...rest2] = rest;
      const subLower = (sub ?? "").toLowerCase();
      if (subLower !== "core" && subLower !== "episodic") {
        return {
          kind: "incomplete",
          raw,
          reason: "forget: expected /forget core <text> or /forget episodic <text>",
        };
      }
      const text = rest2.join(" ").trim();
      if (text.length < 3) {
        return { kind: "incomplete", raw, reason: "forget: text must be at least 3 chars" };
      }
      return { kind: "forget", subKind: subLower, text };
    }
    case "remember": {
      // Optional leading `@<alias>` selects the target agent.
      let targetSlug: string | undefined;
      let textTokens = rest;
      const first = (rest[0] ?? "").trim();
      if (first.startsWith("@") && first.length > 1) {
        const aliasOrSlug = first.slice(1);
        const resolved = resolveAliasToSlug(aliasOrSlug);
        if (!resolved) {
          return {
            kind: "incomplete",
            raw,
            reason: `remember: unknown agent "@${aliasOrSlug}" — try ${knownAliasesHint()}`,
          };
        }
        targetSlug = resolved;
        textTokens = rest.slice(1);
      }
      const text = textTokens.join(" ").trim();
      if (text.length < 3) {
        return { kind: "incomplete", raw, reason: "remember: text must be at least 3 chars" };
      }
      return { kind: "remember", text, targetSlug };
    }
    case "compact": {
      const sub = (rest[0] ?? "").toLowerCase();
      if (sub === "status") return { kind: "compactStatus" };
      if (sub === "preview") return { kind: "compactPreview" };
      return {
        kind: "incomplete",
        raw,
        reason: "compact: expected /compact status or /compact preview",
      };
    }
    case "backup": {
      const sub = (rest[0] ?? "").toLowerCase();
      if (sub === "status") return { kind: "backupStatus" };
      return {
        kind: "incomplete",
        raw,
        reason: "backup: only /backup status is exposed (push/run are not allowed from slash)",
      };
    }
    default:
      // Account for the explicit `restJoined` capture so eslint/tsc don't
      // flag the destructured variable as unused on future edits.
      void restJoined;
      return { kind: "unknown", raw };
  }
}

export interface CommandHint {
  trigger: string;
  description: string;
  needsAgent: boolean;
}

export const COMMAND_HINTS: readonly CommandHint[] = [
  {
    trigger: "/agent <slug> <message>",
    description: "Routing hint (not a forced route)",
    needsAgent: false,
  },
  {
    trigger: "/remember [@agent] <text>",
    description: "Promote to core memory (defaults to active agent or Nexus; confirms first)",
    needsAgent: false,
  },
  {
    trigger: "/forget core <text>",
    description: "Surgical delete from core memory (defaults to active agent or Nexus; confirms)",
    needsAgent: false,
  },
  {
    trigger: "/forget episodic <text>",
    description: "Surgical delete from episodic memory (defaults to active agent or Nexus; confirms)",
    needsAgent: false,
  },
  {
    trigger: "/compact status",
    description: "Show compaction status for active agent",
    needsAgent: true,
  },
  {
    trigger: "/compact preview",
    description: "Preview compaction (does NOT apply)",
    needsAgent: true,
  },
  {
    trigger: "/backup status",
    description: "Show backup readiness flags",
    needsAgent: false,
  },
] as const;

export function filterHints(input: string): readonly CommandHint[] {
  if (!input.startsWith("/")) return [];
  const frag = input.slice(1).toLowerCase();
  if (frag.length === 0) return COMMAND_HINTS;
  return COMMAND_HINTS.filter((h) => h.trigger.slice(1).toLowerCase().startsWith(frag));
}

export function rewriteAgentHint(slug: string, message: string): string {
  return `Please route this to ${slug} if appropriate: ${message}`;
}
