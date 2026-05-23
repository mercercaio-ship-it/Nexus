import { spawn, type ChildProcess } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";

import type { ProviderChunk, ProviderMessage } from "./Provider.js";

/**
 * Local Claude Code CLI streaming integration.
 *
 * Phase 4.4-A reliability patch:
 *   Earlier slices passed BOTH the (large) system prompt and the (variable)
 *   user prompt as positional / `--system-prompt <string>` argv. By turn 7
 *   of a 10-turn voice-hold session, the accumulated transcript pushed
 *   argv past Windows' command-line length limit, causing
 *   `spawn ENAMETOOLONG`, which made the chat route fall back to
 *   MockProvider. The fix is purely transport-side:
 *
 *     1. Write the system prompt to a per-call temp file and pass
 *        `--system-prompt-file <path>` instead of `--system-prompt <s>`
 *        (Claude Code 2.1+ supports both - the file form is documented in
 *        the `--bare` description: "Explicitly provide context via:
 *        --system-prompt[-file], --append-system-prompt[-file], ...").
 *     2. Write the user prompt to the child's stdin instead of pushing it
 *        as a positional argv argument. Claude `-p --input-format text`
 *        (default) reads the prompt from stdin when no positional is
 *        given - confirmed empirically against `claude --version
 *        2.1.138`.
 *
 *   Result: argv is bounded to ~200 chars regardless of session length.
 *   The temp file is always cleaned up on close / abort. No prompt or
 *   memory content is ever logged.
 *
 * Phase 2.4 / 2.5 contracts preserved:
 *   - No Anthropic API call.
 *   - No API-key read.
 *   - No .env.
 *   - No npm SDK import.
 *   - `--bare` is still NOT passed (it forces ANTHROPIC_API_KEY auth).
 *   - The same five runtime-isolation flags from Phase 2.5 remain.
 *   - The streaming JSON parser, first-chunk + hard-turn timeouts, retry
 *     wrapper, and usage chunk shape are unchanged.
 */

export interface CallClaudeOptions {
  /** Messages array - the first system entry becomes --system-prompt-file
   *  content, the last user entry becomes the stdin prompt, and assistant
   *  history is folded into the system prompt as a "conversation so far"
   *  section. */
  messages: ProviderMessage[];
  /** Hard cap on the whole call (default 90s). */
  timeoutMs?: number;
  /** Cap on time-to-first-chunk before we conclude the runtime is broken. */
  firstChunkTimeoutMs?: number;
  /** Optional model override (e.g. "sonnet", "opus", "haiku"). */
  model?: string;
}

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_FIRST_CHUNK_MS = 60_000;

/** Convert {role, content}[] into a single (systemPrompt, prompt) pair for the CLI. */
function packMessages(messages: ProviderMessage[]): { systemPrompt: string; prompt: string } {
  const systemParts: string[] = [];
  const history: string[] = [];
  let lastUser = "";

  for (const m of messages) {
    if (m.role === "system") {
      systemParts.push(m.content);
    } else if (m.role === "user") {
      lastUser = m.content;
      history.push(`[user] ${m.content}`);
    } else if (m.role === "assistant") {
      history.push(`[assistant] ${m.content}`);
    }
  }

  // The last [user] entry is also the prompt - pop it from history so we don't duplicate.
  if (history.length > 0 && history[history.length - 1]?.startsWith("[user] ")) {
    history.pop();
  }

  const systemPrompt = [
    systemParts.join("\n\n"),
    history.length > 0
      ? "\n\n----- conversation so far -----\n" + history.join("\n")
      : "",
  ].join("").trim();

  return { systemPrompt, prompt: lastUser };
}

/**
 * Parse a single stream-json line into 0+ ProviderChunks. (Unchanged
 * since Phase 2.6 - the transport patch only rearranges what we send,
 * not what we read back.)
 */
