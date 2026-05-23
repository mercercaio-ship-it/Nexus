#!/usr/bin/env node
/**
 * Phase 8.1 routing test fixture runner.
 *
 * Posts each fixture in `tests/routing-fixtures.json` to the live local
 * backend (`POST /chat`) and verifies that the routing decision (and, for
 * handoff fixtures, the `done.handoff` payload) matches the fixture's
 * expectation.
 *
 * The runner is intentionally dependency-light: it uses Node 20+ built-in
 * `fetch` and a small SSE block parser. No `.env`, no API keys, no external
 * HTTP client, no Anthropic API. The local backend handles all provider
 * calls internally.
 *
 * Usage:
 *   node scripts/run-routing-fixtures.mjs
 *
 * Env vars:
 *   CREATIVEDGE_API_URL          base URL of the backend (default http://127.0.0.1:3001)
 *   CREATIVEDGE_TURN_TIMEOUT_MS  per-fixture timeout (default 180000)
 *   CREATIVEDGE_ONLY=id1,id2     run only these fixture ids
 *   CREATIVEDGE_VERBOSE=1        print per-event SSE debug info
 *
 * Exit codes:
 *   0  every fixture PASS (SKIP counts as PASS for handoff in degraded mode)
 *   1  one or more fixtures FAIL
 *   2  runner-level error (couldn't read fixture file, couldn't reach backend, etc.)
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(HERE, "..", "tests", "routing-fixtures.json");
const BASE_URL =
  (process.env.CREATIVEDGE_API_URL || "http://127.0.0.1:3001").replace(
    /\/+$/,
    ""
  );
const TURN_TIMEOUT_MS = Number(
  process.env.CREATIVEDGE_TURN_TIMEOUT_MS || 180_000
);
const ONLY = (process.env.CREATIVEDGE_ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const VERBOSE = process.env.CREATIVEDGE_VERBOSE === "1";

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };

function colorize(s, c) {
  return (COLOR[c] || "") + s + (COLOR.reset || "");
}

// ---------------------------------------------------------------------------
// SSE parser
// ---------------------------------------------------------------------------

function parseSseBlock(block) {
  // A block is one event terminated by a blank line. Lines starting with
  // "event:" set the event name, lines starting with "data:" append to data
  // (we only use the last data line because chat.ts sends single-line JSON).
  let event = null;
  let data = "";
  for (const rawLine of block.split("\n")) {
    if (!rawLine) continue;
    if (rawLine.startsWith(":")) continue; // comment
    const colon = rawLine.indexOf(":");
    const field = colon < 0 ? rawLine : rawLine.slice(0, colon);
    const value =
      colon < 0
        ? ""
        : rawLine[colon + 1] === " "
          ? rawLine.slice(colon + 2)
          : rawLine.slice(colon + 1);
    if (field === "event") event = value;
    else if (field === "data") data = data ? data + "\n" + value : value;
  }
  if (!event) return null;
  let parsed = data;
  if (data) {
    try {
      parsed = JSON.parse(data);
    } catch {
      // leave as string
    }
  }
  return { event, data: parsed };
}

/**
 * POST /chat with the given message, parse SSE, return the collected events
 * (or throw on transport-level error / timeout).
 */
async function runOneFixture(message) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new Error("turn timeout")), TURN_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(BASE_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ message }),
      signal: ctrl.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    throw new Error("fetch failed: " + (err?.message || String(err)));
  }
  if (!res.ok || !res.body) {
    clearTimeout(timer);
    throw new Error("HTTP " + res.status + " " + res.statusText);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  const events = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const block = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (!block) continue;
        const evt = parseSseBlock(block);
        if (evt) {
          events.push(evt);
          if (VERBOSE) {
            const previewSrc = typeof evt.data === "string" ? evt.data : JSON.stringify(evt.data);
            const preview = previewSrc.slice(0, 120);
            console.error(colorize(`  [sse] ${evt.event}: ${preview}`, "dim"));
          }
          if (evt.event === "done") {
            // Drain stream so the server can close cleanly.
            buf = "";
          }
        }
      }
    }
  } finally {
    clearTimeout(timer);
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }
  return events;
}

// ---------------------------------------------------------------------------
// Expectation matching
// ---------------------------------------------------------------------------

function extract(events) {
  const meta = events.find((e) => e.event === "meta")?.data;
  const done = events.find((e) => e.event === "done")?.data;
  const errorEvt = events.find((e) => e.event === "error")?.data;
  return { meta, done, errorEvt };
}

