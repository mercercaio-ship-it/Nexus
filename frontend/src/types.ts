// CreativEdge Phase 6-A/6-B/6-C/6-E/7-A/7-B - shared TypeScript types.
//
// These mirror the JSON shapes the backend emits over SSE / REST.
//
// Phase 6-C validation patch (2026-05-20):
//   - `SessionRow` and `SessionMessageRow` switched to camelCase to
//     match the new `GET /sessions` / `GET /sessions/:id` contract
//     (`ok:true`, `createdAt`, `updatedAt`, `lastAgentSlug`).
//   - `SessionListResponse` and `SessionDetailResponse` now carry
//     `ok:true` at the top, matching every other endpoint family.

export type RoleType = "user" | "assistant";

export interface RouteDecisionMeta {
  type: string;
  source?: string;
  confidence?: string;
  rationale?: string;
  appliedRules?: unknown;
  shortlist?: unknown;
  convenedSlugs?: string[];
}

export interface ChatMeta {
  sessionId: string;
  newSession?: boolean;
  agentSlug: string;
  agentName: string | null;
  agentEmoji: string | null;
  routeConfident: boolean;
  routeScore: number;
  routeHits: string[];
  provider: string;
  degraded: boolean;
  claudeError?: string | null;
  candidate?: string;
  requestId?: string;
  routeDecision?: RouteDecisionMeta;
  budget?: {
    messages_kept?: number;
    messages_trimmed?: number;
    protected_chars?: number;
    core_memory_loaded?: boolean;
    episodic_entries?: number;
    episodic_chars?: number;
  };
}

export interface ChatChunk {
  text: string;
}

export interface MemoryCandidate {
  type: "directive" | "identity" | "preference";
  text: string;
  pattern: string;
  agentSlug: string;
}

export interface HandoffMeta {
  fromSlug: string;
  toSlug: string | null;
  rawSlug?: string;
  status: string;
  reason: string | null;
}

export interface ChatDone {
  ok: boolean;
  sessionId: string;
  provider: string;
  degraded: boolean;
  latencyMs?: number;
  synthesisOk?: boolean;
  convenedSlugs?: string[];
  handoff?: HandoffMeta;
  memoryCandidate?: MemoryCandidate;
}

export interface ChatError {
  text: string;
}

export type ChatStreamEvent =
  | { event: "meta"; data: ChatMeta }
  | { event: "chunk"; data: ChatChunk }
  | { event: "done"; data: ChatDone }
  | { event: "error"; data: ChatError };

// ---------------------------------------------------------------------------
// UI message model
// ---------------------------------------------------------------------------

export interface UiMessage {
  localId: string;
  role: RoleType;
  text: string;
  meta?: ChatMeta;
  done?: ChatDone;
  streaming?: boolean;
  error?: string;
  candidateState?: "pending" | "saved" | "duplicate" | "dismissed" | "refused" | "error";
  candidateError?: string;
  historicalAgentSlug?: string | null;
  createdAt?: string;
}

// ---------------------------------------------------------------------------
// REST response shapes
// ---------------------------------------------------------------------------

export interface PromoteResponse {
  ok: true;
  slug: string;
  duplicate?: true;
  timestamp: string;
  bytesAppended?: number;
}

export interface PromoteEpisodicResponse {
  ok: true;
  slug: string;
  promoted?: true;
  duplicate?: true;
  timestamp: string;
  bytesAppended?: number;
}

export interface EditCoreResponse {
  ok: true;
  slug: string;
  edited?: true;
  unchanged?: true;
  timestamp: string;
  bytesWritten?: number;
}

export interface ForgetResponse {
  ok: true;
  slug: string;
  kind: "core" | "episodic";
  forgotten: true;
  timestamp: string;
  bytesWritten: number;
}

export interface CompactStatusResponse {
  ok: true;
  slug: string;
  threshold: number;
  entryCount: number;
  due: boolean;
  empty?: true;
  previewAvailable: boolean;
  requiresConfirmation: true;
  nextAction: "none" | "preview";
}

export interface CompactPreviewResponse {
  ok: true;
  slug: string;
  empty?: true;
  entryCount?: number;
  consideredCount?: number;
  preview?: string[];
  requiresConfirmation?: true;
}

export interface CompactApplyResponse {
  ok: true;
  slug: string;
  applied?: true;
  duplicate?: true;
  mode: "append-core";
  timestamp: string;
  bytesAppended?: number;
}

export interface SearchResponse {
  ok: true;
  q: string;
  count: number;
  results: Array<{
    sessionId: string;
    messageId: string;
    role: string;
    agentSlug: string | null;
    createdAt: string;
    snippet: string;
  }>;
}

