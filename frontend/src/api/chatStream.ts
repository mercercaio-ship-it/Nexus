// CreativEdge Phase 6-A - SSE chat stream client.
//
// Posts to `/chat` (same-origin via the Vite dev proxy in development;
// configurable via VITE_API_URL in production), parses the SSE event
// stream (event:meta / chunk / done / error blocks separated by a blank
// line), and yields typed events through a callback. The caller owns an
// AbortController and can cancel the in-flight turn at any time.
//
// Error contract: this module throws `Error` with a *useful* message:
//   - "Could not reach backend at <URL> (<browser error>). Is `npm run dev`
//      running in backend-api?" for network failures.
//   - "/chat HTTP <status> <statusText>: <body excerpt>" for non-2xx
//     HTTP responses.
//   - "stream read failed: <details>" if the response body stream errors
//     mid-flight.
//
// Privacy: this module never logs body text or memory content. The caller
// is responsible for what it does with the events.

import { API_BASE, apiTargetLabel } from "./client";
import type { ChatStreamEvent } from "../types";

export interface StreamChatArgs {
  message: string;
  sessionId?: string | null;
  signal?: AbortSignal;
  onEvent: (e: ChatStreamEvent) => void;
}

function parseSseBlock(block: string): ChatStreamEvent | null {
  let event: string | null = null;
  let data = "";
  for (const rawLine of block.split("\n")) {
    if (!rawLine) continue;
    if (rawLine.startsWith(":")) continue; // SSE comment
    const colon = rawLine.indexOf(":");
    const field = colon < 0 ? rawLine : rawLine.slice(0, colon);
    const value =
      colon < 0
        ? ""
        : rawLine[colon + 1] === " "
          ? rawLine.slice(colon + 2)
          : rawLine.slice(colon + 1);
    if (field === "event") event = value;
    else if (field === "data") data = data ? data + "\n" + value : value;
  }
  if (!event) return null;
  if (event !== "meta" && event !== "chunk" && event !== "done" && event !== "error") {
    // Unknown / future event types are silently ignored, not thrown on.
    return null;
  }
  let parsed: unknown = data;
  if (data) {
    try {
      parsed = JSON.parse(data);
    } catch {
      // Leave as string; the caller will see the raw value.
    }
  }
  return { event, data: parsed } as ChatStreamEvent;
}

export async function streamChat(args: StreamChatArgs): Promise<void> {
  let res: Response;
  try {
    res = await fetch(API_BASE + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        message: args.message,
        ...(args.sessionId ? { sessionId: args.sessionId } : {}),
      }),
      signal: args.signal,
    });
  } catch (err) {
    if (args.signal?.aborted) {
      // Caller cancelled before we even connected; propagate as-is.
      throw err;
    }
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Could not reach backend at ${apiTargetLabel()} (${detail}). Is \`npm run dev\` running in backend-api?`
    );
  }
  if (!res.ok || !res.body) {
    let bodyExcerpt = "";
    try {
      const text = await res.text();
      bodyExcerpt = text.slice(0, 240);
    } catch { /* ignore */ }
    throw new Error(
      `/chat HTTP ${res.status} ${res.statusText}${bodyExcerpt ? ` - ${bodyExcerpt}` : ""}`
    );
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    while (true) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (err) {
        if (args.signal?.aborted) return; // cancelled
        const detail = err instanceof Error ? err.message : String(err);
        throw new Error(`stream read failed: ${detail}`);
      }
      if (chunk.done) break;
      buf += decoder.decode(chunk.value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const block = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (!block) continue;
        const evt = parseSseBlock(block);
        if (evt) args.onEvent(evt);
      }
    }
    // Flush any trailing block (SSE usually ends with \n\n, but be defensive).
    if (buf.trim().length > 0) {
      const evt = parseSseBlock(buf);
      if (evt) args.onEvent(evt);
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }
}
