// CreativEdge Phase 6-A/6-B/6-D - backup status + safe config + dry-run/run card.
//
// Conservative on purpose:
//   - shows `/backup/status` read-only on load + on demand.
//   - config form requires explicit confirm click (no auto-save).
//   - dry-run is local-only (no commit, no push).
//   - run uses push:false by default. The new Phase 9-D-B3 push path
//     is gated behind a second-confirmation modal and an explicit
//     "I understand…" checkbox (see BackupPushConfirmModal); it
//     re-uses the same `backupRun()` helper but passes `push:true`.
//   - never asks for a GitHub token; never stores credentials.
//
// Phase 6-B polish:
//   - readiness flags render as StatusBadge with glyph + colour, so
//     the status section is scannable at a glance.
//   - dry-run / run results use ActionResult so success / no-change /
//     error use the same visual language as memory tools.
//   - the configure form remains collapsed-by-default and stays
//     "no auto-enable / no auto-push".
//
// Phase 9-D-B3 (2026-05-21) — explicit backup push UX:
//   - new "Run backup + push" button next to "Run (no push)";
//   - disabled with a friendly explainer when backup isn't ready
//     (not enabled / repo not initialised / no remote configured /
//     git not on PATH);
//   - on click opens BackupPushConfirmModal; on confirm calls
//     `backupRun(true)` and renders pushed / pushReason verbatim
//     from the existing `/backup/run` response (no secret leakage —
//     the backend redacts the remote in any failure string it
//     returns).

import { useCallback, useMemo, useState } from "react";

import {
  ApiError,
  backupConfig,
  backupDryRun,
  backupRun,
  backupStatus,
} from "../api/client";
import type {
  ActionState,
  BackupDryRunResponse,
  BackupRunResponse,
  BackupStatusResponse,
} from "../types";
import { ActionResult } from "./ActionResult";
import { BackupPushConfirmModal } from "./BackupPushConfirmModal";
import { StatusBadge } from "./StatusBadge";

