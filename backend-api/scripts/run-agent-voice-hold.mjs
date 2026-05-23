#!/usr/bin/env node
/**
 * Phase 4.4-A 10-turn voice-hold harness.
 *
 * Each fixture in `tests/agent-voice-hold-fixtures.json` describes one
 * agent and a 10-turn user-side conversation. The runner walks the turns
 * sequentially, reusing the sessionId returned on the first turn so the
 * backend keeps proper session continuity, and validates the SAME stable
 * fingerprint as the §4.3-A/B agent behavior runner on every turn:
 *
 *   - meta.agentSlug === expected.agentSlug
 *   - meta.agentName === expected.agentName
 *   - meta.provider === "claude"
 *   - meta.degraded === false
 *   - streamed text contains every `requiredHeaderIncludes` substring
 *   - streamed text contains NONE of `forbiddenIncludes` substrings
 *
 * It deliberately does NOT make subjective LLM-quality assertions. The
 * goal of this slice is structural voice-hold (the agent stays in lane
 * across 10 turns with stable header + provider + no leakage) - not a
 * voice rubric.
 *
 * SAFETY: 14 fixtures x 10 turns = 140 live Claude calls. Default mode
 * REFUSES to run the full suite. The user must opt in by setting
 * exactly one of:
 *
 *   CREATIVEDGE_AGENT=<slug>     run only that agent's 10-turn fixture
 *   CREATIVEDGE_ONLY=<id,...>    run only the listed fixtures (10 turns each)
 *   CREATIVEDGE_FULL_VOICE=1     run all 14 fixtures (140 turns)
 *
 * Additional knobs:
 *
 *   CREATIVEDGE_API_URL          base URL (default http://127.0.0.1:3001)
 *   CREATIVEDGE_TURN_TIMEOUT_MS  per-turn timeout (default 180000)
 *   CREATIVEDGE_VOICE_TURNS=<n>  cap each fixture to its first n turns
 *                                (useful for tiny smoke runs - e.g. 2 or 3)
 *   CREATIVEDGE_VERBOSE=1        print per-event SSE debug info
 *
 * Exit codes:
 *   0  all selected turns passed
 *   1  one or more turns failed
 *   2  runner-level error (couldn't read fixtures, couldn't reach backend,
 *      or default mode without a filter)
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(HERE, "..", "tests", "agent-voice-hold-fixtures.json");
const BASE_URL = (process.env.CREATIVEDGE_API_URL || "http://127.0.0.1:3001").replace(/\/+$/, "");
const TURN_TIMEOUT_MS = Number(process.env.CREATIVEDGE_TURN_TIMEOUT_MS || 180_000);
const ONLY = (process.env.CREATIVEDGE_ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const AGENT_FILTER = (process.env.CREATIVEDGE_AGENT || "").trim();
const FULL_VOICE = process.env.CREATIVEDGE_FULL_VOICE === "1";
const TURN_CAP = (() => {
  const n = Number(process.env.CREATIVEDGE_VOICE_TURNS || "0");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
})();
const VERBOSE = process.env.CREATIVEDGE_VERBOSE === "1";

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };
function colorize(s, c) { return (COLOR[c] || "") + s + (COLOR.reset || ""); }

// ---------------------------------------------------------------------------
// SSE parser (same shape as the routing + agent-behavior runners)
// ---------------------------------------------------------------------------

function parseSseBlock(block) {
  let event = null;
  let data = "";
  for (const rawLine of block.split("\n")) {
    if (!rawLine) continue;
    if (rawLine.startsWith(":")) continue;
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
  if (data) { try { parsed = JSON.parse(data); } catch { /* leave as string */ } }
  return { event, data: parsed };
}

async function runOneTurn(message, sessionId) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new Error("turn timeout")), TURN_TIMEOUT_MS);
  const body = sessionId ? { message, sessionId } : { message };
  let res;
  try {
    res = await fetch(BASE_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(body),
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
  let streamedText = "";
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
          if (evt.event === "chunk" && evt.data && typeof evt.data === "object" && typeof evt.data.text === "string") {
            streamedText += evt.data.text;
          }
          if (VERBOSE) {
            const previewSrc = typeof evt.data === "string" ? evt.data : JSON.stringify(evt.data);
            console.error(colorize(`  [sse] ${evt.event}: ${previewSrc.slice(0, 120)}`, "dim"));
          }
          if (evt.event === "done") buf = "";
        }
      }
    }
  } finally {
    clearTimeout(timer);
    try { reader.releaseLock(); } catch { /* noop */ }
  }
  return { events, streamedText };
}