function parseLine(
  line: string,
  state: { emittedText: boolean }
): ProviderChunk[] {
  if (!line.trim()) return [];
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(line) as Record<string, unknown>;
  } catch {
    return [];
  }
  const type = parsed.type as string | undefined;
  const out: ProviderChunk[] = [];

  if (type === "stream_event") {
    const ev = parsed.event as Record<string, unknown> | undefined;
    if (ev && ev.type === "content_block_delta") {
      const delta = ev.delta as Record<string, unknown> | undefined;
      if (delta && delta.type === "text_delta" && typeof delta.text === "string") {
        state.emittedText = true;
        out.push({ type: "text", text: delta.text });
      }
    }
    return out;
  }

  if (type === "assistant") {
    if (parsed.error) return out;
    const msg = parsed.message as Record<string, unknown> | undefined;
    const content = msg?.content as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === "text" && typeof block.text === "string" && block.text) {
          state.emittedText = true;
          out.push({ type: "text", text: block.text });
        }
      }
    }
    return out;
  }

  if (type === "result") {
    const isError = parsed.is_error === true;
    const resultText = typeof parsed.result === "string" ? parsed.result : "";

    const usage = parsed.usage as Record<string, unknown> | undefined;
    const modelUsage = parsed.modelUsage as Record<string, unknown> | undefined;
    const usageData: Record<string, unknown> = {
      provider: "claude",
      is_error: isError,
      duration_ms: parsed.duration_ms,
      duration_api_ms: parsed.duration_api_ms,
      num_turns: parsed.num_turns,
      total_cost_usd: parsed.total_cost_usd,
      session_id: parsed.session_id,
      stop_reason: parsed.stop_reason,
      service_tier: usage?.service_tier,
      input_tokens: usage?.input_tokens,
      output_tokens: usage?.output_tokens,
      cache_creation_input_tokens: usage?.cache_creation_input_tokens,
      cache_read_input_tokens: usage?.cache_read_input_tokens,
      modelUsage: modelUsage && Object.keys(modelUsage).length > 0 ? modelUsage : undefined,
    };
    for (const k of Object.keys(usageData)) {
      if (usageData[k] === undefined) delete usageData[k];
    }
    out.push({ type: "usage", data: usageData });

    if (isError) {
      out.push({
        type: "error",
        text: resultText || "claude local runtime returned an error",
      });
    } else if (!state.emittedText && resultText) {
      out.push({ type: "text", text: resultText });
      state.emittedText = true;
    }
    out.push({ type: "done" });
    return out;
  }

  return out;
}

/**
 * Returns an AsyncIterable<ProviderChunk> backed by a `claude` child process.
 * Never throws - every error condition surfaces as `{type:"error"}` followed
 * by a single trailing `{type:"done"}` so consumers terminate cleanly.
 */
