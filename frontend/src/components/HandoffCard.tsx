// CreativEdge Phase 6-C - handoff event card.
//
// Renders the `done.handoff` payload that backend Phase 3.3 attaches
// to chat SSE done events. Purely presentational; no backend calls.

import type { HandoffMeta } from "../types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  handoff: HandoffMeta;
}

function variantForStatus(status: string): "ok" | "info" | "warn" | "danger" | "neutral" {
  switch (status) {
    case "applied":
    case "accepted":
    case "ok":
      return "ok";
    case "pending":
      return "info";
    case "rejected":
    case "blocked":
      return "warn";
    case "error":
      return "danger";
    default:
      return "neutral";
  }
}

export function HandoffCard({ handoff }: Props): JSX.Element {
  return (
    <div className="ce-handoff" role="status" aria-label="Handoff event">
      <div className="ce-handoff-head">
        <span aria-hidden>↪</span>
        <span className="ce-handoff-title">Handoff</span>
        <StatusBadge variant={variantForStatus(handoff.status)}>
          {handoff.status}
        </StatusBadge>
      </div>
      <div className="ce-handoff-body">
        <code>{handoff.fromSlug}</code>
        <span aria-hidden> → </span>
        <code>{handoff.toSlug ?? handoff.rawSlug ?? "?"}</code>
      </div>
      {handoff.reason && (
        <p className="ce-handoff-reason">
          <em>{handoff.reason}</em>
        </p>
      )}
    </div>
  );
}
