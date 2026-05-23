// CreativEdge Phase 7-B - safe-edit confirmation modal with diff preview.
//
// Renders the field-level diff between the current snapshot baseline
// (`before`) and the user's edits (`after`), only for fields the user
// actually changed. The destructive save (a real `PUT /agents/:slug`)
// only fires after:
//   1. the user explicitly clicks Save Changes,
//   2. AND the "I understand…" confirmation checkbox is ticked.
//
// Safety contract:
//   - Cancel button is auto-focused on mount so a reflex Enter on
//     modal open fires the safe path.
//   - Esc closes the modal without calling the backend.
//   - Backdrop click closes the modal without calling the backend.
//   - Enter does NOT auto-confirm; the user has to click Save.
//   - The Save button is disabled until the checkbox is ticked AND
//     the modal isn't already mid-flight.
//
// Diff rendering is plain-text only — no markdown, no
// dangerouslySetInnerHTML. Arrays are diffed as set-difference
// (added vs removed items) so multi-line bullet lists stay readable.

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  AgentOverridesPatch,
  AgentSummary,
} from "../../types";

interface Props {
  summary: AgentSummary;
  /** Baseline snapshot before the user's edits — the effective value
   *  per field (overrides → fall back to template defaults). */
  before: AgentOverridesPatch;
  /** Current edited value per field. The modal computes the diff
   *  inside; both shapes are subsets of `AgentOverrides`. */
  after: AgentOverridesPatch;
  /** Patch the parent intends to POST (only changed fields). The
   *  modal does NOT recompute this — it trusts the caller, which
   *  guarantees array-equality and trim semantics are consistent. */
  patch: AgentOverridesPatch;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

type FieldKey = keyof AgentOverridesPatch;

const STRING_FIELDS: readonly FieldKey[] = ["tagline", "voice", "color"];
const ARRAY_FIELDS: readonly FieldKey[] = ["values", "strengths", "watch_outs"];

function getStr(p: AgentOverridesPatch, k: FieldKey): string {
  const v = p[k];
  return typeof v === "string" ? v : "";
}

function getArr(p: AgentOverridesPatch, k: FieldKey): string[] {
  const v = p[k];
  return Array.isArray(v) ? v : [];
}

interface ArrayDiff {
  added: string[];
  removed: string[];
}

function arrayDiff(a: string[], b: string[]): ArrayDiff {
  const aset = new Set(a);
  const bset = new Set(b);
  return {
    added: b.filter((x) => !aset.has(x)),
    removed: a.filter((x) => !bset.has(x)),
  };
}

export function AdminAgentSaveModal({
  summary,
  before,
  after,
  patch,
  busy,
  error,
  onConfirm,
  onCancel,
}: Props): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);

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

  const changedKeys = useMemo<FieldKey[]>(() => {
    return (Object.keys(patch) as FieldKey[]).filter((k) => {
      const v = patch[k];
      return v !== undefined;
    });
  }, [patch]);

  const canSave = confirmed && !busy && changedKeys.length > 0;

  return (
    <div
      className="ce-modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="ce-modal ce-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ce-admin-save-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="ce-admin-save-title" className="ce-modal-title">
          Save changes to {summary.name} <code>({summary.slug})</code>?
        </h3>
        <p className="ce-hint">
          Review the diff below. The save will write to the agent's
          overrides file via <code>PUT /agents/:slug</code> with only
          the changed fields shown. Other fields stay untouched.
        </p>

        {changedKeys.length === 0 ? (
          <p className="ce-status ce-status-info" role="status">
            <span aria-hidden>·</span> No changes detected.
          </p>
        ) : (
          <div className="ce-admin-diff" aria-label="Field-level diff">
            {changedKeys.map((k) => {
              if (STRING_FIELDS.includes(k)) {
                const a = getStr(before, k);
                const b = getStr(after, k);
                return (
                  <div key={k} className="ce-admin-diff-block">
                    <div className="ce-admin-diff-head">
                      <code>{k}</code>
                    </div>
                    <div className="ce-admin-diff-row ce-admin-diff-before">
                      <span className="ce-admin-diff-marker" aria-hidden>
                        −
                      </span>
                      <pre className="ce-admin-diff-text">{a || "(empty)"}</pre>
                    </div>
                    <div className="ce-admin-diff-row ce-admin-diff-after">
                      <span className="ce-admin-diff-marker" aria-hidden>
                        +
                      </span>
                      <pre className="ce-admin-diff-text">{b || "(empty)"}</pre>
                    </div>
                  </div>
                );
              }
              if (ARRAY_FIELDS.includes(k)) {
                const a = getArr(before, k);
                const b = getArr(after, k);
                const { added, removed } = arrayDiff(a, b);
                return (
                  <div key={k} className="ce-admin-diff-block">
                    <div className="ce-admin-diff-head">
                      <code>{k}</code>
                      <span className="ce-hint ce-admin-diff-counts">
                        +{added.length} / −{removed.length} (total{" "}
                        {a.length} → {b.length})
                      </span>
                    </div>
                    {removed.length > 0 && (
                      <ul className="ce-admin-diff-list ce-admin-diff-before">
                        {removed.map((item, idx) => (
                          <li key={"r-" + idx}>
                            <span className="ce-admin-diff-marker" aria-hidden>
                              −
                            </span>
                            <span className="ce-admin-diff-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {added.length > 0 && (
                      <ul className="ce-admin-diff-list ce-admin-diff-after">
                        {added.map((item, idx) => (
                          <li key={"a-" + idx}>
                            <span className="ce-admin-diff-marker" aria-hidden>
                              +
                            </span>
                            <span className="ce-admin-diff-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {removed.length === 0 && added.length === 0 && (
                      <p className="ce-hint">
                        Same items, different order — no net change will
                        be sent.
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        <label className="ce-tool-confirm ce-admin-save-confirm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={busy}
          />{" "}
          I understand this modifies the live agent profile.
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
            disabled={!canSave}
            aria-label={`Save changes to ${summary.name}`}
            title={
              changedKeys.length === 0
                ? "No changes to save"
                : confirmed
                  ? "Save (PUT /agents/:slug)"
                  : "Tick the confirm checkbox first"
            }
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className="ce-btn ce-btn-secondary"
            onClick={onCancel}
            disabled={busy}
            aria-label="Cancel save"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
