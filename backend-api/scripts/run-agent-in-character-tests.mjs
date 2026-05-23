#!/usr/bin/env node
/**
 * Phase 8.2 cross-character contamination check.
 *
 * For each fixture in `tests/agent-contamination-fixtures.json`, the runner
 * walks a TWO-turn conversation that shares one `sessionId`:
 *
 *   turn A: post `source.message` to /chat (no sessionId)
 *           - capture sessionId from the source `meta` event
 *           - validate source.agentSlug + provider + degraded + done.ok
 *           - validate `source.requiredHeaderIncludes` present
 *           - validate `source.forbiddenIncludes` absent
 *   turn B: post `target.message` to /chat with the captured sessionId
 *           - validate target.agentSlug + provider + degraded + done.ok
 *           - validate `target.requiredHeaderIncludes` present
 *           - validate `target.forbiddenIncludes` absent
 *           - validate `target.forbiddenSourceMarkers` absent
 *             (i.e. no residual source-agent voice/persona/domain markers
 *              bled into the target agent's reply on the next turn)
 *
 * The per-turn meta + header + leakage fingerprint is the same one used by
 * Phase 4.3-A's `test:agents` runner; this slice is intentionally a thin
 * extension that adds the cross-character contamination check on top —
 * §8.2 does NOT rebuild the 70-fixture per-agent eval.
 *
 * The runner is dependency-light: Node 20+ built-in `fetch`, no API keys,
 * no Anthropic API, no `.env`. The local backend handles all provider
 * calls internally.
 *
 * Usage:
 *   node scripts/run-agent-in-character-tests.mjs
 *
 * Env vars:
 *   CREATIVEDGE_API_URL          base URL (default http://127.0.0.1:3001)
 *   CREATIVEDGE_TURN_TIMEOUT_MS  per-turn timeout (default 180000)
 *   CREATIVEDGE_ONLY=id1,id2     run only these fixture ids
 *   CREATIVEDGE_VERBOSE=1        print per-event SSE debug
 *
 * Privacy:
 *   The runner never prints full prompts, full responses, memory content,
 *   or secrets. Only fixture ids, expected vs observed agent slugs, and
 *   short per-fixture reason strings (for failures) are emitted.
 *
 * Exit codes:
 *   0  every selected fixture PASS
 *   1  one or more fixtures FAIL
 *   2  runner-level error (couldn't read fixture file, couldn't reach
 *      backend, malformed fixture, etc.)
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(
  HERE,
  "..",
  "tests",
  "agent-contamination-fixtures.json"
);
const BASE_URL = (process.env.CREATIVEDGE_API_URL || "http://127.0.0.1:3001").replace(
  /\/+$/,
  ""
);
const TURN_TIMEOUT_MS = Number(process.env.CREATIVEDGE_TURN_TIMEOUT_MS || 180_000);
const ONLY = (process.env.CREATIVEDGE_ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const VERBOSE = process.env.CREATIVEDGE_VERBOSE === "1";

const COLOR = process.stdout.isTTY
  ? {
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      reset: "\x1b[0m",
      dim: "\x1b[2m",
    }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };

function colorize(s, c) {
  return (COLOR[c] || "") + s + (COLOR.reset || "");
}

// ---------------------------------------------------------------------------
// SSE parser (mirrors run-agent-behavior-smoke.mjs and run-agent-voice-hold.mjs)
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
  if (data) {
    try {
      parsed = JSON.parse(data);
    } catch {
      /* leave as string */
    }
  }
  return { event, data: parsed };
}

