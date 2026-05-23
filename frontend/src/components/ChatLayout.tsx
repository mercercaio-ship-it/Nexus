// CreativEdge Phase 6-A/6-B/6-C/6-D - 3-pane chat layout shell.
//
// Phase 6-D: responsive shell.
//   - Desktop (>= 980px wide) — original 3-column grid is preserved
//     verbatim. Sessions + Search + Backup on the left rail; Active
//     Agent + Memory tools on the right rail; chat in the middle.
//   - Tablet / mobile (< 980px) — the rails collapse off-canvas.
//     A small "mobile chrome" bar appears at the top of the main
//     column with two buttons: "Sessions" opens the left rail in a
//     drawer; "Tools" opens the right rail in a drawer. Each drawer
//     hosts the existing panels unchanged (so the actual functionality
//     is identical to desktop, only the chrome differs).
//
// Drawers are Drawer.tsx — `role="dialog"`, `aria-modal="true"`,
// Escape closes, backdrop closes, close button is auto-focused.

import { useCallback, useState } from "react";

import { useMediaQuery } from "../hooks/useMediaQuery";
import type { ChatMeta, UiMessage } from "../types";
import { AgentCard } from "./AgentCard";
import { BackupPanel } from "./BackupPanel";
import { Composer } from "./Composer";
import { Drawer } from "./Drawer";
import { MemoryToolsPanel } from "./MemoryToolsPanel";
import { MessageThread } from "./MessageThread";
import { SearchPanel } from "./SearchPanel";
import { SessionSidebar } from "./SessionSidebar";

interface Props {
  sessionId: string | null;
  messages: UiMessage[];
  activeMeta: ChatMeta | null;
  streaming: boolean;
  globalError: string | null;
  sendNonce: number;
  sessionRefreshNonce: number;
  onSend: (message: string) => void;
  onStop: () => void;
  onNewConversation: () => void;
  onUpdateMessage: (localId: string, patch: Partial<UiMessage>) => void;
  onSelectSession: (id: string) => void;
  cmdResultSlot?: React.ReactNode;
  modalSlot?: React.ReactNode;
}

export function ChatLayout(props: Props): JSX.Element {
  const activeSlug = props.activeMeta?.agentSlug ?? null;
  const isNarrow = useMediaQuery("(max-width: 980px)");
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Wrap selectSession so picking from a drawer also auto-closes it.
  const selectAndCloseDrawer = useCallback(
    (id: string) => {
      props.onSelectSession(id);
      setSessionsOpen(false);
    },
    [props]
  );

  // Left-rail panels — kept as a separate render fn so they appear
  // identically in the desktop sidebar AND inside the mobile drawer.
  const renderLeftPanels = (
    <>
      <div className="ce-rail-section">
        <SessionSidebar
          selectedSessionId={props.sessionId}
          refreshNonce={props.sessionRefreshNonce}
          streaming={props.streaming}
          onSelectSession={isNarrow ? selectAndCloseDrawer : props.onSelectSession}
        />
      </div>
      <div className="ce-rail-section">
        <SearchPanel onOpenSession={isNarrow ? selectAndCloseDrawer : props.onSelectSession} />
      </div>
      <div className="ce-rail-section">
        <BackupPanel />
      </div>
    </>
  );

  // Right-rail panels — same idea.
  const renderRightPanels = (
    <>
      <AgentCard
        meta={props.activeMeta}
        sessionId={props.sessionId}
        streaming={props.streaming}
      />
      {activeSlug && (
        <div className="ce-rail-section">
          <MemoryToolsPanel slug={activeSlug} />
        </div>
      )}
      {!activeSlug && (
        <p className="ce-hint">
          Send a message to load Memory tools for the active agent.
        </p>
      )}
    </>
  );

  return (
    <div className={"ce-app" + (isNarrow ? " ce-app-narrow" : "")}>
      {/* Desktop left rail — hidden on narrow widths */}
      {!isNarrow && (
        <aside className="ce-rail ce-rail-left" aria-label="Tools and sessions">
          <header className="ce-rail-header">
            <h1 className="ce-brand">CreativEdge</h1>
            <button
              className="ce-btn ce-btn-primary"
              onClick={props.onNewConversation}
              disabled={props.streaming}
              title="Start a new conversation (clears current thread)"
            >
              New conversation
            </button>
          </header>
          {renderLeftPanels}
        </aside>
      )}

      {/* Main pane */}
      <main className="ce-main" aria-label="Conversation">
        {isNarrow && (
          <header className="ce-mobile-chrome" aria-label="Mobile navigation">
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={() => setSessionsOpen(true)}
              aria-label="Open sessions and tools drawer"
              aria-haspopup="dialog"
              aria-expanded={sessionsOpen}
            >
              ☰ Sessions
            </button>
            <h1 className="ce-brand ce-brand-mobile">CreativEdge</h1>
            <button
              type="button"
              className="ce-btn ce-btn-secondary"
              onClick={() => setToolsOpen(true)}
              aria-label="Open active agent and memory tools drawer"
              aria-haspopup="dialog"
              aria-expanded={toolsOpen}
            >
              Tools ⋯
            </button>
          </header>
        )}
        {isNarrow && (
          <div className="ce-mobile-chrome-row">
            <button
              className="ce-btn ce-btn-primary ce-mobile-new"
              onClick={props.onNewConversation}
              disabled={props.streaming}
              aria-label="Start new conversation"
            >
              New conversation
            </button>
          </div>
        )}
        <MessageThread
          messages={props.messages}
          sendNonce={props.sendNonce}
          onUpdateMessage={props.onUpdateMessage}
        />
        {props.cmdResultSlot}
        <Composer
          streaming={props.streaming}
          activeSlug={activeSlug}
          onSend={props.onSend}
          onStop={props.onStop}
        />
      </main>

      {/* Desktop right rail — hidden on narrow widths */}
      {!isNarrow && (
        <aside className="ce-rail ce-rail-right" aria-label="Active agent and memory">
          {renderRightPanels}
        </aside>
      )}

      {/* Mobile drawers */}
      {isNarrow && (
        <Drawer
          open={sessionsOpen}
          side="left"
          title="Sessions, search, backup"
          onClose={() => setSessionsOpen(false)}
        >
          {renderLeftPanels}
        </Drawer>
      )}
      {isNarrow && (
        <Drawer
          open={toolsOpen}
          side="right"
          title="Active agent and memory tools"
          onClose={() => setToolsOpen(false)}
        >
          {renderRightPanels}
        </Drawer>
      )}

      {/* Modal overlay slot */}
      {props.modalSlot}
    </div>
  );
}
