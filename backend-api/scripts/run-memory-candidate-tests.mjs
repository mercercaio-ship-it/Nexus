#!/usr/bin/env node
/**
 * Phase 5.2 bridge — memory-candidate detector unit tests.
 *
 * Pure-function tests. No live backend required. Imports the compiled
 * `dist/agents/memoryCandidate.js` (i.e. `npm run build` must have run at
 * least once before this script runs). Tests both the detector itself and
 * the sensitive-content / transient-signal rejection paths.
 *
 * Fixture file shape (`backend-api/tests/memory-candidate-fixtures.json`):
 *
 *   [
 *     { "id": "...", "message": "...",
 *       "expected": null | { "type": "directive|identity|preference",
 *                            "pattern": "<short label>" } },
 *     ...
 *   ]
 *
 * What this harness CHECKS:
 *   - Each fixture's `detectMemoryCandidate(message, "test-slug")` matches
 *     `expected` (either both null, or both an object with the same `type`
 *     and `pattern`).
 *   - The returned candidate's `text` is a non-empty string <= 280 chars.
 *   - The returned candidate's `agentSlug` equals the slug passed in.
 *   - For sensitive-content fixtures, the result is null (never an object).
 *
 * What this harness EXPLICITLY DOES NOT CHECK:
 *   - The exact captured `text` value (varies with regex group choices).
 *   - End-to-end SSE round-trip (Phase 5.3 + live backend).
 *   - The promote endpoint (covered by a separate integration script).
 *
 * Privacy:
 *   - The runner prints fixture ids, expected/actual type+pattern, and
 *     pass/fail tags. It does NOT print fixture message content or the
 *     captured candidate text.
 *
 * Usage:
 *   npm run build                          # one-time, ensures dist/ is fresh
 *   node scripts/run-memory-candidate-tests.mjs
 *
 * Exit codes:
 *   0  every fixture passes
 *   1  one or more fixtures fail
 *   2  runner-level error (couldn't read fixture file, couldn't load dist, etc.)
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(HERE, "..", "tests", "memory-candidate-fixtures.json");
const DETECTOR_PATH = join(HERE, "..", "dist", "agents", "memoryCandidate.js");
const TEST_SLUG = "test-slug";

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };
function colorize(s, c) { return (COLOR[c] || "") + s + (COLOR.reset || ""); }

async function main() {
  // ----- load detector -------------------------------------------------
  let detectMemoryCandidate;
  try {
    const mod = await import(pathToFileURL(DETECTOR_PATH).href);
    detectMemoryCandidate = mod.detectMemoryCandidate;
    if (typeof detectMemoryCandidate !== "function") {
      throw new Error("detectMemoryCandidate is not a function in " + DETECTOR_PATH);
    }
  } catch (err) {
    console.error("failed to load detector from", DETECTOR_PATH);
    console.error("hint: run `npm run build` first.");
    console.error("cause:", err?.message || err);
    process.exit(2);
  }

  // ----- load fixtures -------------------------------------------------
  let fixtures;
  try {
    const raw = await readFile(FIXTURE_PATH, "utf-8");
    fixtures = JSON.parse(raw);
  } catch (err) {
    console.error("failed to read fixture file:", err?.message || err);
    process.exit(2);
  }
  if (!Array.isArray(fixtures)) {
    console.error("fixture file must be a JSON array");
    process.exit(2);
  }

  console.log("=".repeat(78));
  console.log("CreativEdge memory-candidate detector unit tests (Phase 5.2 bridge)");
  console.log("=".repeat(78));
  console.log(`fixtures: ${fixtures.length}`);
  console.log("");

  const cols = [
    ["id", 38],
    ["expected", 18],
    ["actual", 18],
    ["result", 8],
  ];
  const headerLine = cols.map(([h, w]) => h.padEnd(w)).join(" ");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const f of fixtures) {
    const id = f.id || "(unnamed)";
    const exp = f.expected;
    const actual = detectMemoryCandidate(f.message, TEST_SLUG);

    // Privacy: never print message content. Only print expected/actual
    // category + pattern labels and the pass/fail tag.
    const expLabel = exp === null ? "null" : `${exp.type}/${exp.pattern}`;
    const actLabel = actual === null ? "null" : `${actual.type}/${actual.pattern}`;

    let ok = false;
    let reason = "";
    if (exp === null) {
      if (actual === null) {
        ok = true;
      } else {
        reason = `expected null, got ${actLabel}`;
      }
    } else {
      if (actual === null) {
        reason = `expected ${expLabel}, got null`;
      } else if (actual.type !== exp.type) {
        reason = `type mismatch: expected ${exp.type}, got ${actual.type}`;
      } else if (actual.pattern !== exp.pattern) {
        reason = `pattern mismatch: expected ${exp.pattern}, got ${actual.pattern}`;
      } else if (typeof actual.text !== "string" || actual.text.length === 0) {
        reason = `text must be a non-empty string`;
      } else if (actual.text.length > 280) {
        reason = `text length ${actual.text.length} exceeds 280 char cap`;
      } else if (actual.agentSlug !== TEST_SLUG) {
        reason = `agentSlug mismatch: expected "${TEST_SLUG}", got "${actual.agentSlug}"`;
      } else {
        ok = true;
      }
    }

    const tag = ok ? colorize("PASS", "green") : colorize("FAIL", "red");
    const row = [
      id.slice(0, 38).padEnd(38),
      expLabel.slice(0, 18).padEnd(18),
      actLabel.slice(0, 18).padEnd(18),
      tag,
    ].join(" ");
    console.log(row);
    if (!ok) {
      console.log(colorize(`    reason: ${reason}`, "red"));
      failures.push({ id, reason });
      fail++;
    } else {
      pass++;
    }
  }

  console.log("-".repeat(headerLine.length));
  console.log(
    `total: ${fixtures.length}   ` +
      `${colorize("PASS " + pass, pass > 0 ? "green" : "dim")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );

  if (failures.length > 0) {
    console.log(colorize("\nfailing fixture ids:", "red"));
    for (const f of failures) console.log(colorize(`  - ${f.id}  (${f.reason})`, "red"));
  }

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
