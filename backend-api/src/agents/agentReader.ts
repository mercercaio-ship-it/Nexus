import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

import { loadOverrides, type AgentOverrides } from "./overrides.js";
import type { RegistryEntry } from "./registry.js";

export interface AgentSnapshot {
  slug: string;
  config: unknown | null;
  identity: string | null;
  soul: string | null;
  personality: string | null;
  systemPrompt: string | null;
  memory: { core: string; episodic: string };
  overrides: AgentOverrides;
  paths: {
    templateDir: string;
    runtimeMemoryDir: string;
    overridesPath: string;
  };
}

async function readIfExists(p: string): Promise<string | null> {
  try {
    await access(p);
    return await readFile(p, "utf-8");
  } catch {
    return null;
  }
}

async function readJsonIfExists(p: string): Promise<unknown | null> {
  const raw = await readIfExists(p);
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/**
 * Resolve the project-tree directory that holds an agent's template files.
 *
 * Phase 2.5 fix: registry entries carry a `path` field
 *   - specialists: "agents/<slug>/"   (e.g. "agents/graphics-design/")
 *   - orchestrator: "orchestrator/"   (Nexus is NOT under agents/)
 *
 * Earlier code hard-coded `agents/<slug>/`, which silently produced
 * `systemPrompt: null` for Nexus and let the model improvise. Now we
 * honor the registry's path verbatim, with a graceful fallback for
 * the (impossible) case where it's missing.
 */
function resolveTemplateDir(
  projectRoot: string, slug: string, entry: RegistryEntry | undefined
): string {
  const rel = (entry?.path && entry.path.length > 0)
    ? entry.path
    : `agents/${slug}/`;
  return join(projectRoot, rel);
}

/**
 * Reads project templates + runtime memory + per-agent overrides into a
 * single snapshot. The project tree is treated as read-only here.
 *
 * `entry` is the registry entry for this slug; when supplied we use its
 * `path` to resolve the template directory. When omitted (legacy callers)
 * we fall back to the old `agents/<slug>/` convention.
 */
export async function readAgentSnapshot(
  projectRoot: string,
  runtimeAgentsDir: string,
  slug: string,
  entry?: RegistryEntry
): Promise<AgentSnapshot> {
  const templateDir = resolveTemplateDir(projectRoot, slug, entry);
  const runtimeDir = join(runtimeAgentsDir, slug);
  const runtimeMemoryDir = join(runtimeDir, "memory");

  const [config, identity, soul, personality, systemPrompt, core, episodic, overrides] = await Promise.all([
    readJsonIfExists(join(templateDir, "config.json")),
    readIfExists(join(templateDir, "identity.md")),
    readIfExists(join(templateDir, "soul.md")),
    readIfExists(join(templateDir, "personality.md")),
    readIfExists(join(templateDir, "system_prompt.md")),
    readIfExists(join(runtimeMemoryDir, "core_memory.md")),
    readIfExists(join(runtimeMemoryDir, "episodic_memory.md")),
    loadOverrides(runtimeAgentsDir, slug),
  ]);

  return {
    slug,
    config,
    identity,
    soul,
    personality,
    systemPrompt,
    memory: { core: core ?? "", episodic: episodic ?? "" },
    overrides,
    paths: {
      templateDir,
      runtimeMemoryDir,
      overridesPath: join(runtimeDir, "overrides.json"),
    },
  };
}
