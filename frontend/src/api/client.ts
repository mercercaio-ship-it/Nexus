// CreativEdge Phase 6-A/6-B/6-C/7-A/7-B - typed REST client for the local backend.
//
// All requests go to `import.meta.env.VITE_API_URL` (defaults to empty
// string -> same-origin via the Vite dev proxy, see vite.config.ts).
// No tokens. No third-party API calls.
//
// Phase 6-C validation patch (2026-05-20):
//   - `healthCheck()` added as a preflight reachability ping (`GET
//     /healthz`). The App uses it on mount to surface a clear banner
//     when the backend is down or stale rather than letting individual
//     panels emit raw 404s.
//   - `ApiError.status === 404 && ApiError.message` is recognised by
//     callers as a possible stale-backend signal; the message string
//     mentions the route so the UI can render a friendly hint.

import type {
  AgentListResponse,
  AgentMemoryResponse,
  AgentOverridesPatch,
  AgentOverridesPutResponse,
  AgentSnapshotResponse,
  BackupConfigResponse,
  BackupDryRunResponse,
  BackupRunResponse,
  BackupStatusResponse,
  CompactApplyResponse,
  CompactPreviewResponse,
  CompactStatusResponse,
  CrashReportListResponse,
  CrashReportPrepareResponse,
  EditCoreResponse,
  ForgetResponse,
  HealthCheckResponse,
  OpsDiagnosticsResponse,
  OpsUsageSummaryResponse,
  OpsUsageTimeseriesResponse,
  PromoteEpisodicResponse,
  PromoteResponse,
  SearchResponse,
  SessionDetailResponse,
  SessionListResponse,
} from "../types";

// ---------------------------------------------------------------------------
// Phase 9-D-C3 - runtime API-base discovery
// ---------------------------------------------------------------------------
//
// Resolution order (first non-empty wins; module-init time, no I/O):
//   1. Electron preload bridge - `window.ceBridge.getRuntimeConfig().backendBaseUrl`
//      injected at runtime via `webPreferences.additionalArguments` after the
//      Electron main process allocates a free TCP port for the backend
//      child. This is the canonical source inside the packaged + dev
//      Electron shells and is sync (no `await`).
//   2. Build-time `VITE_API_URL` - kept as a belt-and-suspenders fallback
//      for legacy bundles; `electron/scripts/build-deps.mjs` still pins
//      it to `http://127.0.0.1:3001` so a partial rollback of this slice
//      degrades to the Phase 9-B fixed-port behaviour.
//   3. Empty string -> same-origin via the Vite dev proxy
//      (`frontend/vite.config.ts` forwards `/chat`, `/agents`, ... to
//      `127.0.0.1:3001` for normal `npm run dev` browser usage).
//
// All three branches resolve to a string with no trailing slash, so the
// rest of this module can concatenate paths verbatim (`API_BASE + "/healthz"`).

interface CeRuntimeConfig {
  backendBaseUrl: string | null;
  frontendBaseUrl: string | null;
  packaged: boolean;
}

interface CeRuntimeBridge {
  getRuntimeConfig?: () => CeRuntimeConfig | null | undefined;
}

function readPreloadBackendBase(): string {
  if (typeof window === "undefined") return "";
  const bridge = (window as unknown as { ceBridge?: CeRuntimeBridge }).ceBridge;
  if (!bridge || typeof bridge.getRuntimeConfig !== "function") return "";
  try {
    const cfg = bridge.getRuntimeConfig();
    if (cfg && typeof cfg.backendBaseUrl === "string" && cfg.backendBaseUrl.length > 0) {
      return cfg.backendBaseUrl;
    }
  } catch {
    // Sandboxed bridge call should never throw, but if it does we
    // fall through to the build-time env fallback rather than
    // crashing the renderer.
  }
  return "";
}

function readBuildTimeBackendBase(): string {
  const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
  const baked = env?.VITE_API_URL;
  if (typeof baked !== "string") return "";
  return baked;
}

function resolveApiBase(): string {
  const fromPreload = readPreloadBackendBase();
  if (fromPreload.length > 0) return fromPreload.replace(/\/+$/, "");
  return readBuildTimeBackendBase().replace(/\/+$/, "");
}

export const API_BASE: string = resolveApiBase();

export function apiTargetLabel(): string {
  return API_BASE.length > 0 ? API_BASE : "the local backend (via Vite dev proxy)";
}

export class ApiError extends Error {
  status: number;
  hint?: string;
  /** Set for HTTP errors when the response body is plain text rather
   *  than JSON (e.g. a Fastify default 404 carried as JSON but
   *  without a `hint` field). */
  raw?: string;
  constructor(status: number, message: string, hint?: string, raw?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.hint = hint;
    this.raw = raw;
  }
}

