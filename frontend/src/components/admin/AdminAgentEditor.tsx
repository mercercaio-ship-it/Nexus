// CreativEdge Phase 7-B - safe agent editor (live PUT /agents/:slug).
//
// Lives inside `AdminAgentDetail` and exposes the **safe** override
// fields the backend `validateOverridesPatch` accepts:
//
//   - tagline      (string, ≤ 2000 chars)
//   - voice        (string, ≤ 2000 chars)
//   - color        (string, must match /^#[0-9a-fA-F]{6}$/)
//   - values       (string[], ≤ 50 items)
//   - strengths    (string[], ≤ 50 items)
//   - watch_outs   (string[], ≤ 50 items)
//
// Editor flow (six steps; backend never sees the user's edits until
// the final click on Save Changes):
//
//   1. User edits fields locally — pure component state, no fetch.
//   2. User clicks Preview changes — opens `AdminAgentSaveModal`
//      with a field-level diff (strings before/after, arrays as
//      added/removed sets).
//   3. Diff is plain text only; no markdown, no
//      dangerouslySetInnerHTML.
//   4. User must tick "I understand this modifies the live agent
//      profile." — Save Changes stays disabled until then.
//   5. User clicks Save Changes — `PUT /agents/:slug` fires with the
//      changed-only patch (one network call).
//   6. On success, the editor seeds its baseline from the merged
//      overrides the backend returned and clears the dirty state.
//      On failure, the original values are preserved (no optimistic
//      UI).
//
// Validation:
//   - color is validated client-side BEFORE Preview enables.
//   - oversized strings (>2000) and oversized arrays (>50) are
//     refused with a friendly inline warning.
//   - empty strings are allowed (treated as "clear override" — the
//     backend still merges and writes the empty string; the UI
//     surfaces this as the new effective value).
//   - duplicate array entries are de-duplicated on Add and trimmed
//     on entry so the diff stays scannable.

import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError, putAgentOverrides } from "../../api/client";
import type {
  AgentConfigShape,
  AgentOverrides,
  AgentOverridesPatch,
  AgentSummary,
} from "../../types";
import { ActionResult } from "../ActionResult";
import { AdminAgentSaveModal } from "./AdminAgentSaveModal";

interface Props {
  summary: AgentSummary;
  /** Snapshot config (template defaults) for the safe-editable fields. */
  config: AgentConfigShape | null | undefined;
  /** Snapshot overrides (currently-saved per-agent overrides). */
  overrides: AgentOverrides | undefined;
  /** Called after a successful save so the parent detail panel can
   *  re-fetch the snapshot and update its memory-presence badges +
   *  pass the new baseline back in. */
  onSaved: () => void;
}

interface EditorState {
  tagline: string;
  voice: string;
  color: string;
  values: string[];
  strengths: string[];
  watch_outs: string[];
}

const COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const STRING_MAX = 2000;
const ARRAY_MAX = 50;

/** Resolve the effective baseline: override → template → empty.
 *  Strings collapse `undefined` to `""`; arrays collapse to `[]`. */
