// CreativEdge Phase 6-A/6-B/6-C/6-D - chat composer.
//
// Phase 6-D: full keyboard navigation for the slash menu. When the
// textarea text starts with `/`, the menu shows; ArrowDown / ArrowUp
// move the highlighted item; Enter prefills the highlighted trigger
// (and does NOT dispatch); Escape closes the menu (textarea content
// preserved). The user still has to press Enter again on a fully
// typed command to actually dispatch it.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterHints } from "../slash/slashCommands";
import { SlashCommandMenu } from "./SlashCommandMenu";

interface Props {
  streaming: boolean;
  activeSlug: string | null;
  onSend: (message: string) => void;
  onStop: () => void;
}

export function Composer({
  streaming,
  activeSlug,
  onSend,
  onStop,
}: Props): JSX.Element {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const submit = useCallback(() => {
    const v = value.trim();
    if (v.length === 0 || streaming) return;
    onSend(v);
    setValue("");
    setMenuOpen(true);
    setSelectedIndex(0);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [value, streaming, onSend]);

  const onPrefill = useCallback((trigger: string) => {
    setValue(trigger + " ");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const isSlashing = value.startsWith("/") && !streaming;
  const hints = useMemo(
    () => (isSlashing ? filterHints(value.split(/\s/)[0] ?? "/") : []),
    [isSlashing, value]
  );
  const menuVisible = isSlashing && menuOpen && hints.length > 0;

  // Keep selectedIndex valid as the hint list changes.
  useEffect(() => {
    if (!menuVisible) return;
    if (selectedIndex >= hints.length) setSelectedIndex(Math.max(0, hints.length - 1));
  }, [menuVisible, hints.length, selectedIndex]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (menuVisible) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((i) => Math.min(hints.length - 1, i + 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((i) => Math.max(0, i - 1));
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setMenuOpen(false);
          return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
          // Trim is important — if the user typed `/remember test`
          // the head fragment matches "/remember <text>" but they've
          // also typed the arg. We dispatch only when the value is
          // already a complete command (something past the trigger
          // head). Otherwise we prefill the highlighted template.
          const headOnly =
            value.trim() === value.trim().split(/\s/)[0] &&
            value.trim().startsWith("/");
          if (headOnly) {
            e.preventDefault();
            const pick = hints[selectedIndex];
            if (pick) onPrefill(pick.trigger);
            return;
          }
          // Otherwise fall through to submit.
        }
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [menuVisible, hints, selectedIndex, value, onPrefill, submit]
  );

  const sendDisabled = streaming || value.trim().length === 0;

  return (
    <div className="ce-composer-wrap">
      {menuVisible && (
        <SlashCommandMenu
          hints={hints}
          activeSlug={activeSlug}
          selectedIndex={selectedIndex}
          onHover={setSelectedIndex}
          onPrefill={onPrefill}
          onDismiss={() => setMenuOpen(false)}
        />
      )}
      <form
        className="ce-composer"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="ce-composer-field">
          <span className="ce-visually-hidden">Message to CreativEdge</span>
          <textarea
            ref={textareaRef}
            className="ce-composer-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value.startsWith("/")) {
                setMenuOpen(true);
                // Reset highlight to the first match whenever the
                // hint list changes via typing.
                setSelectedIndex(0);
              }
            }}
            onKeyDown={onKeyDown}
            placeholder={
              streaming
                ? "Streaming response… you can draft your next message; Stop cancels the current stream."
                : "Type a message, or /command. Enter to send · Shift+Enter for a new line."
            }
            rows={3}
            autoFocus
            aria-autocomplete={menuVisible ? "list" : undefined}
            aria-controls={menuVisible ? "ce-slash-menu" : undefined}
          />
        </label>
        <div className="ce-composer-actions">
          {streaming ? (
            <button
              type="button"
              className="ce-btn ce-btn-danger"
              onClick={onStop}
              aria-label="Stop the current response"
              title="Stop the current response"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="ce-btn ce-btn-primary"
              disabled={sendDisabled}
              aria-label="Send message"
              title={sendDisabled ? "Type something first" : "Send (Enter)"}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