export interface BackupStatusResponse {
  ok: true;
  enabled: boolean;
  gitReady: boolean;
  repoReady: boolean;
  remoteConfigured: boolean;
  remote: string | null;
  includeSessionsDb: boolean;
  setupRequired: boolean;
  nextAction: string;
  repoDir: string;
  sourceDir: string;
}

export interface BackupConfigResponse {
  ok: true;
  enabled: boolean;
  remote: string | null;
  includeSessionsDb: boolean;
  repoDir: string;
  sourceDir: string;
  updatedAt: string;
}

export interface BackupDryRunResponse {
  ok: true;
  changed: boolean;
  filesConsidered: number;
  filesCopied: number;
  filesSkippedCount: number;
  statusSummary: {
    added: number;
    modified: number;
    deleted: number;
    untracked: number;
  };
  pushReady: false;
}

export interface BackupRunResponse {
  ok: true;
  changed: boolean;
  committed?: boolean;
  commitHash?: string;
  commitMessage?: string;
  pushed: boolean;
  pushReason?: string | null;
  statusSummary?: {
    added: number;
    modified: number;
    deleted: number;
    untracked: number;
  };
}

// ---------------------------------------------------------------------------
// Sessions (Phase 6-C, camelCase contract + ok:true)
// ---------------------------------------------------------------------------

/** Compact session row in `GET /sessions`. `lastAgentSlug` is the
 *  most recent assistant message's slug for that session (or null if
 *  none yet). */
export interface SessionRow {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  lastAgentSlug: string | null;
}

/** Session metadata row in `GET /sessions/:id`. */
export interface SessionDetailRow {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Single message row in `GET /sessions/:id.messages`. */
export interface SessionMessageRow {
  id: string;
  role: string;
  content: string;
  agentSlug: string | null;
  createdAt: string;
}

export interface SessionListResponse {
  ok: true;
  sessions: SessionRow[];
}

export interface SessionDetailResponse {
  ok: true;
  session: SessionDetailRow;
  messages: SessionMessageRow[];
}

/** `/healthz` response shape consumed by the App.tsx preflight ping
 *  AND by the Phase 9-C first-run wizard. All fields beyond `ok` are
 *  optional so the type stays compatible with older builds that didn't
 *  surface them. The backend (Phase 2.2-B + Phase 2.1) returns them
 *  unconditionally today; the wizard renders each step defensively when
 *  a field is absent. */
export interface HealthCheckProviderReadiness {
  ready: boolean;
  reason?: string;
  installed?: boolean;
  authStatus?: "unknown" | "authenticated" | "unauthenticated";
  mode?: string;
  version?: string | null;
  setupRequired?: boolean;
  setupHint?: string;
  durationMs?: number;
}

export interface HealthCheckResponse {
  ok: true;
  service?: string;
  version?: string;
  degraded?: boolean;
  setupRequired?: boolean;
  setupHint?: string;
  runtimeDir?: string;
  storageReady?: boolean;
  dbReady?: boolean;
  seededAgentSlugs?: string[];
  providers?: {
    primary?: string;
    claude?: HealthCheckProviderReadiness;
    mock?: HealthCheckProviderReadiness;
  };
  requestId?: string;
}

// ---------------------------------------------------------------------------
// Shared UI helpers (Phase 6-B)
// ---------------------------------------------------------------------------

export type BadgeVariant = "ok" | "info" | "warn" | "danger" | "neutral";

export type ActionState =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; text: string }
  | { kind: "duplicate"; text: string }
  | { kind: "warn"; text: string }
  | { kind: "err"; text: string };

// ---------------------------------------------------------------------------
// Slash commands (Phase 6-C)
// ---------------------------------------------------------------------------

export type SlashCommand =
  | { kind: "agent"; slug: string; message: string }
  | { kind: "forget"; subKind: "core" | "episodic"; text: string }
  | { kind: "remember"; text: string; targetSlug?: string }
  | { kind: "compactStatus" }
  | { kind: "compactPreview" }
  | { kind: "backupStatus" }
  | { kind: "unknown"; raw: string }
  | { kind: "incomplete"; raw: string; reason: string };

export interface SlashConfirmRequest {
  command: "remember" | "forget";
  agentSlug: string;
  forgetKind?: "core" | "episodic";
  text: string;
}


// ---------------------------------------------------------------------------
// Phase 7-A admin console — agent management shell
// ---------------------------------------------------------------------------

