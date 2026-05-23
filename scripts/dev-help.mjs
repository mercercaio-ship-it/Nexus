#!/usr/bin/env node
/**
 * CreativEdge Phase 9-A — `npm run dev` help printer.
 *
 * The repo is intentionally a two-package layout (backend-api + frontend)
 * with no root-level dev orchestrator. Phase 9-A keeps it that way and
 * defers a single-command desktop launch to Phase 9-B (Electron wrapper).
 *
 * Reasons for not auto-spawning both servers from one root script today:
 *   - On Windows, `npm.cmd` vs `npm` quirks make child_process spawning
 *     fragile under tsx watch + Vite HMR.
 *   - Log interleaving from both servers obscures errors; two terminals
 *     surface backend errors and frontend HMR notices independently.
 *   - Signal forwarding (Ctrl-C) to nested npm → tsx / vite processes
 *     is brittle and has differed across npm 8/9/10 minor versions.
 *   - The Phase 9-B Electron wrapper will own desktop process lifecycle
 *     properly (spawn backend as a child, ship the frontend bundle as
 *     static files inside the packaged binary, wire crash logs in).
 *
 * This script just prints the canonical two-terminal launch sequence so
 * `npm run dev` does not silently no-op. It exits 0; it does not start
 * anything.
 *
 * Privacy: prints no paths beyond the repo-relative subfolders shown in
 * the project README. No env vars. No secrets.
 */

const lines = [
  "",
  "CreativEdge — two-terminal dev launch (Phase 9-A baseline):",
  "",
  "  Terminal A   cd backend-api && npm run dev",
  "  Terminal B   cd frontend && npm run dev",
  "",
  "Or, from the repo root:",
  "  Terminal A   npm run dev:backend",
  "  Terminal B   npm run dev:frontend",
  "",
  "Backend listens on http://127.0.0.1:3001 (override with CREATIVEDGE_PORT).",
  "Frontend dev server starts on http://127.0.0.1:5173 with a Vite proxy",
  "to the backend so the browser only ever sees same-origin traffic.",
  "",
  "First run on a clean machine? Use `npm run setup` once to install",
  "backend-api/ + frontend/ deps. The backend's `ensureRuntimeDir` will",
  "idempotently create ~/.creativedge/ on first `npm run dev:backend`.",
  "",
  "A single-command desktop launch is the Phase 9-B Electron wrapper",
  "scope (see todo.md Phase 9 active block).",
  "",
];

for (const l of lines) {
  console.log(l);
}