async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ApiError(
      0,
      `Could not reach backend at ${apiTargetLabel()} (${msg}). Is \`npm run dev\` running in backend-api?`,
    );
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    let hint: string | undefined;
    let raw: string | undefined;
    try {
      const text = await res.text();
      raw = text;
      try {
        const body = JSON.parse(text) as { error?: string; hint?: string; message?: string };
        if (typeof body?.error === "string") msg = body.error;
        else if (typeof body?.message === "string") msg = body.message;
        if (typeof body?.hint === "string") hint = body.hint;
      } catch {
        /* not json — keep raw text */
        if (text.length > 0 && text.length < 400) msg = `HTTP ${res.status}: ${text}`;
      }
    } catch {
      /* body read failed entirely */
    }
    throw new ApiError(res.status, msg, hint, raw);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Health check (Phase 6-C validation patch)
// ---------------------------------------------------------------------------

/** Lightweight reachability ping. Resolves to the parsed body on
 *  success; rejects with an `ApiError` whose `.status === 404` when
 *  the backend is running but doesn't have `/healthz` (likely a stale
 *  pre-Phase-2.1 process), or `.status === 0` when the connection
 *  failed entirely (backend down, wrong port, vite proxy
 *  misconfigured). */
export async function healthCheck(): Promise<HealthCheckResponse> {
  return fetchJson<HealthCheckResponse>("/healthz", { method: "GET" });
}

// ---------------------------------------------------------------------------
// Memory mutation routes
// ---------------------------------------------------------------------------

export async function promoteMemory(
  slug: string,
  entry: string
): Promise<PromoteResponse> {
  return fetchJson<PromoteResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/promote`,
    { method: "POST", body: JSON.stringify({ entry, confirmed: true }) }
  );
}

export async function promoteEpisodicMemory(
  slug: string,
  episodicNeedle: string
): Promise<PromoteEpisodicResponse> {
  return fetchJson<PromoteEpisodicResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/promote-episodic`,
    { method: "POST", body: JSON.stringify({ episodicNeedle, confirmed: true }) }
  );
}

export async function editCoreMemory(
  slug: string,
  find: string,
  replace: string
): Promise<EditCoreResponse> {
  return fetchJson<EditCoreResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/core`,
    { method: "PATCH", body: JSON.stringify({ find, replace, confirmed: true }) }
  );
}

export async function forgetMemory(
  slug: string,
  kind: "core" | "episodic",
  find: string
): Promise<ForgetResponse> {
  return fetchJson<ForgetResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/forget`,
    { method: "POST", body: JSON.stringify({ kind, find, confirmed: true }) }
  );
}

// ---------------------------------------------------------------------------
// Compaction
// ---------------------------------------------------------------------------

export async function compactStatus(
  slug: string
): Promise<CompactStatusResponse> {
  return fetchJson<CompactStatusResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/compact/status`,
    { method: "GET" }
  );
}

export async function compactPreview(
  slug: string,
  maxEntries = 10
): Promise<CompactPreviewResponse> {
  return fetchJson<CompactPreviewResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/compact/preview`,
    { method: "POST", body: JSON.stringify({ maxEntries }) }
  );
}

export async function compactApply(
  slug: string,
  preview: string[]
): Promise<CompactApplyResponse> {
  return fetchJson<CompactApplyResponse>(
    `/agents/${encodeURIComponent(slug)}/memory/compact/apply`,
    {
      method: "POST",
      body: JSON.stringify({ preview, mode: "append-core", confirmed: true }),
    }
  );
}

// ---------------------------------------------------------------------------
// Sessions + search
// ---------------------------------------------------------------------------

export async function listSessions(
  limit = 50
): Promise<SessionListResponse> {
  const usp = new URLSearchParams({ limit: String(limit) });
  return fetchJson<SessionListResponse>(`/sessions?${usp.toString()}`, {
    method: "GET",
  });
}

export async function getSession(
  sessionId: string
): Promise<SessionDetailResponse> {
  return fetchJson<SessionDetailResponse>(
    `/sessions/${encodeURIComponent(sessionId)}`,
    { method: "GET" }
  );
}