export async function* callLocalClaudeCli(opts: CallClaudeOptions): AsyncIterable<ProviderChunk> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const firstChunkMs = opts.firstChunkTimeoutMs ?? DEFAULT_FIRST_CHUNK_MS;
  const { systemPrompt, prompt } = packMessages(opts.messages);

  if (!prompt.trim()) {
    yield { type: "error", text: "claude CLI received an empty user prompt" };
    yield { type: "done" };
    return;
  }

  // ---- Phase 4.4-A: write the (potentially large) system prompt to a temp
  // file and pass --system-prompt-file <path> instead of pushing it onto
  // argv. Keeps argv bounded regardless of transcript length.
  let systemPromptDir: string | null = null;
  let systemPromptPath: string | null = null;
  if (systemPrompt) {
    try {
      systemPromptDir = await mkdtemp(join(os.tmpdir(), "creativedge-cli-"));
      systemPromptPath = join(systemPromptDir, "system.txt");
      await writeFile(systemPromptPath, systemPrompt, "utf-8");
    } catch (err) {
      yield {
        type: "error",
        text:
          "could not stage claude system-prompt temp file: " +
          (err instanceof Error ? err.message : String(err)),
      };
      yield { type: "done" };
      return;
    }
  }

  // Phase 2.5 invocation (now without the heavy --system-prompt <s> arg and
  // without the positional prompt argv - both moved off argv per the Phase
  // 4.4-A reliability patch):
  //
  //   claude -p --output-format stream-json --verbose
  //          --no-session-persistence --disable-slash-commands
  //          --tools "" --setting-sources "" --strict-mcp-config
  //          [--system-prompt-file <tmp>] [--model <m>]
  //
  // User prompt is written to child.stdin (Claude `-p` reads stdin when no
  // positional is supplied, confirmed empirically against 2.1.138).
  const args: string[] = [
    "-p",
    "--output-format", "stream-json",
    "--verbose",
    "--no-session-persistence",
    "--disable-slash-commands",
    "--tools", "",
    "--setting-sources", "",
    "--strict-mcp-config",
  ];
  if (systemPromptPath) args.push("--system-prompt-file", systemPromptPath);
  if (opts.model) args.push("--model", opts.model);

  // Observability: bounded counts only - never prompt or memory content.
  const transportMeta = {
    transport: systemPromptPath ? "stdin+system-prompt-file" : "stdin",
    prompt_chars: prompt.length,
    system_chars: systemPrompt.length,
    argv_chars: args.reduce((s, a) => s + (typeof a === "string" ? a.length : 0), 0),
  };

  async function cleanupTempFiles(): Promise<void> {
    if (systemPromptDir) {
      try {
        await rm(systemPromptDir, { recursive: true, force: true });
      } catch {
        /* ignore - temp cleanup is best-effort */
      }
      systemPromptDir = null;
      systemPromptPath = null;
    }
  }

  let child: ChildProcess;
  try {
    child = spawn("claude", args, {
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });
  } catch (err) {
    await cleanupTempFiles();
    yield {
      type: "error",
      text:
        "could not spawn `claude`: " +
        (err instanceof Error ? err.message : String(err)),
    };
    yield { type: "done" };
    return;
  }

  const state = { emittedText: false };
  const queue: ProviderChunk[] = [];
  let queueResolve: (() => void) | null = null;
  const wake = () => {
    if (queueResolve) {
      const r = queueResolve;
      queueResolve = null;
      r();
    }
  };

  let processClosed = false;
  let stderrTail = "";
  let stdoutBuffer = "";
  let killed = false;

  const hardTimer = setTimeout(() => {
    killed = true;
    queue.push({
      type: "error",
      text: `claude CLI hard turn timeout after ${timeoutMs}ms (raise providers.claude.turnTimeoutMs in ~/.creativedge/providers.json if real generations exceed this)`,
    });
    try { child.kill("SIGKILL"); } catch { /* noop */ }
    wake();
  }, timeoutMs);

  const firstTimer = setTimeout(() => {
    if (!state.emittedText && queue.findIndex((q) => q.type === "text") < 0) {
      killed = true;
      queue.push({
        type: "error",
        text: `claude CLI produced no assistant text within ${firstChunkMs}ms (the model may need more time; raise providers.claude.firstChunkTimeoutMs in ~/.creativedge/providers.json)`,
      });
      try { child.kill("SIGKILL"); } catch { /* noop */ }
      wake();
    }
  }, firstChunkMs);

  // Phase 4.4-A: write the user prompt to child.stdin and close it. Stdin
  // is bounded only by OS pipe buffer size (much larger than argv limit).
  // EPIPE / write errors are caught and surfaced as a transport error.
  child.stdin?.on("error", (err: NodeJS.ErrnoException) => {
    queue.push({
      type: "error",
      text: "claude stdin write error: " + (err.code || err.message),
    });
    wake();
  });
  try {
    child.stdin?.write(prompt, "utf-8");
    child.stdin?.end();
  } catch (err) {
    queue.push({
      type: "error",
      text:
        "could not write prompt to claude stdin: " +
        (err instanceof Error ? err.message : String(err)),
    });
    wake();
  }

  child.stdout?.setEncoding("utf-8");
  child.stdout?.on("data", (chunk: string) => {
    stdoutBuffer += chunk;
    let idx: number;
    while ((idx = stdoutBuffer.indexOf("\n")) >= 0) {
      const line = stdoutBuffer.slice(0, idx);
      stdoutBuffer = stdoutBuffer.slice(idx + 1);
      for (const ev of parseLine(line, state)) {
        // Phase 4.4-A: enrich the usage chunk with bounded transport
        // metrics so chat.ts can persist them on `agent_events.usage_json`.
        // No prompt / memory / transcript content ever leaks.
        if (ev.type === "usage" && ev.data && typeof ev.data === "object") {
          Object.assign(ev.data, transportMeta);
        }
        queue.push(ev);
      }
    }
    wake();
  });

  child.stderr?.setEncoding("utf-8");
  child.stderr?.on("data", (chunk: string) => {
    stderrTail = (stderrTail + chunk).slice(-1000);
  });

  child.on("error", (err) => {
    queue.push({
      type: "error",
      text:
        (err as NodeJS.ErrnoException).code === "ENOENT"
          ? "`claude` binary not found on PATH"
          : "claude spawn error: " + err.message,
    });
    queue.push({ type: "done" });
    processClosed = true;
    wake();
  });

  child.on("close", (code) => {
    if (stdoutBuffer.trim().length > 0) {
      for (const ev of parseLine(stdoutBuffer, state)) {
        if (ev.type === "usage" && ev.data && typeof ev.data === "object") {
          Object.assign(ev.data, transportMeta);
        }
        queue.push(ev);
      }
      stdoutBuffer = "";
    }
    if (killed) {
      queue.push({ type: "done" });
    } else if (code !== 0) {
      const hasDone = queue.some((q) => q.type === "done");
      if (!hasDone) {
        queue.push({
          type: "error",
          text: `claude CLI exited with code ${code}: ${stderrTail.slice(0, 400)}`,
        });
        queue.push({ type: "done" });
      }
    } else {
      const hasDone = queue.some((q) => q.type === "done");
      if (!hasDone) queue.push({ type: "done" });
    }
    processClosed = true;
    clearTimeout(hardTimer);
    clearTimeout(firstTimer);
    // Best-effort temp-file cleanup. Claude has already read the file by
    // the time we get here. Errors are swallowed by cleanupTempFiles.
    void cleanupTempFiles();
    wake();
  });

  try {
    while (true) {
      if (queue.length === 0) {
        if (processClosed) break;
        await new Promise<void>((res) => { queueResolve = res; });
        continue;
      }
      const next = queue.shift()!;
      yield next;
      if (next.type === "done") break;
    }
  } finally {
    clearTimeout(hardTimer);
    clearTimeout(firstTimer);
    if (!processClosed) {
      try { child.kill("SIGTERM"); } catch { /* noop */ }
    }
    // Defensive cleanup in case `close` didn't fire (e.g. consumer aborted
    // mid-stream). Safe to call twice - the helper clears its own state.
    await cleanupTempFiles();
  }
}


