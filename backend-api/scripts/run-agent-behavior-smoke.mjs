#!/usr/bin/env node
/**
 * Phase 4.3-A per-agent behavior smoke/eval harness.
 *
 * Posts each fixture in `tests/agent-behavior-fixtures.json` to the live
 * local backend (`POST /chat`) and verifies the stable metadata + header
 * fingerprint + the absence of internal-tool leakage terms.
 *
 * What this harness CHECKS:
 *   - meta.agentSlug matches expected
 *   - meta.agentName matches expected
 *   - meta.provider === "claude"
 *   - meta.degraded === false
 *   - done.ok === true
 *   - streamed text contains every `requiredHeaderIncludes` substring
 *     (case-sensitive - these are agent persona names / domains)
 *   - streamed text contains NO `forbiddenIncludes` substring
 *     (case-insensitive - protects against internal-tool / runtime leakage:
 *      `Superpowers`, `MCP`, `Claude Code`, `<CREATIVEDGE_HANDOFF>`, ...)
 *
 * What this harness EXPLICITLY DOES NOT CHECK:
 *   - subjective LLM quality
 *   - exact response wording
 *   - 10-turn voice-hold (Phase 4 done-when, not 4.3-A)
 *   - 5-prompt in-domain SP coverage (Phase 8.2 territory)
 *   - core-memory recall (Phase 5 + Phase 4 done-when)
 *
 * The runner is intentionally dependency-light: it uses Node 20+ built-in
 * `fetch` and the same small SSE block parser as the routing fixture
 * runner. No `.env`, no API keys, no external HTTP client, no Anthropic
 * API. The local backend handles all provider calls internally.
 *
 * Usage:
 *   node scripts/run-agent-behavior-smoke.mjs
 *
 * Env vars:
 *   CREATIVEDGE_API_URL          base URL (default http://127.0.0.1:3001)
 *   CREATIVEDGE_TURN_TIMEOUT_MS  per-fixture timeout (default 180000)
 *   CREATIVEDGE_ONLY=id1,id2     run only these fixture ids
 *   CREATIVEDGE_VERBOSE=1        print per-event SSE debug
 *   CREATIVEDGE_AGENT=<slug>     run only fixtures whose `agent` or
 *                                `expected.agentSlug` equals this slug
 *                                (combines with CREATIVEDGE_ONLY if both set)
 *
 * Phase 4.3-B reliability behavior:
 *   A fixture that fails ONLY because the chat route degraded to mock
 *   (provider !== "claude" or degraded === true) is retried once after a
 *   1.5 s delay. Routing / header / leakage failures never retry. On a
 *   retry-pass the result tag is `PASS(R)` (yellow) and the first
 *   attempt's reason is preserved in the per-fixture note + the totals
 *   line. On final failure the runner prints both the first attempt's
 *   reason and the retry's reason, with compact meta diagnostics:
 *   `provider`, `degraded`, `candidate`, `claudeError`, `requestId`.
 *   No prompts or memory content are logged.
 *
 * Exit codes:
 *   0  every selected fixture PASS
 *   1  one or more fixtures FAIL
 *   2  runner-level error (couldn't read fixture file, couldn't reach backend, etc.)
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(HERE, "..", "tests", "agent-behavior-fixtures.json");
const BASE_URL =
  (process.env.CREATIVEDGE_API_URL || "http://127.0.0.1:3001").replace(/\/+$/, "");
const TURN_TIMEOUT_MS = Number(process.env.CREATIVEDGE_TURN_TIMEOUT_MS || 180_000);
const ONLY = (process.env.CREATIVEDGE_ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const AGENT_FILTER = (process.env.CREATIVEDGE_AGENT || "").trim();
const VERBOSE = process.env.CREATIVEDGE_VERBOSE === "1";

const COLOR = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", reset: "", dim: "" };

function colorize(s, c) {
  return (COLOR[c] || "") + s + (COLOR.reset || "");
}

// ---------------------------------------------------------------------------
// SSE parser (mirrors run-routing-fixtures.mjs)
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

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

function extract(events) {
  const meta = events.find((e) => e.event === "meta")?.data;
  const done = events.find((e) => e.event === "done")?.data;
  const errorEvt = events.find((e) => e.event === "error")?.data;
  return { meta, done, errorEvt };
}

function evaluate(fixture, meta, done, streamedText) {
  const exp = fixture.expected || {};
  const observed = {
    agentSlug: meta?.agentSlug ?? null,
    agentName: meta?.agentName ?? null,
    provider: meta?.provider ?? null,
    degraded: meta?.degraded ?? null,
    doneOk: done?.ok ?? null,
    streamedChars: streamedText.length,
    // Phase 4.3-B diagnostic patch: capture the compact set of meta fields
    // that explain WHY the chat route ended up on the mock provider when it
    // was supposed to be on Claude. No prompts and no memory content - only
    // already-public meta fields the chat route emits.
    claudeError: meta?.claudeError ?? null,
    candidate: meta?.candidate ?? null,
    requestId: meta?.requestId ?? null,
  };
  if (!meta) {
    return { pass: false, reason: "no meta event received", observed };
  }
  if (observed.agentSlug !== exp.agentSlug) {
    return {
      pass: false,
      reason: `expected agentSlug "${exp.agentSlug}", got "${observed.agentSlug}"`,
      observed,
      failureKind: "routing",
    };
  }
  if (exp.agentName && observed.agentName !== exp.agentName) {
    return {
      pass: false,
      reason: `expected agentName "${exp.agentName}", got "${observed.agentName}"`,
      observed,
      failureKind: "routing",
    };
  }
  if (observed.provider !== "claude") {
    const extras = [];
    if (observed.degraded !== null && observed.degraded !== undefined)
      extras.push(`degraded:${JSON.stringify(observed.degraded)}`);
    if (observed.candidate) extras.push(`candidate:${observed.candidate}`);
    if (observed.claudeError) extras.push(`claudeError:${observed.claudeError}`);
    if (observed.requestId) extras.push(`requestId:${observed.requestId}`);
    return {
      pass: false,
      reason:
        `expected provider "claude", got "${observed.provider}"` +
        (extras.length ? ` [${extras.join(" | ")}]` : "") +
        " (run on a Windows host with an authenticated Claude Code CLI)",
      observed,
      failureKind: "providerFallback",
    };
  }
  if (observed.degraded !== false) {
    return {
      pass: false,
      reason:
        `expected degraded:false, got ${JSON.stringify(observed.degraded)}` +
        (observed.claudeError ? ` [claudeError:${observed.claudeError}]` : "") +
        (observed.requestId ? ` [requestId:${observed.requestId}]` : ""),
      observed,
      failureKind: "providerFallback",
    };
  }
  if (!done) {
    return { pass: false, reason: "no done event received", observed };
  }
  if (done.ok !== true) {
    return { pass: false, reason: `expected done.ok:true, got ${JSON.stringify(done.ok)}`, observed };
  }
  // Header check (case-sensitive: names/domains are deliberate capitalisations).
  const required = Array.isArray(exp.requiredHeaderIncludes) ? exp.requiredHeaderIncludes : [];
  const missingHeader = required.filter((s) => !streamedText.includes(s));
  if (missingHeader.length > 0) {
    return {
      pass: false,
      headerOk: false,
      reason: `streamed text missing required header substring(s): ${JSON.stringify(missingHeader)}`,
      observed,
    };
  }
  // Forbidden-leakage check (case-insensitive).
  const forbidden = Array.isArray(exp.forbiddenIncludes) ? exp.forbiddenIncludes : [];
  const lc = streamedText.toLowerCase();
  const leaked = forbidden.filter((s) => lc.includes(String(s).toLowerCase()));
  if (leaked.length > 0) {
    return {
      pass: false,
      headerOk: true,
      leakageOk: false,
      reason: `streamed text contained forbidden internal term(s): ${JSON.stringify(leaked)}`,
      observed,
    };
  }
  return { pass: true, headerOk: true, leakageOk: true, reason: "ok", observed };
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

  console.log("=".repeat(78));
  console.log("CreativEdge per-agent behavior smoke runner (Phase 4.3-A/B)");
  console.log("=".repeat(78));
  console.log(`backend:   ${BASE_URL}`);
  console.log(`fixtures:  ${fixtures.length}`);
  const agents = new Set(fixtures.map((f) => f.expected?.agentSlug ?? f.agent));
  console.log(`agents:    ${agents.size} unique slugs`);
  console.log("");

  try {
    const r = await fetch(BASE_URL + "/healthz");
    if (!r.ok) throw new Error("HTTP " + r.status);
  } catch (err) {
    console.error(colorize(`cannot reach backend at ${BASE_URL}/healthz: ${err?.message || err}`, "red"));
    console.error("start the backend first:  cd backend-api && npm run dev");
    process.exit(2);
  }

  let toRun = ONLY.length > 0 ? fixtures.filter((f) => ONLY.includes(f.id)) : fixtures;
  if (AGENT_FILTER) {
    toRun = toRun.filter(
      (f) => f.agent === AGENT_FILTER || f.expected?.agentSlug === AGENT_FILTER
    );
    console.log(`agent filter:  ${AGENT_FILTER} -> ${toRun.length} fixture(s) selected`);
  }

  const cols = [
    ["id", 22],
    ["expSlug", 22],
    ["actSlug", 22],
    ["header", 8],
    ["leak", 8],
    ["result", 8],
  ];
  const headerLine = cols.map(([h, w]) => h.padEnd(w)).join(" ");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  let pass = 0;
  let fail = 0;
  let retryPass = 0;
  const failures = [];

  // Phase 4.3-B reliability patch: a single retry, with a 1.5 s delay, is
  // attempted ONLY when the first attempt failed because the chat route
  // degraded to mock (`failureKind === "providerFallback"`). Routing /
  // header / leakage failures never retry - those are deterministic and a
  // retry would just hide the bug.
  const PROVIDER_RETRY_DELAY_MS = 1500;

  async function runOnce(fixture) {
    try {
      const { events, streamedText } = await runOneFixture(fixture.message);
      const { meta, done } = extract(events);
      return evaluate(fixture, meta, done, streamedText);
    } catch (err) {
      return {
        pass: false,
        reason: "runner error: " + (err?.message || String(err)),
        observed: {},
        failureKind: "runnerError",
      };
    }
  }

  for (const f of toRun) {
    let result = await runOnce(f);
    let firstReason = null;
    let didRetry = false;
    if (!result.pass && result.failureKind === "providerFallback") {
      firstReason = result.reason;
      console.log(
        colorize(
          `    retry: ${f.id} hit a provider fallback on attempt 1; sleeping ${PROVIDER_RETRY_DELAY_MS} ms then retrying once`,
          "yellow"
        )
      );
      await new Promise((r) => setTimeout(r, PROVIDER_RETRY_DELAY_MS));
      result = await runOnce(f);
      didRetry = true;
    }
    const exp = f.expected || {};
    const headerCell = result.pass
      ? "OK"
      : result.headerOk === false
        ? "MISS"
        : result.headerOk === true
          ? "OK"
          : "-";
    const leakCell = result.pass
      ? "OK"
      : result.leakageOk === false
        ? "LEAK"
        : result.leakageOk === true
          ? "OK"
          : "-";
    const tag = result.pass
      ? didRetry
        ? colorize("PASS(R)", "yellow")
        : colorize("PASS", "green")
      : colorize("FAIL", "red");
    const row = [
      [(f.id || "-").slice(0, 22).padEnd(22), 22],
      [(exp.agentSlug || "-").slice(0, 22).padEnd(22), 22],
      [(result.observed.agentSlug || "-").slice(0, 22).padEnd(22), 22],
      [headerCell.padEnd(8), 8],
      [leakCell.padEnd(8), 8],
      [tag, 8],
    ]
      .map(([v]) => v)
      .join(" ");
    console.log(row);
    if (!result.pass) {
      console.log(colorize(`    reason: ${result.reason}`, "red"));
      if (didRetry && firstReason) {
        console.log(colorize(`    first attempt reason: ${firstReason}`, "red"));
      }
      const reasonForList =
        didRetry && firstReason
          ? `${result.reason} ; first attempt: ${firstReason}`
          : result.reason;
      failures.push({ id: f.id, reason: reasonForList });
      fail++;
    } else if (didRetry) {
      console.log(colorize(`    note: passed after one retry (first attempt: ${firstReason})`, "yellow"));
      retryPass++;
      pass++;
    } else {
      pass++;
    }
  }

  console.log("-".repeat(headerLine.length));
  const hardPass = pass - retryPass;
  console.log(
    `total: ${toRun.length}   ` +
      `${colorize("PASS " + hardPass, "green")}   ` +
      `${colorize("PASS(R) " + retryPass, retryPass > 0 ? "yellow" : "dim")}   ` +
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
