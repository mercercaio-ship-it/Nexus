// CreativEdge Phase 6-D - off-canvas drawer.
//
// Used on tablet/mobile widths to host the existing left (Sessions +
// Search + Backup) and right (Agent + Memory tools) rails without
// changing their internal markup. The drawer is a `role="dialog"`
// with `aria-modal="true"` and a focusable close button. Escape
// closes it. Clicking the backdrop closes it. We intentionally do
// not implement a full focus-trap library — for a local dev tool
// the close-on-escape + auto-focus-close-button gesture is enough
// without pulling in another dep.

import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  side: "left" | "right";
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, side, title, onClose, children }: Props): JSX.Element | null {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    // Move focus to the close button so keyboard users land in the
    // drawer immediately. Use rAF so the element is laid out first.
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    // Lock body scroll while a drawer is open so the chat thread
    // underneath doesn't scroll along with finger drags.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`ce-drawer-backdrop ce-drawer-${side}`}
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="ce-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ce-drawer-head">
          <h2 className="ce-drawer-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="ce-drawer-close"
            onClick={onClose}
            aria-label={`Close ${title} drawer`}
            title="Close (Esc)"
          >
            ×
          </button>
        </header>
        <div className="ce-drawer-body">{children}</div>
      </aside>
    </div>
  );
}
