// CreativEdge Phase 9-D-A — Ops console (read-only diagnostics + cost
// dashboard + manual update info).
//
// Wraps three already-validated read-only APIs into a single panel
// reachable from the chat chrome:
//   - GET /healthz                  (Phase 2.1 + 2.2-B; runtime/provider state)
//   - GET /backup/status            (Phase 5.6-A; current backup readiness)
//   - GET /ops/usage/summary        (NEW in 9-D-A; aggregated cost/usage)
//   - GET /ops/diagnostics          (NEW in 9-D-A; logs scan + auto-update flag)
//
// Privacy: every field rendered here is metadata only. No chat content,
// no memory content, no prompts, no env vars. The crash-log + backend-log
// rows show filename + size + mtime + path; the user opens the file
// themselves in their file explorer if they want to inspect it.
//
// Auto-update is intentionally DEFERRED. The "Update info" section
// renders the current app version + a manual link to the GitHub releases
// page (opens via window.open → Electron's will-navigate handler routes
// it to shell.openExternal). No background polling, no auto-updater
// dependency, no signing wiring.
//
// Phase 9-D-B1 polish (2026-05-21):
//   - Release/repository coordinates moved into
//     `frontend/src/config/release.ts` (single source of truth).
//   - Hardcoded URL replaced with the correct
//     repo `michelbr84/CreativEdge` via the shared config.
//   - "Check latest release" button added next to "Open releases page";
//     calls the GitHub public REST API on user click only (no
//     background fetch), handles 404 / 403 / network failures, and
//     surfaces a small status badge comparing the local app version
//     against the latest published tag.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ApiError,
  backupRun as apiBackupRun,
  backupStatus as apiBackupStatus,
  healthCheck as apiHealthCheck,
  opsCrashReports as apiOpsCrashReports,
  opsDiagnostics as apiOpsDiagnostics,
  opsPrepareCrashReport as apiOpsPrepareCrashReport,
  opsUsageSummary as apiOpsUsageSummary,
  opsUsageTimeseries as apiOpsUsageTimeseries,
} from "../../api/client";
import {
  compareLocalToLatest,
  fetchLatestRelease,
  openExternalUrl,
  RELEASES_URL,
  type LatestReleaseResult,
  type ReleaseComparison,
} from "../../config/release";
import type {
  BackupRunResponse,
  BackupStatusResponse,
  CrashReportListResponse,
  CrashReportSummary,
  HealthCheckResponse,
  OpsBucket,
  OpsDiagnosticsResponse,
  OpsTimeseriesBucket,
  OpsUsageSummaryResponse,
  OpsUsageTimeseriesResponse,
  PreparedCrashReport,
} from "../../types";
import { BackupPushConfirmModal } from "../BackupPushConfirmModal";

export interface OpsConsoleProps {
  /** Last `/healthz` payload App.tsx already has so we don't double-fetch
   *  on mount. The Re-check button re-fetches anyway. */
  initialHealth: HealthCheckResponse | null;
  onClose: () => void;
}

