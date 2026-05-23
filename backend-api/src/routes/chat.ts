import { randomUUID } from "node:crypto";
import type { ServerResponse } from "node:http";
import type { FastifyInstance } from "fastify";

import {
  appendEpisodicSummary,
  buildAgentRuntimeContext,
} from "../agents/agentRuntimeContext.js";
import { detectMemoryCandidate } from "../agents/memoryCandidate.js";
import { findEntry, loadRegistry } from "../agents/registry.js";
import {
  createSession,
  getSession,
  insertAgentEvent,
  insertHandoffEvent,
  insertMessage,
  insertRoutingEvent,
  listMessages,
  type MessageRow,
} from "../dao/sessions.js";
import {
  routeMessageThroughPipeline,
  buildOutOfDomainReply,
  type RouteDecision,
} from "../routing/routingPipeline.js";
import {
  runConvening,
  summarizeDraftsForUsage,
} from "../convening/runConvening.js";
import { detectHandoff } from "../handoff/handoffDetector.js";
import { runHandoffTurn } from "../handoff/runHandoff.js";
import { ClaudeProvider } from "../providers/ClaudeProvider.js";
import type { Provider, ProviderChunk } from "../providers/Provider.js";

interface ChatBody {
  message?: string;
  sessionId?: string;
}

function writeSse(raw: ServerResponse, event: string, data: unknown): void {
  raw.write(`event: ${event}\n`);
  raw.write(`data: ${JSON.stringify(data)}\n\n`);
}

const MESSAGE_MAX = 8000;
const TITLE_MAX = 60;

/**
 * Phase 3.3 - Hand-off instruction.
 *
 * Injected at the END of a specialist's system prompt when the routing
 * decision is `type:"specialist"`. The block format is exact-matched by
 * detectHandoff in src/handoff/handoffDetector.ts. We deliberately omit
 * any instruction for non-specialist branches (clarify / out_of_domain /
 * convene / nexus_fallback) so the protocol stays scoped to its own use
 * case.
 *
 * Specialists are encouraged - not required - to hand off. The cap is
 * exactly ONE handoff per turn; the target receives a different system
 * prompt that does NOT include this instruction.
 */
const HANDOFF_INSTRUCTION =
  "\n\n----- handoff protocol -----\n" +
  "If this turn really belongs to a different CreativEdge specialist, you " +
  "may end your response with EXACTLY ONE block of this form:\n" +
  "<CREATIVEDGE_HANDOFF>\n" +
  '{"handoff":"<canonical-slug>","reason":"<short justification>"}\n' +
  "</CREATIVEDGE_HANDOFF>\n" +
  "Use the canonical registry slug, not the persona name. Valid slugs:\n" +
  "  graphics-design (Lumi), programming-tech (Bit), digital-marketing (Buzz),\n" +
  "  video-animation (Reel), writing-translation (Lex), music-audio (Echo),\n" +
  "  business (Vera), finance (Cash), ai-services (Sage),\n" +
  "  personal-growth (Bloom), consulting (Atlas), data (Quant), photography (Iris).\n" +
  "Hard rules:\n" +
  "  - Use it ONLY when the request is clearly outside your domain.\n" +
  "  - Never target yourself. Never target nexus.\n" +
  "  - One block per turn. Do not chain handoffs.\n" +
  "  - When in doubt, answer normally without a handoff block.";

interface BudgetConfig {
  maxContextChars: number;
  reservedResponseChars: number;
  recentMessageLimit: number;
}
const DEFAULT_BUDGET: BudgetConfig = {
  maxContextChars: 120_000,
  reservedResponseChars: 12_000,
  recentMessageLimit: 20,
};
function getBudget(fastify: FastifyInstance): BudgetConfig {
  const claude = fastify.providers.byName.claude;
  if (claude instanceof ClaudeProvider) return claude.budget;
  return DEFAULT_BUDGET;
}

/** Phase 4.1: how many trailing episodic-memory entries to inject into the
 *  specialist's system prompt. Resolved from providers.json (Claude); 10 by
 *  default when Claude isn't configured. */
