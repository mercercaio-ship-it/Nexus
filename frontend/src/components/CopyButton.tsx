// CreativEdge Phase 6-E validation patch (2026-05-20) - shared copy button.
//
// Used by MessageThread for both user and assistant bubbles. Copies
// the **raw** message text via `navigator.clipboard.writeText`. For
// assistant bubbles this means the original markdown source — not the
// rendered HTML — which is what the user typically wants to paste
// back into another editor.
//
// Keyboard accessible, has an `aria-label`, falls back to a small
// inline error state when the clipboard API is blocked (e.g. older
// browsers, insecure context).

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  /** Raw text to copy. */
  text: string;
  /** Accessible label, e.g. "Copy assistant message". */
  ariaLabel: string;
  /** Optional className appended after the base classes. */
  className?: string;
}

type State = "idle" | "copied" | "error";

export function CopyButton({ text, ariaLabel, className }: Props): JSX.Element {
  const [state, setState] = useState<State>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onClick = useCallback(() => {
    if (!text) {
      setState("error");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setState("error");
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setState("idle"), 1500);
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setState("copied");
        if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setState("idle"), 1500);
      })
      .catch(() => {
        setState("error");
        if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setState("idle"), 1800);
      });
  }, [text]);

  const label =
    state === "copied" ? "✓ Copied" : state === "error" ? "Copy failed" : "Copy";

  return (
    <button
      type="button"
      className={"ce-copy-btn" + (className ? " " + className : "")}
      onClick={onClick}
      aria-label={ariaLabel}
      title={state === "error" ? "Clipboard unavailable" : "Copy to clipboard"}
      data-state={state}
    >
      {label}
    </button>
  );
}
