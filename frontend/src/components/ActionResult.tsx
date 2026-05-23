// CreativEdge Phase 6-B - shared one-line action result.
//
// Used by every mutation form in the right rail (promote, promote-
// episodic, edit-core, forget, compact apply, backup config, backup
// dry-run, backup run, …) so every mutation surfaces success /
// duplicate / warn / err using the same visual language.

import type { ActionState } from "../types";

interface Props {
  state: ActionState;
}

function variantToClass(kind: ActionState["kind"]): string {
  switch (kind) {
    case "ok":
      return "ce-status ce-status-ok";
    case "duplicate":
      return "ce-status ce-status-info";
    case "warn":
      return "ce-status ce-status-warn";
    case "err":
      return "ce-status ce-status-err";
    case "busy":
      return "ce-status ce-status-info";
    case "idle":
    default:
      return "ce-status";
  }
}

function glyph(kind: ActionState["kind"]): string {
  switch (kind) {
    case "ok":
      return "✓";
    case "duplicate":
      return "·";
    case "warn":
      return "⚠";
    case "err":
      return "✕";
    case "busy":
      return "⏳";
    default:
      return "";
  }
}

export function ActionResult({ state }: Props): JSX.Element | null {
  if (state.kind === "idle") return null;
  const text =
    state.kind === "busy"
      ? "Working…"
      : (state as Extract<ActionState, { text: string }>).text;
  return (
    <div
      className={variantToClass(state.kind)}
      role={state.kind === "err" ? "alert" : "status"}
      aria-live="polite"
    >
      <span aria-hidden>{glyph(state.kind)}</span> {text}
    </div>
  );
}
