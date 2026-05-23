#!/usr/bin/env node
/**
 * Phase 8.3 memory integration runner.
 *
 * This runner exercises the **live HTTP wire contract** of the memory
 * mutation routes against a running local backend. It is the thin
 * integration-test layer on top of the already-validated Phase 5
 * primitives:
 *
 *   - §5.2-A user-confirmed promote (sensitive-content guard at /promote)
 *   - §5.2-B `withFileLock` + `safeAppendUnique` (lock + dedup)
 *   - §5.2-D `safeReplaceOnce` (lock-guarded match+replace; surgical delete
 *     when `replace === ""`)
 *   - §5.4-A `POST /agents/:slug/memory/forget`
 *
 * Phase 5's `test:memory-files` already pure-tests these helpers across
 * 50+ unit cases. This runner does NOT duplicate those tests. It only
 * verifies that the live `/promote` / `/forget` / `GET /memory` HTTP
 * round-trips behave as documented:
 *
 *   TEST 1 — write-read:
 *     POST /promote with a unique entry → 200 (not duplicate)
 *     GET /memory → core contains the unique entry
 *     Sub-assertion: re-POST /promote with the same entry → 200 duplicate:true
 *
 *   TEST 2 — concurrent-write-lock:
 *     Fire 5 distinct /promote requests in parallel
 *     Assert: every response is 200; none 500; none 503 lock_timeout
 *     GET /memory; assert all 5 anchors are present exactly once
 *
 *   TEST 3 — forget-core:
 *     Seed a unique entry via /promote
 *     POST /forget {kind:"core", find:<full entry>, confirmed:true} → 200 forgotten:true
 *     GET /memory; assert the unique anchor is gone
 *     Sub-assertion: POST /forget with kind:"floof" → 400
 *
 *   TEST 4 — sensitive-refusal:
 *     POST /promote with an entry containing a credit-card-shaped fragment → 422
 *     GET /memory; assert the credit-card fragment was NOT written
 *     Sub-assertion: POST /promote without confirmed:true → 400
 *
 * Cleanup: each test that wrote real entries finishes by /forget-ing the
 * anchors it created, so the runner stays a good citizen and can be
 * re-run repeatedly without polluting `~/.creativedge/agents/business/memory/core_memory.md`.
 * Cleanup failures emit a warning line but do not flip a passing test
 * to FAIL — the primary assertions already passed.
 *
 * Privacy:
 *   - Never prints full memory content.
 *   - Never prints the sensitive test string in full after submission;
 *     only a short redacted snippet shows up in log labels.
 *   - Only short anchor strings + status codes + sizes are emitted.
 *
 * The runner is dependency-light: Node 20+ built-in `fetch`, no API
 * keys, no Anthropic API, no `.env`. It does NOT issue any `/chat`
 * requests, so it does not need an authenticated Claude Code CLI to
 * pass — it talks only to the memory routes.
 *
 * Usage:
 *   node scripts/run-memory-integration-tests.mjs
 *
 * Env vars:
 *   CREATIVEDGE_API_URL          base URL (default http://127.0.0.1:3001)
 *   CREATIVEDGE_VERBOSE=1        print extra per-request debug
 *
 * Exit codes:
 *   0  every test PASS
 *   1  one or more tests FAIL
 *   2  runner-level error (couldn't reach backend, etc.)
 */

const BASE_URL = (process.env.CREATIVEDGE_API_URL || "http://127.0.0.1:3001").replace(
  /\/+$/,
  ""
);
const VERBOSE = process.env.CREATIVEDGE_VERBOSE === "1";

const AGENT_SLUG = "business";

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

function logVerbose(...args) {
  if (VERBOSE) console.error(colorize("  [debug] " + args.join(" "), "dim"));
}

/**
 * Build a per-test anchor that is guaranteed NOT to trip the backend's
 * sensitive-content guard.
 *
 * The §5.2-A guard at `backend-api/src/agents/agentRuntimeContext.ts:168`
 * uses the regex `/\b(?:\d[ \-]?){13,19}\b/` (13-19 consecutive digits) to
 * detect credit-card-shaped numbers. `Date.now()` produces a 13-digit
 * millisecond timestamp, which trips that regex when interpolated into an
 * anchor like `phase-8-3-write-read-1748438400000`. That false-positive
 * caused the first Windows live run to fail 3 of 4 tests with HTTP 422.
 *
 * We build anchors from `Date.now().toString(36)` (base36 ~8 chars,
 * lowercase letters + digits, max 4-5 contiguous decimal digits in the
 * worst case) plus a 4-char random base36 suffix for intra-millisecond
 * uniqueness. Result e.g. `phase-8-3-write-read-lvxq5d2-zb4q` — no 13+
 * digit run, no SSN shape (NNN-NN-NNNN), no API-key prefix, no PEM
 * marker, no bearer-token prefix.
 */