export function OpsConsole({ initialHealth, onClose }: OpsConsoleProps): JSX.Element {
  const [health, setHealth] = useState<HealthCheckResponse | null>(initialHealth);
  const [backup, setBackup] = useState<BackupStatusResponse | null>(null);
  const [usage, setUsage] = useState<OpsUsageSummaryResponse | null>(null);
  const [timeseries, setTimeseries] = useState<OpsUsageTimeseriesResponse | null>(null);
  const [diag, setDiag] = useState<OpsDiagnosticsResponse | null>(null);
  const [crashReports, setCrashReports] =
    useState<CrashReportListResponse | null>(null);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Latest GitHub release state. Populated ONLY when the user clicks
  // the "Check latest release" button — never on mount, never on a
  // background timer. The result is a discriminated union so the UI
  // can render a friendly hint for every observable outcome (200, 404,
  // 403, network, parse error).
  const [releaseCheck, setReleaseCheck] = useState<LatestReleaseResult | null>(
    null
  );
  const [releaseCheckBusy, setReleaseCheckBusy] = useState<boolean>(false);
  const [releaseCheckedAt, setReleaseCheckedAt] = useState<string | null>(null);
  // Phase 9-D-B4 — small error slot for the "Open releases page —" button.
  // Populated only on the rare failure path (popup blocker / bridge
  // unavailable / shell.openExternal rejected). Success leaves it null
  // so no visible noise appears on the happy path.
  const [openReleasesError, setOpenReleasesError] = useState<string | null>(null);
  // Phase 9-D-B3 — push modal state (Ops console mirror of BackupPanel).
  // Open only via the explicit "Run backup + push" button below; never
  // auto-opened, never on mount, never on a timer. `pushBusy` tracks
  // the inflight `/backup/run` POST so the modal can disable input.
  const [pushModalOpen, setPushModalOpen] = useState<boolean>(false);
  const [pushBusy, setPushBusy] = useState<boolean>(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [pushResult, setPushResult] = useState<BackupRunResponse | null>(null);
  const [pushResultText, setPushResultText] = useState<string | null>(null);

  const titleId = "ce-ops-console-title";
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const refresh = useCallback(async () => {
    setBusy(true);
    setError(null);
    // Each fetch settles independently — one slow/failing endpoint must
    // not block the others. `Promise.allSettled` keeps partial-success
    // visible to the user.
    const [h, b, u, d, t, c] = await Promise.allSettled([
      apiHealthCheck(),
      apiBackupStatus(),
      apiOpsUsageSummary(),
      apiOpsDiagnostics(),
      apiOpsUsageTimeseries(30),
      apiOpsCrashReports(),
    ]);
    if (h.status === "fulfilled") setHealth(h.value);
    if (b.status === "fulfilled") setBackup(b.value);
    if (u.status === "fulfilled") setUsage(u.value);
    if (d.status === "fulfilled") setDiag(d.value);
    if (t.status === "fulfilled") setTimeseries(t.value);
    if (c.status === "fulfilled") setCrashReports(c.value);
    // First failure gets surfaced; the other panels still render the
    // last-known state (which is "—" on the first load).
    const failures = [h, b, u, d, t, c].filter(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult[];
    if (failures.length > 0) {
      setError(describeApiError(failures[0].reason));
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onOpenReleases = useCallback(async () => {
    // Phase 9-D-B4 — route through the centralised opener.
    //
    //   In Electron, this uses `window.ceBridge.openExternal` (preload
    //   bridge — ipcMain — shell.openExternal) — the only sandbox-safe
    //   path to escape the renderer. The Phase 9-D-B3 walkthrough
    //   surfaced that the prior `window.open(...)` call was dying
    //   inside `setWindowOpenHandler`'s blanket deny, logging
    //   `window.open denied for —` and leaving the user with a dead
    //   button. The bridge bypasses that handler entirely.
    //
    //   In Vite dev mode (regular browser tab), `openExternalUrl`
    //   falls back to `window.open(..., "_blank", "noopener,noreferrer")`
    //   so the same call works in both environments.
    setOpenReleasesError(null);
    const result = await openExternalUrl(RELEASES_URL);
    if (result.status !== "ok") {
      setOpenReleasesError(
        `${result.message} You can copy the URL above (${RELEASES_URL}) into your browser.`
      );
    }
  }, []);

  const onCheckLatestRelease = useCallback(async () => {
    // EXPLICITLY USER-TRIGGERED. No setInterval / setTimeout / on-mount
    // wrapper around this call exists anywhere in the file. A single
    // fetch to GitHub's public unauthenticated REST API; failures are
    // converted into a friendly hint by `fetchLatestRelease`.
    setReleaseCheckBusy(true);
    try {
      const result = await fetchLatestRelease();
      setReleaseCheck(result);
      setReleaseCheckedAt(new Date().toISOString());
    } finally {
      setReleaseCheckBusy(false);
    }
  }, []);

  const appVersionLabel = useMemo(() => {
    return diag?.version ?? health?.version ?? "—";
  }, [diag, health]);

  // Three-state comparison: only meaningful when both the local version
  // is known AND the latest-release check succeeded. Anything else (no
  // check yet, network error, rate-limited, no release published) maps
  // to a friendly neutral state instead of a false "release available".
  const releaseComparison: ReleaseComparison | null = useMemo(() => {
    if (!releaseCheck || releaseCheck.status !== "ok") return null;
    return compareLocalToLatest(appVersionLabel, releaseCheck.info.tagName);
  }, [releaseCheck, appVersionLabel]);

  // Phase 9-D-B3 — same push-readiness derivation as BackupPanel.
  // Kept inline here rather than imported because the rule is short
  // and the two surfaces should drift independently if the user wants
  // to tighten the Ops-side rule in the future.
  const pushReadiness = useMemo<{ ready: boolean; reason: string | null }>(
    () => {
      if (!backup) return { ready: false, reason: "Backup status not loaded yet — try Refresh." };
      if (!backup.gitReady)
        return { ready: false, reason: "Git is not installed or not on PATH." };
      if (!backup.enabled)
        return { ready: false, reason: "Backup is not enabled. Configure it from the Backup card or the Setup wizard." };
      if (!backup.repoReady)
        return { ready: false, reason: "Backup repo is not initialised. Run a dry-run from the Backup card first." };
      if (!backup.remoteConfigured)
        return {
          ready: false,
          reason:
            "No remote configured. Open a terminal in the backup repo and run `git remote add origin <url>`, then Refresh.",
        };
      return { ready: true, reason: null };
    },
    [backup]
  );

  const openPushModal = useCallback(() => {
    if (!pushReadiness.ready) return;
    setPushError(null);
    setPushResult(null);
    setPushResultText(null);
    setPushModalOpen(true);
  }, [pushReadiness.ready]);

  const closePushModal = useCallback(() => {
    if (pushBusy) return;
    setPushModalOpen(false);
    setPushError(null);
  }, [pushBusy]);

  const confirmPush = useCallback(async () => {
    setPushBusy(true);
    setPushError(null);
    try {
      const r = await apiBackupRun(true);
      setPushResult(r);
      setPushModalOpen(false);
      if (r.changed && r.committed && r.pushed) {
        setPushResultText(
          `Committed ${r.commitHash?.slice(0, 10) ?? ""}… and pushed.`
        );
      } else if (r.changed && r.committed && !r.pushed) {
        setPushResultText(
          `Committed ${r.commitHash?.slice(0, 10) ?? ""}… but push was not completed${
            r.pushReason ? `: ${r.pushReason}` : "."
          }`
        );
      } else {
        setPushResultText("Nothing changed (idempotent); nothing to push.");
      }
      // Refresh the backup card so the new state (e.g. a new commit
      // visible in `/backup/status.repoReady`) is reflected.
      try {
        const fresh = await apiBackupStatus();
        setBackup(fresh);
      } catch {
        /* non-fatal — the user can hit Refresh */
      }
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : e instanceof Error
            ? e.message
            : "push failed";
      setPushError(text);
    } finally {
      setPushBusy(false);
    }
  }, []);

  return (
    <div
      className="ce-modal-backdrop ce-ops-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ce-modal ce-ops"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="ce-ops-header">
          <h2 className="ce-modal-title" id={titleId}>
            Ops console
          </h2>
          <div className="ce-ops-header-actions">
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={() => void refresh()}
              disabled={busy}
            >
              {busy ? "Refreshing…" : "Refresh"}
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={onClose}
              aria-label="Close ops console"
              title="Close"
            >
              ✕
            </button>
          </div>
        </header>

        {error && (
          <div className="ce-wizard-hint ce-wizard-hint-error" role="alert">
            {error}
          </div>
        )}

        <section className="ce-ops-body">
          <DiagnosticsCard diag={diag} health={health} backup={backup} />
          <UsageCard usage={usage} />
          <BudgetTrendsCard timeseries={timeseries} />
          <LogsCard diag={diag} />
          <CrashReportsCard list={crashReports} />
          <BackupCard
            backup={backup}
            pushReadiness={pushReadiness}
            pushBusy={pushBusy}
            pushResult={pushResult}
            pushResultText={pushResultText}
            onOpenPushModal={openPushModal}
          />
          <UpdateInfoCard
            version={appVersionLabel}
            backendVersion={diag?.version ?? health?.version ?? null}
            autoUpdateEnabled={diag?.autoUpdate.enabled === true}
            autoUpdateReason={diag?.autoUpdate.reason ?? null}
            releasesUrl={RELEASES_URL}
            releaseCheck={releaseCheck}
            releaseCheckBusy={releaseCheckBusy}
            releaseCheckedAt={releaseCheckedAt}
            releaseComparison={releaseComparison}
            openReleasesError={openReleasesError}
            onOpenReleases={() => void onOpenReleases()}
            onCheckLatestRelease={() => void onCheckLatestRelease()}
          />
        </section>
      </div>
      {pushModalOpen && (
        <BackupPushConfirmModal
          redactedRemote={backup?.remote ?? null}
          busy={pushBusy}
          error={pushError}
          onConfirm={confirmPush}
          onCancel={closePushModal}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function DiagnosticsCard({
  diag,
  health,
  backup,
}: {
  diag: OpsDiagnosticsResponse | null;
  health: HealthCheckResponse | null;
  backup: BackupStatusResponse | null;
}): JSX.Element {
  const claude = diag?.providers?.claude ?? health?.providers?.claude ?? null;
  const mock = diag?.providers?.mock ?? health?.providers?.mock ?? null;
  const primary = diag?.providers?.primary ?? health?.providers?.primary ?? "—";
  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Diagnostics</h3>
      <dl className="ce-wizard-kv">
        <KvRow label="Service" value={diag?.service ?? health?.service ?? "—"} />
        <KvRow label="Version" value={diag?.version ?? health?.version ?? "—"} />
        <KvRow label="Runtime dir" value={diag?.runtimeDir ?? health?.runtimeDir ?? "—"} mono />
        <KvRow label="Logs dir" value={diag?.logsDir ?? "—"} mono />
        <KvRow
          label="Storage ready"
          value={readyLabel(health?.storageReady)}
        />
        <KvRow label="DB ready" value={readyLabel(health?.dbReady)} />
        <KvRow
          label="Seeded agents"
          value={
            (diag?.seededAgentSlugs ?? health?.seededAgentSlugs)?.length
              ? String((diag?.seededAgentSlugs ?? health?.seededAgentSlugs)!.length)
              : "—"
          }
        />
        <KvRow label="Primary provider" value={primary} mono />
        <KvRow label="Claude installed" value={readyLabel(claude?.installed)} />
        <KvRow label="Claude auth" value={claude?.authStatus ?? "unknown"} />
        <KvRow label="Claude ready" value={readyLabel(claude?.ready)} />
        <KvRow label="Mock ready" value={readyLabel(mock?.ready)} />
        {backup && (
          <>
            <KvRow label="Backup enabled" value={backup.enabled ? "yes" : "no"} />
            <KvRow label="Backup repo ready" value={readyLabel(backup.repoReady)} />
            <KvRow
              label="Backup remote"
              value={backup.remoteConfigured ? backup.remote ?? "configured" : "not set"}
              mono={backup.remoteConfigured && backup.remote !== null}
            />
          </>
        )}
      </dl>
    </div>
  );
}

function UsageCard({ usage }: { usage: OpsUsageSummaryResponse | null }): JSX.Element {
  if (!usage) {
    return (
      <div className="ce-ops-card">
        <h3 className="ce-ops-card-title">Usage &amp; cost</h3>
        <p className="ce-wizard-step-text">Loading usage summary…</p>
      </div>
    );
  }
  const providers = Object.entries(usage.byProvider).sort((a, b) => b[1].events - a[1].events);
  const agents = Object.entries(usage.byAgentSlug).sort((a, b) => b[1].events - a[1].events);
  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Usage &amp; cost</h3>
      <p className="ce-wizard-step-text">
        Read-only aggregation of <code>agent_events.usage_json</code>. No chat content
        or prompts are read or exposed. Cost figures are whatever the Claude
        CLI reported in its result event — mock-provider rows contribute zero
        cost. Window: up to {usage.windowRowsConsidered} most recent events
        ({usage.eventsWithMalformedUsage} skipped due to malformed usage JSON).
      </p>
      <div className="ce-ops-kpi-row">
        <KpiTile label="Events (overall)" value={String(usage.overall.events)} />
        <KpiTile label="With usage data" value={String(usage.overall.eventsWithUsage)} />
        <KpiTile
          label="Input tokens"
          value={fmtInt(usage.overall.inputTokens)}
        />
        <KpiTile
          label="Output tokens"
          value={fmtInt(usage.overall.outputTokens)}
        />
        <KpiTile
          label={`Cost (${usage.currency})`}
          value={fmtUsd(usage.overall.totalCostUsd)}
        />
        <KpiTile
          label="Errors"
          value={String(usage.overall.errors)}
          warn={usage.overall.errors > 0}
        />
        <KpiTile
          label="Fallbacks"
          value={String(usage.overall.fallbacks)}
          warn={usage.overall.fallbacks > 0}
        />
      </div>
      <div className="ce-ops-window-row">
        <WindowTile label="Last 24 h" bucket={usage.last24h} currency={usage.currency} />
        <WindowTile label="Last 7 d" bucket={usage.last7d} currency={usage.currency} />
      </div>
      <div className="ce-ops-breakdowns">
        <BreakdownTable
          title="By provider"
          rows={providers}
          currency={usage.currency}
        />
        <BreakdownTable
          title="By agent"
          rows={agents}
          currency={usage.currency}
        />
      </div>
      {usage.notes && usage.notes.length > 0 && (
        <ul className="ce-ops-notes">
          {usage.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase 9-D-C1 - Budget & trends card
// ---------------------------------------------------------------------------
//
// Local-only, read-only cost-budget alerts + cost time-series chart
// foundation. Reads numeric thresholds from localStorage (keys
// `creativedge.budget.daily` and `creativedge.budget.monthly`, USD,
// numeric only) and compares against the today / month-to-date
// buckets returned by `/ops/usage/timeseries`. Alerts are local
// visual warnings only - no notifications, no background jobs, no
// scheduled tasks, no telemetry. The inline SVG bar chart renders
// the dense `days` array without any chart library.
//
// Privacy contract (verbatim from the user's 9-D-C1 brief):
//   - localStorage stores only numeric thresholds. Never secrets.
//     Never prompts. Never message content. Never memory content.
//   - Alerts are local-only visual warnings.
//   - No external requests on this card. The Phase 9-D-B1 manual
//     latest-release check is a separate user-click action in the
//     Update info card.
//   - No prompts / chat content / memory content / env vars / auth
//     tokens are rendered or logged.

const BUDGET_DAILY_KEY = "creativedge.budget.daily";
const BUDGET_MONTHLY_KEY = "creativedge.budget.monthly";

type BudgetValue = number | null;

function safeReadBudget(key: string): BudgetValue {
  try {
    const raw =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem(key)
        : null;
    if (raw === null || raw === "") return null;
    const n = Number.parseFloat(raw);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  } catch {
    return null;
  }
}

function safeWriteBudget(key: string, value: BudgetValue): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, String(value));
    }
  } catch {
    /* localStorage unavailable - silently no-op */
  }
}

type AlertState = "ok" | "near" | "over" | "unavailable";

function alertStateFor(current: number, budget: BudgetValue): AlertState {
  if (budget === null || budget <= 0) return "unavailable";
  if (!Number.isFinite(current) || current < 0) return "unavailable";
  if (current >= budget) return "over";
  if (current >= budget * 0.8) return "near";
  return "ok";
}

function alertBadgeClass(state: AlertState): string {
  switch (state) {
    case "ok":           return "ce-status ce-status-ok";
    case "near":         return "ce-status ce-status-warn";
    case "over":         return "ce-status ce-status-err";
    case "unavailable":  return "ce-status ce-status-info";
  }
}

function alertBadgeText(state: AlertState): string {
  switch (state) {
    case "ok":           return "OK";
    case "near":         return "Near budget";
    case "over":         return "Over budget";
    case "unavailable":  return "Unavailable";
  }
}

function BudgetTrendsCard({
  timeseries,
}: {
  timeseries: OpsUsageTimeseriesResponse | null;
}): JSX.Element {
  const [budgetDaily, setBudgetDaily] = useState<BudgetValue>(() =>
    safeReadBudget(BUDGET_DAILY_KEY)
  );
  const [budgetMonthly, setBudgetMonthly] = useState<BudgetValue>(() =>
    safeReadBudget(BUDGET_MONTHLY_KEY)
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [draftDaily, setDraftDaily] = useState<string>("");
  const [draftMonthly, setDraftMonthly] = useState<string>("");

  const openEditor = useCallback(() => {
    setDraftDaily(budgetDaily === null ? "" : String(budgetDaily));
    setDraftMonthly(budgetMonthly === null ? "" : String(budgetMonthly));
    setEditing(true);
  }, [budgetDaily, budgetMonthly]);

  const cancelEditor = useCallback(() => {
    setEditing(false);
  }, []);

  const saveEditor = useCallback(() => {
    const parsedDaily = draftDaily.trim() === "" ? null : Number.parseFloat(draftDaily);
    const parsedMonthly = draftMonthly.trim() === "" ? null : Number.parseFloat(draftMonthly);
    const finalDaily: BudgetValue =
      parsedDaily === null
        ? null
        : Number.isFinite(parsedDaily) && parsedDaily >= 0
          ? parsedDaily
          : null;
    const finalMonthly: BudgetValue =
      parsedMonthly === null
        ? null
        : Number.isFinite(parsedMonthly) && parsedMonthly >= 0
          ? parsedMonthly
          : null;
    setBudgetDaily(finalDaily);
    setBudgetMonthly(finalMonthly);
    safeWriteBudget(BUDGET_DAILY_KEY, finalDaily);
    safeWriteBudget(BUDGET_MONTHLY_KEY, finalMonthly);
    setEditing(false);
  }, [draftDaily, draftMonthly]);

  const resetBudget = useCallback(() => {
    setBudgetDaily(null);
    setBudgetMonthly(null);
    safeWriteBudget(BUDGET_DAILY_KEY, null);
    safeWriteBudget(BUDGET_MONTHLY_KEY, null);
    setEditing(false);
  }, []);

  if (!timeseries) {
    return (
      <div className="ce-ops-card">
        <h3 className="ce-ops-card-title">Budget &amp; trends</h3>
        <p className="ce-wizard-step-text">Loading usage trend...</p>
      </div>
    );
  }

  const todayCost = timeseries.today.totalCostUsd;
  const monthCost = timeseries.monthToDate.totalCostUsd;
  const dailyAlert = alertStateFor(todayCost, budgetDaily);
  const monthlyAlert = alertStateFor(monthCost, budgetMonthly);

  const currency = timeseries.currency || "USD";

  const hasAnyCost = timeseries.days.some(
    (d) => d.totalCostUsd > 0 || d.inputTokens > 0 || d.outputTokens > 0
  );

  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Budget &amp; trends</h3>
      <p className="ce-wizard-step-text">
        Local-only advisory budget. Thresholds are stored in your browser
        (numeric only - no prompts, no chat content, no memory content,
        no secrets). Cost estimates depend on the Claude CLI reporting{" "}
        <code>total_cost_usd</code> in its result events; mock-provider
        rows contribute zero cost. Time-series window:{" "}
        {timeseries.requestedDays} days - day boundaries are UTC midnight.
      </p>

      <dl className="ce-wizard-kv">
        <KvRow label="Today (UTC)" value={fmtUsd(todayCost)} />
        <KvRow
          label="Daily budget"
          value={budgetDaily === null ? "(not set)" : fmtUsd(budgetDaily)}
        />
        <KvRow label={`Daily (${currency}) state`} value={alertBadgeText(dailyAlert)} />
        <KvRow label="Month to date (UTC)" value={fmtUsd(monthCost)} />
        <KvRow
          label="Monthly budget"
          value={budgetMonthly === null ? "(not set)" : fmtUsd(budgetMonthly)}
        />
        <KvRow label={`Monthly (${currency}) state`} value={alertBadgeText(monthlyAlert)} />
      </dl>

      <div className="ce-wizard-actions-row">
        <span className={alertBadgeClass(dailyAlert)} role="status">
          Daily: {alertBadgeText(dailyAlert)}
        </span>
        <span className={alertBadgeClass(monthlyAlert)} role="status">
          Monthly: {alertBadgeText(monthlyAlert)}
        </span>
      </div>

      {!hasAnyCost ? (
        <p className="ce-wizard-hint" role="status">
          No usage data yet. Send a chat to record cost; the chart below
          will populate as new <code>agent_events</code> rows arrive.
        </p>
      ) : (
        <BudgetTrendChart
          days={timeseries.days}
          dailyBudget={budgetDaily}
          todayKey={timeseries.todayKey}
        />
      )}

      {!editing ? (
        <div className="ce-wizard-actions-row">
          <button
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={openEditor}
            title="Configure local budget thresholds (numeric only; stored in localStorage)"
          >
            Configure local budget
          </button>
          {(budgetDaily !== null || budgetMonthly !== null) && (
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={resetBudget}
              title="Clear both budget thresholds from localStorage"
            >
              Reset budget
            </button>
          )}
        </div>
      ) : (
        <div className="ce-backup-config-body" role="group" aria-label="Configure local budget">
          <p className="ce-hint">
            Thresholds are advisory and local-only. Leave a field blank to
            clear that threshold. Values are USD.
          </p>
          <label className="ce-form-field">
            <span>Daily budget (USD):</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={draftDaily}
              onChange={(e) => setDraftDaily(e.target.value)}
              placeholder="e.g. 1.00"
              autoComplete="off"
            />
          </label>
          <label className="ce-form-field">
            <span>Monthly budget (USD):</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={draftMonthly}
              onChange={(e) => setDraftMonthly(e.target.value)}
              placeholder="e.g. 20.00"
              autoComplete="off"
            />
          </label>
          <div className="ce-wizard-actions-row">
            <button
              type="button"
              className="ce-btn ce-btn-primary"
              onClick={saveEditor}
            >
              Save
            </button>
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={cancelEditor}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {timeseries.eventsWithMalformedUsage > 0 && (
        <p className="ce-wizard-hint ce-wizard-hint-warn" role="status">
          {timeseries.eventsWithMalformedUsage} event
          {timeseries.eventsWithMalformedUsage === 1 ? "" : "s"} had
          malformed <code>usage_json</code> and contributed zero
          tokens/cost.
        </p>
      )}
    </div>
  );
}

function BudgetTrendChart({
  days,
  dailyBudget,
  todayKey,
}: {
  days: OpsTimeseriesBucket[];
  dailyBudget: BudgetValue;
  todayKey: string;
}): JSX.Element {
  const maxCost = days.reduce((m, d) => Math.max(m, d.totalCostUsd), 0);
  const budgetForScale = dailyBudget !== null && dailyBudget > 0 ? dailyBudget : 0;
  const yMax = Math.max(maxCost, budgetForScale, 0.01);

  const W = 600;
  const H = 160;
  const LEFT = 40;
  const RIGHT = W - 20;
  const TOP = 10;
  const BOTTOM = H - 30;
  const innerW = RIGHT - LEFT;
  const innerH = BOTTOM - TOP;

  const barCount = Math.max(days.length, 1);
  const barGap = 2;
  const barW = Math.max(1, innerW / barCount - barGap);

  let budgetLineY: number | null = null;
  if (dailyBudget !== null && dailyBudget > 0) {
    budgetLineY = BOTTOM - (dailyBudget / yMax) * innerH;
  }

  const yMaxLabel = fmtUsd(yMax);

  return (
    <div className="ce-ops-budget-chart" role="img" aria-label="Daily cost trend">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <line x1={LEFT} y1={TOP} x2={LEFT} y2={BOTTOM} stroke="currentColor" strokeOpacity="0.25" />
        <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} stroke="currentColor" strokeOpacity="0.25" />

        <text x={LEFT - 4} y={TOP + 4} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity="0.65">
          {yMaxLabel}
        </text>
        <text x={LEFT - 4} y={BOTTOM} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity="0.65">
          $0
        </text>

        {budgetLineY !== null && (
          <>
            <line
              x1={LEFT}
              y1={budgetLineY}
              x2={RIGHT}
              y2={budgetLineY}
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeDasharray="4 3"
            />
            <text
              x={RIGHT - 2}
              y={Math.max(TOP + 8, budgetLineY - 2)}
              textAnchor="end"
              fontSize="10"
              fill="currentColor"
              fillOpacity="0.75"
            >
              budget {fmtUsd(dailyBudget ?? 0)}
            </text>
          </>
        )}

        {days.map((d, i) => {
          const x = LEFT + i * (barW + barGap);
          const h = (d.totalCostUsd / yMax) * innerH;
          const y = BOTTOM - h;
          const isToday = d.dayKey === todayKey;
          const fill = isToday ? "#3b82f6" : "#64748b";
          const opacity = d.totalCostUsd > 0 ? 0.85 : 0.25;
          return (
            <g key={d.dayKey}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, h)}
                fill={fill}
                opacity={opacity}
              >
                <title>{`${d.dayKey} - ${fmtUsd(d.totalCostUsd)} - ${d.events} event${d.events === 1 ? "" : "s"}`}</title>
              </rect>
              {(i === 0 || i === days.length - 1 || i % 7 === 0) && (
                <text
                  x={x + barW / 2}
                  y={H - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="currentColor"
                  fillOpacity="0.55"
                >
                  {d.dayKey.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="ce-wizard-step-text" style={{ marginTop: "0.25rem" }}>
        Bars: daily cost over the last {days.length} day{days.length === 1 ? "" : "s"} - today highlighted in blue - dashed line: daily budget threshold (when set). Hover a bar for the day's USD total and event count.
      </p>
    </div>
  );
}

function LogsCard({ diag }: { diag: OpsDiagnosticsResponse | null }): JSX.Element {
  if (!diag) {
    return (
      <div className="ce-ops-card">
        <h3 className="ce-ops-card-title">Local logs</h3>
        <p className="ce-wizard-step-text">Loading log scan…</p>
      </div>
    );
  }
  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Local logs</h3>
      <p className="ce-wizard-step-text">
        Backend stdout/stderr is captured to <code>{diag.logsDir}</code>. On
        unexpected backend exits a structured crash record is written to the
        same folder. The files are local; nothing is uploaded anywhere.
      </p>
      {diag.logsScanError && (
        <div className="ce-wizard-hint ce-wizard-hint-warn" role="status">
          Could not scan logs dir: <code>{diag.logsScanError}</code>
        </div>
      )}
      <LogTable title="Latest crash records" rows={diag.crashLogs} emptyText="No crash records — that's a good thing." />
      <LogTable title="Recent backend logs" rows={diag.backendLogs} emptyText="No backend logs captured yet." />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase 9-D-C2 - Crash reports card (prepare + copy + download)
// ---------------------------------------------------------------------------
//
// Local-only crash-report prepare/export UX. Surfaces the
// /ops/crash-reports list and lets the user prepare an individual
// report for review. The prepared JSON can be copied to the clipboard
// or downloaded as a file via a Blob URL.
//
// IMPORTANT - the design is explicitly review-and-share-manually only:
//   - No "Send" button.
//   - No "Upload" button.
//   - No "Email" button.
//   - No GitHub-issue creation.
//   - No telemetry.
//   - No background polling.
//   - No automatic external request.
//
// The user is responsible for attaching the downloaded file to their
// usual support channel if they want to share it. The card text
// repeats this contract prominently so there is no ambiguity.

function CrashReportsCard({
  list,
}: {
  list: CrashReportListResponse | null;
}): JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<PreparedCrashReport | null>(null);
  const [prepBusy, setPrepBusy] = useState<boolean>(false);
  const [prepError, setPrepError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");
  const [downloadState, setDownloadState] = useState<"idle" | "ok" | "err">(
    "idle"
  );

  const onPrepare = useCallback(async (row: CrashReportSummary) => {
    setActiveId(row.id);
    setPrepared(null);
    setPrepError(null);
    setCopyState("idle");
    setDownloadState("idle");
    setPrepBusy(true);
    try {
      const r = await apiOpsPrepareCrashReport(row.id);
      setPrepared(r.report);
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : e instanceof Error
            ? e.message
            : "prepare failed";
      setPrepError(text);
    } finally {
      setPrepBusy(false);
    }
  }, []);

  const onCloseReview = useCallback(() => {
    setActiveId(null);
    setPrepared(null);
    setPrepError(null);
    setCopyState("idle");
    setDownloadState("idle");
  }, []);

  const preparedJsonText = useMemo<string>(() => {
    if (!prepared) return "";
    try {
      return JSON.stringify(prepared, null, 2);
    } catch {
      return "";
    }
  }, [prepared]);

  const onCopyReport = useCallback(async () => {
    if (!preparedJsonText) return;
    setCopyState("idle");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(preparedJsonText);
        setCopyState("ok");
        return;
      }
      // No clipboard API available (very old browsers / locked-down
      // contexts). Surface a hint so the user can fall back to a
      // manual select-and-copy from the <pre> below.
      setCopyState("err");
    } catch {
      setCopyState("err");
    }
  }, [preparedJsonText]);

  const onDownloadReport = useCallback(() => {
    if (!prepared || !preparedJsonText) return;
    setDownloadState("idle");
    try {
      const blob = new Blob([preparedJsonText], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Use the report's crashLogFileName + ".report.json" so the
      // download is easy to identify if the user keeps several.
      const base = prepared.crashLogFileName.replace(/\.log$/i, "");
      a.download = `${base}.report.json`;
      // Append-to-DOM-then-click is the cross-browser-reliable pattern.
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Release the blob URL on the next tick so the download has a
      // moment to start. setTimeout 0 is fine; no need for a longer
      // delay because the browser has already taken over the resource.
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* noop */
        }
      }, 0);
      setDownloadState("ok");
    } catch {
      setDownloadState("err");
    }
  }, [prepared, preparedJsonText]);

  if (!list) {
    return (
      <div className="ce-ops-card">
        <h3 className="ce-ops-card-title">Crash reports</h3>
        <p className="ce-wizard-step-text">Loading crash reports...</p>
      </div>
    );
  }

  const reports = list.reports ?? [];
  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Crash reports</h3>
      <p className="ce-wizard-step-text">
        Crash reports are local JSON files written to{" "}
        <code>{list.logsDir}</code> when the backend exits unexpectedly.{" "}
        <strong>
          Nothing is uploaded, emailed, or sent automatically by CreativEdge.
        </strong>{" "}
        To share a report with someone, prepare it below, then copy or
        download the allow-listed JSON and attach it to your usual support
        channel manually. The prepared report contains structured
        diagnostic fields only - never chat content, prompts, memory,
        environment variables, or credentials.
      </p>
      {list.logsScanError && (
        <div className="ce-wizard-hint ce-wizard-hint-warn" role="status">
          Could not scan logs dir: <code>{list.logsScanError}</code>
        </div>
      )}
      {list.truncated && (
        <p className="ce-wizard-hint" role="status">
          More than 25 crash reports on disk; showing the 25 newest.
        </p>
      )}
      {reports.length === 0 ? (
        <p className="ce-wizard-step-text">
          No crash reports found - that's a good thing. Nothing is sent
          automatically anyway.
        </p>
      ) : (
        <table className="ce-ops-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>Modified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="ce-mono">{r.name}</td>
                <td>{fmtBytes(r.size)}</td>
                <td>
                  {r.mtime.replace("T", " ").replace(/\.\d{3}Z$/, " UTC")}
                </td>
                <td>
                  <button
                    type="button"
                    className="ce-btn ce-btn-secondary"
                    onClick={() => void onPrepare(r)}
                    disabled={prepBusy && activeId === r.id}
                    title="Read the on-disk crash JSON, apply the allow-list, and show a review panel below. Nothing is sent anywhere."
                  >
                    {prepBusy && activeId === r.id
                      ? "Preparing..."
                      : activeId === r.id
                        ? "Re-prepare"
                        : "Prepare report"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {prepError && (
        <p className="ce-wizard-hint ce-wizard-hint-error" role="alert">
          Could not prepare crash report: {prepError}
        </p>
      )}

      {prepared && (
        <div
          className="ce-backup-config-body"
          role="region"
          aria-label="Prepared crash report review"
        >
          <h4 className="ce-ops-breakdown-title">
            Review prepared report ({prepared.crashLogFileName})
          </h4>
          <p className="ce-wizard-hint" role="status">
            {prepared.privacyNotice}
          </p>
          {prepared.droppedFields.length > 0 && (
            <p className="ce-wizard-step-text">
              <strong>Dropped fields</strong> (not included in the prepared
              report): <code>{prepared.droppedFields.join(", ")}</code>
            </p>
          )}
          {prepared.validationWarnings.length > 0 && (
            <ul className="ce-ops-notes">
              {prepared.validationWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <pre
            className="ce-mono"
            style={{
              maxHeight: "320px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              padding: "0.5rem",
            }}
            aria-label="Prepared crash report JSON"
          >
            {preparedJsonText}
          </pre>
          <div className="ce-wizard-actions-row">
            <button
              type="button"
              className="ce-btn ce-btn-primary"
              onClick={() => void onCopyReport()}
              title="Copy the prepared JSON to your clipboard. Nothing is sent over the network."
            >
              Copy report JSON
            </button>
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={onDownloadReport}
              title="Download the prepared JSON as a local file. Nothing is sent over the network."
            >
              Download report JSON
            </button>
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={onCloseReview}
              title="Close the review panel."
            >
              Close review
            </button>
          </div>
          {copyState === "ok" && (
            <p className="ce-wizard-hint" role="status">
              Copied to clipboard. Paste it into your support channel
              manually to share.
            </p>
          )}
          {copyState === "err" && (
            <p
              className="ce-wizard-hint ce-wizard-hint-warn"
              role="status"
            >
              Clipboard unavailable in this context. Select the JSON
              above and copy it with Ctrl/Cmd+C instead.
            </p>
          )}
          {downloadState === "ok" && (
            <p className="ce-wizard-hint" role="status">
              Download started. The file lives in your default
              downloads folder; CreativEdge did not transmit anything.
            </p>
          )}
          {downloadState === "err" && (
            <p
              className="ce-wizard-hint ce-wizard-hint-error"
              role="alert"
            >
              Download failed. You can still copy the JSON above and
              save it manually.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function BackupCard({
  backup,
  pushReadiness,
  pushBusy,
  pushResult,
  pushResultText,
  onOpenPushModal,
}: {
  backup: BackupStatusResponse | null;
  pushReadiness: { ready: boolean; reason: string | null };
  pushBusy: boolean;
  pushResult: BackupRunResponse | null;
  pushResultText: string | null;
  onOpenPushModal: () => void;
}): JSX.Element {
  // Phase 9-D-B3 — read-only Backup card in the Ops console with one
  // intentional mutation affordance: the explicit "Run backup + push"
  // button. Everything else here is metadata read from
  // `/backup/status` (already loaded by the parent's refresh).
  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Backup</h3>
      {!backup ? (
        <p className="ce-wizard-step-text">Loading backup status…</p>
      ) : (
        <>
          <dl className="ce-wizard-kv">
            <KvRow label="Enabled" value={backup.enabled ? "yes" : "no"} />
            <KvRow label="Git on PATH" value={readyLabel(backup.gitReady)} />
            <KvRow label="Repo initialised" value={readyLabel(backup.repoReady)} />
            <KvRow
              label="Remote configured"
              value={backup.remoteConfigured ? "yes" : "no"}
            />
            {backup.remote && (
              <KvRow label="Remote" value={backup.remote} mono />
            )}
            <KvRow label="Next action" value={backup.nextAction} />
          </dl>
          <p className="ce-wizard-step-text">
            Backups stay local by default. The push button below is opt-in
            and asks for a second confirmation. Credentials are handled by
            your local Git setup (HTTPS credential helper or SSH agent);
            CreativEdge never collects or stores them.
          </p>
          <div className="ce-wizard-actions-row">
            <button
              type="button"
              className="ce-btn ce-btn-primary"
              onClick={onOpenPushModal}
              disabled={pushBusy || !pushReadiness.ready}
              title={
                pushReadiness.ready
                  ? "Run backup and push to the configured remote (asks to confirm)"
                  : pushReadiness.reason ?? "Push not available yet"
              }
              aria-describedby={
                pushReadiness.ready
                  ? undefined
                  : "ce-ops-backup-push-disabled-hint"
              }
            >
              {pushBusy ? "Pushing…" : "Run backup + push"}
            </button>
          </div>
          {!pushReadiness.ready && pushReadiness.reason && (
            <p
              id="ce-ops-backup-push-disabled-hint"
              className="ce-wizard-hint"
              role="note"
            >
              Push unavailable: {pushReadiness.reason}
            </p>
          )}
          {pushResultText && pushResult && (
            <p
              className={
                pushResult.pushed
                  ? "ce-wizard-hint"
                  : pushResult.changed
                    ? "ce-wizard-hint ce-wizard-hint-warn"
                    : "ce-wizard-hint"
              }
              role="status"
            >
              {pushResultText}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function UpdateInfoCard({
  version,
  backendVersion,
  autoUpdateEnabled,
  autoUpdateReason,
  releasesUrl,
  releaseCheck,
  releaseCheckBusy,
  releaseCheckedAt,
  releaseComparison,
  openReleasesError,
  onOpenReleases,
  onCheckLatestRelease,
}: {
  version: string;
  backendVersion: string | null;
  autoUpdateEnabled: boolean;
  autoUpdateReason: string | null;
  releasesUrl: string;
  releaseCheck: LatestReleaseResult | null;
  releaseCheckBusy: boolean;
  releaseCheckedAt: string | null;
  releaseComparison: ReleaseComparison | null;
  openReleasesError: string | null;
  onOpenReleases: () => void;
  onCheckLatestRelease: () => void;
}): JSX.Element {
  // Comparison badge. Only rendered when the check has succeeded;
  // every other state (no check yet, 404, 403, network error) is
  // surfaced via the message paragraph below — no false "release
  // available" signal.
  let comparisonBadge: JSX.Element | null = null;
  if (releaseComparison === "up-to-date") {
    comparisonBadge = (
      <span className="ce-status ce-status-ok" role="status">
        Up to date
      </span>
    );
  } else if (releaseComparison === "release-available") {
    comparisonBadge = (
      <span className="ce-status ce-status-warn" role="status">
        Release available
      </span>
    );
  } else if (releaseComparison === "unable-to-compare") {
    comparisonBadge = (
      <span className="ce-status ce-status-info" role="status">
        Unable to compare
      </span>
    );
  }

  // Friendly hint for every observable outcome. The OK case shows the
  // latest tag/name/published date; everything else shows the message
  // produced by the discriminated union in release.ts.
  let releaseHint: JSX.Element | null = null;
  if (releaseCheck) {
    if (releaseCheck.status === "ok") {
      const { tagName, name, publishedAt } = releaseCheck.info;
      const pretty = publishedAt
        ? new Date(publishedAt).toLocaleString()
        : null;
      releaseHint = (
        <p className="ce-wizard-step-text">
          Latest release on GitHub:{" "}
          <strong>{tagName ?? "(no tag)"}</strong>
          {name && name !== tagName ? <> — {name}</> : null}
          {pretty ? <> · published {pretty}</> : null}
          {releaseCheckedAt ? (
            <>
              {" "}
              <span className="ce-pill ce-pill-faint">
                checked {new Date(releaseCheckedAt).toLocaleTimeString()}
              </span>
            </>
          ) : null}
        </p>
      );
    } else if (releaseCheck.status === "no-release") {
      releaseHint = (
        <p className="ce-wizard-hint" role="status">
          {releaseCheck.message}
        </p>
      );
    } else if (releaseCheck.status === "rate-limited") {
      releaseHint = (
        <p className="ce-wizard-hint ce-wizard-hint-warn" role="status">
          {releaseCheck.message}
        </p>
      );
    } else {
      // "network-error" | "error"
      releaseHint = (
        <p className="ce-wizard-hint ce-wizard-hint-error" role="alert">
          {releaseCheck.message}
        </p>
      );
    }
  }

  return (
    <div className="ce-ops-card">
      <h3 className="ce-ops-card-title">Update info</h3>
      <dl className="ce-wizard-kv">
        <KvRow label="App version" value={version} />
        {backendVersion && backendVersion !== version ? (
          <KvRow label="Backend version" value={backendVersion} />
        ) : null}
        <KvRow
          label="Auto-update"
          value={autoUpdateEnabled ? "enabled" : "deferred"}
        />
        <KvRow label="Releases page" value={releasesUrl} mono />
      </dl>
      <p className="ce-wizard-step-text">
        {autoUpdateReason ??
          "Auto-update is deferred until signing + release-feed policy is settled. Builds are produced locally from this checkout via npm run build:electron; the packaged installer lives under electron/dist-electron/. See electron/NOTES.md for the manual update flow."}
      </p>
      {comparisonBadge && (
        <div className="ce-wizard-actions-row">{comparisonBadge}</div>
      )}
      {releaseHint}
      <div className="ce-wizard-actions-row">
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={onCheckLatestRelease}
          disabled={releaseCheckBusy}
          title="Calls the GitHub public REST API once. No background polling."
        >
          {releaseCheckBusy ? "Checking…" : "Check latest release"}
        </button>
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={onOpenReleases}
          title="Opens in your default browser via Electron's shell.openExternal (preload bridge); falls back to window.open in a regular browser tab."
        >
          Open releases page ↗
        </button>
      </div>
      {openReleasesError && (
        <p
          className="ce-wizard-hint ce-wizard-hint-error"
          role="alert"
        >
          {openReleasesError}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function KvRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}): JSX.Element {
  return (
    <>
      <dt className="ce-wizard-kv-key">{label}</dt>
      <dd className={"ce-wizard-kv-val" + (mono ? " ce-mono" : "")}>{value}</dd>
    </>
  );
}

function KpiTile({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}): JSX.Element {
  const cls = "ce-ops-kpi" + (warn ? " is-warn" : "");
  return (
    <div className={cls}>
      <span className="ce-ops-kpi-label">{label}</span>
      <span className="ce-ops-kpi-value">{value}</span>
    </div>
  );
}

function WindowTile({
  label,
  bucket,
  currency,
}: {
  label: string;
  bucket: OpsBucket;
  currency: string;
}): JSX.Element {
  return (
    <div className="ce-ops-window">
      <span className="ce-ops-window-label">{label}</span>
      <dl className="ce-wizard-kv">
        <KvRow label="Events" value={String(bucket.events)} />
        <KvRow label="With usage" value={String(bucket.eventsWithUsage)} />
        <KvRow label="Input tokens" value={fmtInt(bucket.inputTokens)} />
        <KvRow label="Output tokens" value={fmtInt(bucket.outputTokens)} />
        <KvRow label={`Cost (${currency})`} value={fmtUsd(bucket.totalCostUsd)} />
      </dl>
    </div>
  );
}

function BreakdownTable({
  title,
  rows,
  currency,
}: {
  title: string;
  rows: Array<[string, OpsBucket]>;
  currency: string;
}): JSX.Element {
  return (
    <div className="ce-ops-breakdown">
      <h4 className="ce-ops-breakdown-title">{title}</h4>
      {rows.length === 0 ? (
        <p className="ce-wizard-step-text">No events yet.</p>
      ) : (
        <table className="ce-ops-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Events</th>
              <th>Input tok</th>
              <th>Output tok</th>
              <th>Cost ({currency})</th>
              <th>Errors</th>
              <th>Fallbacks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, b]) => (
              <tr key={key}>
                <td className="ce-mono">{key}</td>
                <td>{b.events}</td>
                <td>{fmtInt(b.inputTokens)}</td>
                <td>{fmtInt(b.outputTokens)}</td>
                <td>{fmtUsd(b.totalCostUsd)}</td>
                <td>{b.errors}</td>
                <td>{b.fallbacks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function LogTable({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: Array<{ name: string; path: string; size: number; mtime: string }>;
  emptyText: string;
}): JSX.Element {
  return (
    <div className="ce-ops-breakdown">
      <h4 className="ce-ops-breakdown-title">{title}</h4>
      {rows.length === 0 ? (
        <p className="ce-wizard-step-text">{emptyText}</p>
      ) : (
        <table className="ce-ops-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>Modified</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.path}>
                <td className="ce-mono">{r.name}</td>
                <td>{fmtBytes(r.size)}</td>
                <td>{r.mtime.replace("T", " ").replace(/\.\d{3}Z$/, " UTC")}</td>
                <td className="ce-mono">{r.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readyLabel(v: boolean | undefined | null): string {
  if (v === true) return "yes";
  if (v === false) return "no";
  return "unknown";
}

function fmtInt(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "0";
  return Math.round(n).toLocaleString("en-US");
}

function fmtUsd(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "$0.0000";
  return "$" + n.toFixed(4);
}

function fmtBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function describeApiError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.hint ? `${err.message} (${err.hint})` : err.message;
  }
  return err instanceof Error ? err.message : "unknown error";
}
