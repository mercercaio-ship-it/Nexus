// CreativEdge Phase 6-C/6-D - slash command hint menu.
//
// Phase 6-D: keyboard navigation. The selected index is owned by the
// parent (Composer), which handles ArrowUp / ArrowDown / Enter /
// Escape from the textarea's onKeyDown. The menu just renders the
// highlight and emits hover/click events.

import type { CommandHint } from "../slash/slashCommands";

interface Props {
  hints: readonly CommandHint[];
  activeSlug: string | null;
  selectedIndex: number;
  onHover: (idx: number) => void;
  onPrefill: (trigger: string) => void;
  onDismiss: () => void;
}

export function SlashCommandMenu({
  hints,
  activeSlug,
  selectedIndex,
  onHover,
  onPrefill,
  onDismiss,
}: Props): JSX.Element | null {
  if (hints.length === 0) return null;
  return (
    <div
      className="ce-slash-menu"
      role="listbox"
      aria-label="Slash command suggestions"
      aria-activedescendant={
        selectedIndex >= 0 && selectedIndex < hints.length
          ? `ce-slash-item-${selectedIndex}`
          : undefined
      }
    >
      <div className="ce-slash-menu-head">
        <span>Slash commands · ↑↓ Enter · Esc to close</span>
        <button
          type="button"
          className="ce-slash-menu-close"
          onClick={onDismiss}
          aria-label="Hide command menu"
          title="Hide"
        >
          ×
        </button>
      </div>
      <ul>
        {hints.map((h, i) => {
          const disabled = h.needsAgent && !activeSlug;
          const highlighted = i === selectedIndex;
          return (
            <li key={h.trigger}>
              <button
                type="button"
                id={`ce-slash-item-${i}`}
                className={
                  "ce-slash-menu-item" +
                  (highlighted ? " ce-slash-menu-item-highlight" : "")
                }
                onClick={() => onPrefill(h.trigger)}
                onMouseEnter={() => onHover(i)}
                disabled={disabled}
                title={
                  disabled
                    ? "Send a message first to set an active agent"
                    : `Prefill ${h.trigger}`
                }
                role="option"
                aria-selected={highlighted}
                aria-disabled={disabled || undefined}
              >
                <code>{h.trigger}</code>
                <span className="ce-slash-menu-desc">{h.description}</span>
                {h.needsAgent && (
                  <span className="ce-slash-menu-needs">needs active agent</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