function buildBaseline(
  config: AgentConfigShape | null | undefined,
  overrides: AgentOverrides | undefined
): EditorState {
  const o = overrides ?? {};
  const c = config ?? {};
  const pickStr = (key: keyof EditorState): string => {
    const ov = (o as Record<string, unknown>)[key];
    if (typeof ov === "string") return ov;
    const cv = (c as Record<string, unknown>)[key];
    return typeof cv === "string" ? cv : "";
  };
  const pickArr = (key: keyof EditorState): string[] => {
    const ov = (o as Record<string, unknown>)[key];
    if (Array.isArray(ov) && ov.every((x) => typeof x === "string")) return [...(ov as string[])];
    const cv = (c as Record<string, unknown>)[key];
    if (Array.isArray(cv) && cv.every((x) => typeof x === "string")) return [...(cv as string[])];
    return [];
  };
  return {
    tagline: pickStr("tagline"),
    voice: pickStr("voice"),
    color: pickStr("color"),
    values: pickArr("values"),
    strengths: pickArr("strengths"),
    watch_outs: pickArr("watch_outs"),
  };
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function buildPatch(baseline: EditorState, current: EditorState): AgentOverridesPatch {
  const patch: AgentOverridesPatch = {};
  if (current.tagline !== baseline.tagline) patch.tagline = current.tagline;
  if (current.voice !== baseline.voice) patch.voice = current.voice;
  if (current.color !== baseline.color) patch.color = current.color;
  if (!arraysEqual(current.values, baseline.values)) patch.values = current.values;
  if (!arraysEqual(current.strengths, baseline.strengths)) patch.strengths = current.strengths;
  if (!arraysEqual(current.watch_outs, baseline.watch_outs)) patch.watch_outs = current.watch_outs;
  return patch;
}

interface ValidationProblems {
  tagline?: string;
  voice?: string;
  color?: string;
  values?: string;
  strengths?: string;
  watch_outs?: string;
}

function validate(state: EditorState): ValidationProblems {
  const p: ValidationProblems = {};
  if (state.tagline.length > STRING_MAX) p.tagline = `tagline too long (max ${STRING_MAX})`;
  if (state.voice.length > STRING_MAX) p.voice = `voice too long (max ${STRING_MAX})`;
  if (state.color.length > 0 && !COLOR_RE.test(state.color)) {
    p.color = "color must be a #RRGGBB hex (e.g. #5d8eff)";
  }
  if (state.values.length > ARRAY_MAX) p.values = `too many values (max ${ARRAY_MAX})`;
  if (state.strengths.length > ARRAY_MAX) p.strengths = `too many strengths (max ${ARRAY_MAX})`;
  if (state.watch_outs.length > ARRAY_MAX) p.watch_outs = `too many watch_outs (max ${ARRAY_MAX})`;
  return p;
}

interface ArrayFieldProps {
  label: string;
  fieldKey: "values" | "strengths" | "watch_outs";
  items: string[];
  problem?: string;
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

function ArrayFieldEditor({
  label,
  fieldKey,
  items,
  problem,
  onChange,
  disabled,
}: ArrayFieldProps): JSX.Element {
  const [draft, setDraft] = useState<string>("");

  const add = useCallback(() => {
    const cleaned = draft.trim().replace(/\s+/g, " ");
    if (cleaned.length === 0) return;
    if (items.includes(cleaned)) {
      setDraft("");
      return;
    }
    if (items.length >= ARRAY_MAX) return;
    onChange([...items, cleaned]);
    setDraft("");
  }, [draft, items, onChange]);

  const remove = useCallback(
    (idx: number) => {
      onChange(items.filter((_, i) => i !== idx));
    },
    [items, onChange]
  );

  const inputId = `ce-admin-edit-${fieldKey}-add`;

  return (
    <fieldset className="ce-admin-edit-field">
      <legend>{label}</legend>
      <ul className="ce-admin-edit-array-list">
        {items.length === 0 && (
          <li className="ce-admin-edit-array-empty ce-hint">No entries yet.</li>
        )}
        {items.map((item, idx) => (
          <li key={`${fieldKey}-${idx}`} className="ce-admin-edit-array-row">
            <span className="ce-admin-edit-array-text">{item}</span>
            <button
              type="button"
              className="ce-btn ce-btn-secondary ce-admin-edit-array-remove"
              onClick={() => remove(idx)}
              disabled={disabled}
              aria-label={`Remove ${label} entry: ${item}`}
              title="Remove"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="ce-admin-edit-array-add">
        <label className="ce-visually-hidden" htmlFor={inputId}>
          Add to {label}
        </label>
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={`Add a ${label.toLowerCase().replace(/_/g, " ")} entry…`}
          disabled={disabled || items.length >= ARRAY_MAX}
          maxLength={400}
        />
        <button
          type="button"
          className="ce-btn"
          onClick={add}
          disabled={disabled || draft.trim().length === 0 || items.length >= ARRAY_MAX}
          aria-label={`Add ${label} entry`}
        >
          Add
        </button>
      </div>
      {problem && (
        <p className="ce-status ce-status-warn" role="status">
          <span aria-hidden>⚠</span> {problem}
        </p>
      )}
    </fieldset>
  );
}

export function AdminAgentEditor({
  summary,
  config,
  overrides,
  onSaved,
}: Props): JSX.Element {
  const baseline = useMemo<EditorState>(
    () => buildBaseline(config, overrides),
    [config, overrides]
  );
  const [state, setState] = useState<EditorState>(baseline);

  // Reseed local state when the snapshot baseline changes (e.g. the
  // user selected a different agent or a successful save updated
  // overrides). Equality is structural so we don't churn on every
  // parent re-render.
  useEffect(() => {
    setState(baseline);
  }, [baseline]);

  const patch = useMemo<AgentOverridesPatch>(
    () => buildPatch(baseline, state),
    [baseline, state]
  );
  const dirty = Object.keys(patch).length > 0;
  const problems = useMemo<ValidationProblems>(() => validate(state), [state]);
  const hasProblem = Object.keys(problems).length > 0;

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const onReset = useCallback(() => {
    setState(baseline);
    setError(null);
    setResultText(null);
  }, [baseline]);

  const onPreview = useCallback(() => {
    if (!dirty || hasProblem) return;
    setError(null);
    setResultText(null);
    setModalOpen(true);
  }, [dirty, hasProblem]);

  const onConfirmSave = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await putAgentOverrides(summary.slug, patch);
      const rejected = r.rejected ?? [];
      if (rejected.length > 0) {
        setResultText(
          `Saved with partial apply: ${rejected.length} field(s) refused — ${rejected
            .map((x) => `${x.field}: ${x.reason}`)
            .join("; ")}`
        );
      } else {
        const keys = Object.keys(patch);
        setResultText(
          `Saved ${keys.length} field${keys.length === 1 ? "" : "s"} (${keys.join(", ")}).`
        );
      }
      setModalOpen(false);
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.message}${err.hint ? ` (${err.hint})` : ""}`);
      } else {
        setError(err instanceof Error ? err.message : "save failed");
      }
    } finally {
      setBusy(false);
    }
  }, [summary.slug, patch, onSaved]);

  const onCancelModal = useCallback(() => {
    if (busy) return;
    setModalOpen(false);
  }, [busy]);

  return (
    <section className="ce-admin-section" aria-label="Edit agent overrides">
      <h3 className="ce-admin-section-head">Edit overrides</h3>
      <p className="ce-hint">
        Only the safe-override fields are editable. Slug / system
        prompt / routing internals are read-only by design. Save
        flow: edit → Preview changes → tick the confirmation
        checkbox → Save changes. The backend writes to{" "}
        <code>overrides.json</code>; the original template files
        stay untouched.
      </p>

      <div className="ce-admin-edit-grid">
        <fieldset className="ce-admin-edit-field">
          <legend>tagline</legend>
          <textarea
            value={state.tagline}
            onChange={(e) => setState((s) => ({ ...s, tagline: e.target.value }))}
            rows={2}
            maxLength={STRING_MAX + 1}
            placeholder="A short tagline that captures the agent's voice."
            aria-invalid={!!problems.tagline}
          />
          <div className="ce-admin-edit-field-meta">
            <span className="ce-hint">{state.tagline.length} / {STRING_MAX}</span>
            {problems.tagline && (
              <span className="ce-status-warn">⚠ {problems.tagline}</span>
            )}
          </div>
        </fieldset>

        <fieldset className="ce-admin-edit-field">
          <legend>voice</legend>
          <textarea
            value={state.voice}
            onChange={(e) => setState((s) => ({ ...s, voice: e.target.value }))}
            rows={3}
            maxLength={STRING_MAX + 1}
            placeholder="Describe the agent's tone, register, vocabulary…"
            aria-invalid={!!problems.voice}
          />
          <div className="ce-admin-edit-field-meta">
            <span className="ce-hint">{state.voice.length} / {STRING_MAX}</span>
            {problems.voice && (
              <span className="ce-status-warn">⚠ {problems.voice}</span>
            )}
          </div>
        </fieldset>

        <fieldset className="ce-admin-edit-field">
          <legend>color</legend>
          <div className="ce-admin-edit-color-row">
            <input
              type="text"
              value={state.color}
              onChange={(e) => setState((s) => ({ ...s, color: e.target.value }))}
              placeholder="#5d8eff"
              maxLength={7}
              aria-invalid={!!problems.color}
              spellCheck={false}
              autoComplete="off"
            />
            <span
              className="ce-admin-edit-color-swatch"
              aria-hidden
              style={{
                background: COLOR_RE.test(state.color) ? state.color : "transparent",
                borderColor: COLOR_RE.test(state.color) ? state.color : "var(--border)",
              }}
            />
          </div>
          {problems.color && (
            <p className="ce-status ce-status-warn" role="status">
              <span aria-hidden>⚠</span> {problems.color}
            </p>
          )}
        </fieldset>

        <ArrayFieldEditor
          label="values"
          fieldKey="values"
          items={state.values}
          problem={problems.values}
          onChange={(next) => setState((s) => ({ ...s, values: next }))}
          disabled={busy}
        />
        <ArrayFieldEditor
          label="strengths"
          fieldKey="strengths"
          items={state.strengths}
          problem={problems.strengths}
          onChange={(next) => setState((s) => ({ ...s, strengths: next }))}
          disabled={busy}
        />
        <ArrayFieldEditor
          label="watch_outs"
          fieldKey="watch_outs"
          items={state.watch_outs}
          problem={problems.watch_outs}
          onChange={(next) => setState((s) => ({ ...s, watch_outs: next }))}
          disabled={busy}
        />
      </div>

      <div className="ce-admin-edit-actions">
        <button
          type="button"
          className="ce-btn ce-btn-primary"
          onClick={onPreview}
          disabled={!dirty || hasProblem || busy}
          title={
            !dirty
              ? "No changes to preview"
              : hasProblem
                ? "Fix validation problems first"
                : "Preview field-level diff before saving"
          }
        >
          Preview changes
        </button>
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={onReset}
          disabled={!dirty || busy}
        >
          Reset changes
        </button>
        <span className="ce-hint">
          {dirty
            ? `${Object.keys(patch).length} field(s) modified`
            : "No unsaved changes"}
        </span>
      </div>

      {resultText && (
        <ActionResult state={{ kind: "ok", text: resultText }} />
      )}
      {error && !modalOpen && (
        <ActionResult state={{ kind: "err", text: error }} />
      )}

      {modalOpen && (
        <AdminAgentSaveModal
          summary={summary}
          before={baseline}
          after={state}
          patch={patch}
          busy={busy}
          error={error}
          onConfirm={onConfirmSave}
          onCancel={onCancelModal}
        />
      )}
    </section>
  );
}