async function runOneTurn(message, sessionId) {
  const ctrl = new AbortController();
  const timer = setTimeout(
    () => ctrl.abort(new Error("turn timeout")),
    TURN_TIMEOUT_MS
  );
  const body = sessionId ? { message, sessionId } : { message };
  let res;
  try {
    res = await fetch(BASE_URL + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
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
          if (
            evt.event === "chunk" &&
            evt.data &&
            typeof evt.data === "object" &&
            typeof evt.data.text === "string"
          ) {
            streamedText += evt.data.text;
          }
          if (VERBOSE) {
            const previewSrc =
              typeof evt.data === "string" ? evt.data : JSON.stringify(evt.data);
            console.error(
              colorize(`  [sse] ${evt.event}: ${previewSrc.slice(0, 120)}`, "dim")
            );
          }
          if (evt.event === "done") buf = "";
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
  return { events, streamedText };
}

function extract(events) {
  const meta = events.find((e) => e.event === "meta")?.data;
  const done = events.find((e) => e.event === "done")?.data;
  return { meta, done };
}

// ---------------------------------------------------------------------------
// Per-turn evaluators
// ---------------------------------------------------------------------------

/**
 * Validate the source turn against `source.agentSlug` + `source.agentName`
 * (optional) + provider + degraded + done.ok + requiredHeaderIncludes +
 * forbiddenIncludes. Returns `{ pass, reason, observed }`.
 */
function evaluateSourceTurn(source, meta, done, streamedText) {
  const observed = {
    agentSlug: meta?.agentSlug ?? null,
    agentName: meta?.agentName ?? null,
    provider: meta?.provider ?? null,
    degraded: meta?.degraded ?? null,
    sessionId: meta?.sessionId ?? null,
    doneOk: done?.ok ?? null,
    claudeError: meta?.claudeError ?? null,
    streamedChars: streamedText.length,
  };
  if (!meta) return { pass: false, reason: "source: no meta event", observed };
  if (observed.agentSlug !== source.agentSlug) {
    return {
      pass: false,
      reason: `source: expected agentSlug "${source.agentSlug}", got "${observed.agentSlug}"`,
      observed,
    };
  }
  if (source.agentName && observed.agentName !== source.agentName) {
    return {
      pass: false,
      reason: `source: expected agentName "${source.agentName}", got "${observed.agentName}"`,
      observed,
    };
  }
  if (observed.provider !== "claude") {
    const extra = observed.claudeError ? ` [claudeError:${observed.claudeError}]` : "";
    return {
      pass: false,
      reason: `source: expected provider "claude", got "${observed.provider}"${extra}`,
      observed,
    };
  }
  if (observed.degraded !== false) {
    return {
      pass: false,
      reason: `source: expected degraded:false, got ${JSON.stringify(observed.degraded)}`,
      observed,
    };
  }
  if (!done) return { pass: false, reason: "source: no done event", observed };
  if (done.ok !== true) {
    return {
      pass: false,
      reason: `source: expected done.ok:true, got ${JSON.stringify(done.ok)}`,
      observed,
    };
  }
  const required = Array.isArray(source.requiredHeaderIncludes)
    ? source.requiredHeaderIncludes
    : [];
  const missingHeader = required.filter((s) => !streamedText.includes(s));
  if (missingHeader.length > 0) {
    return {
      pass: false,
      reason: `source: missing header substring(s): ${JSON.stringify(missingHeader)}`,
      observed,
    };
  }
  const forbidden = Array.isArray(source.forbiddenIncludes)
    ? source.forbiddenIncludes
    : [];
  const lc = streamedText.toLowerCase();
  const leaked = forbidden.filter((s) => lc.includes(String(s).toLowerCase()));
  if (leaked.length > 0) {
    return {
      pass: false,
      reason: `source: forbidden internal term(s): ${JSON.stringify(leaked)}`,
      observed,
    };
  }
  return { pass: true, reason: "ok", observed };
}

/**
 * Validate the target turn against `target.agentSlug` + provider + degraded
 * + done.ok + requiredHeaderIncludes + forbiddenIncludes (generic leakage)
 * AND `target.forbiddenSourceMarkers` (cross-character contamination). Returns
 * `{ pass, routingOk, headerOk, leakageOk, contaminationOk, reason, observed }`.
 */
function evaluateTargetTurn(target, meta, done, streamedText) {
  const observed = {
    agentSlug: meta?.agentSlug ?? null,
    agentName: meta?.agentName ?? null,
    provider: meta?.provider ?? null,
    degraded: meta?.degraded ?? null,
    sessionId: meta?.sessionId ?? null,
    doneOk: done?.ok ?? null,
    claudeError: meta?.claudeError ?? null,
    streamedChars: streamedText.length,
  };
  if (!meta) return { pass: false, reason: "target: no meta event", observed };
  if (observed.agentSlug !== target.agentSlug) {
    return {
      pass: false,
      routingOk: false,
      reason: `target: expected agentSlug "${target.agentSlug}", got "${observed.agentSlug}"`,
      observed,
    };
  }
  if (target.agentName && observed.agentName !== target.agentName) {
    return {
      pass: false,
      routingOk: false,
      reason: `target: expected agentName "${target.agentName}", got "${observed.agentName}"`,
      observed,
    };
  }
  if (observed.provider !== "claude") {
    const extra = observed.claudeError ? ` [claudeError:${observed.claudeError}]` : "";
    return {
      pass: false,
      routingOk: true,
      reason: `target: expected provider "claude", got "${observed.provider}"${extra}`,
      observed,
    };
  }
  if (observed.degraded !== false) {
    return {
      pass: false,
      routingOk: true,
      reason: `target: expected degraded:false, got ${JSON.stringify(observed.degraded)}`,
      observed,
    };
  }
  if (!done) return { pass: false, reason: "target: no done event", observed };
  if (done.ok !== true) {
    return {
      pass: false,
      routingOk: true,
      reason: `target: expected done.ok:true, got ${JSON.stringify(done.ok)}`,
      observed,
    };
  }
  const required = Array.isArray(target.requiredHeaderIncludes)
    ? target.requiredHeaderIncludes
    : [];
  const missingHeader = required.filter((s) => !streamedText.includes(s));
  if (missingHeader.length > 0) {
    return {
      pass: false,
      routingOk: true,
      headerOk: false,
      reason: `target: missing header substring(s): ${JSON.stringify(missingHeader)}`,
      observed,
    };
  }
  const forbidden = Array.isArray(target.forbiddenIncludes)
    ? target.forbiddenIncludes
    : [];
  const lc = streamedText.toLowerCase();
  const leakedGeneric = forbidden.filter((s) =>
    lc.includes(String(s).toLowerCase())
  );
  if (leakedGeneric.length > 0) {
    return {
      pass: false,
      routingOk: true,
      headerOk: true,
      leakageOk: false,
      reason: `target: forbidden internal term(s): ${JSON.stringify(leakedGeneric)}`,
      observed,
    };
  }
  const sourceMarkers = Array.isArray(target.forbiddenSourceMarkers)
    ? target.forbiddenSourceMarkers
    : [];
  const contaminated = sourceMarkers.filter((s) =>
    lc.includes(String(s).toLowerCase())
  );
  if (contaminated.length > 0) {
    return {
      pass: false,
      routingOk: true,
      headerOk: true,
      leakageOk: true,
      contaminationOk: false,
      reason: `target: source-agent voice markers bled in: ${JSON.stringify(contaminated)}`,
      observed,
    };
  }
  return {
    pass: true,
    routingOk: true,
    headerOk: true,
    leakageOk: true,
    contaminationOk: true,
    reason: "ok",
    observed,
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

  // Lightweight shape check so a malformed fixture exits 2 instead of
  // surfacing as a misleading FAIL deep in the runner.
  for (const f of fixtures) {
    if (
      !f ||
      typeof f !== "object" ||
      typeof f.id !== "string" ||
      !f.source ||
      !f.target ||
      typeof f.source.agentSlug !== "string" ||
      typeof f.source.message !== "string" ||
      typeof f.target.agentSlug !== "string" ||
      typeof f.target.message !== "string"
    ) {
      console.error(
        "malformed fixture (expected { id, source:{agentSlug,message,...}, target:{agentSlug,message,...} }):",
        JSON.stringify(f).slice(0, 200)
      );
      process.exit(2);
    }
  }

  console.log("=".repeat(78));
  console.log("CreativEdge cross-character contamination runner (Phase 8.2)");
  console.log("=".repeat(78));
  console.log(`backend:   ${BASE_URL}`);
  console.log(`fixtures:  ${fixtures.length}`);
  console.log("");

  try {
    const r = await fetch(BASE_URL + "/healthz");
    if (!r.ok) throw new Error("HTTP " + r.status);
  } catch (err) {
    console.error(
      colorize(
        `cannot reach backend at ${BASE_URL}/healthz: ${err?.message || err}`,
        "red"
      )
    );
    console.error("start the backend first:  cd backend-api && npm run dev");
    process.exit(2);
  }

  const toRun =
    ONLY.length > 0 ? fixtures.filter((f) => ONLY.includes(f.id)) : fixtures;
  if (toRun.length === 0) {
    console.error(colorize("no fixtures selected (check CREATIVEDGE_ONLY)", "red"));
    process.exit(2);
  }

  // Compact table header. Cell width chosen to fit the longest agent slug
  // (`writing-translation` = 19) + a couple of result cells.
  const cols = [
    ["id", 28],
    ["src", 20],
    ["tgt", 20],
    ["src", 6],
    ["tgt", 6],
    ["contam", 8],
    ["result", 8],
  ];
  const headerLine = cols.map(([h, w]) => h.padEnd(w)).join(" ");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const f of toRun) {
    let sourceResult = null;
    let targetResult = null;
    let runnerError = null;

    // --- turn A: source ---
    try {
      const { events, streamedText } = await runOneTurn(f.source.message, null);
      const { meta, done } = extract(events);
      sourceResult = evaluateSourceTurn(f.source, meta, done, streamedText);
    } catch (err) {
      runnerError = "source: runner error: " + (err?.message || String(err));
    }

    // --- turn B: target, reusing sessionId from turn A's meta ---
    if (!runnerError && sourceResult?.pass) {
      const sid = sourceResult.observed?.sessionId ?? null;
      if (!sid) {
        runnerError =
          "source meta lacked sessionId; cannot drive target turn under same session";
      } else {
        try {
          const { events, streamedText } = await runOneTurn(f.target.message, sid);
          const { meta, done } = extract(events);
          targetResult = evaluateTargetTurn(f.target, meta, done, streamedText);
        } catch (err) {
          runnerError = "target: runner error: " + (err?.message || String(err));
        }
      }
    }

    const srcCell = sourceResult?.pass
      ? colorize("OK", "green")
      : colorize("FAIL", "red");
    const tgtCell = !sourceResult?.pass
      ? colorize("-", "dim")
      : targetResult?.pass
        ? colorize("OK", "green")
        : colorize("FAIL", "red");
    const contamCell = !sourceResult?.pass
      ? colorize("-", "dim")
      : targetResult?.pass
        ? colorize("OK", "green")
        : targetResult?.contaminationOk === false
          ? colorize("LEAK", "red")
          : colorize("-", "dim");
    const fixturePass =
      !runnerError && sourceResult?.pass && targetResult?.pass;
    if (fixturePass) pass++;
    else fail++;
    const tag = fixturePass ? colorize("PASS", "green") : colorize("FAIL", "red");

    const row = [
      (f.id || "-").slice(0, 28).padEnd(28),
      (f.source.agentSlug || "-").slice(0, 20).padEnd(20),
      (f.target.agentSlug || "-").slice(0, 20).padEnd(20),
      srcCell.padEnd(6 + (COLOR.green ? COLOR.green.length + COLOR.reset.length : 0)),
      tgtCell.padEnd(6 + (COLOR.green ? COLOR.green.length + COLOR.reset.length : 0)),
      contamCell.padEnd(
        8 + (COLOR.green ? COLOR.green.length + COLOR.reset.length : 0)
      ),
      tag,
    ].join(" ");
    console.log(row);

    if (!fixturePass) {
      const reasons = [];
      if (runnerError) reasons.push(runnerError);
      if (sourceResult && !sourceResult.pass) reasons.push(sourceResult.reason);
      if (targetResult && !targetResult.pass) reasons.push(targetResult.reason);
      for (const r of reasons) console.log(colorize(`    reason: ${r}`, "red"));
      failures.push({ id: f.id, reasons });
    }
  }

  console.log("-".repeat(headerLine.length));
  console.log(
    `total: ${toRun.length}   ` +
      `${colorize("PASS " + pass, "green")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );

  if (failures.length > 0) {
    console.log(colorize("\nfailing fixture ids:", "red"));
    for (const f of failures) {
      console.log(colorize(`  - ${f.id}`, "red"));
      for (const r of f.reasons) console.log(colorize(`      ${r}`, "red"));
    }
  }

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
