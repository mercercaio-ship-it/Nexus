// CreativEdge Phase 7-A - admin agent list (read-only).
//
// Renders the registry-summary cards from `GET /agents`. Click a card
// to load the selected slug into the parent's `AdminAgentDetail`.
// Filterable by free-text against slug/name/domain/routing keywords.

import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError, listAgents } from "../../api/client";
import type { AgentSummary } from "../../types";
import { ActionResult } from "../ActionResult";

interface Props {
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

type State =
  | { kind: "busy" }
  | { kind: "ok"; rows: AgentSummary[] }
  | { kind: "err"; text: string };

export function AdminAgentList({ selectedSlug, onSelect }: Props): JSX.Element {
  const [state, setState] = useState<State>({ kind: "busy" });
  const [filter, setFilter] = useState<string>("");

  const refresh = useCallback(async () => {
    setState({ kind: "busy" });
    try {
      const r = await listAgents();
      setState({ kind: "ok", rows: r.entries });
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : (e as Error).message;
      setState({ kind: "err", text });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (state.kind !== "ok") return [];
    const q = filter.trim().toLowerCase();
    if (q.length === 0) return state.rows;
    return state.rows.filter((row) => {
      const hay = [
        row.slug,
        row.name,
        row.domain ?? "",
        row.role ?? "",
        row.mbti ?? "",
        ...(row.routing_keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [state, filter]);

  return (
    <section className="ce-admin-list" aria-label="Agents">
      <header className="ce-admin-list-head">
        <h2>Agents</h2>
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={refresh}
          disabled={state.kind === "busy"}
          aria-label="Refresh agent list"
          title="Refresh"
        >
          ↻
        </button>
      </header>
      <input
        type="text"
        className="ce-admin-filter"
        placeholder="Filter by slug, name, domain, keyword…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter agents"
        autoComplete="off"
      />

      {state.kind === "busy" && <ActionResult state={{ kind: "busy" }} />}
      {state.kind === "err" && (
        <ActionResult state={{ kind: "err", text: state.text }} />
      )}

      {state.kind === "ok" && filtered.length === 0 && (
        <p className="ce-hint">
          {filter ? "No agents match that filter." : "No agents registered."}
        </p>
      )}

      {state.kind === "ok" && filtered.length > 0 && (
        <ul className="ce-admin-cards">
          {filtered.map((row) => {
            const selected = row.slug === selectedSlug;
            return (
              <li key={row.slug}>
                <button
                  type="button"
                  className={
                    "ce-admin-card" + (selected ? " ce-admin-card-selected" : "")
                  }
                  onClick={() => onSelect(row.slug)}
                  aria-current={selected ? "true" : undefined}
                  aria-label={`Open ${row.name} (${row.slug})`}
                  style={
                    row.color
                      ? ({ "--admin-card-accent": row.color } as React.CSSProperties)
                      : undefined
                  }
                >
                  <div className="ce-admin-card-stripe" aria-hidden />
                  <div className="ce-admin-card-head">
                    <span className="ce-admin-card-emoji" aria-hidden>
                      {row.emoji ?? "👤"}
                    </span>
                    <div className="ce-admin-card-id">
                      <div className="ce-admin-card-name">{row.name}</div>
                      <div className="ce-admin-card-slug">
                        <code>{row.slug}</code>
                      </div>
                    </div>
                  </div>
                  {row.domain && (
                    <div className="ce-admin-card-domain">{row.domain}</div>
                  )}
                  {row.role && (
                    <div className="ce-admin-card-role">{row.role}</div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
