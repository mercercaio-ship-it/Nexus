import { spawn } from "node:child_process";

/**
 * Local Claude runtime readiness probe.
 *
 * Phase 2.2 rules:
 *   - No Anthropic API call.
 *   - No API key read.
 *   - No .env.
 *   - No interactive prompt.
 *   - No model probe just to test readiness.
 *
 * What we DO:
 *   - Try `claude --version` with a hard timeout.
 *   - If the binary is on PATH and exits cleanly, mark `installed: true`.
 *   - We still do not claim `ready: true`, because authentication state can
 *     only be confirmed by an interactive login flow or a model call - both
 *     of which are out of scope.
 *
 * Test hooks (env, both off by default):
 *   CREATIVEDGE_FORCE_CLAUDE_RUNTIME=absent  -> simulate "binary not on PATH"
 *   CREATIVEDGE_FORCE_CLAUDE_RUNTIME=present -> simulate "binary present, auth unknown"
 */
export interface LocalRuntimeStatus {
  ready: boolean;
  installed: boolean;
  authStatus: "unknown" | "authenticated" | "unauthenticated";
  mode: "local-claude-code-runtime";
  version: string | null;
  binaryPath: string | null;
  setupRequired: boolean;
  setupHint: string;
  reason: string;
  durationMs: number;
}

const DEFAULT_TIMEOUT_MS = 2500;
const SETUP_HINT =
  "Claude local runtime is not ready. Open Claude Code and log in first.";

function finalize(
  start: number,
  partial: Omit<LocalRuntimeStatus, "mode" | "setupHint" | "durationMs">
): LocalRuntimeStatus {
  return {
    ...partial,
    mode: "local-claude-code-runtime",
    setupHint: SETUP_HINT,
    durationMs: Date.now() - start,
  };
}

export async function probeLocalClaudeRuntime(
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<LocalRuntimeStatus> {
  const start = Date.now();
  const override = process.env.CREATIVEDGE_FORCE_CLAUDE_RUNTIME;
  if (override === "absent") {
    return finalize(start, {
      ready: false,
      installed: false,
      authStatus: "unknown",
      version: null,
      binaryPath: null,
      setupRequired: true,
      reason: "forced absent via CREATIVEDGE_FORCE_CLAUDE_RUNTIME=absent",
    });
  }
  if (override === "present") {
    return finalize(start, {
      ready: false,
      installed: true,
      authStatus: "unknown",
      version: "simulated",
      binaryPath: "claude",
      setupRequired: true,
      reason: "forced present via CREATIVEDGE_FORCE_CLAUDE_RUNTIME=present; auth not verified",
    });
  }

  return new Promise<LocalRuntimeStatus>((resolve) => {
    let settled = false;
    let stdout = "";
    let stderr = "";

    const done = (
      partial: Omit<LocalRuntimeStatus, "mode" | "setupHint" | "durationMs">
    ) => {
      if (settled) return;
      settled = true;
      resolve(finalize(start, partial));
    };

    let child;
    try {
      child = spawn("claude", ["--version"], {
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (err) {
      return done({
        ready: false,
        installed: false,
        authStatus: "unknown",
        version: null,
        binaryPath: null,
        setupRequired: true,
        reason:
          "could not spawn `claude`: " +
          (err instanceof Error ? err.message : String(err)),
      });
    }

    const t = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch { /* noop */ }
      done({
        ready: false,
        installed: false,
        authStatus: "unknown",
        version: null,
        binaryPath: null,
        setupRequired: true,
        reason: `\`claude --version\` timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    child.stdout?.on("data", (c) => { stdout += c.toString(); });
    child.stderr?.on("data", (c) => { stderr += c.toString(); });

    child.on("error", (err) => {
      clearTimeout(t);
      const notFound =
        (err as NodeJS.ErrnoException).code === "ENOENT" ||
        /not found/i.test(err.message);
      done({
        ready: false,
        installed: false,
        authStatus: "unknown",
        version: null,
        binaryPath: null,
        setupRequired: true,
        reason: notFound
          ? "`claude` binary not found on PATH. Install Claude Code and log in."
          : "spawn error: " + err.message,
      });
    });

    child.on("close", (code) => {
      clearTimeout(t);
      if (code === 0) {
        const version = (stdout.trim() || stderr.trim()) || null;
        done({
          ready: false, // we still don't know if auth is valid
          installed: true,
          authStatus: "unknown",
          version,
          binaryPath: "claude",
          setupRequired: true,
          reason:
            "Claude binary detected, but authenticated runtime cannot be verified non-interactively.",
        });
      } else {
        done({
          ready: false,
          installed: false,
          authStatus: "unknown",
          version: null,
          binaryPath: null,
          setupRequired: true,
          reason: `\`claude --version\` exited with code ${code}. stderr: ${stderr.slice(0, 200)}`,
        });
      }
    });
  });
}
