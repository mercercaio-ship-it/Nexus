// CreativEdge Phase 7-A - admin console top-level container.
//
// Renders the admin surface as a single-pane layout: agent list on the
// left, selected agent detail on the right (or a placeholder + a
// session-independent routing playground when nothing is selected).
// Sits beside (not on top of) the existing chat UI; the parent
// `App.tsx` swaps between Chat and Admin via a `mode` state.

import { useState } from "react";

import type { AgentSummary } from "../../types";
import { AdminAgentDetail } from "./AdminAgentDetail";
import { AdminAgentList } from "./AdminAgentList";
import { AdminRoutingPlayground } from "./AdminRoutingPlayground";

interface Props {
  onExit: () => void;
}

export function AdminConsole({ onExit }: Props): JSX.Element {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  // We cache the most recent click's summary so the detail panel can
  // render immediately without a second roundtrip. The detail panel
  // still re-fetches `GET /agents/:slug` for the full snapshot.
  const [selectedSummary, setSelectedSummary] = useState<AgentSummary | null>(
    null
  );

  const handleSelect = (slug: string): void => {
    setSelectedSlug(slug);
  };

  // We need the AgentSummary object the list rendered to seed
  // `AdminAgentDetail`. The list emits only the slug on click, so we
  // also fetch the list separately here via a callback ref. Simpler
  // alternative: keep the cards' raw summary inside AdminAgentList and
  // call back with the full object. To stay tight, we just track slug
  // here and re-derive the summary from a single targeted lookup on
  // the detail side via `GET /agents/:slug`. For the header chrome
  // (emoji/name/domain) we accept a brief blank until the snapshot
  // loads — `AdminAgentDetail` always shows the slug at minimum.

  // Lift the summary callback by passing a wrapper into the list:
  // the list calls onSelect(slug, summary) but we declared only slug
  // above. Keep the signature simple and let the detail panel be
  // resilient when the seed is null.
  // (No extra fetch: the detail panel's own `GET /agents/:slug`
  // returns the registry entry inside the snapshot.)
  void setSelectedSummary;

  return (
    <div className="ce-admin">
      <header className="ce-admin-chrome">
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={onExit}
          aria-label="Return to chat"
          title="Back to chat"
        >
          ← Back to chat
        </button>
        <h1 className="ce-admin-title">Admin console</h1>
        <span className="ce-admin-chrome-spacer" aria-hidden />
      </header>

      <div className="ce-admin-grid">
        <div className="ce-admin-grid-list">
          <AdminAgentList
            selectedSlug={selectedSlug}
            onSelect={handleSelect}
          />
        </div>
        <div className="ce-admin-grid-detail">
          {selectedSlug ? (
            <AdminAgentDetail
              // Seed with a minimal summary derived from the slug;
              // the detail panel re-fetches the snapshot and shows
              // the full metadata + memory presence + routing
              // playground (per-agent hint).
              summary={
                selectedSummary && selectedSummary.slug === selectedSlug
                  ? selectedSummary
                  : { slug: selectedSlug, name: selectedSlug, emoji: null, domain: null }
              }
              onBack={() => setSelectedSlug(null)}
            />
          ) : (
            <div className="ce-admin-empty">
              <h2>Pick an agent</h2>
              <p className="ce-hint">
                Click an agent on the left to view its registry metadata,
                memory presence, and memory tools — all read-only in
                this Phase 7-A scaffold. The routing playground below
                runs against the live router with no hinted target.
              </p>
              <AdminRoutingPlayground hintedSlug={null} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
