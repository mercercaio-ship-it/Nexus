// CreativEdge Phase 6-A/6-B/6-C - message search panel.
//
// Phase 6-C: each search result row is now a button that loads the
// referenced sessionId into the main thread when clicked. The panel
// stays read-only — clicking does NOT trigger any mutation; it only
// asks the parent to call `GET /sessions/:id`.

import { useCallback, useState } from "react";

import { ApiError, searchMessages } from "../api/client";
import type { SearchResponse } from "../types";
import { ActionResult } from "./ActionResult";
import { SafeSnippet } from "./SafeSnippet";

interface Props {
  onOpenSession: (sessionId: string) => void;
}

type SearchState =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; data: SearchResponse }
  | { kind: "warn"; text: string }
  | { kind: "err"; text: string };

export function SearchPanel({ onOpenSession }: Props): JSX.Element {
  const [q, setQ] = useState("");
  const [state, setState] = useState<SearchState>({ kind: "idle" });

  const busy = state.kind === "busy";

  const run = useCallback(async () => {
    const trimmed = q.trim();
    if (trimmed.length === 0) {
      setState({ kind: "warn", text: "Type at least one word to search." });
      return;
    }
    setState({ kind: "busy" });
    try {
      const r = await searchMessages(trimmed, 20);
      setState({ kind: "ok", data: r });
    } catch (e) {
      const text =
        e instanceof ApiError
          ? `${e.message}${e.hint ? ` (${e.hint})` : ""}`
          : (e as Error).message;
      setState({ kind: "err", text });
    }
  }, [q]);

  return (
    <section className="ce-card ce-search" aria-label="Search transcripts">
      <h2>🔎 Search transcript</h2>
      <form
        className="ce-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <label className="ce-visually-hidden" htmlFor="ce-search-input">
          Search past messages
        </label>
        <input
          id="ce-search-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a phrase in past messages…"
          maxLength={200}
          autoComplete="off"
        />
        <button
          className="ce-btn ce-btn-primary"
          disabled={busy}
          aria-label="Run search"
        >
          {busy ? "…" : "Search"}
        </button>
      </form>

      {state.kind === "busy" && <ActionResult state={{ kind: "busy" }} />}
      {state.kind === "warn" && (
        <ActionResult state={{ kind: "warn", text: state.text }} />
      )}
      {state.kind === "err" && (
        <ActionResult state={{ kind: "err", text: state.text }} />
      )}

      {state.kind === "ok" && (
        <div className="ce-search-results" aria-live="polite">
          <div className="ce-search-summary">
            {state.data.count} result{state.data.count === 1 ? "" : "s"} for{" "}
            <code>{state.data.q}</code>
          </div>
          {state.data.count === 0 ? (
            <p className="ce-hint">No matches in stored transcripts.</p>
          ) : (
            <ul>
              {state.data.results.map((r) => (
                <li key={r.messageId} className="ce-search-row">
                  <button
                    type="button"
                    className="ce-search-row-btn"
                    onClick={() => onOpenSession(r.sessionId)}
                    aria-label={`Open session ${r.sessionId}`}
                    title={`Open session ${r.sessionId}`}
                  >
                    <div className="ce-search-row-meta">
                      <code>{r.agentSlug ?? "—"}</code>
                      <span className="ce-pill ce-pill-faint">{r.role}</span>
                      <time dateTime={r.createdAt} title={r.createdAt}>
                        {r.createdAt.slice(0, 19).replace("T", " ")}
                      </time>
                    </div>
                    <div className="ce-search-row-snippet">
                      <SafeSnippet text={r.snippet} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
