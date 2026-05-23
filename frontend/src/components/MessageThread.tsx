// CreativEdge Phase 6-A/6-B/6-C/6-E + validation patch - message thread.
//
// Phase 6-C:
//   - assistant content is rendered through MarkdownMessage (react-
//     markdown + remark-gfm, no raw HTML), giving us paragraphs,
//     bullet / numbered lists, inline code, fenced code blocks (with
//     copy button via CodeBlock), links (open in new tab with safe
//     rel), blockquotes, and tables.
//   - user content stays in the plain pre-wrapped renderer — no
//     markdown surface for user input, no accidental injection
//     through transcripts.
//   - `done.handoff` surfaces as a HandoffCard.

import { useEffect, useLayoutEffect, useRef } from "react";

import type { UiMessage } from "../types";
import { CopyButton } from "./CopyButton";
import { HandoffCard } from "./HandoffCard";
import { MarkdownMessage } from "./MarkdownMessage";
import { MemoryCandidateCard } from "./MemoryCandidateCard";

interface Props {
  messages: UiMessage[];
  sendNonce: number;
  onUpdateMessage: (localId: string, patch: Partial<UiMessage>) => void;
}

function isNearBottom(el: HTMLElement, threshold = 120): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

export function MessageThread({
  messages,
  sendNonce,
  onUpdateMessage,
}: Props): JSX.Element {
  const scrollRef = useRef<HTMLElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastForcedNonce = useRef<number>(-1);

  useLayoutEffect(() => {
    if (sendNonce !== lastForcedNonce.current) {
      lastForcedNonce.current = sendNonce;
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [sendNonce]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    if (isNearBottom(root)) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <section className="ce-thread ce-thread-empty" ref={scrollRef}>
        <div className="ce-thread-inner">
          <p className="ce-hint">
            Send a message to CreativEdge. Nexus will route it to the right
            specialist, or to itself for clarification.
          </p>
          <p className="ce-hint ce-hint-faint">
            Tip: type <code>/</code> to see slash commands (memory, compaction,
            backup status).
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="ce-thread" ref={scrollRef}>
      <div className="ce-thread-inner">
        {messages.map((m) => (
          <MessageRow key={m.localId} message={m} onUpdate={onUpdateMessage} />
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

function MessageRow({
  message,
  onUpdate,
}: {
  message: UiMessage;
  onUpdate: (localId: string, patch: Partial<UiMessage>) => void;
}): JSX.Element {
  if (message.role === "user") {
    return (
      <article className="ce-msg ce-msg-user" aria-label="Your message">
        <div className="ce-msg-role">
          <span className="ce-msg-role-name">You</span>
          <CopyButton
            text={message.text}
            ariaLabel="Copy user message"
            className="ce-msg-copy"
          />
        </div>
        <div className="ce-msg-text">{preserveLineBreaks(message.text)}</div>
      </article>
    );
  }

  const stopped = message.error === "stopped by user";
  const hasError = !!message.error && !stopped;

  return (
    <article
      className={
        "ce-msg ce-msg-assistant" +
        (stopped ? " ce-msg-stopped" : "") +
        (hasError ? " ce-msg-error-state" : "")
      }
      aria-label="Assistant message"
    >
      <AssistantHeader message={message} />
      {message.text.length === 0 && message.streaming && (
        <div className="ce-msg-thinking" aria-live="polite">
          <span className="ce-thinking-dot" aria-hidden />
          <span className="ce-thinking-dot" aria-hidden />
          <span className="ce-thinking-dot" aria-hidden />
          <span className="ce-thinking-label">Thinking…</span>
        </div>
      )}
      {message.text.length > 0 && (
        <div className="ce-msg-text">
          {message.streaming ? (
            // Mid-stream: render plain pre-wrapped text so partial
            // markdown doesn't flash garbled state. The completed
            // message switches to MarkdownMessage on the done event.
            preserveLineBreaks(message.text)
          ) : (
            <MarkdownMessage text={message.text} />
          )}
        </div>
      )}
      {stopped && (
        <div className="ce-msg-meta-line" role="status">
          <span aria-hidden>■</span> Stream stopped by user.
        </div>
      )}
      {hasError && (
        <div className="ce-msg-error" role="alert">
          <strong>Error:</strong> {message.error}
        </div>
      )}
      {message.done?.handoff && <HandoffCard handoff={message.done.handoff} />}
      {message.done?.memoryCandidate && (
        <MemoryCandidateCard message={message} onUpdate={onUpdate} />
      )}
    </article>
  );
}

function AssistantHeader({ message }: { message: UiMessage }): JSX.Element {
  const meta = message.meta;
  if (!meta) {
    const slug = message.historicalAgentSlug;
    return (
      <div className="ce-msg-role">
        {slug ? (
          <>
            <span className="ce-msg-role-name">{slug}</span>
            <span className="ce-msg-role-decision"> · historical</span>
          </>
        ) : (
          <span className="ce-msg-role-name">Assistant</span>
        )}
        {message.streaming && (
          <span className="ce-streaming"> · streaming…</span>
        )}
        <CopyButton
          text={message.text}
          ariaLabel="Copy assistant message"
          className="ce-msg-copy"
        />
      </div>
    );
  }
  const emoji = meta.agentEmoji ?? "";
  const name = meta.agentName ?? meta.agentSlug;
  const decisionType = meta.routeDecision?.type;
  return (
    <div
      className="ce-msg-role"
      title={`provider=${meta.provider} · degraded=${String(meta.degraded)}`}
    >
      {emoji && (
        <span className="ce-msg-role-emoji" aria-hidden>
          {emoji}{" "}
        </span>
      )}
      <span className="ce-msg-role-name">{name}</span>
      {decisionType && (
        <span className="ce-msg-role-decision"> · {decisionType}</span>
      )}
      {meta.degraded && (
        <span className="ce-msg-role-degraded" title="provider degraded">
          {" · degraded"}
        </span>
      )}
      {message.streaming && (
        <span className="ce-streaming"> · streaming…</span>
      )}
      <CopyButton
        text={message.text}
        ariaLabel="Copy assistant message"
        className="ce-msg-copy"
      />
    </div>
  );
}

function preserveLineBreaks(text: string): JSX.Element[] {
  const lines = text.split("\n");
  return lines.map((line, idx) => (
    <p key={idx} className="ce-msg-line">
      {line.length === 0 ? " " : line}
    </p>
  ));
}
