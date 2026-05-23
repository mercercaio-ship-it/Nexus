import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

import { paths } from "../config/paths.js";

export interface RuntimeContext {
  homeDir: string;
  rootDir: string;          // ~/.creativedge
  agentsDir: string;        // ~/.creativedge/agents
  logsDir: string;          // ~/.creativedge/logs
  profilePath: string;      // ~/.creativedge/profile.json
  providersPath: string;    // ~/.creativedge/providers.json
  dbPath: string;           // ~/.creativedge/sessions.db
  projectRoot: string;
  seededAgentSlugs: string[];
}

interface SeedEntry { slug: string; templateMemoryDir: string; }

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}
async function ensureDir(p: string): Promise<void> { await mkdir(p, { recursive: true }); }
async function writeJsonIfMissing(path: string, obj: unknown): Promise<boolean> {
  if (await exists(path)) return false;
  await writeFile(path, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  return true;
}
async function copyIfMissing(src: string, dest: string): Promise<boolean> {
  if (await exists(dest)) return false;
  if (!(await exists(src))) return false;
  await ensureDir(dirname(dest));
  await copyFile(src, dest);
  return true;
}

/**
 * Resolve the seedable entries from registry.json.
 *
 * Phase 2.5: we now also seed `nexus` so /chat fallback turns can read
 * `~/.creativedge/agents/nexus/memory/`. Each entry's templateMemoryDir
 * comes from its registry `path` field (specialists -> `agents/<slug>/memory`,
 * Nexus -> `orchestrator/memory`).
 */
async function loadSeedEntries(projectRoot: string): Promise<SeedEntry[]> {
  const registryPath = join(projectRoot, "orchestrator", "registry.json");
  if (!(await exists(registryPath))) return [];
  try {
    const raw = await readFile(registryPath, "utf-8");
    const reg = JSON.parse(raw) as {
      entries?: Array<{ slug?: string; role?: string; path?: string }>;
    };
    const out: SeedEntry[] = [];
    for (const e of reg.entries ?? []) {
      if (!e.slug || (e.role !== "specialist" && e.role !== "orchestrator")) continue;
      const rel = (e.path && e.path.length > 0) ? e.path : `agents/${e.slug}/`;
      out.push({ slug: e.slug, templateMemoryDir: join(projectRoot, rel, "memory") });
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Idempotently create the user runtime directory tree under ~/.creativedge.
 *
 * NEVER overwrites existing user data. If a file or memory note already
 * exists, it is left alone.
 *
 * For each entry registered in `orchestrator/registry.json` (specialists
 * AND the orchestrator since Phase 2.5):
 *   - Ensures `~/.creativedge/agents/<slug>/memory/` exists.
 *   - If `core_memory.md` / `episodic_memory.md` are missing in the user
 *     runtime, copies them from the project template (resolved via the
 *     entry's registry `path`). Falls back to a minimal placeholder if
 *     the template is also missing, so reads never crash.
 */
export async function ensureRuntimeDir(): Promise<RuntimeContext> {
  const homeDir = os.homedir();
  const rootDir = paths.runtimeRoot(homeDir);
  const agentsDir = join(rootDir, "agents");
  const logsDir = join(rootDir, "logs");
  const profilePath = join(rootDir, "profile.json");
  const providersPath = join(rootDir, "providers.json");
  const dbPath = join(rootDir, "sessions.db");

  const here = dirname(fileURLToPath(import.meta.url));
  const projectRoot = paths.projectRoot(here);

  await ensureDir(rootDir);
  await ensureDir(agentsDir);
  await ensureDir(logsDir);

  await writeJsonIfMissing(profilePath, {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    singleUser: true,
  });

  await writeJsonIfMissing(providersPath, {
    schemaVersion: 1,
    primary: "claude",
    providers: {
      claude: {
        enabled: true,
        authMode: "claude-code-runtime",
        firstChunkTimeoutMs: 60000,
        turnTimeoutMs: 120000,
        maxContextChars: 120000,
        reservedResponseChars: 12000,
        recentMessageLimit: 20,
        conveningSynthesisTimeoutMs: 150000,
        recentEpisodicLimit: 10,
      },
      openai: { enabled: false },
      ollama: { enabled: false, baseUrl: "http://localhost:11434" },
      mock:   { enabled: true },
    },
  });

  const seeds = await loadSeedEntries(projectRoot);
  const seeded: string[] = [];
  for (const seed of seeds) {
    const userMemDir = join(agentsDir, seed.slug, "memory");
    await ensureDir(userMemDir);

    for (const fileName of ["core_memory.md", "episodic_memory.md"] as const) {
      const src  = join(seed.templateMemoryDir, fileName);
      const dest = join(userMemDir, fileName);

      const copied = await copyIfMissing(src, dest);
      if (!copied && !(await exists(dest))) {
        const placeholder =
          fileName === "core_memory.md"
            ? `# Core memory - ${seed.slug}\n\n> Durable facts. None yet.\n`
            : `# Episodic memory - ${seed.slug}\n\n> Per-session notes go on top.\n`;
        await writeFile(dest, placeholder, "utf-8");
      }
    }
    seeded.push(seed.slug);
  }

  return {
    homeDir,
    rootDir,
    agentsDir,
    logsDir,
    profilePath,
    providersPath,
    dbPath,
    projectRoot,
    seededAgentSlugs: seeded,
  };
}
