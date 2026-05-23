// CreativEdge Phase 6-A/6-B/6-C/6-E/7-A - top-level App component.
//
// Phase 6-C validation patch (2026-05-20):
//   - On mount, ping `GET /healthz`. If it fails (ApiError.status === 0
//     or 404), show a backend-stale banner above the chat area so the
//     user knows the chat / sessions panel will not function until the
//     backend is restarted with current source.
//   - `selectSession` now maps the camelCase response shape from
//     `GET /sessions/:id` (matching the validation-patch contract):
//     `messages[].agentSlug` / `messages[].createdAt` / `session.id`.
//   - Chat error messages now point the user at the backend banner
//     when the underlying cause is a 404 / connection failure.

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ApiError,
  apiTargetLabel,
  backupStatus as apiBackupStatus,
  compactPreview as apiCompactPreview,
  compactStatus as apiCompactStatus,
  forgetMemory as apiForgetMemory,
  getSession as apiGetSession,
  healthCheck as apiHealthCheck,
  listSessions as apiListSessions,
  promoteMemory as apiPromoteMemory,
} from "./api/client";
import { streamChat } from "./api/chatStream";
import { AdminConsole } from "./components/admin/AdminConsole";
import { ChatLayout } from "./components/ChatLayout";
import { CommandResultCard } from "./components/CommandResultCard";
import {
  FirstRunWizard,
  readDismissedFlag,
  writeDismissedFlag,
} from "./components/setup/FirstRunWizard";
import { OpsConsole } from "./components/ops/OpsConsole";
import { SlashConfirmModal } from "./components/SlashConfirmModal";
import { parseSlashCommand, rewriteAgentHint } from "./slash/slashCommands";
import { DEFAULT_AGENT_SLUG } from "./agents/agentCatalog";
import type {
  AdminViewMode,
  ChatMeta,
  HealthCheckResponse,
  SessionDetailRow,
  SessionMessageRow,
  SlashConfirmRequest,
  UiMessage,
} from "./types";

let idCounter = 0;
function newLocalId(): string {
  idCounter += 1;
  return `m-${Date.now().toString(36)}-${idCounter}`;
}

// ---------------------------------------------------------------------------
// Phase 9-B chat-recovery helper (2026-05-20, patch 2).
//
// When `fetch("/chat")` rejects under Electron/Chromium even though the
// backend actually persisted the turn (known false-negative class with
// Fastify's `reply.hijack()` SSE pattern), this helper finds the persisted
// transcript so the UI can replace its optimistic state without showing
// the misleading "Could not reach backend" banner.
//
// Strategy (cheap to expensive):
//   1. If `knownSessionId` is set (e.g. the SSE `meta` event fired before
//      the rejection), fetch that session directly.
//   2. Otherwise (first-turn case where no `meta` fired), call
//      `listSessions()` and walk the most-recently-updated sessions
//      whose `updatedAt` is at or after `sendStartTimeMs - 5s grace`.
//   3. For each candidate, fetch `GET /sessions/:id` and verify the
//      transcript contains the just-sent user message followed by at
//      least one assistant message. The content-match guard makes the
//      recovery deterministic even if multiple sessions exist.
//
// Returns `null` if no candidate matches OR if every fetch itself fails
// (in which case the caller falls through to the existing default
// error display — genuine network failures still surface correctly).
// Privacy: never logs message content; never calls any provider.
// ---------------------------------------------------------------------------

interface RecoveredTurn {
  session: SessionDetailRow;
  messages: SessionMessageRow[];
}

async function tryFetchSessionMatching(
  sessionId: string,
  userText: string
): Promise<RecoveredTurn | null> {
  try {
    const detail = await apiGetSession(sessionId);
    const msgs = detail.messages;
    let lastUserIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user" && msgs[i].content === userText) {
        lastUserIdx = i;
        break;
      }
    }
    const hasAssistantAfter =
      lastUserIdx >= 0 &&
      msgs.slice(lastUserIdx + 1).some((m) => m.role === "assistant");
    if (lastUserIdx >= 0 && hasAssistantAfter) {
      return { session: detail.session, messages: msgs };
    }
  } catch {
    /* fetch failed; skip this candidate */
  }
  return null;
}

