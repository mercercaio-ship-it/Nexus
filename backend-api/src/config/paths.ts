import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Path helpers for the backend service.
 *
 * Two roots matter:
 *   - `runtimeRoot`  the user's runtime state directory  (~/.creativedge)
 *   - `projectRoot`  the project tree containing agents/ and orchestrator/
 *
 * Both can be overridden via environment variables for testing without
 * touching the user's real home directory or the source tree.
 */
export const paths = {
  /** ~/.creativedge — user runtime state (memory, sessions, logs, configs). */
  runtimeRoot(homeDir: string): string {
    return process.env.CREATIVEDGE_RUNTIME_DIR ?? join(homeDir, ".creativedge");
  },

  /**
   * Project root containing `orchestrator/registry.json` and `agents/*`.
   *
   * Resolution order:
   *   1. CREATIVEDGE_PROJECT_ROOT env var (explicit override)
   *   2. Walk up from `currentDir` looking for orchestrator/registry.json
   *   3. Fallback: 3 levels up (assumes ./backend-api/{src|dist}/<sub>/)
   */
  projectRoot(currentDir: string): string {
    const env = process.env.CREATIVEDGE_PROJECT_ROOT;
    if (env && env.length > 0) return env;

    let p = currentDir;
    for (let i = 0; i < 12; i++) {
      if (existsSync(join(p, "orchestrator", "registry.json"))) return p;
      const parent = resolve(p, "..");
      if (parent === p) break;
      p = parent;
    }
    return resolve(currentDir, "..", "..", "..");
  },
};
