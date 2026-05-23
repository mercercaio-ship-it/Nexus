// CreativEdge Phase 9-D-A — read-only ops/diagnostics + cost-summary routes.
//
// Two endpoints, both GET, both content-free:
//
//   GET /ops/usage/summary
//       Aggregates `agent_events.usage_json` into a compact, content-free
//       cost/usage summary. Drives the frontend OpsConsole cost dashboard.
//
//   GET /ops/diagnostics
//       Returns a sanitized snapshot of the local runtime — directory paths,
//       provider readiness echo (from the same provider registry /healthz
//       uses), DB ready bool, latest crash log location IF present in
//       `~/.creativedge/logs/`. No env vars, no chat content, no memory
//       contents, no secrets.
//
// Privacy contract (mirrors Phase 5.6-A backup routes):
//   - We NEVER read message bodies, prompts, memory files, or env vars.
//   - usage_json is JSON written by chat.ts; we parse it defensively and
//     extract a small numeric allowlist (provider, tokens, cost). If a row
//     can't be parsed, it's counted under `eventsWithMalformedUsage` and
//     skipped. No raw row contents are returned.
//   - The crash log directory is scanned by filename pattern only
//     (`crash-*.log` + `electron-backend-*.log`). File contents are NOT
//     read; only the filename, size, and mtime are returned so the user
//     can locate the file in their own file explorer.