function getEpisodicLimit(fastify: FastifyInstance): number {
  const claude = fastify.providers.byName.claude;
  if (claude instanceof ClaudeProvider) return claude.recentEpisodicLimit;
  return 10;
}

interface BudgetedContext {
  recent: MessageRow[];
  estimatedChars: number;
  trimmedCount: number;
  budgetChars: number;
}
function budgetTranscript(
  protectedChars: number,
  candidates: MessageRow[],
  budget: BudgetConfig
): BudgetedContext {
  const transcriptBudget = Math.max(
    0,
    budget.maxContextChars - budget.reservedResponseChars - protectedChars
  );
  const byCount = candidates.slice(-budget.recentMessageLimit);
  const kept: MessageRow[] = [];
  let chars = 0;
  for (let i = byCount.length - 1; i >= 0; i--) {
    const m = byCount[i]!;
    const cost = m.content.length + 16;
    if (chars + cost > transcriptBudget) break;
    chars += cost;
    kept.unshift(m);
  }
  return {
    recent: kept,
    estimatedChars: chars,
    trimmedCount: candidates.length - kept.length,
    budgetChars: transcriptBudget,
  };
}

async function selectProviderWithFallback(
  primary: Provider,
  fallback: Provider,
  args: {
    messages: { role: "system" | "user" | "assistant"; content: string }[];
    requestId: string;
    agentSlug?: string;
  }
): Promise<{
  provider: Provider;
  degraded: boolean;
  primaryError?: string;
  iterator: AsyncIterable<ProviderChunk>;
}> {
  if (primary === fallback) {
    return {
      provider: primary,
      degraded: false,
      iterator: primary.call(args.messages, {
        requestId: args.requestId,
        agentSlug: args.agentSlug,
      }),
    };
  }
  const primaryIter = primary
    .call(args.messages, { requestId: args.requestId, agentSlug: args.agentSlug })
    [Symbol.asyncIterator]();

  const buffered: ProviderChunk[] = [];
  while (true) {
    const r = await primaryIter.next();
    if (r.done) {
      return {
        provider: fallback,
        degraded: true,
        primaryError: "primary provider yielded no discriminating chunk",
        iterator: fallback.call(args.messages, {
          requestId: args.requestId,
          agentSlug: args.agentSlug,
        }),
      };
    }
    const t = r.value.type;
    if (t === "text") {
      async function* prepend(): AsyncIterable<ProviderChunk> {
        for (const b of buffered) yield b;
        yield r.value;
        while (true) {
          const n = await primaryIter.next();
          if (n.done) return;
          yield n.value;
        }
      }
      return { provider: primary, degraded: false, iterator: prepend() };
    }
    if (t === "error") {
      void (async () => {
        try {
          for await (const _ of { [Symbol.asyncIterator]: () => primaryIter }) {
            /* drain */
          }
        } catch {
          /* noop */
        }
      })();
      return {
        provider: fallback,
        degraded: true,
        primaryError:
          typeof r.value.text === "string" ? r.value.text : "primary provider errored",
        iterator: fallback.call(args.messages, {
          requestId: args.requestId,
          agentSlug: args.agentSlug,
        }),
      };
    }
    if (t === "done") {
      return {
        provider: fallback,
        degraded: true,
        primaryError: "primary provider closed without text",
        iterator: fallback.call(args.messages, {
          requestId: args.requestId,
          agentSlug: args.agentSlug,
        }),
      };
    }
    buffered.push(r.value);
  }
}

function persistRouting(
  fastify: FastifyInstance,
  decision: RouteDecision,
  ctx: { sessionId: string; requestId: string; messageId: string | null }
): void {
  insertRoutingEvent(fastify.db, {
    sessionId: ctx.sessionId,
    requestId: ctx.requestId,
    messageId: ctx.messageId,
    selectedSlug: decision.selectedSlug,
    decisionType: decision.type,
    source: decision.source,
    confidence: decision.confidence,
    score: decision.score,
    routeHitsJson: JSON.stringify(decision.routeHits),
    shortlistJson: JSON.stringify(decision.shortlist),
    appliedRulesJson: JSON.stringify(decision.appliedRules),
    rationale: decision.rationale,
    clarificationQuestion: decision.clarificationQuestion ?? null,
    convenedSlugsJson: decision.convenedSlugs
      ? JSON.stringify(decision.convenedSlugs)
      : null,
  });
}

