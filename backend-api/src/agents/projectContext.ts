import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Load the CreativEdge project-context preamble.
 *
 * The preamble is a single markdown file at
 *   `<projectRoot>/orchestrator/creativedge_context.md`
 * that every chat turn injects in front of the specialist's own system
 * prompt. It carries factual project knowledge (what CreativEdge is, the
 * canonical roster, what NOT to leak from Claude Code's runtime). It does
 * NOT carry persona instructions - personas stay per-agent.
 *
 * Phase 2.5 lands this file; phases below it can override per-agent voice
 * without touching the shared preamble.
 *
 * Missing file is treated as empty - chat continues to work the same way
 * as Phase 2.4 if someone strips the doc out.
 */
export async function loadProjectContext(projectRoot: string): Promise<string> {
  const p = join(projectRoot, "orchestrator", "creativedge_context.md");
  try {
    return await readFile(p, "utf-8");
  } catch {
    return "";
  }
}