export async function searchMessages(
  q: string,
  limit = 20
): Promise<SearchResponse> {
  const usp = new URLSearchParams({ q, limit: String(limit) });
  return fetchJson<SearchResponse>(`/sessions/search?${usp.toString()}`, {
    method: "GET",
  });
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

export async function backupStatus(): Promise<BackupStatusResponse> {
  return fetchJson<BackupStatusResponse>("/backup/status", { method: "GET" });
}

export async function backupConfig(input: {
  enabled?: boolean;
  remote?: string | null;
  includeSessionsDb?: boolean;
}): Promise<BackupConfigResponse> {
  return fetchJson<BackupConfigResponse>("/backup/config", {
    method: "POST",
    body: JSON.stringify({ ...input, confirmed: true }),
  });
}

export async function backupDryRun(): Promise<BackupDryRunResponse> {
  return fetchJson<BackupDryRunResponse>("/backup/dry-run", {
    method: "POST",
    body: JSON.stringify({ confirmed: true }),
  });
}

export async function backupRun(push = false): Promise<BackupRunResponse> {
  return fetchJson<BackupRunResponse>("/backup/run", {
    method: "POST",
    body: JSON.stringify({ confirmed: true, push }),
  });
}

// ---------------------------------------------------------------------------
// Phase 7-A admin console — read-only agents endpoints
// ---------------------------------------------------------------------------

/** `GET /agents` — registry-summary list. Read-only. No mutation. */
export async function listAgents(): Promise<AgentListResponse> {
  return fetchJson<AgentListResponse>("/agents", { method: "GET" });
}

/** `GET /agents/:slug` — full agent snapshot. Read-only. */
export async function getAgentSnapshot(
  slug: string
): Promise<AgentSnapshotResponse> {
  return fetchJson<AgentSnapshotResponse>(
    `/agents/${encodeURIComponent(slug)}`,
    { method: "GET" }
  );
}

/** `GET /agents/:slug/memory` — raw core + episodic memory contents.
 *  Used by the admin detail panel only to display presence and
 *  approximate line counts; never copied into chat or auto-mutated. */
export async function getAgentMemory(
  slug: string
): Promise<AgentMemoryResponse> {
  return fetchJson<AgentMemoryResponse>(
    `/agents/${encodeURIComponent(slug)}/memory`,
    { method: "GET" }
  );
}

// ---------------------------------------------------------------------------
// Phase 9-D-A — Ops (diagnostics + cost summary)
// ---------------------------------------------------------------------------

export async function opsUsageSummary(): Promise<OpsUsageSummaryResponse> {
  return fetchJson<OpsUsageSummaryResponse>("/ops/usage/summary", { method: "GET" });
}

/** Phase 9-D-C1 - per-day usage time-series + month-to-date + today
 *  buckets, used by the Ops console's "Budget & trends" card. The
 *  `days` parameter is clamped server-side to [1, 90]; default is 30. */
export async function opsUsageTimeseries(
  days = 30
): Promise<OpsUsageTimeseriesResponse> {
  const clamped = Math.max(1, Math.min(90, Math.floor(days)));
  const usp = new URLSearchParams({ days: String(clamped) });
  return fetchJson<OpsUsageTimeseriesResponse>(
    `/ops/usage/timeseries?${usp.toString()}`,
    { method: "GET" }
  );
}

export async function opsDiagnostics(): Promise<OpsDiagnosticsResponse> {
  return fetchJson<OpsDiagnosticsResponse>("/ops/diagnostics", { method: "GET" });
}

// ---------------------------------------------------------------------------
// Phase 9-D-C2 - crash-report prepare/export (read-only, local-only)
// ---------------------------------------------------------------------------

/** `GET /ops/crash-reports` - newest-first list of locally-written
 *  crash records (filename + size + mtime + path only; never file
 *  contents). Capped server-side at 25 records. */
export async function opsCrashReports(): Promise<CrashReportListResponse> {
  return fetchJson<CrashReportListResponse>("/ops/crash-reports", {
    method: "GET",
  });
}

/** `GET /ops/crash-reports/:id/prepare` - returns an allow-listed
 *  prepared crash report shape suitable for manual review + copy +
 *  download. Never sends, uploads, or emails anything. `id` must
 *  match the on-disk crash-log filename pattern; the backend strictly
 *  validates the parameter and rejects path traversal / non-matching
 *  filenames with HTTP 400. */
export async function opsPrepareCrashReport(
  id: string
): Promise<CrashReportPrepareResponse> {
  return fetchJson<CrashReportPrepareResponse>(
    `/ops/crash-reports/${encodeURIComponent(id)}/prepare`,
    { method: "GET" }
  );
}

/** `PUT /agents/:slug` — safe runtime overrides for the editable
 *  field set (tagline / voice / color / values / strengths / watch_outs).
 *  The backend validates each field and refuses unknown keys. Only
 *  send the fields the user actually changed; the backend merges
 *  with any existing overrides on disk.
 *
 *  Phase 7-B is gated by the modal confirmation flow in the UI; the
 *  helper itself is intentionally thin so other surfaces could call
 *  it later (e.g. a future "Reset to template" button) without
 *  duplicating fetch glue. */
export async function putAgentOverrides(
  slug: string,
  patch: AgentOverridesPatch
): Promise<AgentOverridesPutResponse> {
  return fetchJson<AgentOverridesPutResponse>(
    `/agents/${encodeURIComponent(slug)}`,
    { method: "PUT", body: JSON.stringify(patch) }
  );
}
