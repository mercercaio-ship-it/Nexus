#!/usr/bin/env node
/**
 * Phase 4.5-A per-agent core-memory reference smoke/eval harness.
 *
 * Verifies that each specialist can reference a fact stored in its own
 * `~/.creativedge/agents/<slug>/memory/core_memory.md` when invoked through
 * the live local backend (`POST /chat`).
 *
 * DESIGN — probe-marker, SKIP-by-default:
 *
 *   Real user memories are unbounded and unknown to this harness. Hard-coding
 *   facts to recall would either be wrong (no such fact exists) or invasive
 *   (writing into the user's real memory). Instead, each fixture defines a
 *   short, non-sensitive `coreMemoryProbe` marker, e.g. `[ce-test:lumi]`.
 *
 *   For each fixture:
 *     - We READ `~/.creativedge/agents/<slug>/memory/core_memory.md` and
 *       check whether the probe marker is present.
 *     - If the marker is NOT present, the fixture is SKIPPED with a clear
 *       skipReason that includes the path and the marker so the user can
 *       opt-in by appending the marker to their memory file.
 *     - If the marker IS present, we POST a generic, fact-free message
 *       asking the agent to echo any `[ce-test:...]` tag it sees, and verify
 *       the stable metadata + header + leakage + `responseIncludes` (the
 *       probe marker itself).
 *
 *   This design has three properties the spec required:
 *     - It validates actual per-agent core-memory recall (round-trip).
 *     - It writes NOTHING into memory. The user controls opt-in.
 *     - It NEVER logs memory file content. Only "probe present: yes/no",
 *       fixture id, agent slug, pass/fail/skip, and the marker LABEL.
 *
 * What this harness CHECKS (for non-skipped fixtures):
 *   - meta.agentSlug matches expected
 *   - meta.agentName matches expected
 *   - meta.provider === "claude"
 *   - meta.degraded === false
 *   - done.ok === true
 *   - streamed text contains every `requiredHeaderIncludes` substring
 *   - streamed text contains NO `forbiddenIncludes` substring
 *   - streamed text contains `expected.responseIncludes` (the probe marker)
 *
 * What this harness EXPLICITLY DOES NOT DO:
 *   - It does not write to core_memory.md, episodic_memory.jsonl, or any
 *     other memory artifact.
 *   - It does not log file contents.
 *   - It does not log full streamed responses (only the probe match boolean).
 *   - It does not attempt to discover real user facts.
 *
 * Usage:
 *   node scripts/run-agent-core-memory-smoke.mjs
 *
 * Env vars:
 *   CREATIVEDGE_API_URL          base URL (default http://127.0.0.1:3001)
 *   CREATIVEDGE_TURN_TIMEOUT_MS  per-fixture timeout (default 180000)
 *   CREATIVEDGE_ONLY=id1,id2     run only these fixture ids
 *   CREATIVEDGE_AGENT=<slug>     run only fixtures whose `agent` or
 *                                `expected.agentSlug` equals this slug
 *   CREATIVEDGE_VERBOSE=1        print per-event SSE debug
 *
 * Exit codes:
 *   0  no failures (PASS + SKIP only)
 *   1  one or more fixtures FAIL
 *   2  runner-level error (couldn't read fixture file, couldn't reach backend, etc.)
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(HERE, "..", "tests", "agent-core-memory-fixtures.json");
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
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", cyan: "\x1b[36m", reset: "\x1b[0m", dim: "\x1b[2m" }
  : { red: "", green: "", yellow: "", cyan: "", reset: "", dim: "" };

function colorize(s, c) {
  return (COLOR[c] || "") + s + (COLOR.reset || "");
}

function coreMemoryPathForSlug(slug) {
  return join(homedir(), ".creativedge", "agents", slug, "memory", "core_memory.md");
}

// ---------------------------------------------------------------------------
// SSE parser (mirrors run-agent-behavior-smoke.mjs)
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
            const previewSrc =
              typeof evt.data === "string" ? evt.data : JSON.stringify(evt.data);
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
// Probe-marker detection
// ---------------------------------------------------------------------------

/**
 * Reads the agent's core_memory.md and checks for the probe marker. Returns
 * { present: boolean, path: string, exists: boolean }. Never returns or logs
 * memory file content.
 */
