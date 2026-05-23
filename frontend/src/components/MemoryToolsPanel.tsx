// CreativEdge Phase 6-A/6-B - memory tools panel (per active agent).
//
// Phase 6-B expands the tool set from three to five, matching the
// already-validated backend routes:
//
//   A. Promote arbitrary entry           → POST /promote
//   B. Promote-episodic (by needle)      → POST /promote-episodic
//   C. Edit-core (find + replace)        → PATCH /core
//   D. Forget (kind + find)              → POST /forget
//   E. Compact status / preview / apply  → /compact/{status,preview,apply}
//
// Every mutation requires an explicit click and an explicit confirm
// checkbox (or, in Compact's case, the chained preview-then-apply
// gesture). No auto-promote, no auto-edit, no auto-forget, no auto-
// compact-apply. All status output flows through `ActionResult` so
// success / duplicate / warn / err render with consistent styling.

import { useCallback, useState } from "react";

import {
  ApiError,
  compactApply,
  compactPreview,
  compactStatus,
  editCoreMemory,
  forgetMemory,
  promoteEpisodicMemory,
  promoteMemory,
} from "../api/client";
import type {
  ActionState,
  CompactPreviewResponse,
  CompactStatusResponse,
} from "../types";
import { ActionResult } from "./ActionResult";
import { StatusBadge } from "./StatusBadge";

interface Props {
  slug: string;
}