function makeAnchor(label) {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `phase-8-3-${label}-${ts}-${rand}`;
}

/**
 * Minimal typed `fetch` wrapper that always JSON-parses the body and
 * returns `{ status, body }`. Never logs request/response bodies (only
 * `status` and an optional label).
 */
async function http(method, path, body, label) {
  const url = BASE_URL + path;
  const init = {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    throw new Error(`fetch ${method} ${path} failed: ${err?.message || String(err)}`);
  }
  let parsed = null;
  try {
    parsed = await res.json();
  } catch {
    /* leave parsed = null for empty/non-JSON */
  }
  if (label) logVerbose(`${method} ${path} →`, String(res.status), `(${label})`);
  return { status: res.status, body: parsed };
}

// ---------------------------------------------------------------------------
// Per-test result harness
// ---------------------------------------------------------------------------

const results = []; // [{ id, pass, reason, durationMs }]

async function runTest(id, fn) {
  const startedAt = Date.now();
  try {
    await fn();
    results.push({ id, pass: true, reason: "ok", durationMs: Date.now() - startedAt });
  } catch (err) {
    const reason = err?.message || String(err);
    results.push({ id, pass: false, reason, durationMs: Date.now() - startedAt });
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function assertEq(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

/**
 * Count non-overlapping occurrences of `needle` in `haystack`. Used to
 * assert "exactly one" on concurrent-write content and "zero" on forget
 * + sensitive assertions.
 */
function countOccurrences(haystack, needle) {
  if (typeof haystack !== "string" || typeof needle !== "string" || needle.length === 0) {
    return 0;
  }
  let count = 0;
  let idx = 0;
  while (true) {
    const f = haystack.indexOf(needle, idx);
    if (f === -1) break;
    count++;
    idx = f + needle.length;
  }
  return count;
}

async function getCoreMemory() {
  const r = await http("GET", `/agents/${AGENT_SLUG}/memory`, undefined, "GET memory");
  assertEq(r.status, 200, "GET /memory status");
  assert(r.body && typeof r.body.core === "string", "GET /memory body.core must be a string");
  return r.body.core;
}

async function bestEffortForget(find, label) {
  try {
    const r = await http(
      "POST",
      `/agents/${AGENT_SLUG}/memory/forget`,
      { kind: "core", find, confirmed: true },
      `cleanup forget ${label}`
    );
    if (r.status !== 200) {
      console.error(
        colorize(
          `    warn: cleanup forget for ${label} returned status ${r.status} (memory may carry the test anchor)`,
          "yellow"
        )
      );
    }
  } catch (err) {
    console.error(
      colorize(`    warn: cleanup forget for ${label} crashed: ${err?.message || err}`, "yellow")
    );
  }
}

// ---------------------------------------------------------------------------
// TEST 1 — write-read
// ---------------------------------------------------------------------------

async function testWriteRead() {
  const anchor = makeAnchor("write-read");
  const entry = `Phase 8.3 write-read integration test anchor: ${anchor}.`;

  // Promote.
  const r1 = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/promote`,
    { entry, confirmed: true },
    `promote ${anchor}`
  );
  assertEq(r1.status, 200, "TEST1 promote status");
  assertEq(r1.body?.ok, true, "TEST1 promote body.ok");
  assert(
    r1.body?.duplicate !== true,
    "TEST1 promote: expected fresh write, got duplicate:true (rerun without clearing prior memory?)"
  );

  // Read.
  let core = await getCoreMemory();
  assert(core.includes(anchor), `TEST1 GET /memory: anchor ${anchor} not present after promote`);

  // Sub-assertion: dedup. Re-promote the same entry.
  const r2 = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/promote`,
    { entry, confirmed: true },
    `re-promote ${anchor} (expect duplicate)`
  );
  assertEq(r2.status, 200, "TEST1 re-promote status");
  assertEq(r2.body?.duplicate, true, "TEST1 re-promote body.duplicate");

  // Confirm dedup did NOT grow the file with a second copy.
  core = await getCoreMemory();
  const count = countOccurrences(core, anchor);
  assertEq(count, 1, `TEST1 dedup: anchor count after re-promote (expected exactly 1)`);

  // Cleanup.
  await bestEffortForget(entry, anchor);
}

// ---------------------------------------------------------------------------
// TEST 2 — concurrent-write-lock
// ---------------------------------------------------------------------------

async function testConcurrentWriteLock() {
  // Each anchor gets its own base36 timestamp + random suffix from
  // `makeAnchor`, so the 5 anchors are pairwise unique within the same
  // millisecond AND none of them contains a 13+ digit decimal run that
  // would trip the §5.2-A sensitive-content guard.
  const anchors = Array.from({ length: 5 }, (_, i) =>
    makeAnchor(`concurrent-${i}`)
  );
  const entries = anchors.map(
    (a, i) => `Phase 8.3 concurrent write integration test anchor #${i}: ${a}.`
  );

  // Fire all 5 promotes in parallel. Use Promise.allSettled so a single
  // failure surfaces in the per-response status check rather than killing
  // the whole batch.
  const settled = await Promise.allSettled(
    entries.map((entry, i) =>
      http(
        "POST",
        `/agents/${AGENT_SLUG}/memory/promote`,
        { entry, confirmed: true },
        `concurrent promote #${i}`
      )
    )
  );

  // No fulfillment may carry a 500 or 503; the §5.2-B lock helper should
  // serialise the 5 writers without exhausting the lock timeout under
  // modest concurrency.
  for (let i = 0; i < settled.length; i++) {
    const s = settled[i];
    if (s.status !== "fulfilled") {
      throw new Error(`TEST2 promote #${i} rejected: ${s.reason?.message || s.reason}`);
    }
    const r = s.value;
    if (r.status === 500) {
      throw new Error(`TEST2 promote #${i} returned 500 (server error)`);
    }
    if (r.status === 503) {
      throw new Error(`TEST2 promote #${i} returned 503 lock_timeout (lock pressure exceeded)`);
    }
    assertEq(r.status, 200, `TEST2 promote #${i} status`);
    assertEq(r.body?.ok, true, `TEST2 promote #${i} body.ok`);
    assert(
      r.body?.duplicate !== true,
      `TEST2 promote #${i}: distinct entries should not collide on dedup`
    );
  }

  // Read once and assert each anchor appears exactly once.
  const core = await getCoreMemory();
  for (let i = 0; i < anchors.length; i++) {
    const c = countOccurrences(core, anchors[i]);
    assertEq(c, 1, `TEST2 anchor #${i} count (${anchors[i]}) after concurrent writes`);
  }

  // Cleanup.
  for (let i = 0; i < anchors.length; i++) {
    await bestEffortForget(entries[i], `concurrent-${i}`);
  }
}

// ---------------------------------------------------------------------------
// TEST 3 — forget-core
// ---------------------------------------------------------------------------

async function testForgetCore() {
  const anchor = makeAnchor("forget");
  const entry = `Phase 8.3 forget integration test anchor: ${anchor}.`;

  // Seed.
  const seed = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/promote`,
    { entry, confirmed: true },
    `seed ${anchor}`
  );
  assertEq(seed.status, 200, "TEST3 seed promote status");
  assertEq(seed.body?.ok, true, "TEST3 seed promote body.ok");
  assert(seed.body?.duplicate !== true, "TEST3 seed promote: unexpected duplicate");

  // Confirm seed is visible.
  let core = await getCoreMemory();
  assert(core.includes(anchor), `TEST3 GET /memory: anchor ${anchor} not present after seed`);

  // Sub-assertion: invalid forget kind → 400 (BEFORE the successful forget,
  // so the test entry is still in place when this returns 400).
  const badKind = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/forget`,
    { kind: "floof", find: entry, confirmed: true },
    `forget bad kind (expect 400)`
  );
  assertEq(badKind.status, 400, "TEST3 forget invalid kind status");

  // Real forget — use the full entry as find so the entire promoted line
  // is the unique match target.
  const r = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/forget`,
    { kind: "core", find: entry, confirmed: true },
    `forget ${anchor}`
  );
  assertEq(r.status, 200, "TEST3 forget status");
  assertEq(r.body?.ok, true, "TEST3 forget body.ok");
  assertEq(r.body?.kind, "core", "TEST3 forget body.kind");
  assertEq(r.body?.forgotten, true, "TEST3 forget body.forgotten");

  // Read again; assert the anchor is gone.
  core = await getCoreMemory();
  const remaining = countOccurrences(core, anchor);
  assertEq(remaining, 0, `TEST3 GET /memory after forget: anchor count (expected 0)`);

  // No cleanup needed: forget already removed the seeded entry.
}

// ---------------------------------------------------------------------------
// TEST 4 — sensitive-refusal
// ---------------------------------------------------------------------------

async function testSensitiveRefusal() {
  // The anchor itself is base36 + random (no 13-19 digit run), so the
  // 422 comes purely from the intentional credit-card fragment below.
  // Before the 2026-05-20 patch, this test "passed" coincidentally
  // because Date.now() also tripped the guard — right answer for the
  // wrong reason. With the patched anchor, this test now exercises the
  // CC-detector specifically.
  const anchor = makeAnchor("sensitive");
  // The credit-card-shaped fragment 4111-1111-1111-1111 is the classic
  // Luhn-valid test card pattern used by §5.2-A's sensitive-content guard
  // fixtures. The full string is built here at runtime; it is NEVER
  // emitted to the runner log after submission (anchor labels only).
  const ccFragment = "4111 1111 1111 1111";
  const entry = `Phase 8.3 sensitive test anchor ${anchor}: My card is ${ccFragment}.`;

  // Sub-assertion: unconfirmed promote → 400 (BEFORE the sensitive attempt,
  // so we exercise the confirmed-gate cleanly).
  const noConfirm = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/promote`,
    { entry: "Phase 8.3 unconfirmed sentinel that should never persist" },
    `promote unconfirmed (expect 400)`
  );
  assertEq(noConfirm.status, 400, "TEST4 unconfirmed promote status");

  // The actual sensitive-refusal probe.
  const r = await http(
    "POST",
    `/agents/${AGENT_SLUG}/memory/promote`,
    { entry, confirmed: true },
    `promote sensitive (expect 422)`
  );
  assertEq(r.status, 422, "TEST4 sensitive promote status");
  // The 422 body should NOT echo the sensitive category back as a
  // sensitivity oracle (per §5.2-A privacy contract). We only assert the
  // status; we do not inspect body for content.

  // Read and assert NEITHER the CC fragment NOR the anchor is present.
  const core = await getCoreMemory();
  assert(
    !core.includes(ccFragment),
    "TEST4 GET /memory: credit-card fragment leaked into core memory despite 422"
  );
  assert(
    !core.includes(anchor),
    "TEST4 GET /memory: sensitive-test anchor leaked into core memory despite 422"
  );

  // Also verify the unconfirmed sentinel did not somehow land either.
  assert(
    !core.includes("Phase 8.3 unconfirmed sentinel that should never persist"),
    "TEST4 GET /memory: unconfirmed sentinel leaked into core memory despite 400"
  );

  // No cleanup needed: nothing was written.
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function printHeader() {
  console.log("=".repeat(78));
  console.log("CreativEdge memory integration runner (Phase 8.3)");
  console.log("=".repeat(78));
  console.log(`backend: ${BASE_URL}`);
  console.log(`agent:   ${AGENT_SLUG}`);
  console.log("");
}

function printTable() {
  const idWidth = 28;
  const resultWidth = 10;
  console.log(`${"id".padEnd(idWidth)} ${"result".padEnd(resultWidth)} ms`);
  console.log("-".repeat(idWidth + 1 + resultWidth + 1 + 6));
  for (const r of results) {
    const tag = r.pass ? colorize("PASS", "green") : colorize("FAIL", "red");
    console.log(
      `${r.id.padEnd(idWidth)} ${tag.padEnd(resultWidth + (tag.length - 4))} ${String(r.durationMs).padStart(5)}`
    );
    if (!r.pass) {
      console.log(colorize(`    reason: ${r.reason}`, "red"));
    }
  }
  console.log("-".repeat(idWidth + 1 + resultWidth + 1 + 6));
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  console.log(
    `total: ${results.length}   ` +
      `${colorize("PASS " + pass, "green")}   ` +
      `${colorize("FAIL " + fail, fail > 0 ? "red" : "dim")}`
  );
}

async function main() {
  printHeader();

  // Healthz probe — exit 2 if the backend isn't reachable, matching the
  // existing runners' convention.
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

  // Confirm the test agent exists (defends against a misconfigured registry).
  try {
    const r = await fetch(BASE_URL + `/agents/${AGENT_SLUG}`);
    if (!r.ok) throw new Error(`HTTP ${r.status} on /agents/${AGENT_SLUG}`);
  } catch (err) {
    console.error(
      colorize(
        `cannot find test agent "${AGENT_SLUG}" via /agents/${AGENT_SLUG}: ${err?.message || err}`,
        "red"
      )
    );
    process.exit(2);
  }

  await runTest("write-read", testWriteRead);
  await runTest("concurrent-write-lock", testConcurrentWriteLock);
  await runTest("forget-core", testForgetCore);
  await runTest("sensitive-refusal", testSensitiveRefusal);

  printTable();

  const anyFail = results.some((r) => !r.pass);
  process.exit(anyFail ? 1 : 0);
}

main().catch((err) => {
  console.error("runner crashed:", err?.stack || err);
  process.exit(2);
});
