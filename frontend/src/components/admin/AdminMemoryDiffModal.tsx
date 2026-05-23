// CreativEdge Phase 7-C - safe-edit confirmation modal for core memory.
//
// Renders the change region with ±5 lines of context around the
// replacement so the admin can see exactly what the backend's
// `PATCH /agents/:slug/memory/core` will rewrite. Plain text only —
// no markdown, no `dangerouslySetInnerHTML`, no syntax highlighting.
//
// Safety:
//   - Cancel auto-focused on mount.
//   - Esc + backdrop click close without calling the backend.
//   - Enter does NOT auto-confirm.
//   - Save Changes disabled until the "I understand…" checkbox is
//     ticked AND the modal isn't mid-flight.
//   - The replace value is shown verbatim; the parent has already
//     enforced uniqueness (single match) so the backend's 409 path
//     should never fire from this UI, but it is still surfaced via
//     `ApiError.hint` if the backend disagrees.

import { useEffect, useMemo, useRef, useState } from "react";

import type { AgentSummary } from "../../types";

interface Props {
  summary: AgentSummary;
  /** Full current core_memory.md content (loaded by parent). */
  coreText: string;
  /** Substring the user typed in Find. Must occur exactly once in
   *  coreText — the parent gates Preview on that. */
  find: string;
  /** Replacement text. */
  replace: string;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ContextSlice {
  /** 1-indexed line numbers shown in the gutter. */
  startLine: number;
  /** Slice of the original file before the change region. */
  preLines: string[];
  /** Slice of the original file after the change region. */
  postLines: string[];
  /** The original change-region lines (could be 1+ lines). */
  beforeChangeLines: string[];
  /** The replacement-region lines (could be different length). */
  afterChangeLines: string[];
}

const CONTEXT_LINES = 5;

function buildContextSlice(coreText: string, find: string, replace: string): ContextSlice | null {
  const idx = coreText.indexOf(find);
  if (idx < 0) return null;
  const before = coreText.slice(0, idx);
  const after = coreText.slice(idx + find.length);

  // Count line index at the start of the match (0-indexed).
  const startLineIdx = before.split("\n").length - 1;
  // Compute pre context: last CONTEXT_LINES lines of `before`.
  const beforeLines = before.split("\n");
  const preLines = beforeLines.slice(
    Math.max(0, beforeLines.length - 1 - CONTEXT_LINES),
    beforeLines.length - 1
  );
  // The first line of the match region merges with the trailing
  // partial line of `before` (if any). Compute the change-region
  // lines by splitting `find` and `replace` and prepending the
  // trailing-partial fragment.
  const beforeTail = beforeLines[beforeLines.length - 1] ?? "";
  const findLines = find.split("\n");
  const replaceLines = replace.split("\n");
  const afterLines = after.split("\n");
  const afterHead = afterLines[0] ?? "";
  const postLines = afterLines.slice(1, 1 + CONTEXT_LINES);

  const beforeChangeLines = findLines.map((l, i) => {
    if (i === 0) return beforeTail + l;
    return l;
  });
  // Append the head of `after` to the last change line.
  if (beforeChangeLines.length > 0) {
    beforeChangeLines[beforeChangeLines.length - 1] =
      beforeChangeLines[beforeChangeLines.length - 1] + afterHead;
  }

  const afterChangeLines = replaceLines.map((l, i) => {
    if (i === 0) return beforeTail + l;
    return l;
  });
  if (afterChangeLines.length > 0) {
    afterChangeLines[afterChangeLines.length - 1] =
      afterChangeLines[afterChangeLines.length - 1] + afterHead;
  }

  return {
    startLine: Math.max(1, startLineIdx + 1 - preLines.length),
    preLines,
    postLines,
    beforeChangeLines,
    afterChangeLines,
  };
}

export function AdminMemoryDiffModal({
  summary,
  coreText,
  find,
  replace,
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

  const slice = useMemo(
    () => buildContextSlice(coreText, find, replace),
    [coreText, find, replace]
  );

  // Phase 7-C robustness: also require that the defensive context
  // slice resolved. If the file content drifted between Preview click
  // and modal render (e.g. another tab landed an edit), `slice` is
  // null — the warn renders above, and Save Changes must stay locked.
  const canSave =
    confirmed && !busy && find.length > 0 && find !== replace && slice != null;

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
        aria-labelledby="ce-admin-mem-save-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="ce-admin-mem-save-title" className="ce-modal-title">
          Apply this edit to {summary.name}&apos;s core memory?
        </h3>
        <p className="ce-hint">
          Backend will run <code>PATCH /agents/{summary.slug}/memory/core</code>{" "}
          with <code>{`{ find, replace, confirmed: true }`}</code>. The
          backend enforces single-match uniqueness + a sensitive-content
          guard server-side; this preview shows the change region with
          surrounding context. Nothing is written until you click Save
          Changes below.
        </p>

        {slice ? (
          <div className="ce-admin-memdiff" aria-label="Core memory diff preview">
            <div className="ce-admin-memdiff-block">
              {/* Pre-context lines */}
              {slice.preLines.length > 0 && (
                <ol
                  className="ce-admin-memdiff-context"
                  start={slice.startLine}
                  aria-label="Context before change"
                >
                  {slice.preLines.map((line, i) => (
                    <li key={`pre-${i}`}>
                      <span className="ce-admin-memdiff-text">{line || " "}</span>
                    </li>
                  ))}
                </ol>
              )}
              {/* Change region */}
              <div className="ce-admin-memdiff-change">
                {slice.beforeChangeLines.map((line, i) => (
                  <div
                    key={`b-${i}`}
                    className="ce-admin-diff-row ce-admin-diff-before"
                  >
                    <span className="ce-admin-diff-marker" aria-hidden>
                      −
                    </span>
                    <pre className="ce-admin-diff-text">{line || " "}</pre>
                  </div>
                ))}
                {slice.afterChangeLines.map((line, i) => (
                  <div
                    key={`a-${i}`}
                    className="ce-admin-diff-row ce-admin-diff-after"
                  >
                    <span className="ce-admin-diff-marker" aria-hidden>
                      +
                    </span>
                    <pre className="ce-admin-diff-text">{line || " "}</pre>
                  </div>
                ))}
              </div>
              {/* Post-context lines */}
              {slice.postLines.length > 0 && (
                <ol
                  className="ce-admin-memdiff-context"
                  start={
                    slice.startLine +
                    slice.preLines.length +
                    slice.beforeChangeLines.length
                  }
                  aria-label="Context after change"
                >
                  {slice.postLines.map((line, i) => (
                    <li key={`post-${i}`}>
                      <span className="ce-admin-memdiff-text">{line || " "}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        ) : (
          <div className="ce-status ce-status-warn" role="status">
            <span aria-hidden>⚠</span> Find substring is no longer
            present in core memory. Re-load the editor and try again.
          </div>
        )}

        <label className="ce-tool-confirm ce-admin-save-confirm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={busy}
          />{" "}
          I understand this rewrites the agent&apos;s core memory file.
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
            aria-label={`Apply core-memory edit to ${summary.name}`}
            title={
              !slice
                ? "Find string no longer matches"
                : confirmed
                  ? "Save (PATCH /agents/:slug/memory/core)"
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
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