export function MemoryToolsPanel({ slug }: Props): JSX.Element {
  return (
    <details className="ce-tools-panel">
      <summary>
        🧰 Memory tools <code>{slug}</code>
      </summary>
      <div className="ce-tools-body">
        <PromoteTool slug={slug} />
        <PromoteEpisodicTool slug={slug} />
        <EditCoreTool slug={slug} />
        <ForgetTool slug={slug} />
        <CompactSection slug={slug} />
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Map HTTP status → ActionState. Keeps messaging consistent across tools.
// ---------------------------------------------------------------------------

function apiErrorToState(err: unknown, fallback: string): ActionState {
  if (err instanceof ApiError) {
    const baseMsg = err.message || `HTTP ${err.status}`;
    const hint = err.hint ? ` (${err.hint})` : "";
    switch (err.status) {
      case 400:
        return {
          kind: "warn",
          text: `Refused (400): ${baseMsg}${hint}`,
        };
      case 404:
        return {
          kind: "warn",
          text: `Not found (404): ${baseMsg}${hint}`,
        };
      case 409:
        return {
          kind: "warn",
          text: `Multiple matches (409): ${baseMsg}${hint}`,
        };
      case 422:
        return {
          kind: "warn",
          text: "This looks sensitive, so it was not saved.",
        };
      default:
        return {
          kind: "err",
          text: `${baseMsg}${hint}`,
        };
    }
  }
  return {
    kind: "err",
    text: err instanceof Error ? err.message : fallback,
  };
}

// ---------------------------------------------------------------------------
// A. Promote arbitrary entry
// ---------------------------------------------------------------------------

function PromoteTool({ slug }: { slug: string }) {
  const [entry, setEntry] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const busy = state.kind === "busy";
  const canRun = confirmed && entry.trim().length > 0 && !busy;

  const run = useCallback(async () => {
    if (!canRun) return;
    setState({ kind: "busy" });
    try {
      const r = await promoteMemory(slug, entry.trim());
      setState(
        r.duplicate
          ? { kind: "duplicate", text: "Already in core memory." }
          : { kind: "ok", text: `Saved (${r.bytesAppended ?? 0} bytes).` }
      );
      setEntry("");
      setConfirmed(false);
    } catch (err) {
      setState(apiErrorToState(err, "promote failed"));
    }
  }, [canRun, slug, entry]);

  return (
    <fieldset className="ce-tool">
      <legend>Promote entry to core memory</legend>
      <label className="ce-visually-hidden" htmlFor={`promote-${slug}`}>
        Entry to save
      </label>
      <textarea
        id={`promote-${slug}`}
        rows={2}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="The fact to save…"
      />
      <label className="ce-tool-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />{" "}
        I confirm this is intentional and not sensitive.
      </label>
      <button
        className="ce-btn ce-btn-primary"
        disabled={!canRun}
        onClick={run}
      >
        {busy ? "Saving…" : "Save to core"}
      </button>
      <ActionResult state={state} />
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// B. Promote-episodic by needle
// ---------------------------------------------------------------------------

function PromoteEpisodicTool({ slug }: { slug: string }) {
  const [needle, setNeedle] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const busy = state.kind === "busy";
  const canRun = confirmed && needle.trim().length >= 3 && !busy;

  const run = useCallback(async () => {
    if (!canRun) return;
    setState({ kind: "busy" });
    try {
      const r = await promoteEpisodicMemory(slug, needle.trim());
      if (r.duplicate) {
        setState({
          kind: "duplicate",
          text: "Already present in core (duplicate).",
        });
      } else {
        setState({
          kind: "ok",
          text: `Promoted episodic match to core (${
            r.bytesAppended ?? 0
          } bytes).`,
        });
      }
      setNeedle("");
      setConfirmed(false);
    } catch (err) {
      setState(apiErrorToState(err, "promote-episodic failed"));
    }
  }, [canRun, slug, needle]);

  return (
    <fieldset className="ce-tool">
      <legend>Promote episodic entry to core</legend>
      <p className="ce-tool-info">
        Provide a unique substring of an episodic entry to copy that
        entry into core memory.
      </p>
      <label className="ce-visually-hidden" htmlFor={`needle-${slug}`}>
        Episodic needle
      </label>
      <input
        id={`needle-${slug}`}
        type="text"
        value={needle}
        onChange={(e) => setNeedle(e.target.value)}
        placeholder="Unique substring (≥ 3 chars) of the episodic entry…"
      />
      <label className="ce-tool-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />{" "}
        I confirm this promotion.
      </label>
      <button
        className="ce-btn ce-btn-primary"
        disabled={!canRun}
        onClick={run}
      >
        {busy ? "Promoting…" : "Promote to core"}
      </button>
      <ActionResult state={state} />
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// C. Edit-core (find + replace, never blind overwrite)
// ---------------------------------------------------------------------------

function EditCoreTool({ slug }: { slug: string }) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const busy = state.kind === "busy";
  const canRun = confirmed && find.trim().length >= 3 && !busy;

  const run = useCallback(async () => {
    if (!canRun) return;
    setState({ kind: "busy" });
    try {
      const r = await editCoreMemory(slug, find, replace);
      if (r.unchanged) {
        setState({
          kind: "duplicate",
          text: "Find equals replace — core memory unchanged.",
        });
      } else if (r.edited) {
        setState({
          kind: "ok",
          text: `Edited core memory (${r.bytesWritten ?? 0} bytes rewritten).`,
        });
      } else {
        setState({ kind: "ok", text: "Edit applied." });
      }
      setConfirmed(false);
    } catch (err) {
      setState(apiErrorToState(err, "edit-core failed"));
    }
  }, [canRun, slug, find, replace]);

  return (
    <fieldset className="ce-tool">
      <legend>Edit core memory (find + replace)</legend>
      <p className="ce-tool-info">
        Replace one exact occurrence in this agent's core memory. No
        blind overwrite — 0 / many matches refuses with a clear
        message.
      </p>
      <label className="ce-visually-hidden" htmlFor={`find-${slug}`}>
        Find
      </label>
      <textarea
        id={`find-${slug}`}
        rows={2}
        value={find}
        onChange={(e) => setFind(e.target.value)}
        placeholder="Exact substring to find (must be unique, ≥ 3 chars)…"
      />
      <label className="ce-visually-hidden" htmlFor={`replace-${slug}`}>
        Replace with
      </label>
      <textarea
        id={`replace-${slug}`}
        rows={2}
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
        placeholder="Replacement text (leave equal to find for a no-op check)…"
      />
      <label className="ce-tool-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />{" "}
        I confirm this surgical edit.
      </label>
      <button
        className="ce-btn ce-btn-primary"
        disabled={!canRun}
        onClick={run}
      >
        {busy ? "Editing…" : "Apply edit"}
      </button>
      <ActionResult state={state} />
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// D. Forget (surgical delete)
// ---------------------------------------------------------------------------

function ForgetTool({ slug }: { slug: string }) {
  const [kind, setKind] = useState<"core" | "episodic">("core");
  const [find, setFind] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const busy = state.kind === "busy";
  const canRun = confirmed && find.trim().length >= 3 && !busy;

  const run = useCallback(async () => {
    if (!canRun) return;
    setState({ kind: "busy" });
    try {
      const r = await forgetMemory(slug, kind, find.trim());
      setState({
        kind: "ok",
        text: `Forgotten (${r.bytesWritten} bytes rewritten in ${r.kind}).`,
      });
      setFind("");
      setConfirmed(false);
    } catch (err) {
      setState(apiErrorToState(err, "forget failed"));
    }
  }, [canRun, slug, kind, find]);

  return (
    <fieldset className="ce-tool">
      <legend>Forget a memory entry</legend>
      <div className="ce-tool-row">
        <label>
          Kind:{" "}
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "core" | "episodic")}
          >
            <option value="core">core</option>
            <option value="episodic">episodic</option>
          </select>
        </label>
      </div>
      <label className="ce-visually-hidden" htmlFor={`forget-${slug}`}>
        Substring to forget
      </label>
      <input
        id={`forget-${slug}`}
        type="text"
        value={find}
        onChange={(e) => setFind(e.target.value)}
        placeholder="Exact substring to remove (≥ 3 chars)…"
      />
      <label className="ce-tool-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />{" "}
        I confirm this surgical delete.
      </label>
      <button
        className="ce-btn ce-btn-danger"
        disabled={!canRun}
        onClick={run}
      >
        {busy ? "Forgetting…" : "Forget"}
      </button>
      <ActionResult state={state} />
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// E. Compaction (status → preview → apply, every step explicit)
// ---------------------------------------------------------------------------

function CompactSection({ slug }: { slug: string }) {
  const [status, setStatus] = useState<CompactStatusResponse | null>(null);
  const [preview, setPreview] = useState<CompactPreviewResponse | null>(null);
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const busy = state.kind === "busy";

  const refreshStatus = useCallback(async () => {
    setState({ kind: "busy" });
    try {
      const r = await compactStatus(slug);
      setStatus(r);
      setState({ kind: "idle" });
    } catch (err) {
      setState(apiErrorToState(err, "status failed"));
    }
  }, [slug]);

  const runPreview = useCallback(async () => {
    setState({ kind: "busy" });
    try {
      const r = await compactPreview(slug, 10);
      setPreview(r);
      if (r.empty) {
        setState({
          kind: "duplicate",
          text: "Episodic memory is empty — nothing to preview.",
        });
      } else {
        setState({
          kind: "ok",
          text: `Preview ready (${r.preview?.length ?? 0} bullet${
            (r.preview?.length ?? 0) === 1 ? "" : "s"
          }). Review, then Apply.`,
        });
      }
    } catch (err) {
      setState(apiErrorToState(err, "preview failed"));
    }
  }, [slug]);

  const runApply = useCallback(async () => {
    if (!preview || !preview.preview || preview.preview.length === 0) return;
    setState({ kind: "busy" });
    try {
      const r = await compactApply(slug, preview.preview);
      setState(
        r.duplicate
          ? {
              kind: "duplicate",
              text: "Already in core (duplicate).",
            }
          : {
              kind: "ok",
              text: `Applied (${r.bytesAppended ?? 0} bytes appended).`,
            }
      );
    } catch (err) {
      setState(apiErrorToState(err, "apply failed"));
    }
  }, [slug, preview]);

  const previewReady =
    preview != null &&
    preview.preview != null &&
    preview.preview.length > 0 &&
    !busy;

  return (
    <fieldset className="ce-tool">
      <legend>Compaction</legend>
      <div className="ce-tool-row">
        <button className="ce-btn" onClick={refreshStatus} disabled={busy}>
          Refresh status
        </button>
        <button className="ce-btn" onClick={runPreview} disabled={busy}>
          Preview
        </button>
        <button
          className="ce-btn ce-btn-primary"
          onClick={runApply}
          disabled={!previewReady}
          title={
            previewReady
              ? "Append the preview block to core memory"
              : "Run Preview first; Apply enables after a non-empty preview"
          }
        >
          Apply preview
        </button>
      </div>
      {status && (
        <div className="ce-tool-status">
          <div className="ce-tool-status-badges">
            <StatusBadge
              variant={status.due ? "warn" : "neutral"}
              icon={status.due ? "⚠" : "·"}
            >
              {status.due ? "compaction due" : "not yet due"}
            </StatusBadge>
            <StatusBadge variant="info" icon="#">
              {status.entryCount} / {status.threshold}
            </StatusBadge>
            {status.empty && (
              <StatusBadge variant="neutral">empty</StatusBadge>
            )}
            <StatusBadge variant="neutral" icon="↳">
              next: {status.nextAction}
            </StatusBadge>
          </div>
        </div>
      )}
      {preview?.preview && preview.preview.length > 0 && (
        <ul className="ce-tool-preview">
          {preview.preview.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <ActionResult state={state} />
    </fieldset>
  );
}
