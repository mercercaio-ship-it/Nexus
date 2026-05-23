// CreativEdge Phase 7-A/7-B/7-C - admin agent detail with safe overrides editor + core-memory diff editor.
//
// Shown alongside the agent list. Loads `GET /agents/:slug` (full
// snapshot, lazy) and `GET /agents/:slug/memory` (presence + cheap
// length info). **Read-only.** No PUT to `/agents/:slug`, no memory
// mutation. A clearly labelled scaffold explains that edit support
// lands in Phase 7-B with diff preview + explicit confirmation.

import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  getAgentMemory,
  getAgentSnapshot,
} from "../../api/client";
import type {
  AgentMemoryResponse,
  AgentSnapshotResponse,
  AgentSummary,
} from "../../types";
import { ActionResult } from "../ActionResult";
import { MemoryToolsPanel } from "../MemoryToolsPanel";
import { StatusBadge } from "../StatusBadge";
import { AdminAgentEditor } from "./AdminAgentEditor";
import { AdminMemoryEditor } from "./AdminMemoryEditor";
import { AdminRoutingPlayground } from "./AdminRoutingPlayground";

interface Props {
  summary: AgentSummary;
  /** Called when the user clicks "← back" so the parent can clear
   *  the selected slug and show the placeholder again. */
  onBack: () => void;
}

type SnapState =
  | { kind: "busy" }
  | { kind: "ok"; snap: AgentSnapshotResponse }
  | { kind: "err"; text: string };

type MemState =
  | { kind: "busy" }
  | { kind: "ok"; mem: AgentMemoryResponse }
  | { kind: "err"; text: string };

function approxLineCount(s: string): number {
  if (s.length === 0) return 0;
  return s.split("\n").filter((l) => l.trim().length > 0).length;
}

export function AdminAgentDetail({ summary, onBack }: Props): JSX.Element {
  const [snap, setSnap] = useState<SnapState>({ kind: "busy" });
  const [mem, setMem] = useState<MemState>({ kind: "busy" });

  const refresh = useCallback(async () => {
    setSnap({ kind: "busy" });
    setMem({ kind: "busy" });
    try {
      const s = await getAgentSnapshot(summary.slug);
      setSnap({ kind: "ok", snap: s });
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : (e as Error).message;
      setSnap({ kind: "err", text });
    }
    try {
      const m = await getAgentMemory(summary.slug);
      setMem({ kind: "ok", mem: m });
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : (e as Error).message;
      setMem({ kind: "err", text });
    }
  }, [summary.slug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="ce-admin-detail" aria-label={`${summary.name} detail`}>
      <header className="ce-admin-detail-head">
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={onBack}
          aria-label="Back to agent list"
        >
          ← Back
        </button>
        <div className="ce-admin-detail-id">
          <span className="ce-admin-detail-emoji" aria-hidden>
            {summary.emoji ?? "👤"}
          </span>
          <div>
            <h2 className="ce-admin-detail-name">{summary.name}</h2>
            <div className="ce-admin-detail-slug">
              <code>{summary.slug}</code>
              {summary.domain && (
                <>
                  {" · "}
                  <span>{summary.domain}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={refresh}
          aria-label="Refresh agent detail"
          title="Refresh"
        >
          ↻
        </button>
      </header>

      <div className="ce-admin-detail-badges">
        {summary.role && <StatusBadge variant="info">{summary.role}</StatusBadge>}
        {summary.mbti && <StatusBadge variant="neutral">{summary.mbti}</StatusBadge>}
        {mem.kind === "ok" && (
          <>
            <StatusBadge
              variant={mem.mem.core.length > 0 ? "ok" : "neutral"}
              title="Has core memory content"
            >
              core: {approxLineCount(mem.mem.core)} lines
            </StatusBadge>
            <StatusBadge
              variant={mem.mem.episodic.length > 0 ? "ok" : "neutral"}
              title="Has episodic memory content"
            >
              episodic: {approxLineCount(mem.mem.episodic)} lines
            </StatusBadge>
          </>
        )}
      </div>

      {summary.routing_keywords && summary.routing_keywords.length > 0 && (
        <div className="ce-admin-section">
          <h3 className="ce-admin-section-head">Routing keywords</h3>
          <div className="ce-admin-keywords">
            {summary.routing_keywords.map((kw) => (
              <span key={kw} className="ce-pill">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {snap.kind === "busy" && <ActionResult state={{ kind: "busy" }} />}
      {snap.kind === "err" && (
        <ActionResult state={{ kind: "err", text: snap.text }} />
      )}

      <div className="ce-admin-section">
        <h3 className="ce-admin-section-head">Memory tools</h3>
        <p className="ce-hint">
          Reuses the validated <code>MemoryToolsPanel</code> from the chat
          UI. All mutation flows (promote, promote-episodic, edit-core,
          forget, compact apply) remain modal-/confirm-gated. No admin
          bypass.
        </p>
        <MemoryToolsPanel slug={summary.slug} />
      </div>

      <AdminRoutingPlayground hintedSlug={summary.slug} />

      <AdminMemoryEditor summary={summary} onSaved={refresh} />

      <AdminAgentEditor
        summary={summary}
        config={snap.kind === "ok" ? snap.snap.config ?? null : null}
        overrides={snap.kind === "ok" ? snap.snap.overrides : undefined}
        onSaved={refresh}
      />
    </section>
  );
}
