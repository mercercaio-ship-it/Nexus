#!/usr/bin/env node
/**
 * CreativEdge Phase 9-B — pre-flight build orchestrator.
 *
 * Runs before `electron .` (dev) and before `electron-builder --win`
 * (build). Builds the existing backend + frontend bundles so that
 * `electron/main.mjs` has fresh `backend-api/dist/index.js` to spawn and
 * fresh `frontend/dist/` to serve over the localhost static HTTP server.
 *
 * The frontend build pins `VITE_API_URL=http://127.0.0.1:3001` so the
 * bundle's `frontend/src/api/client.ts:39` (which reads
 * `import.meta.env.VITE_API_URL`) emits absolute backend URLs in the
 * built JS. In Vite dev mode the proxy handles same-origin; in the
 * Electron-served bundle there is no Vite proxy, so the absolute URL
 * is required.
 *
 * What this script does:
 *   1. Builds backend-api (`npm --prefix ../backend-api run build`).
 *   2. Builds frontend (`npm --prefix ../frontend run build`) with
 *      `VITE_API_URL=http://127.0.0.1:3001` injected into the
 *      child-process env.
 *
 * What this script does NOT do:
 *   - Does NOT touch `~/.creativedge/` (backend's idempotent
 *     `ensureRuntimeDir` does that on first start).
 *   - Does NOT write any `.env` file.
 *   - Does NOT rebuild `better-sqlite3` against Electron's ABI; that's
 *     the separate `npm run rebuild:sqlite` step documented in
 *     `electron/NOTES.md` and only needed for the packaged binary.
 *   - Does NOT prompt for / store any API key.
 *   - Does NOT call any provider or external endpoint.
 *
 * Privacy: prints only npm script output (which is already
 * non-content). No env vars beyond `VITE_API_URL` are forwarded
 * explicitly; the rest of the inherited env is passed through to
 * npm verbatim.
 *
 * Exit codes:
 *   0  both builds succeeded
 *   1  at least one build failed
 */

import { spawnSync } from "node:child_process";

const BACKEND_PORT_FOR_BUNDLE = 3001;
const VITE_API_URL = `http://127.0.0.1:${BACKEND_PORT_FOR_BUNDLE}`;

function run(step, args, extraEnv = {}) {
  console.log(`\n[build-deps] ${step}: npm ${args.join(" ")}`);
  // Use shell:true so `npm` resolves to `npm.cmd` on Windows. The
  // process.platform check would also work but shell:true keeps this
  // tiny script cross-platform without conditional branches.
  const r = spawnSync("npm", args, {
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) {
    console.error(`[build-deps] ${step} FAILED with exit ${r.status}`);
    process.exit(1);
  }
}

run("backend build", ["--prefix", "../backend-api", "run", "build"]);
run("frontend build (VITE_API_URL pinned)", ["--prefix", "../frontend", "run", "build"], {
  VITE_API_URL,
});

console.log(
  `\n[build-deps] done. Backend dist + frontend dist are fresh. VITE_API_URL was set to ${VITE_API_URL} for the frontend bundle.`
);