// ---------------------------------------------------------------------------
// Phase 2.6 - Retry wrapper (unchanged)
// ---------------------------------------------------------------------------

const RETRY_BACKOFF_MS = 600;
const MAX_ATTEMPTS = 2;

export function isTransientErrorText(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("not logged in")) return false;
  if (t.includes("authentication_failed")) return false;
  if (t.includes("binary not found")) return false;
  if (t.includes("hard turn timeout")) return false;
  if (t.includes("no assistant text within")) return false;
  if (t.includes("empty user prompt")) return false;
  if (t.includes("unimplemented in phase")) return false;
  if (t.includes("intentionally not wired")) return false;

  if (t.includes("epipe")) return true;
  if (t.includes("econnreset")) return true;
  if (t.includes("etimedout")) return true;
  if (t.includes("killed")) return true;
  if (t.includes("signal sig")) return true;
  if (t.includes("rate_limit")) return true;
  if (t.includes("rate limit")) return true;
  if (t.includes("overloaded")) return true;
  if (t.includes("503")) return true;
  if (t.includes("temporarily")) return true;
  if (t.includes("exited with code")) return true;

  return false;
}

export interface RetryHook {
  (info: { attempt: number; reason: string; backoffMs: number }): void;
}

export async function* callLocalClaudeCliWithRetry(
  opts: CallClaudeOptions & { onRetry?: RetryHook }
): AsyncIterable<ProviderChunk> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const buffer: ProviderChunk[] = [];
    let hadText = false;
    let errorText: string | null = null;

    for await (const ch of callLocalClaudeCli(opts)) {
      if (ch.type === "text") {
        if (!hadText) {
          hadText = true;
          for (const b of buffer) yield b;
          buffer.length = 0;
        }
        yield ch;
      } else if (ch.type === "error") {
        if (hadText) {
          yield ch;
        } else {
          errorText = ch.text ?? "";
          buffer.push(ch);
        }
      } else if (ch.type === "done") {
        if (hadText) yield ch;
        else buffer.push(ch);
      } else {
        if (hadText) yield ch;
        else buffer.push(ch);
      }
    }

    if (hadText) return;

    if (attempt < MAX_ATTEMPTS && errorText && isTransientErrorText(errorText)) {
      opts.onRetry?.({
        attempt,
        reason: errorText.slice(0, 200),
        backoffMs: RETRY_BACKOFF_MS,
      });
      await new Promise<void>((res) => setTimeout(res, RETRY_BACKOFF_MS));
      continue;
    }

    for (const b of buffer) yield b;
    return;
  }
}
