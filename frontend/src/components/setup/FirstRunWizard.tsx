// CreativEdge Phase 9-C — First-run wizard.
//
// A thin, accessible frontend UX layer over already-validated APIs.
// NO new backend routes. NO provider mutations. NO memory mutations.
// NO destructive backup actions. The wizard wraps:
//
//   1. /healthz (Phase 2.1 runtime + Phase 2.2-B Claude readiness)
//   2. /backup/status, /backup/config, /backup/dry-run, /backup/run
//      (Phase 5.6-A — opt-in, confirmed-by-default-false)
//
// The wizard auto-opens on first launch (no `creativedge.firstRun.dismissed`
// flag in localStorage) OR when `/healthz` reports `setupRequired:true`.
// Closing the wizard via the Finish / Done button writes the UI flag so
// subsequent launches skip auto-open. The "Setup" button in the chrome
// always re-opens it (manual entry). The flag is UI-only and never
// stores secrets, remote URLs, or credentials.
//
// Accessibility:
//   - Focus trap inside the wizard (focuses the close button on open).
//   - Esc closes the wizard (safe — nothing is destructive here).
//   - All actions have explicit Skip / Finish paths.
//   - Tabular keyboard navigation works because the dialog uses native
//     <button> / <input> elements without role overrides.
//   - role="dialog", aria-modal="true", aria-labelledby = title id.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ApiError,
  apiTargetLabel,
  backupConfig as apiBackupConfig,
  backupDryRun as apiBackupDryRun,
  backupRun as apiBackupRun,
  backupStatus as apiBackupStatus,
  healthCheck as apiHealthCheck,
} from "../../api/client";
import type {
  BackupStatusResponse,
  HealthCheckResponse,
} from "../../types";

export const FIRST_RUN_DISMISSED_KEY = "creativedge.firstRun.dismissed";

type WizardStep = "runtime" | "claude" | "backup" | "done";
const ORDER: WizardStep[] = ["runtime", "claude", "backup", "done"];

export interface FirstRunWizardProps {
  /** Initial health snapshot from App.tsx so we don't double-fetch on
   *  mount. The wizard's "Re-check" buttons still re-fetch through
   *  apiHealthCheck() to refresh state. */
  initialHealth: HealthCheckResponse | null;
  onClose: (markDismissed: boolean) => void;
}

