// CreativEdge Phase 7-A - routing playground.
//
// Sends a single prompt through the existing `streamChat` SSE pipeline
// and surfaces the route metadata (routed agent, provider, degraded,
// decision type, handoff) along with a short response preview. **No
// backend force-routing**; the playground observes the real router's
// decision rather than imposing one. Each run uses a fresh session
// (`sessionId: null`) so the user's chat thread is not polluted.
//
// Safety:
//   - read-only observation of the live chat pipeline,
//   - no memory mutation, no backup write,
//   - Clear button resets local state but never touches the backend.

import { useCallback, useRef, useState } from "react";

import { streamChat } from "../../api/chatStream";
import type { ChatMeta, RoutingPlaygroundResult } from "../../types";
import { ActionResult } from "../ActionResult";
import { StatusBadge } from "../StatusBadge";

interface Props {
  /** Optional slug — if set, the playground prepends a polite routing
   *  hint so the orchestrator considers (but may decline) that target.
   *  Same wording as the `/agent` slash command. */
  hintedSlug?: string | null;
}

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; result: RoutingPlaygroundResult }
  | { kind: "err"; text: string };

export function AdminRoutingPlayground({ hintedSlug }: Props): JSX.Element {
  const [prompt, setPrompt] = useState<string>("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const busy = state.kind === "busy";

  const run = useCallback(async () => {
    const trimmed = prompt.trim();
    if (trimmed.length === 0 || busy) return;
    const message = hintedSlug
      ? `Please route this to ${hintedSlug} if appropriate: ${trimmed}`
      : trimmed;

    setState({ kind: "busy" });
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const startedAt = Date.now();
    let meta: ChatMeta | null = null;
    let text = "";
    let handoff: RoutingPlaygroundResult["handoff"] | undefined;
    try {
      await streamChat({
        message,
        sessionId: null,
        signal: ctrl.signal,
        onEvent: (evt) => {
          if (evt.event === "meta") {
            meta = evt.data;
          } else if (evt.event === "chunk") {
            text += evt.data.text;
          } else if (evt.event === "done") {
            if (evt.data.handoff) handoff = evt.data.handoff;
          }
        },
      });
      // Cap the preview so the playground stays scannable even for long
      // multi-paragraph responses.
      const preview =
        text.length > 1000 ? text.slice(0, 1000) + "…" : text;
      const m = meta as ChatMeta | null;
      setState({
        kind: "ok",
        result: {
          routedAgentSlug: m?.agentSlug ?? null,
          routedAgentName: m?.agentName ?? null,
          provider: m?.provider ?? null,
          degraded: m?.degraded ?? false,
          decisionType: m?.routeDecision?.type ?? null,
          handoff,
          responsePreview: preview,
          latencyMs: Date.now() - startedAt,
        },
      });
    } catch (err) {
      if (ctrl.signal.aborted) {
        setState({ kind: "idle" });
      } else {
        const t = err instanceof Error ? err.message : "playground failed";
        setState({ kind: "err", text: t });
      }
    } finally {
      abortRef.current = null;
    }
  }, [prompt, busy, hintedSlug]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    setPrompt("");
    setState({ kind: "idle" });
  }, []);

  return (
    <section className="ce-admin-section" aria-label="Routing playground">
      <h3 className="ce-admin-section-head">Routing playground</h3>
      <p className="ce-hint">
        Sends a prompt through the real router and shows which agent
        handled it. No force-routing — the orchestrator may decide
        differently.
        {hintedSlug && (
          <>
            {" "}Hinted target: <code>{hintedSlug}</code> (the prompt is
            prefixed with a polite routing hint).
          </>
        )}
      </p>
      <textarea
        className="ce-admin-prompt"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Suggest a colour palette for a fintech onboarding."
        disabled={busy}
        aria-label="Playground prompt"
      />
      <div className="ce-admin-actions">
        <button
          type="button"
          className="ce-btn ce-btn-primary"
          onClick={run}
          disabled={busy || prompt.trim().length === 0}
        >
          {busy ? "Running…" : "Run"}
        </button>
        {busy && (
          <button
            type="button"
            className="ce-btn ce-btn-danger"
            onClick={stop}
            aria-label="Stop the playground run"
          >
            Stop
          </button>
        )}
        <button
          type="button"
          className="ce-btn ce-btn-secondary"
          onClick={clear}
          disabled={busy}
        >
          Clear
        </button>
      </div>

      {state.kind === "err" && (
        <ActionResult state={{ kind: "err", text: state.text }} />
      )}

      {state.kind === "ok" && (
        <div className="ce-admin-playground-result" role="status" aria-live="polite">
          <div className="ce-admin-playground-badges">
            <StatusBadge variant="info" icon="↳">
              routed: {state.result.routedAgentName ?? state.result.routedAgentSlug ?? "?"}
              {state.result.routedAgentSlug ? ` (${state.result.routedAgentSlug})` : ""}
            </StatusBadge>
            {state.result.provider && (
              <StatusBadge
                variant={state.result.degraded ? "warn" : "ok"}
              >
                {state.result.provider}
                {state.result.degraded ? " · degraded" : ""}
              </StatusBadge>
            )}
            {state.result.decisionType && (
              <StatusBadge variant="neutral" icon="≈">
                {state.result.decisionType}
              </StatusBadge>
            )}
            {state.result.latencyMs != null && (
              <StatusBadge variant="neutral" icon="·">
                {state.result.latencyMs} ms
              </StatusBadge>
            )}
          </div>
          {state.result.handoff && (
            <p className="ce-hint">
              Handoff: <code>{state.result.handoff.fromSlug}</code> →{" "}
              <code>
                {state.result.handoff.toSlug ?? state.result.handoff.rawSlug ?? "?"}
              </code>{" "}
              · {state.result.handoff.status}
            </p>
          )}
          <pre className="ce-admin-playground-response">
            {state.result.responsePreview || "(empty response)"}
          </pre>
        </div>
      )}
    </section>
  );
}