/** Compact agent row from `GET /agents`. Mirrors the existing backend
 *  response under `entries[]`: registry-summary metadata only, no
 *  hidden prompts, no memory file contents. */
export interface AgentSummary {
  slug: string;
  name: string;
  domain: string | null;
  emoji: string | null;
  mbti?: string | null;
  color?: string | null;
  role?: string | null;
  routing_keywords?: string[];
}

/** Wire shape of `GET /agents`. */
export interface AgentListResponse {
  schemaVersion?: number;
  count?: { orchestrator?: number; specialists?: number };
  entries: AgentSummary[];
}

/** Template defaults for the safe-editable fields read from
 *  `<project>/agents/<slug>/config.json`. The file may contain other
 *  fields too — we only model the ones the editor cares about. */
export interface AgentConfigShape {
  tagline?: string;
  voice?: string;
  color?: string;
  values?: string[];
  strengths?: string[];
  watch_outs?: string[];
  [extra: string]: unknown;
}

/** Per-agent runtime overrides — the actual JSON written to
 *  `<runtime>/agents/<slug>/overrides.json` by the backend. Mirrors
 *  the backend's `AgentOverrides` exactly. */
export interface AgentOverrides {
  tagline?: string;
  voice?: string;
  color?: string;
  values?: string[];
  strengths?: string[];
  watch_outs?: string[];
  updated_at?: string;
}

/** Patch sent to `PUT /agents/:slug`. Only the fields the user
 *  actually changed should be present; the backend validates each
 *  field type and refuses unknown fields with a 400. */
export interface AgentOverridesPatch {
  tagline?: string;
  voice?: string;
  color?: string;
  values?: string[];
  strengths?: string[];
  watch_outs?: string[];
}

/** Successful response from `PUT /agents/:slug`. The backend returns
 *  the **merged** overrides (existing + patch). A 207 may also be
 *  returned when some fields were accepted and others rejected; in
 *  that case `rejected[]` is populated. */
export interface AgentOverridesPutResponse {
  ok: true;
  slug: string;
  overrides: AgentOverrides;
  rejected: Array<{ field: string; reason: string }>;
}

/** Wire shape of `GET /agents/:slug` — full snapshot including the
 *  registry entry and project template + runtime overrides. The
 *  editor reads `config` for template defaults and `overrides` for
 *  the currently-saved overrides; the other fields stay `unknown`
 *  until later slices opt into them. */
export interface AgentSnapshotResponse {
  registryEntry: AgentSummary;
  config?: AgentConfigShape | null;
  overrides?: AgentOverrides;
  identity?: string | null;
  soul?: string | null;
  personality?: string | null;
  systemPrompt?: string | null;
  memory?: { core?: string; episodic?: string };
  paths?: {
    templateDir?: string;
    runtimeMemoryDir?: string;
    overridesPath?: string;
  };
}

/** Wire shape of `GET /agents/:slug/memory`. Memory contents are kept
 *  as raw strings so the admin can preview presence without coupling
 *  the admin scaffold to memory-mutation paths. */
export interface AgentMemoryResponse {
  slug: string;
  core: string;
  episodic: string;
  paths?: { core?: string; episodic?: string };
}

/** Lightweight result captured by the routing playground from a single
 *  `/chat` SSE round-trip. Used purely for read-only display; the
 *  underlying `/chat` call still goes through `streamChat` unchanged. */
export interface RoutingPlaygroundResult {
  routedAgentSlug: string | null;
  routedAgentName: string | null;
  provider: string | null;
  degraded: boolean;
  decisionType: string | null;
  handoff?: HandoffMeta;
  responsePreview: string;
  latencyMs?: number;
}

export type AdminViewMode = "chat" | "admin";

// ---------------------------------------------------------------------------
// Phase 9-D-A — Ops (diagnostics + cost summary)
// ---------------------------------------------------------------------------

/** Compact aggregation bucket returned by `GET /ops/usage/summary`. The
 *  backend computes the same shape for the overall window, last 24h, last
 *  7d, and per-provider / per-agent breakdowns. */