function setEqualUnordered(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  for (const x of b) if (!aSet.has(x)) return false;
  return true;
}

/**
 * Compare meta/done against fixture.expected. Returns
 *   { pass: boolean, skip: boolean, reason: string, observed: object }
 */
function evaluate(fixture, meta, done, errorEvt) {
  const exp = fixture.expected || {};
  const observed = {
    type: meta?.routeDecision?.type ?? null,
    agentSlug: meta?.agentSlug ?? null,
    source: meta?.routeDecision?.source ?? null,
    convenedSlugs: meta?.routeDecision?.convenedSlugs ?? null,
    handoff: done?.handoff ?? null,
    synthesisOk: done?.synthesisOk ?? null,
    degraded: meta?.degraded ?? null,
    provider: meta?.provider ?? null,
    error: errorEvt?.text ?? null,
  };

  if (!meta) {
    return { pass: false, skip: false, reason: "no meta event received", observed };
  }
  if (!done && exp.type !== "handoff") {
    // For non-handoff fixtures, a missing done event is a failure.
    return { pass: false, skip: false, reason: "no done event received", observed };
  }

  switch (exp.type) {
    case "specialist": {
      if (observed.type !== "specialist") {
        return {
          pass: false,
          skip: false,
          reason: `expected routeDecision.type "specialist", got "${observed.type}"`,
          observed,
        };
      }
      const acceptable =
        Array.isArray(exp.acceptableSlugs) && exp.acceptableSlugs.length > 0
          ? exp.acceptableSlugs
          : [exp.agentSlug];
      if (!acceptable.includes(observed.agentSlug)) {
        return {
          pass: false,
          skip: false,
          reason: `expected agentSlug in [${acceptable.join(", ")}], got "${observed.agentSlug}"`,
          observed,
        };
      }
      return { pass: true, skip: false, reason: "ok", observed };
    }

    case "convene": {
      if (observed.type !== "convene") {
        return {
          pass: false,
          skip: false,
          reason: `expected routeDecision.type "convene", got "${observed.type}"`,
          observed,
        };
      }
      if (!setEqualUnordered(observed.convenedSlugs, exp.convenedSlugs)) {
        return {
          pass: false,
          skip: false,
          reason: `expected convenedSlugs ${JSON.stringify(exp.convenedSlugs)}, got ${JSON.stringify(observed.convenedSlugs)}`,
          observed,
        };
      }
      return { pass: true, skip: false, reason: "ok", observed };
    }

    case "handoff": {
      // Handoff requires the originating specialist to actually emit a
      // CREATIVEDGE_HANDOFF block - which only real Claude can do, and
      // even then the model decides per-turn. The fixture is therefore
      // split into a DETERMINISTIC half (initial route must match) and
      // an OPTIONAL half (if done.handoff fires, validate it strictly).
      //
      // Modes:
      //   - default (handoffOptional !== false): missing done.handoff is
      //     a WARN, not a FAIL, as long as the initial route is correct.
      //     If `done.handoff` is present, it is still validated strictly.
      //   - strict: setting CREATIVEDGE_STRICT_HANDOFF=1 (or whichever env
      //     name the fixture declares via `strictHandoffEnv`) demotes the
      //     warning back to a hard FAIL so a follow-up run can confirm
      //     real handoff emission deterministically.
      //   - degraded backend: still SKIP, because the mock provider cannot
      //     produce a CREATIVEDGE_HANDOFF block at all.
      if (observed.degraded === true || observed.provider === "mock") {
        return {
          pass: true,
          skip: true,
          reason: "backend degraded to mock; handoff cannot be exercised",
          observed,
        };
      }
      if (observed.agentSlug !== exp.initialAgentSlug) {
        return {
          pass: false,
          skip: false,
          reason: `expected initial agentSlug "${exp.initialAgentSlug}", got "${observed.agentSlug}"`,
          observed,
        };
      }

      const strictEnvName =
        typeof exp.strictHandoffEnv === "string" && exp.strictHandoffEnv.length > 0
          ? exp.strictHandoffEnv
          : "CREATIVEDGE_STRICT_HANDOFF";
      const strictMode = process.env[strictEnvName] === "1";
      const optional = exp.handoffOptional !== false; // default: optional

      const h = observed.handoff;
      if (!h || typeof h !== "object") {
        if (optional && !strictMode) {
          return {
            pass: true,
            skip: false,
            warn: true,
            reason: `initial route matched ${exp.initialAgentSlug} but no done.handoff field was emitted by the model (set ${strictEnvName}=1 to make this a hard failure)`,
            observed,
          };
        }
        return {
          pass: false,
          skip: false,
          reason: strictMode
            ? `no done.handoff field on this turn (strict mode via ${strictEnvName}=1)`
            : "no done.handoff field on this turn",
          observed,
        };
      }
      if (h.toSlug !== exp.handoffToSlug) {
        return {
          pass: false,
          skip: false,
          reason: `expected done.handoff.toSlug "${exp.handoffToSlug}", got "${h.toSlug}"`,
          observed,
        };
      }
      if (h.status !== "completed") {
        return {
          pass: false,
          skip: false,
          reason: `expected done.handoff.status "completed", got "${h.status}"`,
          observed,
        };
      }
      return { pass: true, skip: false, reason: "ok", observed };
    }

    case "nexus": {
      const acceptable = Array.isArray(exp.acceptableTypes) && exp.acceptableTypes.length > 0
        ? exp.acceptableTypes
        : ["nexus_fallback", "out_of_domain", "clarify"];
      if (!acceptable.includes(observed.type)) {
        return {
          pass: false,
          skip: false,
          reason: `expected nexus-class type in [${acceptable.join(", ")}], got "${observed.type}"`,
          observed,
        };
      }
      return { pass: true, skip: false, reason: "ok", observed };
    }

    default:
      return {
        pass: false,
        skip: false,
        reason: `unknown expected.type "${exp.type}"`,
        observed,
      };
  }
}