export function BackupPanel(): JSX.Element {
  const [status, setStatus] = useState<BackupStatusResponse | null>(null);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  // Config form draft
  const [enabled, setEnabled] = useState(false);
  const [remote, setRemote] = useState("");
  const [includeSessionsDb, setIncludeSessionsDb] = useState(false);
  const [configConfirmed, setConfigConfirmed] = useState(false);

  const [dryRun, setDryRun] = useState<BackupDryRunResponse | null>(null);
  const [run, setRun] = useState<BackupRunResponse | null>(null);

  // Phase 9-D-B3 — push modal state. The modal is opened only by the
  // explicit "Run backup + push" button (never auto-opened). `pushBusy`
  // tracks the inflight `/backup/run` POST so the modal can disable
  // its buttons + checkbox.
  const [pushModalOpen, setPushModalOpen] = useState<boolean>(false);
  const [pushBusy, setPushBusy] = useState<boolean>(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const busy = state.kind === "busy";

  // Derive a single push-readiness signal + the reason it's not ready
  // so the disabled button can carry a friendly tooltip + helper line.
  // The four observable blockers map 1:1 to backend status fields and
  // are mutually exclusive in priority order (git → enabled → repo →
  // remote) so the user always sees the next-action they need to take.
  const pushReadiness = useMemo<
    { ready: boolean; reason: string | null }
  >(() => {
    if (!status) return { ready: false, reason: "Check status first." };
    if (!status.gitReady)
      return { ready: false, reason: "Git is not installed or not on PATH." };
    if (!status.enabled)
      return { ready: false, reason: "Backup is not enabled. Enable it in Configure first." };
    if (!status.repoReady)
      return { ready: false, reason: "Backup repo is not initialised. Run Dry-run once to initialise it." };
    if (!status.remoteConfigured)
      return {
        ready: false,
        reason:
          "No remote configured. Open a terminal in the backup repo and run `git remote add origin <url>`, then re-check.",
      };
    return { ready: true, reason: null };
  }, [status]);

  const refresh = useCallback(async () => {
    setState({ kind: "busy" });
    try {
      const r = await backupStatus();
      setStatus(r);
      setEnabled(r.enabled);
      setRemote(r.remote ?? "");
      setIncludeSessionsDb(r.includeSessionsDb);
      setState({ kind: "idle" });
    } catch (e) {
      setState({
        kind: "err",
        text: e instanceof Error ? e.message : "status failed",
      });
    }
  }, []);

  const onConfigure = useCallback(async () => {
    if (!configConfirmed) {
      setState({
        kind: "warn",
        text: "Tick the confirm box before saving backup config.",
      });
      return;
    }
    setState({ kind: "busy" });
    try {
      const r = await backupConfig({
        enabled,
        remote: remote.trim().length > 0 ? remote.trim() : null,
        includeSessionsDb,
      });
      setState({
        kind: "ok",
        text: `Config saved. enabled=${r.enabled}, remote=${
          r.remote ?? "—"
        }, includeSessionsDb=${r.includeSessionsDb}`,
      });
      setConfigConfirmed(false);
      await refresh();
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : (e as Error).message;
      setState({ kind: "err", text });
    }
  }, [configConfirmed, enabled, remote, includeSessionsDb, refresh]);

  const onDryRun = useCallback(async () => {
    setDryRun(null);
    setState({ kind: "busy" });
    try {
      const r = await backupDryRun();
      setDryRun(r);
      setState({
        kind: r.changed ? "ok" : "duplicate",
        text: r.changed
          ? `Dry-run: ${r.filesCopied} files would be copied.`
          : "Dry-run: nothing changed.",
      });
    } catch (e) {
      setState({
        kind: "err",
        text: e instanceof Error ? e.message : "dry-run failed",
      });
    }
  }, []);

  const onRun = useCallback(async () => {
    setRun(null);
    setState({ kind: "busy" });
    try {
      const r = await backupRun(false);
      setRun(r);
      if (r.changed && r.committed) {
        setState({
          kind: "ok",
          text: `Committed ${r.commitHash?.slice(0, 10) ?? ""}… (no push).`,
        });
      } else {
        setState({
          kind: "duplicate",
          text: "Run: nothing changed (idempotent).",
        });
      }
    } catch (e) {
      setState({
        kind: "err",
        text: e instanceof Error ? e.message : "run failed",
      });
    }
  }, []);

  // Phase 9-D-B3 — explicit opt-in push path.
  //
  // openPushModal is wired to the new "Run backup + push" button.
  // It is a no-op when `pushReadiness.ready === false` (the button
  // itself is also `disabled`, but the guard is defence-in-depth so
  // a tooltip-only state can't accidentally surface the modal).
  const openPushModal = useCallback(() => {
    if (!pushReadiness.ready) return;
    setPushError(null);
    setPushModalOpen(true);
  }, [pushReadiness.ready]);

  const closePushModal = useCallback(() => {
    if (pushBusy) return;
    setPushModalOpen(false);
    setPushError(null);
  }, [pushBusy]);

  // confirmPush fires `/backup/run` with push:true. The backend
  // re-checks `cfg.enabled` + `cfg.remote !== null` + `hasOriginRemote`
  // before calling `git push`, and returns the existing
  // BackupRunResponse shape — pushed + pushReason are what the user
  // sees on the result line. No new fields, no schema change.
  const confirmPush = useCallback(async () => {
    setRun(null);
    setPushBusy(true);
    setPushError(null);
    setState({ kind: "busy" });
    try {
      const r = await backupRun(true);
      setRun(r);
      setPushModalOpen(false);
      if (r.changed && r.committed && r.pushed) {
        setState({
          kind: "ok",
          text: `Committed ${r.commitHash?.slice(0, 10) ?? ""}… and pushed.`,
        });
      } else if (r.changed && r.committed && !r.pushed) {
        // Commit landed locally but push was skipped or failed —
        // surface the backend's pushReason verbatim (already free of
        // credentials per Phase 5.6-A redaction).
        setState({
          kind: "warn",
          text: `Committed ${r.commitHash?.slice(0, 10) ?? ""}… but push was not completed${
            r.pushReason ? `: ${r.pushReason}` : "."
          }`,
        });
      } else {
        setState({
          kind: "duplicate",
          text: "Run: nothing changed (idempotent); nothing to push.",
        });
      }
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : e instanceof Error
            ? e.message
            : "push failed";
      setPushError(text);
      setState({ kind: "err", text });
    } finally {
      setPushBusy(false);
    }
  }, []);

  return (
    <section className="ce-card ce-backup" aria-label="Local backup">
      <h2>💾 Backup</h2>
      <div className="ce-backup-actions">
        <button className="ce-btn" onClick={refresh} disabled={busy}>
          {status ? "Refresh status" : "Check status"}
        </button>
      </div>
      {status && (
        <>
          <div className="ce-backup-badges">
            <StatusBadge variant={status.enabled ? "ok" : "neutral"}>
              {status.enabled ? "enabled" : "disabled"}
            </StatusBadge>
            <StatusBadge variant={status.gitReady ? "ok" : "danger"}>
              git
            </StatusBadge>
            <StatusBadge variant={status.repoReady ? "ok" : "neutral"}>
              repo
            </StatusBadge>
            <StatusBadge
              variant={status.remoteConfigured ? "ok" : "neutral"}
              title={status.remote ?? "no remote configured"}
            >
              remote
            </StatusBadge>
            {status.setupRequired && (
              <StatusBadge variant="warn">setup required</StatusBadge>
            )}
            <StatusBadge variant="info" icon="↳" title="suggested next step">
              {status.nextAction}
            </StatusBadge>
          </div>
          <dl className="ce-meta-list ce-meta-list-compact">
            <dt>includeSessionsDb</dt>
            <dd>{String(status.includeSessionsDb)}</dd>
            {status.remote && (
              <>
                <dt>remote</dt>
                <dd className="ce-truncate" title={status.remote}>
                  <code>{status.remote}</code>
                </dd>
              </>
            )}
          </dl>
        </>
      )}

      <details className="ce-backup-config">
        <summary>Configure</summary>
        <div className="ce-backup-config-body">
          <label className="ce-tool-confirm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />{" "}
            Enable backup (opt-in)
          </label>
          <label className="ce-form-field">
            <span>Remote (optional):</span>
            <input
              type="text"
              value={remote}
              onChange={(e) => setRemote(e.target.value)}
              placeholder="https://github.com/<owner>/<private-repo>.git"
              autoComplete="off"
            />
          </label>
          <label className="ce-tool-confirm">
            <input
              type="checkbox"
              checked={includeSessionsDb}
              onChange={(e) => setIncludeSessionsDb(e.target.checked)}
            />{" "}
            Include sessions.db (NOT recommended)
          </label>
          <label className="ce-tool-confirm">
            <input
              type="checkbox"
              checked={configConfirmed}
              onChange={(e) => setConfigConfirmed(e.target.checked)}
            />{" "}
            I confirm the backup config change.
          </label>
          <button
            className="ce-btn ce-btn-primary"
            onClick={onConfigure}
            disabled={busy || !configConfirmed}
          >
            {busy ? "Saving…" : "Save backup config"}
          </button>
        </div>
      </details>

      <p className="ce-hint ce-backup-local-note" role="note">
        Local-only by default. The push button is opt-in and behind a
        second confirmation; credentials are not handled by CreativEdge
        and are never stored in the browser.
      </p>
      <div className="ce-backup-actions">
        <button className="ce-btn" onClick={onDryRun} disabled={busy}>
          Dry-run
        </button>
        <button
          className="ce-btn ce-btn-primary"
          onClick={onRun}
          disabled={busy}
          title="Commit locally; does not push."
        >
          Run (no push)
        </button>
        <button
          className="ce-btn ce-btn-primary"
          onClick={openPushModal}
          disabled={busy || pushBusy || !pushReadiness.ready}
          title={
            pushReadiness.ready
              ? "Run backup and push to the configured remote (asks to confirm)"
              : pushReadiness.reason ?? "Push not available yet"
          }
          aria-describedby={
            pushReadiness.ready ? undefined : "ce-backup-push-disabled-hint"
          }
        >
          Run backup + push
        </button>
      </div>
      {!pushReadiness.ready && pushReadiness.reason && (
        <p
          id="ce-backup-push-disabled-hint"
          className="ce-hint"
          role="note"
        >
          Push unavailable: {pushReadiness.reason}
        </p>
      )}

      {dryRun && (
        <div className="ce-tool-info" role="status">
          considered={dryRun.filesConsidered} · copied={dryRun.filesCopied} ·
          skipped={dryRun.filesSkippedCount} · added=
          {dryRun.statusSummary.added} · modified=
          {dryRun.statusSummary.modified} · deleted=
          {dryRun.statusSummary.deleted} · untracked=
          {dryRun.statusSummary.untracked}
        </div>
      )}
      {run && (
        <div className="ce-tool-info" role="status">
          committed={String(run.committed ?? false)}
          {run.commitHash ? ` · ${run.commitHash.slice(0, 10)}…` : ""} · pushed=
          {String(run.pushed)}
          {run.pushReason ? ` (${run.pushReason})` : ""}
        </div>
      )}
      <ActionResult state={state} />
      {pushModalOpen && (
        <BackupPushConfirmModal
          redactedRemote={status?.remote ?? null}
          busy={pushBusy}
          error={pushError}
          onConfirm={confirmPush}
          onCancel={closePushModal}
        />
      )}
    </section>
  );
}
