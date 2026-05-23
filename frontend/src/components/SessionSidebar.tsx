// CreativEdge Phase 6-C - real sessions sidebar.
//
// Phase 6-C validation patch (2026-05-20):
//   - reads the new camelCase `updatedAt` / `lastAgentSlug` shape.
//   - degrades gracefully on HTTP 404 from `GET /sessions`: instead of
//     a raw "HTTP 404" line, shows "Sessions endpoint not available
//     yet — backend may be stale. Restart `npm run dev` in
//     backend-api." Hint is shaped from `ApiError.status`.

import { useCallback, useEffect, useState } from "react";

import { ApiError, listSessions } from "../api/client";
import type { SessionRow } from "../types";
import { ActionResult } from "./ActionResult";

interface Props {
  selectedSessionId: string | null;
  refreshNonce: number;
  streaming: boolean;
  onSelectSession: (id: string) => void;
}

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; rows: SessionRow[] }
  | { kind: "warn"; text: string }
  | { kind: "err"; text: string };

function formatRelative(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso.slice(0, 10);
  const diffSec = Math.max(0, (Date.now() - t) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
  return iso.slice(0, 10);
}

function titleOrFallback(row: SessionRow): string {
  if (row.title && row.title.trim().length > 0) return row.title;
  return `Session ${row.id.slice(0, 8)}…`;
}

export function SessionSidebar({
  selectedSessionId,
  refreshNonce,
  streaming,
  onSelectSession,
}: Props): JSX.Element {
  const [state, setState] = useState<State>({ kind: "idle" });

  const refresh = useCallback(async () => {
    setState({ kind: "busy" });
    try {
      const r = await listSessions(50);
      setState({ kind: "ok", rows: r.sessions });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setState({
          kind: "warn",
          text:
            "Sessions endpoint not available — backend may be stale. Restart `npm run dev` in backend-api.",
        });
      } else if (e instanceof ApiError && e.status === 0) {
        setState({
          kind: "err",
          text: e.message,
        });
      } else {
        setState({
          kind: "err",
          text: e instanceof Error ? e.message : "load failed",
        });
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, refreshNonce]);

  return (
    <section className="ce-card ce-sessions" aria-label="Past sessions">
      <h2>
        📚 Sessions
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-sessions-refresh"
          onClick={refresh}
          disabled={state.kind === "busy"}
          aria-label="Refresh session list"
          title="Refresh"
        >
          ↻
        </button>
      </h2>

      {state.kind === "busy" && <ActionResult state={{ kind: "busy" }} />}
      {state.kind === "warn" && (
        <ActionResult state={{ kind: "warn", text: state.text }} />
      )}
      {state.kind === "err" && (
        <ActionResult state={{ kind: "err", text: state.text }} />
      )}

      {state.kind === "ok" && state.rows.length === 0 && (
        <p className="ce-hint">
          No saved sessions yet. Send a message to start one.
        </p>
      )}

      {state.kind === "ok" && state.rows.length > 0 && (
        <ul className="ce-sessions-list">
          {state.rows.map((row) => {
            const selected = row.id === selectedSessionId;
            return (
              <li
                key={row.id}
                className={
                  "ce-session-row" + (selected ? " ce-session-row-selected" : "")
                }
              >
                <button
                  type="button"
                  className="ce-session-row-btn"
                  onClick={() => onSelectSession(row.id)}
                  aria-current={selected ? "true" : undefined}
                  disabled={streaming && !selected}
                  title={`session ${row.id}`}
                >
                  <span className="ce-session-title">{titleOrFallback(row)}</span>
                  <span className="ce-session-meta">
                    <time dateTime={row.updatedAt} title={row.updatedAt}>
                      {formatRelative(row.updatedAt)}
                    </time>
                    {row.lastAgentSlug && (
                      <span className="ce-session-meta-slug">
                        <code>{row.lastAgentSlug}</code>
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