import { readFile, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

import type { FastifyInstance } from "fastify";

// ---------------------------------------------------------------------------
// Shape of the small numeric allowlist we pull out of usage_json.
// ---------------------------------------------------------------------------

interface UsageRow {
  provider: string | null;
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  totalCostUsd: number;
  numTurns: number;
  isError: boolean;
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function bool(v: unknown): boolean {
  return v === true;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function parseUsage(raw: unknown): UsageRow | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  return {
    provider: str(o.provider),
    inputTokens: num(o.input_tokens),
    outputTokens: num(o.output_tokens),
    cacheCreationInputTokens: num(o.cache_creation_input_tokens),
    cacheReadInputTokens: num(o.cache_read_input_tokens),
    totalCostUsd: num(o.total_cost_usd),
    numTurns: num(o.num_turns),
    isError: bool(o.is_error),
  };
}

// ---------------------------------------------------------------------------
// Row shape from `agent_events`. Only the columns we aggregate; we
// intentionally do NOT pull request_id, session_id, or anything that
// could be cross-correlated with chat content downstream.
// ---------------------------------------------------------------------------

interface EventAggRow {
  agent_slug: string | null;
  provider: string | null;
  fallback_used: number; // 0/1
  latency_ms: number | null;
  status: string | null;
  usage_json: string | null;
  created_at: string;
}

interface Bucket {
  events: number;
  eventsWithUsage: number;
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  totalCostUsd: number;
  errors: number;
  fallbacks: number;
}

function emptyBucket(): Bucket {
  return {
    events: 0,
    eventsWithUsage: 0,
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationInputTokens: 0,
    cacheReadInputTokens: 0,
    totalCostUsd: 0,
    errors: 0,
    fallbacks: 0,
  };
}

function applyToBucket(b: Bucket, ev: EventAggRow, u: UsageRow | null) {
  b.events += 1;
  if (ev.fallback_used === 1) b.fallbacks += 1;
  if (u) {
    b.eventsWithUsage += 1;
    b.inputTokens += u.inputTokens;
    b.outputTokens += u.outputTokens;
    b.cacheCreationInputTokens += u.cacheCreationInputTokens;
    b.cacheReadInputTokens += u.cacheReadInputTokens;
    b.totalCostUsd += u.totalCostUsd;
    if (u.isError) b.errors += 1;
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export async function opsRoutes(fastify: FastifyInstance): Promise<void> {
  // -----------------------------------------------------------------
  // GET /ops/usage/summary
  // -----------------------------------------------------------------
  fastify.get("/ops/usage/summary", async (_req, reply) => {
    const rows = fastify.db
      .prepare(
        `SELECT agent_slug, provider, fallback_used, latency_ms, status, usage_json, created_at
         FROM agent_events
         ORDER BY created_at DESC
         LIMIT 10000`
      )
      .all() as EventAggRow[];

    const overall = emptyBucket();
    const byProvider = new Map<string, Bucket>();
    const byAgentSlug = new Map<string, Bucket>();
    const last24h = emptyBucket();
    const last7d = emptyBucket();
    let eventsWithMalformedUsage = 0;

    const now = Date.now();
    const ms24h = 24 * 60 * 60 * 1000;
    const ms7d = 7 * ms24h;

    let earliest: string | null = null;
    let latest: string | null = null;

    for (const ev of rows) {
      const u = parseUsage(ev.usage_json);
      if (ev.usage_json !== null && u === null) eventsWithMalformedUsage += 1;

      applyToBucket(overall, ev, u);

      const provKey = ev.provider ?? "(unknown)";
      const provBucket = byProvider.get(provKey) ?? emptyBucket();
      applyToBucket(provBucket, ev, u);
      byProvider.set(provKey, provBucket);

      const agentKey = ev.agent_slug ?? "(unknown)";
      const agentBucket = byAgentSlug.get(agentKey) ?? emptyBucket();
      applyToBucket(agentBucket, ev, u);
      byAgentSlug.set(agentKey, agentBucket);

      const ts = Date.parse(ev.created_at);
      if (Number.isFinite(ts)) {
        if (now - ts <= ms24h) applyToBucket(last24h, ev, u);
        if (now - ts <= ms7d) applyToBucket(last7d, ev, u);
      }

      if (!earliest || ev.created_at < earliest) earliest = ev.created_at;
      if (!latest || ev.created_at > latest) latest = ev.created_at;
    }

    return reply.code(200).send({
      ok: true,
      generatedAt: new Date().toISOString(),
      windowRowsConsidered: rows.length,
      earliestEventAt: earliest,
      latestEventAt: latest,
      eventsWithMalformedUsage,
      overall,
      last24h,
      last7d,
      byProvider: Object.fromEntries(byProvider),
      byAgentSlug: Object.fromEntries(byAgentSlug),
      currency: "USD",
      notes: [
        "Costs reflect what the Claude CLI reported via the result event's total_cost_usd field; mock provider rows contribute zero cost.",
        "Token counts come from the same usage block; rows whose usage_json is null or malformed are still counted in 'events' but contribute zero tokens/cost.",
        "Aggregation window is capped at the 10,000 most-recent events to keep this endpoint cheap; older history lives in SQLite untouched.",
      ],
    });
  });

  // -----------------------------------------------------------------
  // GET /ops/usage/timeseries  (Phase 9-D-C1)
  // -----------------------------------------------------------------
  //
  // Returns per-day aggregated usage buckets for a bounded range, plus
  // a month-to-date and a today (UTC) bucket, so the Ops Console's
  // "Budget & trends" card can render an inline SVG bar chart + show
  // budget alert state without needing additional history.
  //
  // Privacy / safety contract (mirrors the existing /ops/usage/summary
  // route):
  //   - Never reads message bodies, prompts, memory files, env vars.
  //   - Only extracts a small numeric allowlist from usage_json
  //     (provider, tokens, cost) via the same parseUsage() helper.
  //   - Rows with malformed usage_json are counted under
  //     `eventsWithMalformedUsage` but contribute zero numeric data.
  //   - The aggregation window is capped at the 10,000 most-recent
  //     events (same cap as the summary route) so the endpoint stays
  //     cheap on large agent_events tables.
  //   - The day-range query parameter is clamped to [1, 90].
  //
  // Day boundary: UTC midnight. Buckets are keyed by `YYYY-MM-DD`
  // (ISO 8601 date). The "today" bucket is the UTC-current-day
  // bucket; the "monthToDate" bucket sums every event since UTC
  // 00:00 on the 1st of the current month. The frontend formats
  // these for display in the user's local timezone.
  fastify.get<{ Querystring: { days?: string } }>(
    "/ops/usage/timeseries",
    async (req, reply) => {
      // Parse + clamp the `days` query string. Default 30; cap 90.
      let requestedDays = 30;
      if (typeof req.query?.days === "string" && req.query.days.length > 0) {
        const parsed = Number.parseInt(req.query.days, 10);
        if (Number.isFinite(parsed)) {
          requestedDays = parsed;
        }
      }
      if (!Number.isFinite(requestedDays) || requestedDays < 1) requestedDays = 1;
      if (requestedDays > 90) requestedDays = 90;

      const rows = fastify.db
        .prepare(
          `SELECT agent_slug, provider, fallback_used, latency_ms, status, usage_json, created_at
           FROM agent_events
           ORDER BY created_at DESC
           LIMIT 10000`
        )
        .all() as EventAggRow[];

      // UTC day-key helper. `YYYY-MM-DD` from an ISO timestamp without
      // pulling in a date library; tolerates missing/invalid stamps.
      function utcDayKey(iso: string): string | null {
        const ts = Date.parse(iso);
        if (!Number.isFinite(ts)) return null;
        const d = new Date(ts);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }

      // Build the expected day window — every day for the past N days,
      // including today, in chronological order. This guarantees the
      // chart axis is contiguous even on days with zero events.
      const today = new Date();
      const todayKey = (() => {
        const y = today.getUTCFullYear();
        const m = String(today.getUTCMonth() + 1).padStart(2, "0");
        const d = String(today.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      })();
      const monthStart = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
      );

      const dayKeys: string[] = [];
      for (let i = requestedDays - 1; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        dayKeys.push(`${y}-${m}-${day}`);
      }
      const earliestDayKey = dayKeys[0] ?? todayKey;

      // Initialise every day in the window with an empty bucket so the
      // returned series is dense (no gaps).
      const dayMap = new Map<string, Bucket>();
      for (const k of dayKeys) dayMap.set(k, emptyBucket());

      const monthToDate = emptyBucket();
      const todayBucket = emptyBucket();
      let eventsWithMalformedUsage = 0;
      let eventsConsidered = 0;

      for (const ev of rows) {
        const u = parseUsage(ev.usage_json);
        if (ev.usage_json !== null && u === null) eventsWithMalformedUsage += 1;

        const key = utcDayKey(ev.created_at);
        if (key === null) continue;
        eventsConsidered += 1;

        // Day window: only buckets within the requested range.
        if (key >= earliestDayKey) {
          const dayBucket = dayMap.get(key);
          if (dayBucket) applyToBucket(dayBucket, ev, u);
        }

        // Month-to-date: any event since UTC midnight on the 1st of
        // the current month.
        const ts = Date.parse(ev.created_at);
        if (Number.isFinite(ts) && ts >= monthStart.getTime()) {
          applyToBucket(monthToDate, ev, u);
        }

        // Today bucket: events whose UTC day matches today.
        if (key === todayKey) {
          applyToBucket(todayBucket, ev, u);
        }
      }

      // Emit the time series as an ordered array of { dayKey, bucket }
      // so the frontend can render bars left-to-right without sorting.
      const days = dayKeys.map((k) => ({
        dayKey: k,
        ...dayMap.get(k)!,
      }));

      return reply.code(200).send({
        ok: true,
        generatedAt: new Date().toISOString(),
        requestedDays,
        windowRowsConsidered: rows.length,
        eventsConsidered,
        eventsWithMalformedUsage,
        todayKey,
        monthStartKey: (() => {
          const y = monthStart.getUTCFullYear();
          const m = String(monthStart.getUTCMonth() + 1).padStart(2, "0");
          return `${y}-${m}-01`;
        })(),
        today: todayBucket,
        monthToDate,
        days,
        currency: "USD",
        notes: [
          "Day boundaries are UTC midnight. The frontend formats dayKey strings for display in the user's local timezone.",
          "Costs come from the Claude CLI's total_cost_usd field; mock-provider rows contribute zero cost.",
          "Rows with malformed usage_json are still counted in eventsConsidered but contribute zero tokens/cost.",
          "Range is clamped to [1, 90] days; the source query is capped at the 10,000 most-recent events to keep this endpoint cheap.",
        ],
      });
    }
  );

  // -----------------------------------------------------------------
  // GET /ops/diagnostics
  // -----------------------------------------------------------------
  fastify.get("/ops/diagnostics", async (_req, reply) => {
    const runtime = fastify.runtime;
    const providers = fastify.providers;

    // Provider readiness — same shape /healthz uses; we DO NOT call
    // checkReady() here to avoid spawning the Claude CLI on every
    // dashboard load. The cached readiness in the registry is fine for
    // an at-a-glance diagnostics surface.
    const claudeReadiness = providers.readiness.claude ?? null;
    const mockReadiness = providers.readiness.mock ?? null;

    // Scan ~/.creativedge/logs/ for the most recent crash-*.log + the
    // most recent electron-backend-*.log. We deliberately do NOT read
    // file contents here; only filename + size + mtime are returned.
    const logsDir = join(homedir(), ".creativedge", "logs");
    let crashLogs: Array<{ name: string; path: string; size: number; mtime: string }> = [];
    let backendLogs: Array<{ name: string; path: string; size: number; mtime: string }> = [];
    let logsScanError: string | null = null;
    try {
      const names = await readdir(logsDir);
      const probe = async (
        pattern: RegExp,
        names: string[]
      ): Promise<Array<{ name: string; path: string; size: number; mtime: string }>> => {
        const matched = names.filter((n) => pattern.test(n));
        const records = await Promise.all(
          matched.map(async (n) => {
            const p = join(logsDir, n);
            try {
              const st = await stat(p);
              return {
                name: n,
                path: p,
                size: st.size,
                mtime: st.mtime.toISOString(),
              };
            } catch {
              return null;
            }
          })
        );
        return (records.filter(Boolean) as Array<{
          name: string;
          path: string;
          size: number;
          mtime: string;
        }>)
          .sort((a, b) => (a.mtime < b.mtime ? 1 : -1))
          .slice(0, 5);
      };
      crashLogs = await probe(/^crash-.*\.log$/i, names);
      backendLogs = await probe(/^electron-backend-.*\.log$/i, names);
    } catch (err) {
      logsScanError = err instanceof Error ? err.message : String(err);
    }

    return reply.code(200).send({
      ok: true,
      generatedAt: new Date().toISOString(),
      service: "creativedge-backend",
      version: "0.2.0",
      runtimeDir: runtime.rootDir,
      logsDir,
      logsScanError,
      seededAgentSlugs: runtime.seededAgentSlugs,
      providers: {
        primary: providers.primaryName,
        claude: claudeReadiness,
        mock: mockReadiness,
      },
      latestCrashLog: crashLogs[0] ?? null,
      crashLogs,
      latestBackendLog: backendLogs[0] ?? null,
      backendLogs,
      autoUpdate: {
        enabled: false,
        reason:
          "Auto-update is intentionally deferred to Phase 9-D-B pending release-feed + signing policy. Use the Update info section of the Ops console for the manual flow.",
      },
    });
  });

  // -----------------------------------------------------------------
  // Phase 9-D-C2 - crash-report prepare/export routes
  // -----------------------------------------------------------------
  //
  // Local-only crash-report prepare/export workflow. The Electron main
  // process (Phase 9-D-A `writeCrashLog()`) already writes a structured
  // JSON record to `~/.creativedge/logs/crash-<ts>.log` on unexpected
  // backend exit; these two read-only routes expose that file to the
  // Ops Console so the user can review + copy + download it.
  //
  //   GET /ops/crash-reports
  //       Lists newest-first crash records found in
  //       `~/.creativedge/logs/` matching `crash-*.log`. Filename,
  //       size, mtime, and path only - file contents are NOT read at
  //       listing time.
  //
  //   GET /ops/crash-reports/:id/prepare
  //       Reads the named crash file, JSON-parses it, applies a strict
  //       allow-list of safe diagnostic fields, and returns the prepared
  //       report shape. The endpoint NEVER returns the free-text
  //       `backendLogTail` field - until a tested redaction sanitizer
  //       lands the tail is intentionally omitted (the user can still
  //       inspect the on-disk file directly via `backendLogPath`). Any
  //       unknown / unexpected fields in the source file are dropped
  //       and listed under `droppedFields[]` for transparency.
  //
  // Privacy / safety contract (verbatim from the 9-D-C2 brief):
  //   - Reads ONLY from the user's local logs directory; strict
  //     filename validation; rejects path traversal (`..`) and any
  //     filename that doesn't match the `crash-*.log` pattern.
  //   - Never deletes / modifies / uploads / emails / sends a log.
  //   - Never reads chat content, message bodies, prompts, memory
  //     files, env vars, `.env` files, DB rows, SQLite handles, or
  //     any file outside the logs directory.
  //   - Bounded by file size: per-file read is capped at
  //     `CRASH_REPORT_MAX_BYTES` (256 KB). Larger files return a
  //     friendly error rather than streaming arbitrary bytes.
  //   - Bounded by list size: list response caps at 25 newest
  //     records.
  //
  // Both routes are GET / read-only / idempotent / side-effect-free.
  // There is intentionally no POST/DELETE/PATCH; nothing in this slice
  // can modify or remove a crash log.

  const LOGS_DIR_ABS = resolve(join(homedir(), ".creativedge", "logs"));
  const CRASH_FILENAME_RE = /^crash-[A-Za-z0-9._:T+\-]+\.log$/;
  const CRASH_REPORT_MAX_BYTES = 256 * 1024; // 256 KB hard cap per file
  const CRASH_REPORT_MAX_ROWS = 25;

  // Allow-listed diagnostic fields preserved from the on-disk crash
  // JSON. Anything not in this list is dropped and surfaced under
  // `droppedFields[]`. `backendLogTail` is intentionally absent - see
  // privacy contract above.
  const CRASH_FIELD_ALLOWLIST = new Set<string>([
    "kind",
    "schemaVersion",
    "timestamp",
    "appVersion",
    "electronVersion",
    "nodeVersion",
    "packaged",
    "platform",
    "arch",
    "osRelease",
    "backendEntry",
    "frontendDist",
    "backendPort",
    "frontendPort",
    "backendChildPid",
    "exit",
    "backendLogPath",
  ]);

  // `exit` is an object; the sub-allow-list keeps only the three known
  // sub-fields and drops anything else (defensive against schema drift).
  const EXIT_FIELD_ALLOWLIST = new Set<string>(["code", "signal", "expected"]);

  function pickAllowlistedExit(raw: unknown): {
    code: number | null;
    signal: string | null;
    expected: boolean;
  } | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    return {
      code:
        typeof o.code === "number" && Number.isFinite(o.code) ? o.code : null,
      signal:
        typeof o.signal === "string" && o.signal.length > 0 ? o.signal : null,
      expected: o.expected === true,
    };
  }

  function isAbsoluteSafePath(value: unknown): string | null {
    // We intentionally surface paths the Electron writer recorded
    // (backendEntry / frontendDist / backendLogPath). They are
    // file-system locations, not credentials. We still null-out
    // anything that isn't a non-empty string.
    return typeof value === "string" && value.length > 0 ? value : null;
  }

  // -----------------------------------------------------------------
  // GET /ops/crash-reports - newest-first list of crash records.
  // -----------------------------------------------------------------
  fastify.get("/ops/crash-reports", async (_req, reply) => {
    let names: string[] = [];
    let logsScanError: string | null = null;
    try {
      names = await readdir(LOGS_DIR_ABS);
    } catch (err) {
      logsScanError = err instanceof Error ? err.message : String(err);
      return reply.code(200).send({
        ok: true,
        generatedAt: new Date().toISOString(),
        logsDir: LOGS_DIR_ABS,
        logsScanError,
        reports: [],
        truncated: false,
        privacyNotice:
          "Crash reports are local files in your runtime logs directory. Nothing is uploaded, emailed, or sent automatically by CreativEdge. To share a report with someone, use Prepare + Download in the Ops console.",
      });
    }

    const matched = names.filter((n) => CRASH_FILENAME_RE.test(n));
    const rows = await Promise.all(
      matched.map(async (n) => {
        const path = join(LOGS_DIR_ABS, n);
        try {
          const st = await stat(path);
          return {
            id: n,
            name: n,
            path,
            size: st.size,
            mtime: st.mtime.toISOString(),
          };
        } catch {
          return null;
        }
      })
    );
    const filtered = (rows.filter(Boolean) as Array<{
      id: string;
      name: string;
      path: string;
      size: number;
      mtime: string;
    }>).sort((a, b) => (a.mtime < b.mtime ? 1 : -1));

    const truncated = filtered.length > CRASH_REPORT_MAX_ROWS;
    const reports = filtered.slice(0, CRASH_REPORT_MAX_ROWS);

    return reply.code(200).send({
      ok: true,
      generatedAt: new Date().toISOString(),
      logsDir: LOGS_DIR_ABS,
      logsScanError: null,
      reports,
      truncated,
      privacyNotice:
        "Crash reports are local files in your runtime logs directory. Nothing is uploaded, emailed, or sent automatically by CreativEdge. To share a report with someone, use Prepare + Download in the Ops console.",
    });
  });

  // -----------------------------------------------------------------
  // GET /ops/crash-reports/:id/prepare - allow-listed prepared report.
  // -----------------------------------------------------------------
  fastify.get<{ Params: { id: string } }>(
    "/ops/crash-reports/:id/prepare",
    async (req, reply) => {
      const rawId = req.params?.id ?? "";

      // Strict filename validation: must match the crash-log pattern
      // exactly. This blocks path traversal (`..`), absolute paths,
      // directory separators, and arbitrary filenames like
      // `electron-backend-*.log` or `passwords.txt`.
      if (!CRASH_FILENAME_RE.test(rawId)) {
        return reply.code(400).send({
          ok: false,
          error: "invalid_crash_report_id",
          hint:
            "id must match the on-disk crash-log filename pattern (crash-<timestamp>.log).",
        });
      }

      const targetPath = resolve(join(LOGS_DIR_ABS, rawId));
      // Defence-in-depth: even though the regex blocks `..`, double-
      // check the resolved path still lives under the logs directory.
      const expectedPrefix = LOGS_DIR_ABS + (LOGS_DIR_ABS.endsWith("/") || LOGS_DIR_ABS.endsWith("\\") ? "" : "/");
      const expectedPrefixWin = LOGS_DIR_ABS + (LOGS_DIR_ABS.endsWith("\\") || LOGS_DIR_ABS.endsWith("/") ? "" : "\\");
      if (!targetPath.startsWith(expectedPrefix) && !targetPath.startsWith(expectedPrefixWin)) {
        return reply.code(400).send({
          ok: false,
          error: "invalid_crash_report_id",
          hint: "id resolved outside the runtime logs directory.",
        });
      }

      let stats;
      try {
        stats = await stat(targetPath);
      } catch {
        return reply.code(404).send({
          ok: false,
          error: "crash_report_not_found",
          hint: `No crash report named ${rawId} in ${LOGS_DIR_ABS}.`,
        });
      }

      if (stats.size > CRASH_REPORT_MAX_BYTES) {
        return reply.code(413).send({
          ok: false,
          error: "crash_report_too_large",
          hint: `Crash file is ${stats.size} bytes; max allowed ${CRASH_REPORT_MAX_BYTES} bytes. Inspect the on-disk file directly.`,
        });
      }

      let raw: string;
      try {
        const buf = await readFile(targetPath);
        raw =
          buf.length > CRASH_REPORT_MAX_BYTES
            ? buf.subarray(0, CRASH_REPORT_MAX_BYTES).toString("utf8")
            : buf.toString("utf8");
      } catch (err) {
        return reply.code(500).send({
          ok: false,
          error: "crash_report_read_failed",
          hint: err instanceof Error ? err.message : String(err),
        });
      }

      let parsed: unknown;
      let parseError: string | null = null;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        parseError = err instanceof Error ? err.message : String(err);
        parsed = null;
      }

      const validationWarnings: string[] = [];
      const droppedFields: string[] = [];
      const report: Record<string, unknown> = {
        reportSchemaVersion: 1,
        generatedAt: new Date().toISOString(),
        crashLogFileName: rawId,
        crashLogPath: targetPath,
        crashLogSize: stats.size,
        crashLogModifiedAt: stats.mtime.toISOString(),
      };

      if (parseError !== null || !parsed || typeof parsed !== "object") {
        validationWarnings.push(
          parseError
            ? `Crash log JSON parse failed: ${parseError}. Returning structural metadata only.`
            : "Crash log content was not a JSON object. Returning structural metadata only."
        );
      } else {
        const src = parsed as Record<string, unknown>;
        for (const [k, v] of Object.entries(src)) {
          if (!CRASH_FIELD_ALLOWLIST.has(k)) {
            droppedFields.push(k);
            continue;
          }
          if (k === "exit") {
            const safeExit = pickAllowlistedExit(v);
            if (safeExit === null) {
              validationWarnings.push("`exit` field was malformed; omitted.");
              continue;
            }
            if (v && typeof v === "object") {
              for (const sk of Object.keys(v as Record<string, unknown>)) {
                if (!EXIT_FIELD_ALLOWLIST.has(sk)) {
                  droppedFields.push(`exit.${sk}`);
                }
              }
            }
            report.exit = safeExit;
            continue;
          }
          if (
            k === "backendEntry" ||
            k === "frontendDist" ||
            k === "backendLogPath"
          ) {
            const safePath = isAbsoluteSafePath(v);
            if (safePath !== null) report[k] = safePath;
            continue;
          }
          if (k === "backendChildPid") {
            if (typeof v === "number" && Number.isFinite(v)) report[k] = v;
            else if (v === null) report[k] = null;
            else validationWarnings.push("`backendChildPid` was non-numeric; omitted.");
            continue;
          }
          if (
            k === "backendPort" ||
            k === "frontendPort"
          ) {
            if (typeof v === "number" && Number.isFinite(v)) report[k] = v;
            continue;
          }
          if (k === "packaged") {
            report[k] = v === true;
            continue;
          }
          if (
            k === "kind" ||
            k === "timestamp" ||
            k === "appVersion" ||
            k === "electronVersion" ||
            k === "nodeVersion" ||
            k === "platform" ||
            k === "arch" ||
            k === "osRelease"
          ) {
            if (typeof v === "string" && v.length > 0) report[k] = v;
            else if (v === null) report[k] = null;
            continue;
          }
          if (k === "schemaVersion") {
            if (typeof v === "number" && Number.isFinite(v)) report[k] = v;
            continue;
          }
          validationWarnings.push(
            `Allow-listed field "${k}" had an unexpected type; dropped.`
          );
          droppedFields.push(k);
        }
        if (Object.prototype.hasOwnProperty.call(src, "backendLogTail")) {
          droppedFields.push("backendLogTail");
        }
      }

      // Stable field order for the prepared report.
      const ordered: Record<string, unknown> = {
        reportSchemaVersion: report.reportSchemaVersion,
        generatedAt: report.generatedAt,
        crashLogFileName: report.crashLogFileName,
        crashLogPath: report.crashLogPath,
        crashLogSize: report.crashLogSize,
        crashLogModifiedAt: report.crashLogModifiedAt,
      };
      const orderedAllow: string[] = [
        "kind",
        "schemaVersion",
        "timestamp",
        "appVersion",
        "electronVersion",
        "nodeVersion",
        "packaged",
        "platform",
        "arch",
        "osRelease",
        "backendPort",
        "frontendPort",
        "backendEntry",
        "frontendDist",
        "backendLogPath",
        "backendChildPid",
        "exit",
      ];
      for (const k of orderedAllow) {
        if (k in report) ordered[k] = report[k];
      }
      ordered.validationWarnings = validationWarnings;
      ordered.droppedFields = droppedFields;
      ordered.privacyNotice =
        "Prepared crash reports contain only allow-listed structured diagnostic fields. CreativEdge never sends, uploads, or emails crash reports automatically. To share this report with someone, copy or download it from the Ops console and attach it manually to your usual support channel. The on-disk file at `crashLogPath` may contain additional fields (notably a free-text `backendLogTail`) that were intentionally dropped from this prepared report.";

      return reply.code(200).send({
        ok: true,
        generatedAt: new Date().toISOString(),
        report: ordered,
      });
    }
  );
}
