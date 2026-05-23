// CreativEdge Phase 7-C - admin core-memory diff editor.
//
// Inline section inside `AdminAgentDetail` that lets an admin make a
// single, **safe**, find/replace edit to an agent's core memory file
// via the already-validated `PATCH /agents/:slug/memory/core` route.
// The route enforces single-match uniqueness, a sensitive-content
// guard, and atomic disk writes server-side (Phase 5.2-D).
//
// The §7-C admin editor layers context awareness + pre-flight match
// counting + a diff-modal preview on top of those backend gates:
//
//   1. The current `core_memory.md` is loaded via the existing
//      `GET /agents/:slug/memory` route and rendered in a read-only,
//      monospace, line-numbered viewer so the admin can see what
//      they're editing.
//   2. Find / Replace inputs are multi-line textareas — `find` may
//      span multiple lines, which the backend already supports.
//   3. As the user types `find`, a live match-count badge shows
//      0 / 1 / 2+; Preview enables only when exactly 1 match exists
//      AND `find !== replace`.
//   4. Preview opens `AdminMemoryDiffModal` with the change region
//      surrounded by ±5 lines of context.
//   5. The modal requires an explicit checkbox + an explicit Save
//      Changes click; Cancel is auto-focused; Esc / backdrop close
//      without calling the backend.
//   6. On success, the viewer reloads from the backend so the new
//      file content becomes the new baseline; the parent detail
//      panel is asked to refresh its memory-presence badges.
//   7. 404 / 409 / 422 / network errors are rendered via the
//      existing `ApiError` semantics with friendly per-status hints.

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  editCoreMemory,
  getAgentMemory,
} from "../../api/client";
import type { AgentSummary } from "../../types";
import { ActionResult } from "../ActionResult";
import { StatusBadge } from "../StatusBadge";
import { AdminMemoryDiffModal } from "./AdminMemoryDiffModal";

interface Props {
  summary: AgentSummary;
  /** Called after a successful PATCH so the parent detail panel can
   *  refresh the memory-presence badges + episodic/core line counts. */
  onSaved: () => void;
}

type LoadState =
  | { kind: "busy" }
  | { kind: "ok"; coreText: string }
  | { kind: "err"; text: string };

function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const idx = haystack.indexOf(needle, from);
    if (idx < 0) break;
    count += 1;
    from = idx + needle.length;
    if (count > 10) break; // cap; only the 0/1/2+ distinction matters
  }
  return count;
}

function describeApiError(err: unknown): string {
  if (err instanceof ApiError) {
    const base = err.message || `HTTP ${err.status}`;
    const hint = err.hint ? ` (${err.hint})` : "";
    switch (err.status) {
      case 400:
        return `Refused (400): ${base}${hint}`;
      case 404:
        return `Not found (404) — find substring no longer matches: ${base}${hint}`;
      case 409:
        return `Multiple matches (409) — find substring is no longer unique: ${base}${hint}`;
      case 422:
        return `Refused (422) — replacement contains sensitive content. The file is unchanged.`;
      default:
        return `${base}${hint}`;
    }
  }
  return err instanceof Error ? err.message : "edit failed";
}