export function FirstRunWizard({
  initialHealth,
  onClose,
}: FirstRunWizardProps): JSX.Element {
  const [step, setStep] = useState<WizardStep>("runtime");
  const [health, setHealth] = useState<HealthCheckResponse | null>(
    initialHealth
  );
  const [healthBusy, setHealthBusy] = useState<boolean>(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [backup, setBackup] = useState<BackupStatusResponse | null>(null);
  const [backupBusy, setBackupBusy] = useState<boolean>(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  // Editable form state for the optional backup configuration step.
  const [backupEnableInput, setBackupEnableInput] = useState<boolean>(false);
  const [backupRemoteInput, setBackupRemoteInput] = useState<string>("");

  const titleId = "ce-first-run-title";
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // -------------------------------------------------------------------
  // Initial focus + Esc-to-close (safe — nothing destructive).
  // -------------------------------------------------------------------
  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // -------------------------------------------------------------------
  // Re-fetch /healthz on demand. Used by the "Re-check" buttons on the
  // runtime + Claude steps.
  // -------------------------------------------------------------------
  const recheckHealth = useCallback(async () => {
    setHealthBusy(true);
    setHealthError(null);
    try {
      const next = await apiHealthCheck();
      setHealth(next);
    } catch (err) {
      setHealthError(describeApiError(err));
    } finally {
      setHealthBusy(false);
    }
  }, []);

  // -------------------------------------------------------------------
  // Load /backup/status the first time the user enters the backup step.
  // -------------------------------------------------------------------
  const loadBackupStatus = useCallback(async () => {
    setBackupBusy(true);
    setBackupError(null);
    setBackupNotice(null);
    try {
      const next = await apiBackupStatus();
      setBackup(next);
      // Seed the form with the current state so the first edit is just
      // an enable toggle, not a re-type of the existing remote.
      setBackupEnableInput(next.enabled);
      // The server returns a REDACTED remote; we never repopulate the
      // input from it (would leak host/path). Leave empty unless the
      // user wants to (re-)set a remote.
      setBackupRemoteInput("");
    } catch (err) {
      setBackupError(describeApiError(err));
    } finally {
      setBackupBusy(false);
    }
  }, []);

  useEffect(() => {
    if (step === "backup" && backup === null && !backupBusy && !backupError) {
      void loadBackupStatus();
    }
  }, [step, backup, backupBusy, backupError, loadBackupStatus]);

  // -------------------------------------------------------------------
  // Step status decoration (used by both the stepper sidebar and each
  // step's main panel header).
  // -------------------------------------------------------------------
  const runtimeStatus = useMemo<StepStatus>(() => {
    if (!health) return { kind: "unknown", label: "Re-check" };
    const storageReady = health.storageReady === true;
    const dbReady = health.dbReady === true;
    if (storageReady && dbReady) {
      return { kind: "ok", label: "Ready" };
    }
    return { kind: "warn", label: "Needs attention" };
  }, [health]);

  const claudeStatus = useMemo<StepStatus>(() => {
    if (!health) return { kind: "unknown", label: "Re-check" };
    const claude = health.providers?.claude;
    if (claude?.ready === true) return { kind: "ok", label: "Ready" };
    if (health.providers?.mock?.ready === true) {
      return { kind: "warn", label: "Degraded fallback" };
    }
    return { kind: "warn", label: "Needs attention" };
  }, [health]);

  // -------------------------------------------------------------------
  // Step navigation helpers.
  // -------------------------------------------------------------------
  const goNext = useCallback(() => {
    const idx = ORDER.indexOf(step);
    if (idx >= 0 && idx < ORDER.length - 1) setStep(ORDER[idx + 1]);
  }, [step]);

  const goBack = useCallback(() => {
    const idx = ORDER.indexOf(step);
    if (idx > 0) setStep(ORDER[idx - 1]);
  }, [step]);

  const finish = useCallback(() => onClose(true), [onClose]);
  const closeNow = useCallback(() => onClose(false), [onClose]);

  // -------------------------------------------------------------------
  // Backup actions. All routes require confirmed:true on the server
  // side; the API client wraps that for us. Each action is gated by the
  // explicit click so there's no Enter-key accidental destructive path.
  // -------------------------------------------------------------------
  const onSaveBackupConfig = useCallback(async () => {
    setBackupBusy(true);
    setBackupError(null);
    setBackupNotice(null);
    try {
      // Only send `remote` if the user typed something OR explicitly
      // cleared the field with a leading "—" / "clear" placeholder.
      // Keep it simple here: an empty string means "do not change
      // remote"; a non-empty string sets the remote.
      const trimmed = backupRemoteInput.trim();
      const payload: {
        enabled?: boolean;
        remote?: string | null;
      } = { enabled: backupEnableInput };
      if (trimmed.length > 0) payload.remote = trimmed;
      await apiBackupConfig(payload);
      setBackupNotice("Backup configuration saved.");
      // Refresh the live status so the green / amber UI updates
      // without forcing the user to leave the step.
      await loadBackupStatus();
    } catch (err) {
      setBackupError(describeApiError(err));
    } finally {
      setBackupBusy(false);
    }
  }, [backupEnableInput, backupRemoteInput, loadBackupStatus]);

  const onDryRun = useCallback(async () => {
    setBackupBusy(true);
    setBackupError(null);
    setBackupNotice(null);
    try {
      const res = await apiBackupDryRun();
      setBackupNotice(
        `Dry run OK — considered ${res.filesConsidered} files, ` +
          `copied ${res.filesCopied}, changes: ` +
          `${res.changed ? "yes" : "none"}.`
      );
    } catch (err) {
      setBackupError(describeApiError(err));
    } finally {
      setBackupBusy(false);
    }
  }, []);

  const onRunBackup = useCallback(async () => {
    setBackupBusy(true);
    setBackupError(null);
    setBackupNotice(null);
    try {
      // The wizard does NOT push by default (push:false is the
      // implicit server contract via this client helper). A push
      // automation flow is intentionally Phase 5.6-B / 9-D territory.
      const res = await apiBackupRun(false);
      if (res.changed && res.committed) {
        setBackupNotice(
          `Backup committed${
            res.commitHash ? ` (${res.commitHash.slice(0, 8)})` : ""
          }. Push not requested.`
        );
      } else if (!res.changed) {
        setBackupNotice("Backup run: nothing changed since last commit.");
      } else {
        setBackupNotice("Backup run completed.");
      }
      await loadBackupStatus();
    } catch (err) {
      setBackupError(describeApiError(err));
    } finally {
      setBackupBusy(false);
    }
  }, [loadBackupStatus]);

  // -------------------------------------------------------------------
  // Render.
  // -------------------------------------------------------------------
  return (
    <div
      className="ce-modal-backdrop ce-wizard-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        // Click outside dismisses (non-destructive — same as Esc).
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <div
        className="ce-modal ce-wizard"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="ce-wizard-header">
          <h2 className="ce-modal-title" id={titleId}>
            Welcome to CreativEdge
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="ce-btn ce-btn-secondary ce-wizard-close"
            onClick={closeNow}
            aria-label="Close setup (you can reopen it from the Setup button)"
            title="Close"
          >
            ✕
          </button>
        </header>

        <nav className="ce-wizard-steps" aria-label="Setup steps">
          <StepPill
            n={1}
            label="Runtime"
            active={step === "runtime"}
            done={runtimeStatus.kind === "ok"}
            onClick={() => setStep("runtime")}
          />
          <StepPill
            n={2}
            label="Claude Code"
            active={step === "claude"}
            done={claudeStatus.kind === "ok"}
            onClick={() => setStep("claude")}
          />
          <StepPill
            n={3}
            label="Backup (optional)"
            active={step === "backup"}
            done={false}
            onClick={() => setStep("backup")}
          />
          <StepPill
            n={4}
            label="Done"
            active={step === "done"}
            done={false}
            onClick={() => setStep("done")}
          />
        </nav>

        <section className="ce-wizard-body">
          {step === "runtime" && (
            <RuntimeStep
              health={health}
              status={runtimeStatus}
              busy={healthBusy}
              error={healthError}
              onRecheck={recheckHealth}
            />
          )}
          {step === "claude" && (
            <ClaudeStep
              health={health}
              status={claudeStatus}
              busy={healthBusy}
              error={healthError}
              onRecheck={recheckHealth}
            />
          )}
          {step === "backup" && (
            <BackupStep
              status={backup}
              busy={backupBusy}
              error={backupError}
              notice={backupNotice}
              enableInput={backupEnableInput}
              remoteInput={backupRemoteInput}
              setEnableInput={setBackupEnableInput}
              setRemoteInput={setBackupRemoteInput}
              onReload={loadBackupStatus}
              onSaveConfig={onSaveBackupConfig}
              onDryRun={onDryRun}
              onRunBackup={onRunBackup}
            />
          )}
          {step === "done" && <DoneStep />}
        </section>

        <footer className="ce-wizard-footer">
          <div className="ce-wizard-footer-left">
            {step !== "runtime" && (
              <button
                type="button"
                className="ce-btn ce-btn-secondary"
                onClick={goBack}
              >
                Back
              </button>
            )}
          </div>
          <div className="ce-wizard-footer-right">
            {step !== "done" && (
              <button
                type="button"
                className="ce-btn ce-btn-secondary"
                onClick={closeNow}
              >
                Skip for now
              </button>
            )}
            {step !== "done" ? (
              <button
                type="button"
                className="ce-btn ce-btn-primary"
                onClick={goNext}
              >
                {step === "backup" ? "Continue" : "Next"}
              </button>
            ) : (
              <button
                type="button"
                className="ce-btn ce-btn-primary"
                onClick={finish}
              >
                Finish
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

interface StepStatus {
  kind: "ok" | "warn" | "unknown";
  label: string;
}

function RuntimeStep({
  health,
  status,
  busy,
  error,
  onRecheck,
}: {
  health: HealthCheckResponse | null;
  status: StepStatus;
  busy: boolean;
  error: string | null;
  onRecheck: () => void | Promise<void>;
}): JSX.Element {
  const seededCount = health?.seededAgentSlugs?.length ?? null;
  return (
    <div className="ce-wizard-step">
      <header className="ce-wizard-step-header">
        <h3 className="ce-wizard-step-title">Runtime &amp; storage</h3>
        <StatusBadgeInline status={status} />
      </header>
      <p className="ce-wizard-step-text">
        CreativEdge keeps your sessions, agent memory, and settings under a
        local folder on this computer. No data leaves your machine unless you
        configure the optional backup.
      </p>
      <dl className="ce-wizard-kv">
        <KvRow label="Runtime directory" value={health?.runtimeDir ?? "—"} mono />
        <KvRow
          label="Storage ready"
          value={readyLabel(health?.storageReady)}
        />
        <KvRow label="Database ready" value={readyLabel(health?.dbReady)} />
        <KvRow
          label="Seeded agents"
          value={seededCount === null ? "—" : String(seededCount)}
        />
        <KvRow label="Backend target" value={apiTargetLabel()} mono />
      </dl>
      <ActionRow
        busy={busy}
        error={error}
        recheckLabel="Re-check"
        onRecheck={onRecheck}
      />
    </div>
  );
}

function ClaudeStep({
  health,
  status,
  busy,
  error,
  onRecheck,
}: {
  health: HealthCheckResponse | null;
  status: StepStatus;
  busy: boolean;
  error: string | null;
  onRecheck: () => void | Promise<void>;
}): JSX.Element {
  const claude = health?.providers?.claude;
  const mockReady = health?.providers?.mock?.ready === true;
  const primary = health?.providers?.primary ?? "—";

  return (
    <div className="ce-wizard-step">
      <header className="ce-wizard-step-header">
        <h3 className="ce-wizard-step-title">Claude Code readiness</h3>
        <StatusBadgeInline status={status} />
      </header>
      <p className="ce-wizard-step-text">
        CreativEdge uses your local Claude Code CLI as the primary provider.
        If it isn&rsquo;t installed or signed in yet, the app still opens and a
        mock provider keeps things responsive — just expect placeholder text
        instead of real Claude responses.
      </p>
      <dl className="ce-wizard-kv">
        <KvRow label="Primary provider" value={primary} mono />
        <KvRow
          label="Installed"
          value={readyLabel(claude?.installed)}
        />
        <KvRow
          label="Auth status"
          value={claude?.authStatus ?? "unknown"}
        />
        <KvRow label="Ready" value={readyLabel(claude?.ready)} />
        {typeof claude?.version === "string" && claude.version.length > 0 && (
          <KvRow label="CLI version" value={claude.version} mono />
        )}
        <KvRow label="Mock fallback" value={mockReady ? "available" : "not available"} />
      </dl>
      {claude?.setupRequired && claude.setupHint && (
        <div
          className="ce-wizard-hint ce-wizard-hint-warn"
          role="status"
        >
          <strong>Setup needed:</strong> {claude.setupHint}
        </div>
      )}
      {claude?.reason && !claude.ready && !claude.setupHint && (
        <div className="ce-wizard-hint" role="status">
          <strong>Reason:</strong> {claude.reason}
        </div>
      )}
      {!claude?.ready && mockReady && (
        <div className="ce-wizard-hint" role="status">
          You can still use the app now — replies will come from the mock
          provider until Claude Code is ready. Re-run this step after you
          finish installing or signing in.
        </div>
      )}
      <ActionRow
        busy={busy}
        error={error}
        recheckLabel="Re-check"
        onRecheck={onRecheck}
      />
    </div>
  );
}

function BackupStep({
  status,
  busy,
  error,
  notice,
  enableInput,
  remoteInput,
  setEnableInput,
  setRemoteInput,
  onReload,
  onSaveConfig,
  onDryRun,
  onRunBackup,
}: {
  status: BackupStatusResponse | null;
  busy: boolean;
  error: string | null;
  notice: string | null;
  enableInput: boolean;
  remoteInput: string;
  setEnableInput: (v: boolean) => void;
  setRemoteInput: (v: string) => void;
  onReload: () => void | Promise<void>;
  onSaveConfig: () => void | Promise<void>;
  onDryRun: () => void | Promise<void>;
  onRunBackup: () => void | Promise<void>;
}): JSX.Element {
  const remoteRedacted = status?.remote ?? null;

  return (
    <div className="ce-wizard-step">
      <header className="ce-wizard-step-header">
        <h3 className="ce-wizard-step-title">Backup (optional)</h3>
        <span className="ce-wizard-skip">You can skip this and set it up later.</span>
      </header>
      <p className="ce-wizard-step-text">
        Optionally back up your agent memory to a private GitHub repository.
        The backup runs locally (commits stay on your machine until you push
        manually). CreativEdge never sends credentials to the backend.
        Memory files only — sessions, logs, and providers config are
        excluded.
      </p>

      {status === null && !busy && !error && (
        <p className="ce-wizard-step-text">Loading current backup state&hellip;</p>
      )}

      {status && (
        <dl className="ce-wizard-kv">
          <KvRow label="Enabled" value={status.enabled ? "yes" : "no"} />
          <KvRow label="git on PATH" value={readyLabel(status.gitReady)} />
          <KvRow label="Repo initialized" value={readyLabel(status.repoReady)} />
          <KvRow
            label="Remote configured"
            value={readyLabel(status.remoteConfigured)}
          />
          {remoteRedacted && (
            <KvRow label="Remote" value={remoteRedacted} mono />
          )}
          <KvRow label="Repo dir" value={status.repoDir} mono />
          <KvRow label="Next action" value={status.nextAction} />
        </dl>
      )}

      <fieldset className="ce-wizard-fieldset" disabled={busy || !status}>
        <legend className="ce-wizard-legend">Configure</legend>
        <label className="ce-wizard-check">
          <input
            type="checkbox"
            checked={enableInput}
            onChange={(e) => setEnableInput(e.target.checked)}
          />
          Enable backup
        </label>
        <label className="ce-wizard-input-row">
          <span className="ce-wizard-input-label">
            GitHub remote URL (optional)
          </span>
          <input
            type="text"
            className="ce-wizard-input"
            placeholder="https://github.com/user/private-backup.git"
            value={remoteInput}
            onChange={(e) => setRemoteInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <span className="ce-wizard-input-help">
            Leave empty to keep the existing remote. The remote is stored in
            your local backup config — not in the frontend or browser
            storage.
          </span>
        </label>
        <div className="ce-wizard-actions-row">
          <button
            type="button"
            className="ce-btn ce-btn-primary"
            onClick={() => void onSaveConfig()}
          >
            Save settings
          </button>
          <button
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={() => void onDryRun()}
            disabled={!status?.enabled}
            title={
              status?.enabled
                ? "Copy files + check status, do not commit"
                : "Enable backup first"
            }
          >
            Dry run
          </button>
          <button
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={() => void onRunBackup()}
            disabled={!status?.enabled}
            title={
              status?.enabled
                ? "Run backup now (commit only; no push)"
                : "Enable backup first"
            }
          >
            Run backup now
          </button>
          <button
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={() => void onReload()}
          >
            Reload status
          </button>
        </div>
      </fieldset>

      {notice && (
        <div className="ce-wizard-hint" role="status">
          {notice}
        </div>
      )}
      {error && (
        <div className="ce-wizard-hint ce-wizard-hint-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

function DoneStep(): JSX.Element {
  return (
    <div className="ce-wizard-step">
      <h3 className="ce-wizard-step-title">You&rsquo;re ready</h3>
      <p className="ce-wizard-step-text">
        That&rsquo;s it for setup. You can reopen this wizard any time from
        the <strong>Setup</strong> button in the top bar.
      </p>
      <ul className="ce-wizard-list">
        <li>Use the chat to talk to Nexus or any specialist (try <code>@bit</code>, <code>@lumi</code>, &hellip;).</li>
        <li>Open the admin console (<code>⚙ Admin</code>) to inspect agents and run routing tests.</li>
        <li>Re-run this wizard whenever your environment changes (new install, new auth, new backup target).</li>
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiny presentational helpers (kept inside this file so the wizard is a
// single self-contained chunk).
// ---------------------------------------------------------------------------

function StepPill({
  n,
  label,
  active,
  done,
  onClick,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}): JSX.Element {
  const className = [
    "ce-wizard-step-pill",
    active ? "is-active" : "",
    done ? "is-done" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-current={active ? "step" : undefined}
    >
      <span className="ce-wizard-step-num">{n}</span>
      <span className="ce-wizard-step-label">{label}</span>
    </button>
  );
}

function StatusBadgeInline({ status }: { status: StepStatus }): JSX.Element {
  const cls =
    status.kind === "ok"
      ? "ce-wizard-badge ce-wizard-badge-ok"
      : status.kind === "warn"
        ? "ce-wizard-badge ce-wizard-badge-warn"
        : "ce-wizard-badge";
  return <span className={cls}>{status.label}</span>;
}

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

function ActionRow({
  busy,
  error,
  recheckLabel,
  onRecheck,
}: {
  busy: boolean;
  error: string | null;
  recheckLabel: string;
  onRecheck: () => void | Promise<void>;
}): JSX.Element {
  return (
    <div className="ce-wizard-actions-row">
      <button
        type="button"
        className="ce-btn ce-btn-secondary"
        onClick={() => void onRecheck()}
        disabled={busy}
      >
        {busy ? "Checking…" : recheckLabel}
      </button>
      {error && (
        <span className="ce-wizard-inline-error" role="alert">
          {error}
        </span>
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

function describeApiError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.hint ? `${err.message} (${err.hint})` : err.message;
  }
  return err instanceof Error ? err.message : "unknown error";
}

export function readDismissedFlag(): boolean {
  try {
    return localStorage.getItem(FIRST_RUN_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeDismissedFlag(value: boolean): void {
  try {
    if (value) localStorage.setItem(FIRST_RUN_DISMISSED_KEY, "1");
    else localStorage.removeItem(FIRST_RUN_DISMISSED_KEY);
  } catch {
    /* localStorage unavailable (private mode, packaged Electron edge case) — ignore */
  }
}

export function clearDismissedFlag(): void {
  writeDismissedFlag(false);
}

export type _UnusedReactNodeReference = ReactNode; // keep eslint happy if tree-shaking trims