function extract(events) {
  const meta = events.find((e) => e.event === "meta")?.data;
  const done = events.find((e) => e.event === "done")?.data;
  return { meta, done };
}

function evaluateTurn(fixture, meta, done, streamedText) {
  const exp = fixture.expected || {};
  const observed = {
    agentSlug: meta?.agentSlug ?? null,
    agentName: meta?.agentName ?? null,
    provider: meta?.provider ?? null,
    degraded: meta?.degraded ?? null,
    doneOk: done?.ok ?? null,
    sessionId: meta?.sessionId ?? null,
    claudeError: meta?.claudeError ?? null,
  };
  if (!meta) return { pass: false, reason: "no meta event", observed };
  if (observed.agentSlug !== exp.agentSlug)
    return { pass: false, reason: `expected agentSlug "${exp.agentSlug}", got "${observed.agentSlug}"`, observed };
  if (exp.agentName && observed.agentName !== exp.agentName)
    return { pass: false, reason: `expected agentName "${exp.agentName}", got "${observed.agentName}"`, observed };
  if (observed.provider !== "claude") {
    const extra = observed.claudeError ? ` [claudeError:${observed.claudeError}]` : "";
    return { pass: false, reason: `expected provider "claude", got "${observed.provider}"${extra}`, observed };
  }
  if (observed.degraded !== false)
    return { pass: false, reason: `expected degraded:false, got ${JSON.stringify(observed.degraded)}`, observed };
  if (!done) return { pass: false, reason: "no done event", observed };
  if (done.ok !== true) return { pass: false, reason: `expected done.ok:true, got ${JSON.stringify(done.ok)}`, observed };
  const required = Array.isArray(exp.requiredHeaderIncludes) ? exp.requiredHeaderIncludes : [];
  const missing = required.filter((s) => !streamedText.includes(s));
  if (missing.length > 0)
    return { pass: false, reason: `missing header substring(s): ${JSON.stringify(missing)}`, observed };
  const forbidden = Array.isArray(exp.forbiddenIncludes) ? exp.forbiddenIncludes : [];
  const lc = streamedText.toLowerCase();
  const leaked = forbidden.filter((s) => lc.includes(String(s).toLowerCase()));
  if (leaked.length > 0)
    return { pass: false, reason: `forbidden internal term(s): ${JSON.stringify(leaked)}`, observed };
  return { pass: true, observed };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function printUsageAndExit(reason) {
  console.error("=".repeat(78));
  console.error("CreativEdge per-agent 10-turn voice-hold runner (Phase 4.4-A)");
  console.error("=".repeat(78));
  if (reason) console.error(colorize(reason, "yellow"));
  console.error("");
  console.error("This runner makes up to 14 x 10 = 140 live Claude turns. It refuses");
  console.error("to run the full suite by default. Choose one:");
  console.error("");
  console.error("  CREATIVEDGE_AGENT=<slug>     # one agent (10 turns)");
  console.error("  CREATIVEDGE_ONLY=<id,...>    # explicit fixture ids");
  console.error("  CREATIVEDGE_FULL_VOICE=1     # all 14 fixtures (140 turns)");
  console.error("");
  console.error("Optional:");
  console.error("  CREATIVEDGE_VOICE_TURNS=<n>  # cap each fixture to first n turns");
  console.error("  CREATIVEDGE_API_URL=<url>    # default http://127.0.0.1:3001");
  console.error("  CREATIVEDGE_TURN_TIMEOUT_MS  # per-turn timeout (default 180000)");
  console.error("  CREATIVEDGE_VERBOSE=1        # per-event SSE debug");
  process.exit(2);
}

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

  let toRun = fixtures;
  let scope = "all";
  if (AGENT_FILTER) {
    toRun = fixtures.filter((f) => f.agent === AGENT_FILTER || f.expected?.agentSlug === AGENT_FILTER);
    scope = `CREATIVEDGE_AGENT=${AGENT_FILTER}`;
  } else if (ONLY.length > 0) {
    toRun = fixtures.filter((f) => ONLY.includes(f.id));
    scope = `CREATIVEDGE_ONLY=${ONLY.join(",")}`;
  } else if (!FULL_VOICE) {
    printUsageAndExit(
      "No filter set and CREATIVEDGE_FULL_VOICE != 1 - refusing to run the full 140-turn suite by default."
    );
  } else {
    scope = "CREATIVEDGE_FULL_VOICE=1 (full 140-turn suite)";
  }

  if (toRun.length === 0) {
    printUsageAndExit(`No fixtures matched filter (${scope}).`);
  }

  console.log("=".repeat(78));
  console.log("CreativEdge per-agent 10-turn voice-hold runner (Phase 4.4-A)");
  console.log("=".repeat(78));
  console.log(`backend:  ${BASE_URL}`);
  console.log(`scope:    ${scope}`);
  console.log(`fixtures: ${toRun.length}`);
  const perFixtureTurns = TURN_CAP > 0 ? `${TURN_CAP} (capped via CREATIVEDGE_VOICE_TURNS)` : "10 (full)";
  console.log(`turns:    ${perFixtureTurns} per fixture`);
  console.log("");

  try {
    const r = await fetch(BASE_URL + "/healthz");
    if (!r.ok) throw new Error("HTTP " + r.status);
  } catch (err) {
    console.error(colorize(`cannot reach backend at ${BASE_URL}/healthz: ${err?.message || err}`, "red"));
    console.error("start the backend first:  cd backend-api && npm run dev");
    process.exit(2);
  }

  let totalTurns = 0;
  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const f of toRun) {
    const expectedAgent = f.expected?.agentSlug || f.agent;
    console.log(colorize(`--- ${f.id} (agent=${expectedAgent}) ---`, "dim"));
    const allTurns = Array.isArray(f.turns) ? f.turns : [];
    const turnsForThisFixture = TURN_CAP > 0 ? allTurns.slice(0, TURN_CAP) : allTurns;
    let sessionId = null;
    let fixtureFailed = false;
    for (let i = 0; i < turnsForThisFixture.length; i++) {
      const turnText = turnsForThisFixture[i];
      const turnIndex = i + 1;
      totalTurns++;
      let result;
      try {
        const { events, streamedText } = await runOneTurn(turnText, sessionId);
        const { meta, done } = extract(events);
        result = evaluateTurn(f, meta, done, streamedText);
        if (!sessionId && result.observed?.sessionId) {
          sessionId = result.observed.sessionId;
        }
      } catch (err) {
        result = { pass: false, reason: "runner error: " + (err?.message || String(err)), observed: {} };
      }
      const tag = result.pass ? colorize("PASS", "green") : colorize("FAIL", "red");
      const slug = (result.observed?.agentSlug || "-").padEnd(22);
      console.log(`  turn ${String(turnIndex).padStart(2)}/${turnsForThisFixture.length}  ${slug}  ${tag}`);
      if (!result.pass) {
        console.log(colorize(`    reason: ${result.reason}`, "red"));
        failures.push({ id: f.id, turn: turnIndex, reason: result.reason });
        fail++;
        fixtureFailed = true;
        // Stop this fixture early - voice-hold means stability across turns,
        // so once stability is broken we don't burn more Claude turns.
        break;
      } else {
        pass++;
      }
    }
    if (!fixtureFailed) {
      console.log(colorize(`  fixture ${f.id}: ${turnsForThisFixture.length}/${turnsForThisFixture.length} PASS`, "green"));
    } else {
      console.log(colorize(`  fixture ${f.id}: stopped early after first failure`, "red"));
    }
    console.log("");
  }

  console.log("-".repeat(78));
  console.log(
    `total turns: ${totalTurns}   ` +
      `${colorize("PASS " + pass, "green")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );
  if (failures.length > 0) {
    console.log(colorize("\nfailing turns:", "red"));
    for (const f of failures) console.log(colorize(`  - ${f.id} turn ${f.turn}  (${f.reason})`, "red"));
  }
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