export function AdminMemoryEditor({ summary, onSaved }: Props): JSX.Element {
  const [load, setLoad] = useState<LoadState>({ kind: "busy" });
  const [find, setFind] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoad({ kind: "busy" });
    setError(null);
    try {
      const r = await getAgentMemory(summary.slug);
      setLoad({ kind: "ok", coreText: r.core ?? "" });
    } catch (err) {
      setLoad({ kind: "err", text: describeApiError(err) });
    }
  }, [summary.slug]);

  // Load when the selected slug changes; reset draft inputs so a
  // stale `find` from a previous agent never accidentally targets
  // this one.
  useEffect(() => {
    setFind("");
    setReplace("");
    setError(null);
    setResultText(null);
    void refresh();
  }, [refresh]);

  const coreText = load.kind === "ok" ? load.coreText : "";
  const matchCount = useMemo(() => countOccurrences(coreText, find), [coreText, find]);
  const sameAsReplace = find === replace;
  const findReady = find.length >= 3 && matchCount === 1 && !sameAsReplace;
  const lineCount = coreText.length > 0 ? coreText.split("\n").length : 0;

  const onPreview = useCallback(() => {
    if (!findReady) return;
    setError(null);
    setResultText(null);
    setModalOpen(true);
  }, [findReady]);

  const onConfirm = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await editCoreMemory(summary.slug, find, replace);
      if (r.edited) {
        setResultText(`Core memory updated (${r.bytesWritten ?? 0} bytes rewritten).`);
      } else if (r.unchanged) {
        setResultText("No change (find equals replace).");
      } else {
        setResultText("Edit applied.");
      }
      setModalOpen(false);
      setFind("");
      setReplace("");
      onSaved();
      await refresh();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setBusy(false);
    }
  }, [summary.slug, find, replace, onSaved, refresh]);

  const onCancelModal = useCallback(() => {
    if (busy) return;
    setModalOpen(false);
  }, [busy]);

  const matchVariant =
    matchCount === 0
      ? "neutral"
      : matchCount === 1
        ? "ok"
        : "warn";
  const matchLabel =
    matchCount === 0
      ? "no match yet"
      : matchCount === 1
        ? "1 match"
        : matchCount > 10
          ? "10+ matches"
          : `${matchCount} matches`;

  return (
    <section
      className="ce-admin-section ce-admin-memedit"
      aria-label="Core memory diff editor"
    >
      <h3 className="ce-admin-section-head">
        Core memory editor
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-admin-memedit-refresh"
          onClick={refresh}
          disabled={load.kind === "busy" || busy}
          aria-label="Reload core memory from disk"
          title="Reload"
        >
          ↻
        </button>
      </h3>
      <p className="ce-hint">
        Surgical find / replace into{" "}
        <code>core_memory.md</code> via{" "}
        <code>PATCH /agents/{summary.slug}/memory/core</code>. Backend
        enforces single-match uniqueness, a sensitive-content guard,
        and an atomic write. Preview is gated on a unique match in
        this UI too — the diff modal also requires an explicit
        confirmation checkbox.
      </p>

      {load.kind === "busy" && <ActionResult state={{ kind: "busy" }} />}
      {load.kind === "err" && (
        <ActionResult state={{ kind: "err", text: load.text }} />
      )}

      {load.kind === "ok" && (
        <>
          <div className="ce-admin-memedit-viewer-head">
            <StatusBadge variant="neutral" icon="·">
              {coreText.length === 0
                ? "empty file"
                : `${lineCount} line${lineCount === 1 ? "" : "s"}`}
            </StatusBadge>
            <StatusBadge variant="neutral" icon="·">
              {coreText.length} chars
            </StatusBadge>
          </div>
          {coreText.length === 0 ? (
            <p className="ce-hint">
              Core memory file is empty. Use the regular Memory tools
              to promote an entry first, then return here to edit it.
            </p>
          ) : (
            <pre
              className="ce-admin-memedit-viewer"
              aria-label="Current core memory contents"
            >
              {coreText}
            </pre>
          )}

          <div className="ce-admin-memedit-form">
            <label className="ce-admin-edit-field">
              <span className="ce-admin-edit-field-legend">find</span>
              <textarea
                rows={3}
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="Unique substring to replace (≥ 3 chars; can span multiple lines)…"
                disabled={busy}
              />
            </label>
            <label className="ce-admin-edit-field">
              <span className="ce-admin-edit-field-legend">replace</span>
              <textarea
                rows={3}
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="Replacement text. Leave equal to find for a no-op check."
                disabled={busy}
              />
            </label>
          </div>

          <div className="ce-admin-memedit-status">
            <StatusBadge variant={matchVariant}>{matchLabel}</StatusBadge>
            {sameAsReplace && find.length > 0 && (
              <StatusBadge variant="neutral" icon="·">
                find equals replace
              </StatusBadge>
            )}
            {find.length > 0 && find.length < 3 && (
              <StatusBadge variant="warn">need ≥ 3 chars</StatusBadge>
            )}
          </div>

          <div className="ce-admin-edit-actions">
            <button
              type="button"
              className="ce-btn ce-btn-primary"
              onClick={onPreview}
              disabled={!findReady || busy}
              title={
                find.length === 0
                  ? "Type a find string"
                  : find.length < 3
                    ? "Find must be ≥ 3 chars"
                    : matchCount === 0
                      ? "Find substring is not in core memory"
                      : matchCount > 1
                        ? "Find substring is not unique — add more context"
                        : sameAsReplace
                          ? "Find equals replace — nothing to do"
                          : "Preview the change in a diff modal"
              }
            >
              Preview changes
            </button>
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={() => {
                setFind("");
                setReplace("");
                setError(null);
                setResultText(null);
              }}
              disabled={(find.length === 0 && replace.length === 0) || busy}
            >
              Clear
            </button>
          </div>

          {resultText && (
            <ActionResult state={{ kind: "ok", text: resultText }} />
          )}
          {error && !modalOpen && (
            <ActionResult state={{ kind: "err", text: error }} />
          )}

          {modalOpen && (
            <AdminMemoryDiffModal
              summary={summary}
              coreText={coreText}
              find={find}
              replace={replace}
              busy={busy}
              error={error}
              onConfirm={onConfirm}
              onCancel={onCancelModal}
            />
          )}
        </>
      )}
    </section>
  );
}
