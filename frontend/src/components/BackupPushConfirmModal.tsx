// CreativEdge Phase 9-D-B3 — backup push confirmation modal.
//
// Sits in front of the only mutation path that performs a network
// push: `POST /backup/run` with `push:true`. The backend already
// enforces three defences (Phase 5.6-A) — `confirmed:true` required,
// `push:true` required, and a server-side recheck that the local
// repo has an `origin` remote configured — but a destructive-feel
// action that talks to a third party deserves an unmissable UI gate
// too. This modal is that gate.
//
// Privacy / safety contract (verbatim from the user's slice brief):
//   - NEVER stores credentials, tokens, or remote URLs in
//     localStorage / sessionStorage / cookies (no storage call anywhere
//     in this file — grep-verifiable).
//   - NEVER asks the user for credentials. Auth is the local Git
//     setup's concern (HTTPS credential helper, SSH agent, etc.); the
//     backend's `pushBackup()` call runs `git push` in the user's
//     working environment.
//   - Shows the remote URL only as the server-side redacted string
//     already returned by `GET /backup/status` (which strips userinfo
//     via `redactRemote()` in `backend-api/src/backup/backupGit.ts`).
//   - Default focus lands on the Cancel button (Phase 6-E pattern).
//   - Esc cancels safely.
//   - Enter does NOT auto-confirm. The Confirm button stays disabled
//     until the user explicitly ticks the "I understand this will push
//     to my configured remote" checkbox.
//   - Backdrop click cancels (cheap escape hatch; cancel is always
//     safe — nothing has been sent to the backend yet).

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Server-side redacted remote string (from `/backup/status.remote`).
   *  Pass `null` when the backend has no remote on file — we render
   *  a friendly "(no remote configured)" placeholder rather than
   *  silently confirming an empty target. */
  redactedRemote: string | null;
  /** True while the parent is waiting on `/backup/run` to settle. We
   *  disable both buttons + the checkbox to prevent double-fire. */
  busy: boolean;
  /** Optional inline error from the most recent attempt — surfaced
   *  inside the modal so the user can read it without losing the
   *  confirm-checkbox state. */
  error: string | null;
  /** User confirmed the action. Caller fires `backupRun(true)`. */
  onConfirm: () => void;
  /** User dismissed the modal (Cancel, Esc, backdrop click). */
  onCancel: () => void;
}

export function BackupPushConfirmModal({
  redactedRemote,
  busy,
  error,
  onConfirm,
  onCancel,
}: Props): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onCancel();
    }
    window.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => cancelRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [busy, onCancel]);

  // The Confirm path is gated on `acknowledged && !busy`. The form
  // never accepts `onSubmit` so a stray Enter on the checkbox or
  // inside the modal can't accidentally fire the push.
  const confirmDisabled = busy || !acknowledged;

  return (
    <div
      className="ce-modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="ce-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ce-backup-push-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="ce-backup-push-confirm-title" className="ce-modal-title">
          Run backup + push to remote?
        </h3>
        <p className="ce-hint">
          This will copy your eligible agent memory files into the local
          backup repo, commit any changes, and then run{" "}
          <code>git push</code> to your configured remote.
        </p>
        <dl className="ce-meta-list ce-meta-list-compact">
          <dt>Remote</dt>
          <dd className="ce-truncate" title={redactedRemote ?? ""}>
            <code>{redactedRemote ?? "(no remote configured)"}</code>
          </dd>
        </dl>
        <p className="ce-hint" role="note">
          Credentials are not handled by CreativEdge. The push uses your
          local Git setup (HTTPS credential helper, SSH agent, etc.).
          If push fails — e.g. auth missing or remote unreachable — the
          commit still lands locally and the failure reason is shown.
        </p>
        <label className="ce-tool-confirm">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            disabled={busy}
            aria-describedby="ce-backup-push-confirm-title"
          />{" "}
          I understand this will push to my configured remote.
        </label>
        {error && (
          <div className="ce-status ce-status-err" role="alert">
            <span aria-hidden>✕</span> {error}
          </div>
        )}
        <div className="ce-modal-actions">
          <button
            type="button"
            className="ce-btn ce-btn-primary"
            onClick={onConfirm}
            disabled={confirmDisabled}
            aria-label="Run backup and push to the configured remote"
            title={
              confirmDisabled && !busy
                ? "Tick the confirm box to enable push"
                : undefined
            }
          >
            {busy ? "Pushing…" : "Run backup + push"}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={onCancel}
            disabled={busy}
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
