import type { ServerResponse } from "node:http";

import type { Registry, RegistryEntry } from "../agents/registry.js";
import { findEntry } from "../agents/registry.js";
import { buildAgentRuntimeContext } from "../agents/agentRuntimeContext.js";
import type { Provider } from "../providers/Provider.js";
import { stripAnyHandoffBlock } from "./handoffDetector.js";

/**
 * Phase 3.3 - handoff runner.
 *
 * After a specialist's first-pass response is buffered and shown to declare
 * a hand-off, the chat route calls this to produce the FINAL visible reply
 * from the target specialist. Unlike the convening runner, this is a single
 * sequential call - we are not fanning out and not synthesizing.
 *
 * Key contracts:
 *   - The target specialist's system prompt is loaded normally, WITHOUT the
 *     handoff instruction. This is what prevents chains: only the FIRST
 *     specialist this turn can emit a handoff block. If the target tries to
 *     emit one anyway, the chat route strips it via stripAnyHandoffBlock
 *     before persisting.
 *   - A short Nexus transition line is streamed to the user before the
 *     target's text. The transition is also captured in `assistantText` so
 *     the persisted message reflects exactly what the user saw.
 *   - The original user message is passed to the target unchanged. We only
 *     inject the hand-off reason into the system prompt as a transferred
 *     note, so the target has full context without us editing their input.
 */

const HANDOFF_TIMEOUT_MS = 90_000;

export interface RunHandoffArgs {
  fromSlug: string;
  toSlug: string;
  reason: string;
  userMessage: string;
  registry: Registry;
  provider: Provider;
  projectRoot: string;
  runtimeAgentsDir: string;
  requestId: string;
  /** Phase 4.1: number of trailing episodic-memory entries to inject into
   *  the target specialist's system prompt. Default 10 in
   *  buildAgentRuntimeContext when omitted. */
  episodicLimit?: number;
  /** Hijacked SSE response writer. The runner streams chunks onto it. */
  raw: ServerResponse;
  /** Writes one SSE event onto `raw`. */
  writeSse: (event: string, data: unknown) => void;
}

export interface RunHandoffResult {
  success: boolean;
  assistantText: string;
  usage?: unknown;
  errorText?: string;
  targetEntry: RegistryEntry | undefined;
}

function buildTransitionLine(
  fromEntry: RegistryEntry | undefined,
  toEntry: RegistryEntry | undefined,
  reason: string
): string {
  const fromName = fromEntry?.name ?? "the previous specialist";
  const toName = toEntry?.name ?? "another specialist";
  const toEmoji = toEntry?.emoji ?? "🤖";
  return (
    `🌐 Nexus — handoff accepted\n` +
    `${fromName} identified that this is better handled by ${toEmoji} ${toName}.\n` +
    `Reason: ${reason}\n\n`
  );
}

function buildTargetHeader(entry: RegistryEntry | undefined): string {
  if (!entry) return "";
  const dom = entry.domain ? " - " + entry.domain : "";
  return `${entry.emoji} ${entry.name}${dom}\n\n`;
}

function buildTransferNoteAddendum(fromName: string, reason: string): string {
  return (
    "\n\n----- handoff context -----\n" +
    `You are receiving this turn from ${fromName} via Nexus. Reason: ` +
    `${reason}\n` +
    "Answer the user's ORIGINAL message directly from your own specialist " +
    "perspective. Do not emit a CREATIVEDGE_HANDOFF block - handoffs are " +
    "capped at one per turn."
  );
}

export async function runHandoffTurn(
  args: RunHandoffArgs
): Promise<RunHandoffResult> {
  const fromEntry = findEntry(args.registry, args.fromSlug);
  const toEntry = findEntry(args.registry, args.toSlug);

  // 1) Stream transition line up-front so the user sees the handover.
  const transition = buildTransitionLine(fromEntry, toEntry, args.reason);
  args.writeSse("chunk", { text: transition });

  // 2) Phase 4.1 - assemble the target system prompt via the shared
  //    runtime-context builder. This gives the target the SAME layout that
  //    chat.ts and runConvening use (project context + persona + core +
  //    episodic memory), with a transfer-note addendum and NO handoff
  //    instruction (anti-chain).
  const runtimeContext = await buildAgentRuntimeContext({
    slug: args.toSlug,
    registryEntry: toEntry,
    projectRoot: args.projectRoot,
    runtimeAgentsDir: args.runtimeAgentsDir,
    systemPromptAddendum: buildTransferNoteAddendum(
      fromEntry?.name ?? args.fromSlug,
      args.reason
    ),
    episodicLimit: args.episodicLimit,
  });
  const systemContent = runtimeContext.systemContent;

  // 3) Stream a target header so the user sees who is now speaking.
  const targetHeader = buildTargetHeader(toEntry);
  if (targetHeader) args.writeSse("chunk", { text: targetHeader });

  // 4) Call the target specialist sequentially.
  const messages = [
    { role: "system" as const, content: systemContent },
    { role: "user" as const, content: args.userMessage },
  ];

  let targetText = "";
  let usage: unknown = undefined;
  let errorText: string | undefined;

  try {
    for await (const ch of args.provider.call(messages, {
      requestId: "handoff-" + args.requestId.slice(0, 8) + "-" + args.toSlug,
      timeoutMs: HANDOFF_TIMEOUT_MS,
      agentSlug: args.toSlug,
    })) {
      if (ch.type === "text" && typeof ch.text === "string") {
        targetText += ch.text;
      } else if (ch.type === "usage") {
        usage = ch.data;
      } else if (ch.type === "error") {
        errorText = ch.text ?? "handoff target provider error";
      }
    }
  } catch (err) {
    errorText = err instanceof Error ? err.message : String(err);
  }

  // 5) Anti-ping-pong: strip any handoff block the target tried to emit.
  const { stripped, hadBlock } = stripAnyHandoffBlock(targetText);
  const finalTargetText = stripped;
  const ok = !errorText && finalTargetText.trim().length > 0;

  // 6) Stream the cleaned target text (or an apology if it failed).
  if (ok) {
    args.writeSse("chunk", { text: finalTargetText });
  } else {
    const apology =
      `Nexus tried to bring in ${toEntry?.name ?? args.toSlug} for this, but ` +
      "the handoff couldn't complete. Please try again.";
    args.writeSse("chunk", { text: apology });
  }

  const assistantText =
    transition +
    targetHeader +
    (ok
      ? finalTargetText
      : `Nexus tried to bring in ${toEntry?.name ?? args.toSlug} for this, but the handoff couldn't complete. Please try again.`);

  return {
    success: ok,
    assistantText,
    usage,
    errorText: ok
      ? hadBlock
        ? "target attempted second handoff (stripped)"
        : undefined
      : errorText ?? "handoff target produced no text",
    targetEntry: toEntry,
  };
}
