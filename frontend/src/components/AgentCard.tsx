// CreativEdge Phase 6-A/6-B - active agent + route metadata card.
//
// Phase 6-B polish:
//   - uses the shared `StatusBadge` for provider / decision / handoff
//     so colour is paired with a glyph (not colour-only).
//   - shows convened slugs as individual chips instead of a comma list.
//   - "no route yet" placeholder is intentional and shows a tiny dim
//     hint instead of a near-blank card.
//   - sessionId still shown as a short prefix so the user can correlate
//     with backend logs / sessions.db.

import type { ChatMeta } from "../types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  meta: ChatMeta | null;
  sessionId: string | null;
  streaming: boolean;
}

export function AgentCard({ meta, sessionId, streaming }: Props): JSX.Element {
  if (!meta) {
    return (
      <section className="ce-card ce-agent-card ce-agent-card-empty">
        <h2>Active agent</h2>
        <p className="ce-hint">
          Send a message to see the routed agent and route metadata.
        </p>
        {sessionId && (
          <p className="ce-hint">
            <span className="ce-mono">session:</span>{" "}
            <code>{sessionId.slice(0, 8)}…</code>
          </p>
        )}
      </section>
    );
  }
  const decision = meta.routeDecision;
  const convened = decision?.convenedSlugs ?? [];
  return (
    <section className="ce-card ce-agent-card">
      <h2>Active agent</h2>
      <div className="ce-agent-head">
        <span className="ce-agent-emoji" aria-hidden>
          {meta.agentEmoji ?? "👤"}
        </span>
        <div>
          <div className="ce-agent-name">
            {meta.agentName ?? meta.agentSlug}
          </div>
          <div className="ce-agent-slug">
            <code>{meta.agentSlug}</code>
          </div>
        </div>
      </div>

      <div className="ce-agent-badges">
        <StatusBadge
          variant={meta.degraded ? "warn" : "ok"}
          title={meta.claudeError ?? undefined}
        >
          {meta.provider}
          {meta.degraded ? " · degraded" : ""}
        </StatusBadge>
        {decision?.type && (
          <StatusBadge variant="info" icon="↳">
            {decision.type}
          </StatusBadge>
        )}
        {decision?.confidence && (
          <StatusBadge variant="neutral" icon="≈">
            {decision.confidence}
          </StatusBadge>
        )}
        {streaming && (
          <StatusBadge variant="info" icon="●">
            streaming
          </StatusBadge>
        )}
      </div>

      <dl className="ce-meta-list">
        {convened.length > 0 && (
          <>
            <dt>convened</dt>
            <dd className="ce-meta-pills">
              {convened.map((slug) => (
                <span key={slug} className="ce-pill" title={slug}>
                  {slug}
                </span>
              ))}
            </dd>
          </>
        )}
        {meta.candidate && (
          <>
            <dt>handoff</dt>
            <dd>
              <code>{meta.candidate}</code>
            </dd>
          </>
        )}
        {meta.budget && (
          <>
            <dt>core mem</dt>
            <dd>
              {meta.budget.core_memory_loaded ? (
                <StatusBadge variant="ok">loaded</StatusBadge>
              ) : (
                <StatusBadge variant="neutral">not loaded</StatusBadge>
              )}
            </dd>
            <dt>episodic</dt>
            <dd>
              {meta.budget.episodic_entries ?? 0} entries ·{" "}
              {meta.budget.episodic_chars ?? 0} chars
            </dd>
          </>
        )}
        {sessionId && (
          <>
            <dt>session</dt>
            <dd>
              <code title={sessionId}>{sessionId.slice(0, 8)}…</code>
            </dd>
          </>
        )}
      </dl>
    </section>
  );
}