export interface OpsBucket {
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

export interface OpsUsageSummaryResponse {
  ok: true;
  generatedAt: string;
  windowRowsConsidered: number;
  earliestEventAt: string | null;
  latestEventAt: string | null;
  eventsWithMalformedUsage: number;
  overall: OpsBucket;
  last24h: OpsBucket;
  last7d: OpsBucket;
  byProvider: Record<string, OpsBucket>;
  byAgentSlug: Record<string, OpsBucket>;
  currency: string;
  notes?: string[];
}

/** Phase 9-D-C1 - per-day bucket emitted by `/ops/usage/timeseries`.
 *  Same numeric shape as `OpsBucket` plus a `dayKey` (UTC `YYYY-MM-DD`)
 *  so the frontend can plot bars in chronological order without
 *  sorting. */
export interface OpsTimeseriesBucket extends OpsBucket {
  dayKey: string;
}

/** Phase 9-D-C1 - response shape for `/ops/usage/timeseries`. The
 *  `days` array is dense (one entry per UTC day in the requested
 *  range, including days with zero events) so the chart axis is
 *  contiguous; `today` + `monthToDate` are pre-aggregated buckets
 *  the Budget & trends card can read without recomputing from
 *  `days`. */
export interface OpsUsageTimeseriesResponse {
  ok: true;
  generatedAt: string;
  requestedDays: number;
  windowRowsConsidered: number;
  eventsConsidered: number;
  eventsWithMalformedUsage: number;
  todayKey: string;
  monthStartKey: string;
  today: OpsBucket;
  monthToDate: OpsBucket;
  days: OpsTimeseriesBucket[];
  currency: string;
  notes?: string[];
}

export interface OpsLogFileRow {
  name: string;
  path: string;
  size: number;
  mtime: string;
}

// ---------------------------------------------------------------------------
// Phase 9-D-C2 - Crash report prepare/export
// ---------------------------------------------------------------------------

/** Compact crash-report record returned by `GET /ops/crash-reports`. The
 *  backend scans `~/.creativedge/logs/` for `crash-*.log` files and
 *  returns filename, size, mtime, and path only - never file contents. */
export interface CrashReportSummary {
  id: string;
  name: string;
  path: string;
  size: number;
  mtime: string;
}

/** Wire shape of `GET /ops/crash-reports`. Newest-first, capped at 25
 *  records; the `truncated` flag indicates more on disk than were
 *  returned. */
export interface CrashReportListResponse {
  ok: true;
  generatedAt: string;
  logsDir: string;
  logsScanError: string | null;
  reports: CrashReportSummary[];
  truncated: boolean;
  privacyNotice: string;
}

/** Prepared crash report - the allow-listed subset of the on-disk
 *  crash JSON that `GET /ops/crash-reports/:id/prepare` returns. Every
 *  field except the preparer-added top six is sourced from the on-disk
 *  record via the backend's strict allow-list. The free-text
 *  `backendLogTail` field is intentionally NOT included. */
export interface PreparedCrashReport {
  reportSchemaVersion: number;
  generatedAt: string;
  crashLogFileName: string;
  crashLogPath: string;
  crashLogSize: number;
  crashLogModifiedAt: string;
  kind?: string | null;
  schemaVersion?: number;
  timestamp?: string | null;
  appVersion?: string | null;
  electronVersion?: string | null;
  nodeVersion?: string | null;
  packaged?: boolean;
  platform?: string | null;
  arch?: string | null;
  osRelease?: string | null;
  backendPort?: number;
  frontendPort?: number;
  backendEntry?: string;
  frontendDist?: string;
  backendLogPath?: string;
  backendChildPid?: number | null;
  exit?: {
    code: number | null;
    signal: string | null;
    expected: boolean;
  };
  validationWarnings: string[];
  droppedFields: string[];
  privacyNotice: string;
}

/** Wire shape of `GET /ops/crash-reports/:id/prepare`. */
export interface CrashReportPrepareResponse {
  ok: true;
  generatedAt: string;
  report: PreparedCrashReport;
}

export interface OpsDiagnosticsResponse {
  ok: true;
  generatedAt: string;
  service: string;
  version: string;
  runtimeDir: string;
  logsDir: string;
  logsScanError: string | null;
  seededAgentSlugs: string[];
  providers: {
    primary: string;
    claude: HealthCheckProviderReadiness | null;
    mock: HealthCheckProviderReadiness | null;
  };
  latestCrashLog: OpsLogFileRow | null;
  crashLogs: OpsLogFileRow[];
  latestBackendLog: OpsLogFileRow | null;
  backendLogs: OpsLogFileRow[];
  autoUpdate: {
    enabled: boolean;
    reason: string;
  };
}

// ---------------------------------------------------------------------------
// Phase 9-D-A — Ops (diagnostics + cost summary)
// ---------------------------------------------------------------------------

/** Compact aggregation bucket returned by `GET /ops/usage/summary`. The
 *  backend computes the same shape for the overall window, last 24h, last
 *  7d, and per-provider / per-agent breakdowns. */
export interface OpsBucket {
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

export interface OpsUsageSummaryResponse {
  ok: true;
  generatedAt: string;
  windowRowsConsidered: number;
  earliestEventAt: string | null;
  latestEventAt: string | null;
  eventsWithMalformedUsage: number;
  overall: OpsBucket;
  last24h: OpsBucket;
  last7d: OpsBucket;
  byProvider: Record<string, OpsBucket>;
  byAgentSlug: Record<string, OpsBucket>;
  currency: string;
  notes?: string[];
}

/** Phase 9-D-C1 - per-day bucket emitted by `/ops/usage/timeseries`.
 *  Same numeric shape as `OpsBucket` plus a `dayKey` (UTC `YYYY-MM-DD`)
 *  so the frontend can plot bars in chronological order without
 *  sorting. */
export interface OpsTimeseriesBucket extends OpsBucket {
  dayKey: string;
}

/** Phase 9-D-C1 - response shape for `/ops/usage/timeseries`. The
 *  `days` array is dense (one entry per UTC day in the requested
 *  range, including days with zero events) so the chart axis is
 *  contiguous; `today` + `monthToDate` are pre-aggregated buckets
 *  the Budget & trends card can read without recomputing from
 *  `days`. */
export interface OpsUsageTimeseriesResponse {
  ok: true;
  generatedAt: string;
  requestedDays: number;
  windowRowsConsidered: number;
  eventsConsidered: number;
  eventsWithMalformedUsage: number;
  todayKey: string;
  monthStartKey: string;
  today: OpsBucket;
  monthToDate: OpsBucket;
  days: OpsTimeseriesBucket[];
  currency: string;
  notes?: string[];
}

export interface OpsLogFileRow {
  name: string;
  path: string;
  size: number;
  mtime: string;
}

// ---------------------------------------------------------------------------
// Phase 9-D-C2 - Crash report prepare/export
// ---------------------------------------------------------------------------

/** Compact crash-report record returned by `GET /ops/crash-reports`. The
 *  backend scans `~/.creativedge/logs/` for `crash-*.log` files and
 *  returns filename, size, mtime, and path only - never file contents. */
export interface CrashReportSummary {
  id: string;
  name: string;
  path: string;
  size: number;
  mtime: string;
}

/** Wire shape of `GET /ops/crash-reports`. Newest-first, capped at 25
 *  records; the `truncated` flag indicates more on disk than were
 *  returned. */
export interface CrashReportListResponse {
  ok: true;
  generatedAt: string;
  logsDir: string;
  logsScanError: string | null;
  reports: CrashReportSummary[];
  truncated: boolean;
  privacyNotice: string;
}

/** Prepared crash report - the allow-listed subset of the on-disk
 *  crash JSON that `GET /ops/crash-reports/:id/prepare` returns. Every
 *  field except the preparer-added top six is sourced from the on-disk
 *  record via the backend's strict allow-list. The free-text
 *  `backendLogTail` field is intentionally NOT included. */
export interface PreparedCrashReport {
  reportSchemaVersion: number;
  generatedAt: string;
  crashLogFileName: string;
  crashLogPath: string;
  crashLogSize: number;
  crashLogModifiedAt: string;
  kind?: string | null;
  schemaVersion?: number;
  timestamp?: string | null;
  appVersion?: string | null;
  electronVersion?: string | null;
  nodeVersion?: string | null;
  packaged?: boolean;
  platform?: string | null;
  arch?: string | null;
  osRelease?: string | null;
  backendPort?: number;
  frontendPort?: number;
  backendEntry?: string;
  frontendDist?: string;
  backendLogPath?: string;
  backendChildPid?: number | null;
  exit?: {
    code: number | null;
    signal: string | null;
    expected: boolean;
  };
  validationWarnings: string[];
  droppedFields: string[];
  privacyNotice: string;
}

/** Wire shape of `GET /ops/crash-reports/:id/prepare`. */
export interface CrashReportPrepareResponse {
  ok: true;
  generatedAt: string;
  report: PreparedCrashReport;
}

export interface OpsDiagnosticsResponse {
  ok: true;
  generatedAt: string;
  service: string;
  version: string;
  runtimeDir: string;
  logsDir: string;
  logsScanError: string | null;
  seededAgentSlugs: string[];
  providers: {
    primary: string;
    claude: HealthCheckProviderReadiness | null;
    mock: HealthCheckProviderReadiness | null;
  };
  latestCrashLog: OpsLogFileRow | null;
  crashLogs: OpsLogFileRow[];
  latestBackendLog: OpsLogFileRow | null;
  backendLogs: OpsLogFileRow[];
  autoUpdate: {
    enabled: boolean;
    reason: string;
  };
}