async function recoverPersistedChatTurn(args: {
  knownSessionId: string | null;
  userText: string;
  sendStartTimeMs: number;
}): Promise<RecoveredTurn | null> {
  const { knownSessionId, userText, sendStartTimeMs } = args;

  // Stage 1 — try the session we already know about (cheapest path).
  if (knownSessionId) {
    const r = await tryFetchSessionMatching(knownSessionId, userText);
    if (r) return r;
  }

  // Stage 2 — list recent sessions and probe candidates updated near the
  // send time. 5s back-grace covers clock skew + the time it took the
  // backend to persist the assistant message after our send started.
  try {
    const list = await apiListSessions(20);
    const cutoffMs = sendStartTimeMs - 5_000;
    const candidates = list.sessions
      .filter((s) => {
        const updatedAtMs = Date.parse(s.updatedAt);
        return Number.isFinite(updatedAtMs) && updatedAtMs >= cutoffMs;
      })
      .sort(
        (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      );
    for (const candidate of candidates) {
      if (candidate.id === knownSessionId) continue; // already tried in stage 1
      const r = await tryFetchSessionMatching(candidate.id, userText);
      if (r) return r;
    }
  } catch {
    /* listSessions itself rejected (same Chromium class possible);
       recovery via stage 2 is impossible — caller falls through. */
  }

  return null;
}

// Phase 9-B chat-recovery helper (2026-05-20, patch 3 — bounded retry).
//
// Wraps `recoverPersistedChatTurn` in a small delay-and-retry loop. The
// immediate-recovery attempt in `sendChatMessage`'s catch usually fires
// before the backend has flushed the assistant message to SQLite (the
// Chromium fetch promise rejects on response framing well before the
// server finishes writing). This helper re-runs the same recovery a
// few times with short, bounded delays so the false-negative case
// auto-heals without the user pressing Ctrl+R or manually switching
// sessions.
//
// Default schedule: [250, 750, 1500] ms → total ≈ 2.5s wall-clock with
// up to 3 extra attempts. Each attempt is the same cheap two-stage
// flow (known-id then listSessions); on the first hit, returns the
// recovered transcript.
//
// Caller is responsible for guarding the apply step (e.g. checking
// the optimistic assistantId is still in the messages array) so a
// late recovery cannot clobber a session the user navigated away from.

async function recoverPersistedChatTurnWithRetries(args: {
  knownSessionId: string | null;
  userText: string;
  sendStartTimeMs: number;
  delaysMs: number[];
}): Promise<RecoveredTurn | null> {
  for (const delay of args.delaysMs) {
    if (delay > 0) {
      await new Promise<void>((r) => setTimeout(r, delay));
    }
    try {
      const result = await recoverPersistedChatTurn({
        knownSessionId: args.knownSessionId,
        userText: args.userText,
        sendStartTimeMs: args.sendStartTimeMs,
      });
      if (result) return result;
    } catch {
      /* this attempt crashed; let the loop try again after the next delay */
    }
  }
  return null;
}

interface CmdResult {
  title: string;
  variant: "ok" | "warn" | "err";
  body: React.ReactNode;
}

type BackendHealth =
  | { kind: "checking" }
  | { kind: "ok" }
  | { kind: "stale"; text: string }
  | { kind: "down"; text: string };

export function App(): JSX.Element {
  const [mode, setMode] = useState<AdminViewMode>("chat");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [activeMeta, setActiveMeta] = useState<ChatMeta | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sendNonce, setSendNonce] = useState<number>(0);
  const [sessionRefreshNonce, setSessionRefreshNonce] = useState<number>(0);
  const [backendHealth, setBackendHealth] =
    useState<BackendHealth>({ kind: "checking" });
  const abortRef = useRef<AbortController | null>(null);

  // Phase 9-C — First-run wizard state. `latestHealth` is the most-recent
  // /healthz payload (kept so the wizard doesn't double-fetch on mount).
  // `wizardOpen` is the explicit show/hide flag; the auto-open logic runs
  // once per session via `wizardAutoCheckedRef` so a "Skip" click can't
  // be undone by another /healthz re-fire.
  const [latestHealth, setLatestHealth] = useState<HealthCheckResponse | null>(
    null
  );
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const wizardAutoCheckedRef = useRef<boolean>(false);

  // Phase 9-D-A — Ops console (diagnostics + cost dashboard + update info).
  // Manual open only; never auto-opens. Reuses `latestHealth` so the
  // panel renders immediately and Refresh re-fetches all four sources.
  const [opsOpen, setOpsOpen] = useState<boolean>(false);

  const [cmdResult, setCmdResult] = useState<CmdResult | null>(null);
  const [confirmRequest, setConfirmRequest] =
    useState<SlashConfirmRequest | null>(null);
  const [confirmBusy, setConfirmBusy] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // /healthz preflight. Runs once on mount and once after each chat send
  // so a restarted backend re-clears the banner without a full reload.
  // -------------------------------------------------------------------------
  const pingHealth = useCallback(async () => {
    try {
      const payload = await apiHealthCheck();
      setBackendHealth({ kind: "ok" });
      setLatestHealth(payload);
      // First-launch auto-open of the Phase 9-C wizard. Runs at most
      // once per app session (`wizardAutoCheckedRef`). Auto-opens when
      // the user has not yet dismissed the wizard via Finish OR when
      // the backend reports `setupRequired:true` (Claude Code missing /
      // unauthenticated). The flag is UI-only and never carries
      // secrets.
      if (!wizardAutoCheckedRef.current) {
        wizardAutoCheckedRef.current = true;
        const dismissed = readDismissedFlag();
        const setupNeeded = payload.setupRequired === true;
        if (!dismissed || setupNeeded) {
          setWizardOpen(true);
        }
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setBackendHealth({
          kind: "down",
          text:
            `Backend is not reachable at ${apiTargetLabel()}. ` +
            "In dev: start it with `cd backend-api && npm run dev` (Terminal A). " +
            "In the Electron app: check the Electron stdout log for the dynamic backend port.",
        });
      } else if (err instanceof ApiError && err.status === 404) {
        setBackendHealth({
          kind: "stale",
          text:
            "Backend is responding but doesn't have `/healthz`. It may be a stale process from an earlier phase. Stop the old `tsx watch` and re-run `npm run dev` in backend-api.",
        });
      } else {
        const text = err instanceof Error ? err.message : "health check failed";
        setBackendHealth({ kind: "down", text });
      }
      // Mark the auto-check as "considered" so a transient backend-down
      // bounce on a later poll doesn't re-open the wizard after the
      // user has explicitly dismissed it.
      wizardAutoCheckedRef.current = true;
    }
  }, []);

  useEffect(() => {
    void pingHealth();
  }, [pingHealth]);

  const openWizard = useCallback(() => setWizardOpen(true), []);
  const closeWizard = useCallback(
    (markDismissed: boolean) => {
      if (markDismissed) writeDismissedFlag(true);
      setWizardOpen(false);
    },
    []
  );

  const startNewConversation = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setActiveMeta(null);
    setGlobalError(null);
    setCmdResult(null);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // -------------------------------------------------------------------------
  // Load a historical session into the thread. Maps the new camelCase
  // response shape; 404 from /sessions/:id is reported in the global
  // error banner.
  // -------------------------------------------------------------------------
  const selectSession = useCallback(
    async (id: string) => {
      if (streaming) return;
      setGlobalError(null);
      setCmdResult(null);
      try {
        const r = await apiGetSession(id);
        const mapped: UiMessage[] = r.messages.map((row) => ({
          localId: row.id,
          role: row.role === "user" ? "user" : "assistant",
          text: row.content,
          createdAt: row.createdAt,
          historicalAgentSlug: row.agentSlug,
        }));
        setSessionId(r.session.id);
        setMessages(mapped);
        setActiveMeta(null);
      } catch (err) {
        const text =
          err instanceof ApiError
            ? `${err.message}${err.hint ? ` (${err.hint})` : ""}`
            : err instanceof Error
              ? err.message
              : "load failed";
        setGlobalError(text);
      }
    },
    [streaming]
  );

  // -------------------------------------------------------------------------
  // Send a chat message (SSE).
  // -------------------------------------------------------------------------
  const sendChatMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (trimmed.length === 0 || streaming) return;
      setGlobalError(null);

      const userMsg: UiMessage = {
        localId: newLocalId(),
        role: "user",
        text: trimmed,
      };
      const assistantId = newLocalId();
      const assistantMsg: UiMessage = {
        localId: assistantId,
        role: "assistant",
        text: "",
        streaming: true,
      };
      setMessages((m) => [...m, userMsg, assistantMsg]);
      setSendNonce((n) => n + 1);
      setStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      // Phase 9-B recovery patch (2026-05-20): track the latest sessionId
      // observed via a `meta` SSE event in a local mutable, NOT via React
      // state. The closure value of `sessionId` is stale during the catch
      // block (state updates are async), and we need a synchronously-
      // current id for the recovery GET /sessions/:id below.
      let observedSessionId: string | null = sessionId ?? null;

      // Phase 9-B chat-recovery patch 2 (2026-05-20): capture a wall-
      // clock timestamp BEFORE `streamChat` so the listSessions()
      // fallback can filter recent sessions by
      // `updatedAt >= sendStartTimeMs - 5s grace`. Used only on the
      // false-negative recovery path; ignored otherwise.
      const sendStartTimeMs = Date.now();

      try {
        await streamChat({
          message: trimmed,
          sessionId,
          signal: ctrl.signal,
          onEvent: (evt) => {
            if (evt.event === "meta") {
              observedSessionId = evt.data.sessionId ?? observedSessionId;
              setActiveMeta(evt.data);
              setSessionId(evt.data.sessionId);
              setMessages((m) =>
                m.map((row) =>
                  row.localId === assistantId ? { ...row, meta: evt.data } : row
                )
              );
            } else if (evt.event === "chunk") {
              const incoming = evt.data.text;
              setMessages((m) =>
                m.map((row) =>
                  row.localId === assistantId
                    ? { ...row, text: row.text + incoming }
                    : row
                )
              );
            } else if (evt.event === "error") {
              setMessages((m) =>
                m.map((row) =>
                  row.localId === assistantId
                    ? { ...row, error: evt.data.text }
                    : row
                )
              );
            } else if (evt.event === "done") {
              if (evt.data.sessionId) observedSessionId = evt.data.sessionId;
              setMessages((m) =>
                m.map((row) =>
                  row.localId === assistantId
                    ? {
                        ...row,
                        done: evt.data,
                        streaming: false,
                        candidateState: evt.data.memoryCandidate
                          ? "pending"
                          : undefined,
                      }
                    : row
                )
              );
            }
          },
        });
      } catch (err) {
        let text = err instanceof Error ? err.message : "chat stream failed";
        // If /chat 404'd, the most likely cause is a stale backend
        // process. Reuse the health-check banner phrasing so the
        // diagnostic story is consistent.
        if (/HTTP 404/i.test(text) && /chat/i.test(text)) {
          text =
            "Backend does not have `POST /chat`. Most likely a stale `tsx watch` process — stop it and re-run `npm run dev` in backend-api.";
        }
        if (ctrl.signal.aborted) {
          setMessages((m) =>
            m.map((row) =>
              row.localId === assistantId
                ? { ...row, streaming: false, error: "stopped by user" }
                : row
            )
          );
        } else {
          // Phase 9-B chat-recovery patch 3 (2026-05-20):
          // some Electron/Chromium builds reject `fetch("/chat")` even
          // after the backend writes the full SSE response and persists
          // both messages (known false-negative class with Fastify's
          // `reply.hijack()` SSE pattern). The immediate recovery in
          // patch 2 fires too early — Chromium's reject can land BEFORE
          // the backend's SQLite write for the assistant message
          // completes. Patch 3 keeps the immediate try (Stage A) but
          // also kicks off bounded retry polling (Stage B) so the
          // persisted transcript is picked up automatically within ~2.5s
          // without the user pressing Ctrl+R or switching sessions.
          //
          // `applyRecovered` is the apply step both stages share. It
          // guards on the optimistic `assistantId` STILL being present
          // in the messages array — if the user navigated to a
          // different session or started a new conversation during a
          // background poll, the guard fails silently so we don't
          // clobber their current view.
          const applyRecovered = (recovered: RecoveredTurn): boolean => {
            let didApply = false;
            setMessages((m) => {
              const stillHere = m.some((row) => row.localId === assistantId);
              if (!stillHere) return m;
              didApply = true;
              return recovered.messages.map((row) => ({
                localId: row.id,
                role: row.role === "user" ? "user" : "assistant",
                text: row.content,
                createdAt: row.createdAt,
                historicalAgentSlug: row.agentSlug,
              }));
            });
            if (didApply) {
              setSessionId(recovered.session.id);
              setGlobalError(null);
              setSessionRefreshNonce((n) => n + 1);
            }
            return didApply;
          };

          // Stage A — immediate recovery (cheap; often fails if backend
          // hasn't flushed yet; if it succeeds, no error is ever shown).
          let immediateRecovery: RecoveredTurn | null = null;
          try {
            immediateRecovery = await recoverPersistedChatTurn({
              knownSessionId: observedSessionId,
              userText: trimmed,
              sendStartTimeMs,
            });
          } catch {
            /* recovery helper crashed; fall through to Stage B */
          }
          if (immediateRecovery && applyRecovered(immediateRecovery)) {
            // Immediate recovery succeeded; do NOT show the error and
            // do NOT kick off Stage B. The finally block still runs to
            // refresh the sessions sidebar + re-ping health.
          } else {
            // Set the error message — the user may see it briefly if
            // Stage B succeeds, or persistently if Stage B also fails.
            setMessages((m) =>
              m.map((row) =>
                row.localId === assistantId
                  ? { ...row, streaming: false, error: text }
                  : row
              )
            );
            setGlobalError(text);

            // Stage B — bounded background polling. ≈2.5s total, 3
            // retries at 250/750/1500 ms. Fire-and-forget so the user
            // can keep interacting with the UI. The guard inside
            // `applyRecovered` prevents clobbering if the user
            // navigates away during the wait.
            void (async () => {
              const delayedRecovery = await recoverPersistedChatTurnWithRetries({
                knownSessionId: observedSessionId,
                userText: trimmed,
                sendStartTimeMs,
                delaysMs: [250, 750, 1500],
              });
              if (delayedRecovery) {
                applyRecovered(delayedRecovery);
              }
            })();
          }
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
        setMessages((m) =>
          m.map((row) =>
            row.localId === assistantId ? { ...row, streaming: false } : row
          )
        );
        setSessionRefreshNonce((n) => n + 1);
        // Quietly re-ping health after each send so the banner auto-
        // clears once the user restarts the backend.
        void pingHealth();
      }
    },
    [sessionId, streaming, pingHealth]
  );

  // -------------------------------------------------------------------------
  // Slash command dispatch (unchanged from Phase 6-C, abridged here).
  // -------------------------------------------------------------------------
  const dispatchSlash = useCallback(
    async (raw: string) => {
      const parsed = parseSlashCommand(raw);
      if (!parsed) {
        await sendChatMessage(raw);
        return;
      }
      const slug = activeMeta?.agentSlug ?? null;
      setCmdResult(null);

      switch (parsed.kind) {
        case "agent": {
          const rewritten = rewriteAgentHint(parsed.slug, parsed.message);
          setCmdResult({
            title: `Routing hint sent: ${parsed.slug}`,
            variant: "ok",
            body: (
              <p>
                This is a hint, not a forced route. The orchestrator may
                still decide otherwise.
              </p>
            ),
          });
          await sendChatMessage(rewritten);
          return;
        }
        case "incomplete":
          setCmdResult({
            title: "Incomplete command",
            variant: "warn",
            body: <p>{parsed.reason}</p>,
          });
          return;
        case "unknown":
          setCmdResult({
            title: "Unknown command",
            variant: "warn",
            body: <p>Type <code>/</code> to see available commands.</p>,
          });
          return;
        case "remember": {
          // Phase 6-E validation patch: no longer block when there is no
          // active agent. Pick `parsed.targetSlug` if the user typed
          // `/remember @alias …`; otherwise fall back to the active agent;
          // otherwise default to Nexus. The modal lets the user change
          // the target before the backend call fires.
          const target = parsed.targetSlug ?? slug ?? DEFAULT_AGENT_SLUG;
          setConfirmError(null);
          setConfirmBusy(false);
          setConfirmRequest({
            command: "remember",
            agentSlug: target,
            text: parsed.text,
          });
          return;
        }
        case "forget": {
          // Phase 6-E validation patch: same fallback as /remember — no
          // active agent is no longer a hard block; default to Nexus and
          // let the modal selector confirm/override before the destructive
          // backend call.
          const target = slug ?? DEFAULT_AGENT_SLUG;
          setConfirmError(null);
          setConfirmBusy(false);
          setConfirmRequest({
            command: "forget",
            agentSlug: target,
            forgetKind: parsed.subKind,
            text: parsed.text,
          });
          return;
        }
        case "compactStatus": {
          if (!slug) {
            setCmdResult({
              title: "No active agent",
              variant: "warn",
              body: <p>Compaction is per-agent; send a message first.</p>,
            });
            return;
          }
          try {
            const r = await apiCompactStatus(slug);
            setCmdResult({
              title: `compact status · ${slug}`,
              variant: "ok",
              body: (
                <ul className="ce-cmd-result-kv">
                  <li>entries: <b>{r.entryCount}</b> / {r.threshold}</li>
                  <li>due: <b>{r.due ? "yes" : "no"}</b></li>
                  <li>next: <code>{r.nextAction}</code></li>
                </ul>
              ),
            });
          } catch (err) {
            setCmdResult({
              title: "compact status failed",
              variant: "err",
              body: <p>{describeError(err)}</p>,
            });
          }
          return;
        }
        case "compactPreview": {
          if (!slug) {
            setCmdResult({
              title: "No active agent",
              variant: "warn",
              body: <p>Compaction is per-agent; send a message first.</p>,
            });
            return;
          }
          try {
            const r = await apiCompactPreview(slug, 10);
            if (r.empty || !r.preview || r.preview.length === 0) {
              setCmdResult({
                title: `compact preview · ${slug}`,
                variant: "ok",
                body: <p>Episodic memory is empty — nothing to preview.</p>,
              });
            } else {
              setCmdResult({
                title: `compact preview · ${slug}`,
                variant: "ok",
                body: (
                  <>
                    <p>{r.preview.length} bullets. <em>No auto-apply.</em> Use the Compaction tool to apply.</p>
                    <ul className="ce-cmd-result-bullets">
                      {r.preview.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </>
                ),
              });
            }
          } catch (err) {
            setCmdResult({
              title: "compact preview failed",
              variant: "err",
              body: <p>{describeError(err)}</p>,
            });
          }
          return;
        }
        case "backupStatus": {
          try {
            const r = await apiBackupStatus();
            setCmdResult({
              title: "backup status",
              variant: "ok",
              body: (
                <ul className="ce-cmd-result-kv">
                  <li>enabled: <b>{String(r.enabled)}</b></li>
                  <li>git: {r.gitReady ? "ready" : "missing"}</li>
                  <li>repo: {r.repoReady ? "ready" : "—"}</li>
                  <li>remote: {r.remoteConfigured ? "configured" : "—"}</li>
                  <li>next: <code>{r.nextAction}</code></li>
                </ul>
              ),
            });
          } catch (err) {
            setCmdResult({
              title: "backup status failed",
              variant: "err",
              body: <p>{describeError(err)}</p>,
            });
          }
          return;
        }
      }
    },
    [activeMeta, sendChatMessage]
  );

  const onComposerSend = useCallback(
    (raw: string) => {
      if (raw.startsWith("/")) {
        void dispatchSlash(raw);
      } else {
        void sendChatMessage(raw);
      }
    },
    [dispatchSlash, sendChatMessage]
  );

  const onConfirm = useCallback(async (targetSlug: string) => {
    if (!confirmRequest) return;
    // Phase 6-E validation patch: trust the modal's targetSlug — the
    // user may have changed it from the default before clicking Confirm.
    const effectiveSlug = targetSlug || confirmRequest.agentSlug;
    setConfirmBusy(true);
    setConfirmError(null);
    try {
      if (confirmRequest.command === "remember") {
        const r = await apiPromoteMemory(effectiveSlug, confirmRequest.text);
        setCmdResult({
          title: `/remember · ${effectiveSlug}`,
          variant: "ok",
          body: (
            <p>
              {r.duplicate
                ? "Already in core memory (duplicate)."
                : `Saved (${r.bytesAppended ?? 0} bytes appended).`}
            </p>
          ),
        });
      } else {
        const r = await apiForgetMemory(
          effectiveSlug,
          confirmRequest.forgetKind ?? "core",
          confirmRequest.text
        );
        setCmdResult({
          title: `/forget · ${effectiveSlug} · ${r.kind}`,
          variant: "ok",
          body: <p>Forgotten ({r.bytesWritten} bytes rewritten).</p>,
        });
      }
      setConfirmRequest(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setConfirmError("This looks sensitive, so it was not saved.");
      } else {
        setConfirmError(describeError(err));
      }
    } finally {
      setConfirmBusy(false);
    }
  }, [confirmRequest]);

  const onCancel = useCallback(() => {
    if (confirmBusy) return;
    setConfirmRequest(null);
    setConfirmError(null);
  }, [confirmBusy]);

  const updateMessage = useCallback(
    (localId: string, patch: Partial<UiMessage>) => {
      setMessages((m) =>
        m.map((row) => (row.localId === localId ? { ...row, ...patch } : row))
      );
    },
    []
  );

  // Backend-health banner. Rendered above the chat layout in a fixed
  // band so the user can't miss it. Auto-clears once /healthz comes
  // back ok.
  const healthBanner =
    backendHealth.kind === "ok" || backendHealth.kind === "checking" ? null : (
      <div
        className="ce-banner ce-banner-error"
        role="alert"
        aria-live="polite"
      >
        <span className="ce-banner-text">
          <strong>Backend unavailable.</strong> {backendHealth.text}
        </span>
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-banner-action"
          onClick={pingHealth}
          aria-label="Re-check backend"
        >
          Re-check
        </button>
      </div>
    );

  const wizardSlot = wizardOpen ? (
    <FirstRunWizard initialHealth={latestHealth} onClose={closeWizard} />
  ) : null;
  const opsSlot = opsOpen ? (
    <OpsConsole initialHealth={latestHealth} onClose={() => setOpsOpen(false)} />
  ) : null;

  if (mode === "admin") {
    return (
      <>
        {healthBanner}
        {wizardSlot}
        {opsSlot}
        <AdminConsole onExit={() => setMode("chat")} />
      </>
    );
  }

  return (
    <>
      {healthBanner}
      {wizardSlot}
      {opsSlot}
      <div className="ce-mode-switch">
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-mode-switch-btn"
          onClick={openWizard}
          aria-label="Open setup wizard"
          title="Open setup wizard"
        >
          🧭 Setup
        </button>
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-mode-switch-btn"
          onClick={() => setOpsOpen(true)}
          aria-label="Open ops console"
          title="Diagnostics, usage & cost, update info"
        >
          📊 Ops
        </button>
        <button
          type="button"
          className="ce-btn ce-btn-secondary ce-mode-switch-btn"
          onClick={() => setMode("admin")}
          aria-label="Open admin console"
          title="Open admin console"
          disabled={streaming}
        >
          ⚙ Admin
        </button>
      </div>
      <ChatLayout
        sessionId={sessionId}
        messages={messages}
        activeMeta={activeMeta}
        streaming={streaming}
        globalError={globalError}
        sendNonce={sendNonce}
        sessionRefreshNonce={sessionRefreshNonce}
        onSend={onComposerSend}
        onStop={stopStreaming}
        onNewConversation={startNewConversation}
        onUpdateMessage={updateMessage}
        onSelectSession={selectSession}
        cmdResultSlot={
          cmdResult && (
            <CommandResultCard
              title={cmdResult.title}
              variant={cmdResult.variant}
              body={cmdResult.body}
              onDismiss={() => setCmdResult(null)}
            />
          )
        }
        modalSlot={
          confirmRequest && (
            <SlashConfirmModal
              request={confirmRequest}
              busy={confirmBusy}
              error={confirmError}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          )
        }
      />
    </>
  );
}

function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    return `${err.message}${err.hint ? ` (${err.hint})` : ""}`;
  }
  return err instanceof Error ? err.message : "unknown error";
}