export async function chatRoutes(fastify: FastifyInstance): Promise<void> {
  const claudeProvider = fastify.providers.byName.claude;
  if (claudeProvider instanceof ClaudeProvider) {
    claudeProvider.retryHook = (info) => {
      fastify.log.warn(
        {
          phase: "claude-cli-retry",
          attempt: info.attempt,
          backoffMs: info.backoffMs,
          reason: info.reason,
        },
        "claude CLI transient failure; retrying"
      );
    };
  }

  fastify.post<{ Body: ChatBody }>("/chat", async (req, reply) => {
    const start = Date.now();
    const body = (req.body ?? {}) as ChatBody;

    if (typeof body.message !== "string" || body.message.trim().length === 0) {
      return reply.code(400).send({ error: "body.message must be a non-empty string" });
    }
    if (body.message.length > MESSAGE_MAX) {
      return reply.code(400).send({ error: `body.message too long (max ${MESSAGE_MAX} chars)` });
    }

    // 1) Session bookkeeping
    let sessionId = body.sessionId ?? null;
    let isNewSession = false;
    if (!sessionId) {
      sessionId = randomUUID();
      createSession(fastify.db, { id: sessionId, title: body.message.slice(0, TITLE_MAX) });
      isNewSession = true;
    } else if (!getSession(fastify.db, sessionId)) {
      return reply.code(404).send({ error: "sessionId not found" });
    }

    // 2) Routing pipeline (Phase 3.1)
    const reg = await loadRegistry(fastify.runtime.projectRoot);
    const claudeReadyForTiebreak =
      fastify.providers.readiness.claude?.installed === true && !!claudeProvider;
    const decision = await routeMessageThroughPipeline({
      message: body.message,
      registry: reg,
      tieBreakerProvider: claudeReadyForTiebreak ? claudeProvider : undefined,
    });
    fastify.log.info(
      {
        phase: "chat-route",
        sessionId,
        selectedSlug: decision.selectedSlug,
        decisionType: decision.type,
        source: decision.source,
        score: decision.score,
        confidence: decision.confidence,
        hits: decision.routeHits.length,
        appliedRules: decision.appliedRules,
      },
      "routing decision"
    );

    const agentEntry = findEntry(reg, decision.selectedSlug);

    // Phase 5.2 bridge: detect a user-confirmed-required memory-worthy fact
    // candidate from the raw user message. Pure function; no IO; never
    // writes to disk. Returns null when the message is transient, sensitive,
    // or doesn't match a durable-preference / identity / explicit-directive
    // pattern. The candidate (when present) is round-tripped to the client
    // via the SSE `done` payload below; the actual write requires a
    // separate `POST /agents/:slug/memory/promote` call with `confirmed:true`.
    const memoryCandidate = detectMemoryCandidate(body.message, decision.selectedSlug);
    if (memoryCandidate) {
      fastify.log.info(
        {
          phase: "memory-candidate",
          sessionId,
          requestId: req.id,
          agentSlug: memoryCandidate.agentSlug,
          type: memoryCandidate.type,
          pattern: memoryCandidate.pattern,
          textChars: memoryCandidate.text.length,
        },
        "memory candidate suggested (awaiting user confirmation)"
      );
    }

    // 3) Persist user message and routing event up front so they're always visible.
    insertMessage(fastify.db, {
      sessionId,
      role: "user",
      content: body.message,
      agentSlug: decision.selectedSlug,
    });
    persistRouting(fastify, decision, {
      sessionId,
      requestId: req.id,
      messageId: null,
    });

    // 4a) Phase 3.2 - convening: fan out to 2-3 specialists in parallel, then
    //     stream a synthesized Nexus reply. Drafts are internal: they do NOT
    //     create messages rows and do NOT emit raw SSE chunks to the user.
    if (decision.type === "convene" && Array.isArray(decision.convenedSlugs) && decision.convenedSlugs.length > 0) {
      const claudeInstalledC = fastify.providers.readiness.claude?.installed === true;
      const claudeC = fastify.providers.byName.claude;
      const mockC = fastify.providers.byName.mock;
      if (!mockC) {
        return reply.code(500).send({ error: "mock provider not registered" });
      }
      const convProvider = claudeInstalledC && claudeC ? claudeC : mockC;
      const convDegraded = !(claudeInstalledC && claudeC);

      reply.hijack();
      const raw = reply.raw;
      raw.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      raw.setHeader("Cache-Control", "no-cache, no-transform");
      raw.setHeader("Connection", "keep-alive");
      raw.setHeader("X-Accel-Buffering", "no");
      raw.writeHead(200);

      const writeFn = (event: string, data: unknown) => writeSse(raw, event, data);
      writeFn("meta", {
        sessionId,
        newSession: isNewSession,
        agentSlug: "nexus",
        agentName: agentEntry?.name ?? "Nexus",
        agentEmoji: agentEntry?.emoji ?? "🌐",
        routeConfident: decision.confidence === "high",
        routeScore: decision.score,
        routeHits: decision.routeHits,
        provider: convProvider.name,
        degraded: convDegraded,
        candidate: convProvider.name,
        requestId: req.id,
        routeDecision: {
          type: decision.type,
          source: decision.source,
          confidence: decision.confidence,
          rationale: decision.rationale,
          appliedRules: decision.appliedRules,
          shortlist: decision.shortlist,
          convenedSlugs: decision.convenedSlugs,
        },
        budget: { messages_kept: 0, messages_trimmed: 0, protected_chars: 0 },
      });

      // Phase 3.2 patch: thread the configured synthesis timeout into the runner.
      //   `providers.claude.conveningSynthesisTimeoutMs` (~/.creativedge/providers.json)
      //   defaults to 150s and is the hard cap on the synthesis call itself.
      const synthesisTimeoutMs =
        claudeC instanceof ClaudeProvider ? claudeC.conveningSynthesisTimeoutMs : undefined;
      const result = await runConvening({
        message: body.message,
        registry: reg,
        convenedSlugs: decision.convenedSlugs,
        provider: convProvider,
        degraded: convDegraded,
        projectRoot: fastify.runtime.projectRoot,
        runtimeAgentsDir: fastify.runtime.agentsDir,
        requestId: req.id,
        synthesisTimeoutMs,
        // Phase 4.2: convening specialist drafters now see the same trailing
        // episodic-memory window the single-specialist and handoff target
        // turns get. Same providers.claude.recentEpisodicLimit knob.
        episodicLimit: getEpisodicLimit(fastify),
        raw,
        writeSse: writeFn,
      });

      if (result.synthesisError) {
        fastify.log.warn(
          {
            phase: "convening-synthesis",
            sessionId,
            requestId: req.id,
            convenedSlugs: decision.convenedSlugs,
            synthesisError: result.synthesisError,
            visibleProvider: result.visibleProvider,
            anyDraftOk: result.drafts.some((d) => d.success),
          },
          "convening synthesis fell back"
        );
      }

      insertMessage(fastify.db, {
        sessionId,
        role: "assistant",
        content: result.assistantText,
        agentSlug: "nexus",
      });
      const aggregateUsage = {
        ...(summarizeDraftsForUsage(result.drafts) as Record<string, unknown>),
        synthesis_ok: result.synthesisOk,
        synthesis_usage: result.synthesisUsage,
        visible_provider: result.visibleProvider,
        ...(result.synthesisError ? { synthesis_error: result.synthesisError } : {}),
        synthesis_timeout_ms: synthesisTimeoutMs ?? null,
      };
      insertAgentEvent(fastify.db, {
        sessionId,
        requestId: req.id,
        agentSlug: "nexus",
        provider: result.visibleProvider,
        fallbackUsed: convDegraded || !result.synthesisOk,
        latencyMs: Date.now() - start,
        status: result.synthesisOk ? "ok" : "synthesis_fallback",
        usageJson: JSON.stringify(aggregateUsage),
      });
      writeFn("done", {
        ok: true,
        sessionId,
        provider: result.visibleProvider,
        degraded: convDegraded,
        latencyMs: Date.now() - start,
        synthesisOk: result.synthesisOk,
        convenedSlugs: decision.convenedSlugs,
        ...(result.synthesisError ? { synthesisError: result.synthesisError } : {}),
        ...(memoryCandidate ? { memoryCandidate } : {}),
      });
      raw.end();
      return;
    }

    // 4) Deterministic Nexus paths (clarify / out_of_domain) - skip provider entirely.
    if (decision.type === "clarify" || decision.type === "out_of_domain") {
      reply.hijack();
      const raw = reply.raw;
      raw.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      raw.setHeader("Cache-Control", "no-cache, no-transform");
      raw.setHeader("Connection", "keep-alive");
      raw.setHeader("X-Accel-Buffering", "no");
      raw.writeHead(200);

      const text =
        decision.type === "clarify"
          ? decision.clarificationQuestion ??
            "🌐 Nexus: could you rephrase what you need? I want to bring in the right specialist."
          : buildOutOfDomainReply(reg, decision);

      writeSse(raw, "meta", {
        sessionId,
        newSession: isNewSession,
        agentSlug: decision.selectedSlug,
        agentName: agentEntry?.name ?? "Nexus",
        agentEmoji: agentEntry?.emoji ?? "🌐",
        routeConfident: decision.confidence === "high",
        routeScore: decision.score,
        routeHits: decision.routeHits,
        provider: "nexus",
        degraded: false,
        candidate: "nexus",
        requestId: req.id,
        routeDecision: {
          type: decision.type,
          source: decision.source,
          confidence: decision.confidence,
          rationale: decision.rationale,
          appliedRules: decision.appliedRules,
          shortlist: decision.shortlist,
        },
        budget: { messages_kept: 0, messages_trimmed: 0, protected_chars: 0 },
      });
      writeSse(raw, "chunk", { text });

      insertMessage(fastify.db, {
        sessionId,
        role: "assistant",
        content: text,
        agentSlug: decision.selectedSlug,
      });
      insertAgentEvent(fastify.db, {
        sessionId,
        requestId: req.id,
        agentSlug: decision.selectedSlug,
        provider: "nexus",
        fallbackUsed: false,
        latencyMs: Date.now() - start,
        status: "ok",
        usageJson: JSON.stringify({ provider: "nexus", decision: decision.type }),
      });

      writeSse(raw, "done", {
        ok: true,
        sessionId,
        provider: "nexus",
        degraded: false,
        latencyMs: Date.now() - start,
        ...(memoryCandidate ? { memoryCandidate } : {}),
      });
      raw.end();
      return;
    }

    // 5) Specialist / nexus_fallback paths - go through the real provider.
    const claudeInstalled = fastify.providers.readiness.claude?.installed === true;
    const claudeP = fastify.providers.byName.claude;
    const mockProvider = fastify.providers.byName.mock;
    if (!mockProvider) {
      return reply.code(500).send({ error: "mock provider not registered" });
    }
    const candidate: Provider = claudeInstalled && claudeP ? claudeP : mockProvider;

    // Phase 3.3: handoff instruction is injected ONLY for confident specialist
    // routings. nexus_fallback (Nexus answering as a generalist) does NOT get
    // the protocol because Nexus is already the orchestrator and shouldn't
    // hand off to itself or to a specialist via this channel.
    const handoffEligible = decision.type === "specialist";
    // Phase 4.1: centralized runtime context assembly. Loads project context,
    // system_prompt.md, core memory, the trailing N episodic entries, and the
    // optional handoff instruction in one place so chat.ts, runConvening, and
    // runHandoff can never drift apart.
    const runtimeContext = await buildAgentRuntimeContext({
      slug: decision.selectedSlug,
      registryEntry: agentEntry,
      projectRoot: fastify.runtime.projectRoot,
      runtimeAgentsDir: fastify.runtime.agentsDir,
      systemPromptAddendum: handoffEligible ? HANDOFF_INSTRUCTION : undefined,
      episodicLimit: getEpisodicLimit(fastify),
    });
    const systemContent = runtimeContext.systemContent;

    // 6) Phase 2.6 context budgeting (preserved).
    const budget = getBudget(fastify);
    const allRecent = listMessages(fastify.db, sessionId, 200).slice(0, -1);
    const protectedChars = systemContent.length + body.message.length;
    const budgeted = budgetTranscript(protectedChars, allRecent, budget);
    if (budgeted.trimmedCount > 0) {
      fastify.log.info(
        {
          phase: "chat-budget",
          sessionId,
          agentSlug: decision.selectedSlug,
          messages_total: allRecent.length,
          messages_kept: budgeted.recent.length,
          messages_trimmed: budgeted.trimmedCount,
          transcript_budget_chars: budgeted.budgetChars,
          transcript_used_chars: budgeted.estimatedChars,
          protected_chars: protectedChars,
        },
        "transcript trimmed by context budget"
      );
    }

    const messages = [
      { role: "system" as const, content: systemContent },
      ...budgeted.recent.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: body.message },
    ];

    // 7) Provider selection with first-chunk fallback (Phase 2.6 selector).
    const selection = await selectProviderWithFallback(candidate, mockProvider, {
      messages,
      requestId: req.id,
      agentSlug: decision.selectedSlug,
    });

    // 8) SSE stream
    reply.hijack();
    const raw = reply.raw;
    raw.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    raw.setHeader("Cache-Control", "no-cache, no-transform");
    raw.setHeader("Connection", "keep-alive");
    raw.setHeader("X-Accel-Buffering", "no");
    raw.writeHead(200);

    writeSse(raw, "meta", {
      sessionId,
      newSession: isNewSession,
      agentSlug: decision.selectedSlug,
      agentName: agentEntry?.name ?? null,
      agentEmoji: agentEntry?.emoji ?? null,
      routeConfident: decision.confidence === "high",
      routeScore: decision.score,
      routeHits: decision.routeHits,
      provider: selection.provider.name,
      degraded: selection.degraded,
      ...(selection.primaryError ? { claudeError: selection.primaryError } : {}),
      candidate: candidate.name,
      requestId: req.id,
      routeDecision: {
        type: decision.type,
        source: decision.source,
        confidence: decision.confidence,
        rationale: decision.rationale,
        appliedRules: decision.appliedRules,
        shortlist: decision.shortlist,
      },
      budget: {
        messages_kept: budgeted.recent.length,
        messages_trimmed: budgeted.trimmedCount,
        protected_chars: protectedChars,
        // Phase 4.1 - episodic memory injection counters. Content is never
        // logged, only counts/booleans.
        core_memory_loaded: runtimeContext.coreMemoryLoaded,
        episodic_entries: runtimeContext.episodicEntriesLoaded,
        episodic_chars: runtimeContext.episodicCharsUsed,
      },
    });

    const headerText = agentEntry
      ? `${agentEntry.emoji} ${agentEntry.name}${agentEntry.domain ? " - " + agentEntry.domain : ""}\n\n`
      : "";

    // Phase 3.3: BUFFER the first specialist's raw text instead of streaming
    // it live. We must wait until the full response is in hand to detect a
    // possible <CREATIVEDGE_HANDOFF> block. If the block is valid, the visible
    // reply will come from the TARGET specialist (the first specialist's
    // draft is discarded and never persisted). For non-handoff turns we
    // flush the buffer in one shot after detection runs.
    let bufferedText = "";
    let status = "ok";
    let usageData: unknown = null;
    let providerErrorText: string | null = null;
    try {
      for await (const ch of selection.iterator) {
        if (ch.type === "text" && typeof ch.text === "string") {
          bufferedText += ch.text;
        } else if (ch.type === "usage") {
          usageData = ch.data ?? null;
        } else if (ch.type === "error") {
          status = "error";
          providerErrorText = ch.text ?? "provider error";
        } else if (ch.type === "done") {
          // handled below
        }
      }
    } catch (err) {
      status = "error";
      providerErrorText = err instanceof Error ? err.message : String(err);
    }

    // Phase 3.3 - handoff detection. Only specialist routings are eligible
    // (the instruction was only injected when handoffEligible is true).
    const detection = handoffEligible
      ? detectHandoff(bufferedText, decision.selectedSlug, reg)
      : null;

    // ------------------------------------------------------------------
    // Branch A: VALID handoff - stream from target, persist target's reply.
    // ------------------------------------------------------------------
    if (status === "ok" && detection && detection.kind === "valid") {
      const handoffResult = await runHandoffTurn({
        fromSlug: decision.selectedSlug,
        toSlug: detection.toSlug,
        reason: detection.reason,
        userMessage: body.message,
        registry: reg,
        provider: selection.provider,
        projectRoot: fastify.runtime.projectRoot,
        runtimeAgentsDir: fastify.runtime.agentsDir,
        requestId: req.id,
        episodicLimit: getEpisodicLimit(fastify),
        raw,
        writeSse: (event, data) => writeSse(raw, event, data),
      });

      const finalStatus = handoffResult.success ? "completed" : "failed_target_call";
      insertHandoffEvent(fastify.db, {
        sessionId,
        requestId: req.id,
        messageId: null,
        fromSlug: decision.selectedSlug,
        toSlug: detection.toSlug,
        reason: detection.reason,
        status: finalStatus,
        ignoredReason:
          finalStatus === "failed_target_call"
            ? (handoffResult.errorText ?? "target call failed").slice(0, 400)
            : null,
      });

      // Persist exactly ONE assistant message (transition + target text or
      // apology). The originating specialist's draft is NEVER persisted.
      insertMessage(fastify.db, {
        sessionId,
        role: "assistant",
        content: handoffResult.assistantText,
        agentSlug: detection.toSlug,
      });

      const agentEventUsage = {
        provider: selection.provider.name,
        handoff: {
          from: decision.selectedSlug,
          to: detection.toSlug,
          status: finalStatus,
          reason: detection.reason,
        },
        target_usage: handoffResult.usage ?? null,
        originating_usage: usageData ?? null,
        ...(handoffResult.errorText ? { handoff_error: handoffResult.errorText } : {}),
      };
      insertAgentEvent(fastify.db, {
        sessionId,
        requestId: req.id,
        agentSlug: detection.toSlug,
        provider: selection.provider.name,
        fallbackUsed: selection.degraded || !handoffResult.success,
        latencyMs: Date.now() - start,
        status: handoffResult.success ? "ok" : "handoff_failed",
        usageJson: JSON.stringify(agentEventUsage),
      });

      fastify.log.info(
        {
          phase: "chat-handoff",
          sessionId,
          requestId: req.id,
          fromSlug: decision.selectedSlug,
          toSlug: detection.toSlug,
          rawSlug: detection.rawSlug,
          aliasNormalized: detection.rawSlug !== detection.toSlug,
          status: finalStatus,
        },
        "handoff executed"
      );

      // Phase 4.1 - append a deterministic one-line episodic summary to the
      // TARGET specialist's memory (the agent that actually answered). The
      // helper itself guards against sensitive-looking content and never
      // throws. Only fires on a completed handoff.
      if (handoffResult.success) {
        const summary = await appendEpisodicSummary({
          runtimeAgentsDir: fastify.runtime.agentsDir,
          slug: detection.toSlug,
          sessionId,
          userMessage: body.message,
          wasHandoff: true,
        });
        fastify.log.info(
          {
            phase: "chat-episodic",
            sessionId,
            requestId: req.id,
            agentSlug: detection.toSlug,
            written: summary.written,
            ...(summary.skipped ? { skippedReason: summary.skipped } : {}),
          },
          "episodic summary"
        );
      }

      writeSse(raw, "done", {
        ok: handoffResult.success,
        sessionId,
        provider: selection.provider.name,
        degraded: selection.degraded,
        latencyMs: Date.now() - start,
        handoff: {
          fromSlug: decision.selectedSlug,
          toSlug: detection.toSlug,
          rawSlug: detection.rawSlug,
          status: finalStatus,
          reason: detection.reason,
        },
        // Phase 5.2 bridge: re-key the candidate to the target slug if a
        // handoff completed, so the user's "remember" applies to the agent
        // that actually answered.
        ...(memoryCandidate
          ? {
              memoryCandidate: handoffResult.success
                ? { ...memoryCandidate, agentSlug: detection.toSlug }
                : memoryCandidate,
            }
          : {}),
      });
      raw.end();
      return;
    }

    // ------------------------------------------------------------------
    // Branch B: NO handoff or IGNORED - stream the originating specialist's
    //           reply normally. cleanedText drops any (ignored) handoff block.
    // ------------------------------------------------------------------
    let assistantText = "";
    if (headerText) {
      assistantText += headerText;
      writeSse(raw, "chunk", { text: headerText });
    }

    const visibleText =
      detection && detection.kind !== "none" ? detection.cleanedText : bufferedText;
    // Always flush any partial text we received, even if a provider error
    // followed it. This matches the live-streaming behavior of the pre-3.3
    // chat route (text chunks streamed as-they-arrived, error event sent
    // separately afterwards).
    if (visibleText.length > 0) {
      assistantText += visibleText;
      writeSse(raw, "chunk", { text: visibleText });
    }
    if (status === "error" && providerErrorText) {
      writeSse(raw, "error", { text: providerErrorText });
    }

    // If detection ignored a malformed/invalid block, audit it.
    let handoffDoneField:
      | { fromSlug: string; toSlug: string | null; status: string; reason: string | null }
      | undefined;
    if (detection && detection.kind === "ignored") {
      insertHandoffEvent(fastify.db, {
        sessionId,
        requestId: req.id,
        messageId: null,
        fromSlug: decision.selectedSlug,
        // NOT NULL column constraint is satisfied without inventing a slug.
        toSlug: "",
        reason: detection.ignoredReason.slice(0, 400),
        status: detection.status,
        ignoredReason: detection.ignoredReason.slice(0, 400),
      });
      fastify.log.info(
        {
          phase: "chat-handoff",
          sessionId,
          requestId: req.id,
          fromSlug: decision.selectedSlug,
          rawSlug: detection.rawSlug,
          status: detection.status,
          ignoredReason: detection.ignoredReason,
        },
        "handoff block ignored"
      );
      handoffDoneField = {
        fromSlug: decision.selectedSlug,
        toSlug: null,
        status: detection.status,
        reason: detection.ignoredReason,
      };
    }

    insertMessage(fastify.db, {
      sessionId,
      role: "assistant",
      content: assistantText,
      agentSlug: decision.selectedSlug,
    });
    const usageJson = usageData
      ? JSON.stringify(usageData)
      : selection.provider.name === "mock"
        ? JSON.stringify({ provider: "mock" })
        : null;
    insertAgentEvent(fastify.db, {
      sessionId,
      requestId: req.id,
      agentSlug: decision.selectedSlug,
      provider: selection.provider.name,
      fallbackUsed: selection.degraded,
      latencyMs: Date.now() - start,
      status,
      usageJson,
    });

    // Phase 4.1 - append a deterministic episodic summary to the answering
    // specialist's memory file. Fires ONLY for confident `specialist`
    // routings; nexus_fallback / clarify / out_of_domain / convene all skip
    // this (Nexus and convening don't get per-agent episodic summaries on
    // this slice). The helper itself is sensitive-content-aware and never
    // throws.
    if (decision.type === "specialist" && status === "ok") {
      const summary = await appendEpisodicSummary({
        runtimeAgentsDir: fastify.runtime.agentsDir,
        slug: decision.selectedSlug,
        sessionId,
        userMessage: body.message,
        wasHandoff: false,
      });
      fastify.log.info(
        {
          phase: "chat-episodic",
          sessionId,
          requestId: req.id,
          agentSlug: decision.selectedSlug,
          written: summary.written,
          ...(summary.skipped ? { skippedReason: summary.skipped } : {}),
        },
        "episodic summary"
      );
    }
    writeSse(raw, "done", {
      ok: status === "ok",
      sessionId,
      provider: selection.provider.name,
      degraded: selection.degraded,
      latencyMs: Date.now() - start,
      ...(handoffDoneField ? { handoff: handoffDoneField } : {}),
      ...(memoryCandidate ? { memoryCandidate } : {}),
    });
    raw.end();
  });
}
