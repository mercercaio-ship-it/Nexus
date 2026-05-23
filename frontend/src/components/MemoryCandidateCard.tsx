// CreativEdge Phase 6-A/6-B - memory candidate confirm/cancel card.
//
// Appears under an assistant message when the SSE `done` event carried
// a `memoryCandidate`. Two actions, both explicit:
//   - "Save memory" -> POST /agents/:slug/memory/promote with
//                      confirmed:true. On success the card switches to
//                      "Saved". On the backend's duplicate path it
//                      switches to "Already saved". On HTTP 422 it
//                      shows the sensitive-content message. On any
//                      other error shows a friendly error line.
//   - "Dismiss"     -> hides the card locally; never calls the backend.
//
// **No auto-save.** The user is the only path to /promote from this
// card. Re-renders are safe because the source of truth for the card
// state lives on the parent `UiMessage.candidateState`.

import { useCallback, useState } from "react";

import { ApiError, promoteMemory } from "../api/client";
import type { UiMessage } from "../types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  message: UiMessage;
  onUpdate: (localId: string, patch: Partial<UiMessage>) => void;
}

export function MemoryCandidateCard({
  message,
  onUpdate,
}: Props): JSX.Element | null {
  const candidate = message.done?.memoryCandidate;
  const state = message.candidateState ?? "pending";
  const [busy, setBusy] = useState(false);

  const onSave = useCallback(async () => {
    if (!candidate || busy) return;
    setBusy(true);
    try {
      const r = await promoteMemory(candidate.agentSlug, candidate.text);
      onUpdate(message.localId, {
        candidateState: r.duplicate ? "duplicate" : "saved",
        candidateError: undefined,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        onUpdate(message.localId, {
          candidateState: "refused",
          candidateError:
            "This looks sensitive, so it was not saved to memory.",
        });
      } else {
        const text = err instanceof Error ? err.message : "save failed";
        onUpdate(message.localId, {
          candidateState: "error",
          candidateError: text,
        });
      }
    } finally {
      setBusy(false);
    }
  }, [candidate, busy, message.localId, onUpdate]);

  const onDismiss = useCallback(() => {
    if (busy) return;
    onUpdate(message.localId, { candidateState: "dismissed" });
  }, [busy, message.localId, onUpdate]);

  if (!candidate || state === "dismissed") return null;

  return (
    <div className="ce-candidate" role="region" aria-label="Memory candidate">
      <div className="ce-candidate-head">
        <span className="ce-candidate-icon" aria-hidden>
          🧠
        </span>
        <span className="ce-candidate-title">
          Save this memory for <code>{candidate.agentSlug}</code>?
        </span>
        <div className="ce-candidate-pills">
          <StatusBadge variant="info" icon="·">
            {candidate.type}
          </StatusBadge>
          <StatusBadge variant="neutral" icon="·">
            {candidate.pattern}
          </StatusBadge>
        </div>
      </div>
      <blockquote className="ce-candidate-text">{candidate.text}</blockquote>

      {state === "pending" && (
        <div className="ce-candidate-actions">
          <button
            className="ce-btn ce-btn-primary"
            onClick={onSave}
            disabled={busy}
            aria-label="Save this memory to core"
          >
            {busy ? "Saving…" : "Save memory"}
          </button>
          <button
            className="ce-btn ce-btn-secondary"
            onClick={onDismiss}
            disabled={busy}
            aria-label="Dismiss this candidate without saving"
          >
            Dismiss
          </button>
        </div>
      )}
      {state === "saved" && (
        <div
          className="ce-candidate-status ce-candidate-ok"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden>✓</span> Saved to {candidate.agentSlug}'s core
          memory.
        </div>
      )}
      {state === "duplicate" && (
        <div
          className="ce-candidate-status ce-candidate-info"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden>·</span> Already saved — no change to{" "}
          {candidate.agentSlug}'s core memory.
        </div>
      )}
      {state === "refused" && (
        <div className="ce-candidate-status ce-candidate-warn" role="alert">
          <span aria-hidden>⚠</span>{" "}
          {message.candidateError ??
            "This looks sensitive, so it was not saved to memory."}
        </div>
      )}
      {state === "error" && (
        <div className="ce-candidate-status ce-candidate-error" role="alert">
          <span aria-hidden>✕</span> Save failed:{" "}
          {message.candidateError ?? "unknown error"}.
        </div>
      )}
    </div>
  );
}