// ---------------------------------------------------------------------------
// Coverage assertions
// ---------------------------------------------------------------------------

const ALL_SPECIALISTS = [
  "graphics-design", "programming-tech", "digital-marketing", "video-animation",
  "writing-translation", "music-audio", "business", "finance", "ai-services",
  "personal-growth", "consulting", "data", "photography",
];

function checkCoverage(fixtures) {
  const issues = [];
  if (fixtures.length < 30) {
    issues.push(`fixture count is ${fixtures.length}, expected at least 30`);
  }
  // Per-specialist count includes any fixture that names that specialist
  // either as agentSlug, in acceptableSlugs, in convenedSlugs, or as
  // initialAgentSlug / handoffToSlug.
  const slugMentions = Object.fromEntries(ALL_SPECIALISTS.map((s) => [s, 0]));
  let convene = 0;
  let overlap = 0;
  let nexus = 0;
  let handoff = 0;
  for (const f of fixtures) {
    if (f.category === "convene") convene++;
    if (f.category === "overlap") overlap++;
    if (f.category === "nexus") nexus++;
    if (f.category === "handoff") handoff++;
    const mention = new Set();
    if (f.expected?.agentSlug) mention.add(f.expected.agentSlug);
    for (const s of f.expected?.acceptableSlugs ?? []) mention.add(s);
    for (const s of f.expected?.convenedSlugs ?? []) mention.add(s);
    if (f.expected?.initialAgentSlug) mention.add(f.expected.initialAgentSlug);
    if (f.expected?.handoffToSlug) mention.add(f.expected.handoffToSlug);
    for (const s of mention) if (s in slugMentions) slugMentions[s]++;
  }
  for (const [slug, n] of Object.entries(slugMentions)) {
    if (n < 2) issues.push(`specialist ${slug} has only ${n} fixture(s) (need >= 2)`);
  }
  if (overlap < 5) issues.push(`overlap-rule fixtures: ${overlap} (need >= 5)`);
  if (convene < 3) issues.push(`convening fixtures: ${convene} (need >= 3)`);
  if (nexus < 3) issues.push(`nexus / out-of-domain fixtures: ${nexus} (need >= 3)`);
  if (handoff < 1) issues.push(`handoff fixtures: ${handoff} (need >= 1)`);
  return {
    issues,
    summary: { total: fixtures.length, slugMentions, convene, overlap, nexus, handoff },
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
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

  const cov = checkCoverage(fixtures);
  console.log("=".repeat(78));
  console.log("CreativEdge routing fixture runner");
  console.log("=".repeat(78));
  console.log(`backend:    ${BASE_URL}`);
  console.log(`fixtures:   ${cov.summary.total}`);
  console.log(`per-class:  convene=${cov.summary.convene} overlap=${cov.summary.overlap} nexus=${cov.summary.nexus} handoff=${cov.summary.handoff}`);
  console.log("per-specialist mention counts:");
  for (const [slug, n] of Object.entries(cov.summary.slugMentions)) {
    console.log(`  ${slug.padEnd(22)} ${n}`);
  }
  if (cov.issues.length > 0) {
    console.log(colorize("coverage issues:", "yellow"));
    for (const i of cov.issues) console.log(colorize("  - " + i, "yellow"));
  } else {
    console.log(colorize("coverage: ok", "green"));
  }
  console.log("");

  // Quick liveness probe.
  try {
    const r = await fetch(BASE_URL + "/healthz");
    if (!r.ok) throw new Error("HTTP " + r.status);
  } catch (err) {
    console.error(colorize(`cannot reach backend at ${BASE_URL}/healthz: ${err?.message || err}`, "red"));
    console.error("start the backend first:");
    console.error("  cd backend-api && npm run dev");
    process.exit(2);
  }

  const toRun = ONLY.length > 0
    ? fixtures.filter((f) => ONLY.includes(f.id))
    : fixtures;

  // Print header.
  const cols = [
    ["id", 36],
    ["expected", 14],
    ["actual", 14],
    ["expSlug(s)", 32],
    ["actSlug", 22],
    ["result", 8],
  ];
  const headerLine = cols.map(([h, w]) => h.padEnd(w)).join(" ");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  let pass = 0;
  let fail = 0;
  let skip = 0;
  let warn = 0;
  const failures = [];
  const warnings = [];

  for (const f of toRun) {
    let result;
    try {
      const events = await runOneFixture(f.message);
      const { meta, done, errorEvt } = extract(events);
      result = evaluate(f, meta, done, errorEvt);
    } catch (err) {
      result = {
        pass: false,
        skip: false,
        reason: "runner error: " + (err?.message || String(err)),
        observed: {},
      };
    }
    const exp = f.expected || {};
    const expSlug =
      exp.type === "convene"
        ? (exp.convenedSlugs || []).join(",")
        : exp.type === "handoff"
          ? `${exp.initialAgentSlug}->${exp.handoffToSlug}`
          : exp.agentSlug ||
            (exp.acceptableSlugs || []).join("|") ||
            (exp.acceptableTypes || []).join("|") ||
            "-";
    const actSlug =
      exp.type === "convene"
        ? (result.observed.convenedSlugs || []).join(",")
        : exp.type === "handoff"
          ? `${result.observed.agentSlug || "-"}->${result.observed.handoff?.toSlug || "-"}`
          : result.observed.agentSlug || "-";
    const tag = result.skip
      ? colorize("SKIP", "yellow")
      : result.warn
        ? colorize("WARN", "yellow")
        : result.pass
          ? colorize("PASS", "green")
          : colorize("FAIL", "red");
    const row = [
      [f.id, 36],
      [(exp.type || "-").padEnd(14), 14],
      [(result.observed.type || "-").padEnd(14), 14],
      [expSlug.slice(0, 32).padEnd(32), 32],
      [actSlug.slice(0, 22).padEnd(22), 22],
      [tag, 8],
    ]
      .map(([v]) => v)
      .join(" ");
    console.log(row);
    if (!result.pass) {
      console.log(colorize(`    reason: ${result.reason}`, "red"));
      failures.push({ id: f.id, reason: result.reason });
      fail++;
    } else if (result.warn) {
      console.log(colorize(`    warning: ${result.reason}`, "yellow"));
      warnings.push({ id: f.id, reason: result.reason });
      warn++;
      pass++; // WARN counts as pass for exit code
    } else if (result.skip) {
      console.log(colorize(`    note: ${result.reason}`, "yellow"));
      skip++;
      pass++; // skip counts as pass for exit code
    } else {
      pass++;
    }
  }

  console.log("-".repeat(headerLine.length));
  const hardPass = pass - skip - warn;
  console.log(
    `total: ${toRun.length}   ` +
      `${colorize("PASS " + hardPass, "green")}   ` +
      `${colorize("WARN " + warn, warn > 0 ? "yellow" : "dim")}   ` +
      `${colorize("SKIP " + skip, "yellow")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );

  if (warnings.length > 0) {
    console.log(colorize("\nwarnings (counted as PASS for exit code):", "yellow"));
    for (const w of warnings) console.log(colorize(`  - ${w.id}  (${w.reason})`, "yellow"));
  }

  if (failures.length > 0) {
    console.log(colorize("\nfailing fixture ids:", "red"));
    for (const f of failures) console.log(colorize(`  - ${f.id}  (${f.reason})`, "red"));
  }

  if (cov.issues.length > 0) {
    console.log(colorize("\nNOTE: coverage issues reported above; runner still exits based on per-fixture results.", "yellow"));
  }

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