async function probeMarkerStatus(slug, marker) {
  const path = coreMemoryPathForSlug(slug);
  let raw;
  try {
    raw = await readFile(path, "utf-8");
  } catch (err) {
    if (err && err.code === "ENOENT") {
      return { present: false, path, exists: false };
    }
    throw new Error("failed to read core_memory.md at " + path + ": " + (err?.message || err));
  }
  const present = typeof raw === "string" && raw.includes(marker);
  return { present, path, exists: true };
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
  // Probe-marker recall check. This is the Phase 4.5-A signal: did the agent
  // actually surface the marker that exists in its core_memory.md? Note: we
  // already verified the marker is present in the file before posting, so a
  // miss here is a genuine recall failure (the agent did not look at /
  // could not reference its core memory).
  const need = typeof exp.responseIncludes === "string" ? exp.responseIncludes : "";
  if (need && !streamedText.includes(need)) {
    return {
      pass: false,
      headerOk: true,
      leakageOk: true,
      probeOk: false,
      reason:
        `streamed text did not include probe marker (label only: agent="${exp.agentSlug}", marker label="${exp.responseIncludes}") — ` +
        `agent appears to have ignored its core_memory.md`,
      observed,
    };
  }
  return { pass: true, headerOk: true, leakageOk: true, probeOk: true, reason: "ok", observed };
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
  console.log("CreativEdge per-agent core-memory smoke runner (Phase 4.5-A)");
  console.log("=".repeat(78));
  console.log(`backend:   ${BASE_URL}`);
  console.log(`fixtures:  ${fixtures.length}`);
  const agents = new Set(fixtures.map((f) => f.expected?.agentSlug ?? f.agent));
  console.log(`agents:    ${agents.size} unique slugs`);
  console.log(
    colorize(
      "note: fixtures whose core_memory.md does not contain the probe marker will SKIP.",
      "dim"
    )
  );
  console.log(
    colorize(
      "      append the per-agent marker (e.g. `[ce-test:lumi]`) to opt-in to that agent's test.",
      "dim"
    )
  );
  console.log("");

  try {
    const r = await fetch(BASE_URL + "/healthz");
    if (!r.ok) throw new Error("HTTP " + r.status);
  } catch (err) {
    console.error(
      colorize(`cannot reach backend at ${BASE_URL}/healthz: ${err?.message || err}`, "red")
    );
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
    ["agent", 22],
    ["probe", 8],
    ["header", 8],
    ["recall", 8],
    ["result", 10],
  ];
  const headerLine = cols.map(([h, w]) => h.padEnd(w)).join(" ");
  console.log(headerLine);
  console.log("-".repeat(headerLine.length));

  let pass = 0;
  let skip = 0;
  let fail = 0;
  const failures = [];
  const skipped = [];

  for (const f of toRun) {
    const slug = f.expected?.agentSlug ?? f.agent ?? "-";
    const marker = typeof f.coreMemoryProbe === "string" ? f.coreMemoryProbe : "";

    // Phase 4.5-A safety: never log file contents. We only ever read to test
    // for marker presence; the boolean result and the path go to the log.
    let probe;
    try {
      probe = await probeMarkerStatus(slug, marker);
    } catch (err) {
      const row = [
        (f.id || "-").slice(0, 22).padEnd(22),
        slug.slice(0, 22).padEnd(22),
        "ERR".padEnd(8),
        "-".padEnd(8),
        "-".padEnd(8),
        colorize("FAIL", "red"),
      ].join(" ");
      console.log(row);
      console.log(colorize(`    reason: ${err?.message || err}`, "red"));
      failures.push({ id: f.id, reason: err?.message || String(err) });
      fail++;
      continue;
    }

    if (!marker) {
      const reason = `fixture missing "coreMemoryProbe"`;
      const row = [
        (f.id || "-").slice(0, 22).padEnd(22),
        slug.slice(0, 22).padEnd(22),
        "MISS".padEnd(8),
        "-".padEnd(8),
        "-".padEnd(8),
        colorize("FAIL", "red"),
      ].join(" ");
      console.log(row);
      console.log(colorize(`    reason: ${reason}`, "red"));
      failures.push({ id: f.id, reason });
      fail++;
      continue;
    }

    if (!probe.present) {
      const reasonShort = probe.exists
        ? `core_memory.md does not contain probe marker '${marker}'`
        : `core_memory.md not found at expected path`;
      const reasonLong =
        reasonShort +
        `; to enable this test, append the marker to '${probe.path}'`;
      const row = [
        (f.id || "-").slice(0, 22).padEnd(22),
        slug.slice(0, 22).padEnd(22),
        "NO".padEnd(8),
        "-".padEnd(8),
        "-".padEnd(8),
        colorize("SKIP", "yellow"),
      ].join(" ");
      console.log(row);
      console.log(colorize(`    skip: ${reasonLong}`, "dim"));
      skipped.push({ id: f.id, slug, reason: reasonShort, path: probe.path });
      skip++;
      continue;
    }

    // Probe marker is present in core_memory.md — proceed to live /chat.
    let result;
    try {
      const { events, streamedText } = await runOneFixture(f.message);
      const { meta, done } = extract(events);
      result = evaluate(f, meta, done, streamedText);
    } catch (err) {
      result = {
        pass: false,
        reason: "runner error: " + (err?.message || String(err)),
        observed: {},
        failureKind: "runnerError",
      };
    }

    const headerCell = result.pass
      ? "OK"
      : result.headerOk === false
        ? "MISS"
        : result.headerOk === true
          ? "OK"
          : "-";
    const recallCell = result.pass
      ? "OK"
      : result.probeOk === false
        ? "MISS"
        : result.probeOk === true
          ? "OK"
          : "-";
    const tag = result.pass ? colorize("PASS", "green") : colorize("FAIL", "red");
    const row = [
      (f.id || "-").slice(0, 22).padEnd(22),
      slug.slice(0, 22).padEnd(22),
      "YES".padEnd(8),
      headerCell.padEnd(8),
      recallCell.padEnd(8),
      tag.padEnd(10),
    ].join(" ");
    console.log(row);

    if (!result.pass) {
      console.log(colorize(`    reason: ${result.reason}`, "red"));
      failures.push({ id: f.id, reason: result.reason });
      fail++;
    } else {
      pass++;
    }
  }

  console.log("-".repeat(headerLine.length));
  console.log(
    `total: ${toRun.length}   ` +
      `${colorize("PASS " + pass, pass > 0 ? "green" : "dim")}   ` +
      `${colorize("SKIP " + skip, skip > 0 ? "yellow" : "dim")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );

  if (skipped.length > 0) {
    console.log(colorize("\nskipped fixture ids (opt-in to enable):", "yellow"));
    for (const s of skipped) {
      console.log(
        colorize(
          `  - ${s.id}  agent=${s.slug}  marker='${s.reason.match(/'([^']+)'/)?.[1] || ""}'`,
          "yellow"
        )
      );
      console.log(colorize(`      file: ${s.path}`, "dim"));
    }
    console.log(
      colorize(
        "\n      append the marker to each file above to enable that agent's test.",
        "dim"
      )
    );
  }

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
