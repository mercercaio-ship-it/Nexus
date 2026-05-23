#!/usr/bin/env node
/**
 * CreativEdge Phase 9-A — `npm run setup` next-steps printer.
 *
 * Runs at the end of `npm run setup` (after `setup:backend` and
 * `setup:frontend` have installed deps). Prints the canonical sequence
 * to bring the app up on a clean machine, including the first-run
 * bootstrap that the backend handles idempotently via
 * `ensureRuntimeDir()` (Phase 2.1; Windows-validated).
 *
 * What this script DOES:
 *   - Prints next-step launch instructions.
 *   - Optionally prints a Node version sanity hint if the running
 *     interpreter is below the backend's declared engine (>=20.11.0).
 *
 * What this script INTENTIONALLY DOES NOT DO:
 *   - Does NOT touch ~/.creativedge/ — that's the backend's idempotent
 *     job on first `npm run dev:backend`.
 *   - Does NOT write any `.env` file.
 *   - Does NOT prompt for / store any API key.
 *   - Does NOT call any provider, network endpoint, or external API.
 *   - Does NOT rebuild native modules; `better-sqlite3` rebuilds happen
 *     during `npm install` on the host platform.
 *
 * Privacy: prints no paths beyond what the README already documents.
 * No env vars consumed. No secrets emitted.
 */

const required = "20.11.0";
const actual = process.versions.node;

function lt(a, b) {
  // Tiny semver-ish comparator for "MAJOR.MINOR.PATCH" only. Returns
  // true if `a` is strictly less than `b`. We don't import semver to
  // keep this script dependency-free.
  const pa = a.split(".").map((n) => Number(n) || 0);
  const pb = b.split(".").map((n) => Number(n) || 0);
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return true;
    if (pa[i] > pb[i]) return false;
  }
  return false;
}

const lines = [
  "",
  "CreativEdge setup complete.",
  "",
];

if (lt(actual, required)) {
  lines.push(
    `Heads-up: detected Node ${actual}. The backend declares engines.node >=${required}.`,
    `Some Phase 2-5 features may behave unexpectedly on older Node. Consider upgrading.`,
    ""
  );
}

lines.push(
  "Next steps:",
  "",
  "  Terminal A   npm run dev:backend",
  "  Terminal B   npm run dev:frontend",
  "",
  "Then open  http://127.0.0.1:5173  in a browser.",
  "",
  "On first backend start, ~/.creativedge/ is scaffolded idempotently",
  "(profile.json, providers.json, sessions.db, logs/, agents/<slug>/memory/).",
  "Your existing data is never overwritten.",
  "",
  "Optional probes:",
  "  curl http://127.0.0.1:3001/healthz       (backend liveness)",
  "  npm run typecheck                        (TypeScript across both packages)",
  "  npm run build                            (compile both packages)",
  "",
);

for (const l of lines) {
  console.log(l);
}
