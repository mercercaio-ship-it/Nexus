// CreativEdge Phase 6-C/6-E - confirmation modal for destructive slash commands.
//
// `/remember <text>` and `/forget core|episodic <text>` never call
// the backend on parse. They hand the parent a `SlashConfirmRequest`
// which renders this modal; the backend call only fires after an
// explicit click on Confirm. Cancel closes the modal and never
// reaches the backend.
//
// Phase 6-E hardening: focus lands on **Cancel** by default; Esc
// closes; Enter does NOT auto-confirm (we keep the destructive
// action behind an intentional click).
//
// Phase 6-E validation patch (2026-05-20):
//   - Adds a target-agent `<select>` so the user can pick which
//     agent's memory the action targets. Defaults to the slug the
//     parent passed in (which is either an explicit `/remember @alias`
//     resolution, the active agent, or `nexus` as the safe fallback).
//   - The selected slug is passed back via `onConfirm(slug)` so the
//     dispatcher always uses the modal's authoritative choice — not
//     the original request's slug — when calling the backend.

import { useEffect, useRef, useState } from "react";

import { AGENT_CATALOG, nameForSlug } from "../agents/agentCatalog";
import type { SlashConfirmRequest } from "../types";

interface Props {
  request: SlashConfirmRequest;
  busy: boolean;
  error: string | null;
  /** Called when the user clicks Confirm. The resolved `targetSlug`
   *  is the value of the modal's selector at click-time. */
  onConfirm: (targetSlug: string) => void;
  onCancel: () => void;
}

export function SlashConfirmModal({
  request,
  busy,
  error,
  onConfirm,
  onCancel,
}: Props): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [targetSlug, setTargetSlug] = useState<string>(request.agentSlug);

  // Re-sync the local target slug if the parent hands us a new request
  // (e.g. user dismissed and re-ran a different /remember).
  useEffect(() => {
    setTargetSlug(request.agentSlug);
  }, [request.agentSlug]);

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

  const isForget = request.command === "forget";
  const title = isForget
    ? `Forget from ${request.forgetKind ?? "core"} memory?`
    : "Save this to core memory?";
  const verb = isForget ? "Forget" : "Save memory";
  const danger = isForget;
  const labelText = isForget ? "Forget from memory of" : "Save to memory of";

  return (
    <div className="ce-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="ce-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ce-slash-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="ce-slash-confirm-title" className="ce-modal-title">
          {title}
        </h3>
        <label className="ce-modal-field">
          <span className="ce-modal-field-label">{labelText}</span>
          <select
            value={targetSlug}
            onChange={(e) => setTargetSlug(e.target.value)}
            disabled={busy}
            aria-label="Target agent for this memory action"
          >
            {AGENT_CATALOG.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name} ({a.slug})
              </option>
            ))}
            {/* Defensive: if the request slug isn't in the catalog (older
             *  agent or custom slug), keep it selectable so the modal
             *  doesn't silently change it. */}
            {!AGENT_CATALOG.some((a) => a.slug === targetSlug) && (
              <option value={targetSlug}>{nameForSlug(targetSlug)} ({targetSlug})</option>
            )}
          </select>
        </label>
        {isForget && request.forgetKind && (
          <p className="ce-hint">
            Kind: <code>{request.forgetKind}</code>
          </p>
        )}
        <blockquote className="ce-modal-quote">{request.text}</blockquote>
        {error && (
          <div className="ce-status ce-status-err" role="alert">
            <span aria-hidden>✕</span> {error}
          </div>
        )}
        <div className="ce-modal-actions">
          <button
            type="button"
            className={
              danger
                ? "ce-btn ce-btn-danger"
                : "ce-btn ce-btn-primary"
            }
            onClick={() => onConfirm(targetSlug)}
            disabled={busy}
            aria-label={`${verb} to ${nameForSlug(targetSlug)}`}
          >
            {busy ? "Working…" : verb}
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
