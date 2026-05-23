// CreativEdge Phase 9-B / 9-D-C3 — Electron main process.
//
// Architecture (dev + packaged):
//   1. PORT ALLOCATION (Phase 9-D-C3): allocate a free loopback TCP
//      port for the backend by binding a temporary `net.createServer`
//      to `127.0.0.1:0`, reading the assigned port, and closing the
//      probe. There is a small race between probe-close and child-spawn;
//      on EADDRINUSE we retry the allocate+spawn cycle once before
//      giving up. The Phase 9-B fixed-port preflight (`probePortTcp`
//      on 3001) is no longer needed — dynamic allocation makes
//      port-busy diagnostics moot.
//   2. Spawn the existing compiled Fastify backend as a child process
//      (`backend-api/dist/index.js`) with `CREATIVEDGE_PORT=<dynamic>`
//      and `CREATIVEDGE_HOST=127.0.0.1` in its env. The backend's
//      Phase 2.1 entry point already honours both env vars.
//   3. Redirect backend stdout/stderr to a log file under
//      `~/.creativedge/logs/electron-backend-<ts>.log`. Important:
//      forwarding the child's stdout to Electron main's process.stdout
//      crashes the backend with EPIPE on Windows GUI mode (pino's
//      default destination calls process.exit(1) on write failure).
//      Logging to a file decouples the lifecycles cleanly.
//   4. Start a tiny localhost HTTP server (Node stdlib only) that
//      serves the existing Vite-built frontend bundle from
//      `frontend/dist/` by calling `listen(0, "127.0.0.1")` and
//      reading `server.address().port` for the actual assigned port.
//      Loading the bundle via http rather than file:// avoids the
//      `Origin: null` CORS rejection the backend's Phase 2.1
//      allow-list would otherwise emit.
//   5. Wait for the backend's `/healthz` to return 200 (max 30s) at
//      the actual dynamic backend URL.
//   6. Open a hardened BrowserWindow with the dynamic backend +
//      frontend URLs pushed in via `webPreferences.additionalArguments`
//      so the preload script can expose them through
//      `window.ceBridge.getRuntimeConfig()`. The renderer's API
//      client (`frontend/src/api/client.ts`) reads this at module
//      init and falls back to `import.meta.env.VITE_API_URL` for
//      legacy browser-dev usage.
//   7. CRASH HANDLING: if the backend child exits unexpectedly AFTER
//      the window is showing, do NOT immediately quit — load a
//      diagnostic page so the user can read what happened and inspect
//      the log file. The user closes the window to quit.
//   8. On `before-quit` / window close, terminate the backend child
//      and close the static server cleanly.
//
// Security baseline (hardening):
//   - contextIsolation: true
//   - nodeIntegration: false
//   - sandbox: true (Electron 20+ default; set explicitly for clarity)
//   - webSecurity: true (default; not relaxed)
//   - no preload script (renderer needs only standard browser fetch;
//     no Electron-specific API surface required for Phase 9-B)
//   - window.open denied (no new windows; no popups)
//   - will-navigate restricted to 127.0.0.1 origins
//   - backend bound to 127.0.0.1 only (no LAN exposure)
//   - no remote module (deprecated, never enabled)
//   - never writes .env, never prompts for / stores any API key,
//     never calls any provider or external endpoint directly
//
// Dev vs packaged paths:
//   - Dev: backend dist + frontend dist live at `../backend-api/dist`
//     and `../frontend/dist` relative to this file.
//   - Packaged: same files are copied to `process.resourcesPath`
//     by electron-builder per the `extraResources` config; we set
//     `CREATIVEDGE_PROJECT_ROOT` to the resources path so the backend
//     finds agents/ and orchestrator/ inside the bundle.
//
// Privacy contract: this process only logs operational lifecycle
// events (PIDs, ports, healthz status, exit codes, log paths). It
// never logs memory content, chat content, or user messages. Backend
// stdout/stderr go to a log file; pino's redaction config still
// applies inside that file.

import { app, BrowserWindow, ipcMain, shell } from "electron";
import { spawn } from "node:child_process";
import { createServer as createHttpServer } from "node:http";
import { createServer as createNetServer } from "node:net";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir, platform as osPlatform, arch as osArch, release as osRelease } from "node:os";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BACKEND_HOST = "127.0.0.1";
const FRONTEND_HOST = "127.0.0.1";
const HEALTHZ_TIMEOUT_MS = 30_000;
const HEALTHZ_POLL_MS = 500;
const APP_SERVICE_NAME = "creativedge-backend";

// Phase 9-D-C3 - dynamic free-port allocation
//
// We allocate the backend port via a temporary `net.createServer.listen(0)`
// probe, then spawn the backend with that exact port (race window mitigated
// by the EADDRINUSE single retry below). The static server uses `listen(0)`
// directly and reads `server.address().port`, so there's no race on the
// frontend side. Both ports are bound to 127.0.0.1 only - never 0.0.0.0,
// never a LAN-routable interface.
const PORT_ALLOC_HOST = "127.0.0.1";
const SPAWN_RETRY_LIMIT = 1;

// ---------------------------------------------------------------------------
// Phase 9-D-B4 - External URL allow-list + IPC channel name
// ---------------------------------------------------------------------------
//
// The renderer can ask the main process to open an HTTPS URL in the
// user's default browser via `shell.openExternal()`. To prevent the
// renderer (or a compromised CSS/JS pipeline) from forwarding a hostile
// URL through that bridge, every URL is filtered against this
// allow-list of {protocol, host, path-prefix} triples before we hand
// it to `shell.openExternal`. The list is intentionally tiny - today
// it covers only the GitHub Releases page that the Ops console's
// "Open releases page" button targets. Any new external destination
// must be added here AND in `frontend/src/config/release.ts` so the
// frontend's friendly hints stay accurate.

const EXTERNAL_OPEN_IPC_CHANNEL = "ce:openExternal";

/**
 * Each entry must satisfy: parsed URL has `protocol === "https:"`,
 * `host === entry.host`, and `pathname.startsWith(entry.pathPrefix)`.
 * Path prefixes intentionally cover the directory (so e.g.
 * `/CreativEdgeSolutions/Nexus/releases/tag/v0.1.0` is allowed) but the
 * filter is still anchored to the repo path so unrelated GitHub URLs
 * cannot ride through this bridge.
 */
const EXTERNAL_URL_ALLOWLIST = [
  {
    label: "github-releases",
    host: "github.com",
    pathPrefix: "/CreativEdgeSolutions/Nexus/releases",
  },
];

/**
 * Returns `null` if the URL is allowed; otherwise a short reason
 * string for the log line. Never throws. Conservative-by-default: any
 * parse failure / non-HTTPS / unknown host / wrong path is rejected.
 */
function classifyExternalUrl(url) {
  if (typeof url !== "string" || url.length === 0) return "empty";
  let u;
  try {
    u = new URL(url);
  } catch {
    return "unparseable";
  }
  if (u.protocol !== "https:") return `non-https-protocol(${u.protocol})`;
  for (const entry of EXTERNAL_URL_ALLOWLIST) {
    if (u.host === entry.host && u.pathname.startsWith(entry.pathPrefix)) {
      return null;
    }
  }
  return "not-on-allowlist";
}

// ---------------------------------------------------------------------------
// Path resolution: dev vs packaged
// ---------------------------------------------------------------------------

function resolvePaths() {
  if (app.isPackaged) {
    const rsrc = process.resourcesPath;
    return {
      backendEntry: join(rsrc, "backend-api", "dist", "index.js"),
      frontendDist: join(rsrc, "frontend", "dist"),
      projectRoot: rsrc,
    };
  }
  const repoRoot = resolve(HERE, "..");
  return {
    backendEntry: join(repoRoot, "backend-api", "dist", "index.js"),
    frontendDist: join(repoRoot, "frontend", "dist"),
    projectRoot: undefined,
  };
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let backendChild = null;
let backendChildPid = null;
let backendLogPath = null;
let backendLogStream = null;
let staticServer = null;
let mainWindow = null;
let shuttingDown = false;
let backendCrashed = false;
let latestCrashLogPath = null;
let resolvedBackendEntry = null;
let resolvedFrontendDist = null;
// Phase 9-D-C3 - actual dynamically-allocated ports + URLs (filled in by
// boot()). NULL until allocation succeeds. Used by writeCrashLog,
// waitForHealthz, the will-navigate allowlist, and the renderer-side
// runtime config bridge.
let resolvedBackendPort = null;
let resolvedFrontendPort = null;
let resolvedBackendBaseUrl = null;
let resolvedFrontendBaseUrl = null;

function logMain(...args) {
  // eslint-disable-next-line no-console
  console.log("[electron-main]", ...args);
}

// ---------------------------------------------------------------------------
// Dynamic free-port allocation (Phase 9-D-C3)
// ---------------------------------------------------------------------------
//
// Bind a temporary net.createServer to 127.0.0.1:0, ask the kernel for an
// assigned port, then close the probe. There is a small race between the
// probe close and the backend child's actual bind; if that race trips we
// retry the alloc+spawn cycle once (see SPAWN_RETRY_LIMIT). The kernel
// rarely re-hands-out the same ephemeral port immediately, so this
// retry strategy is sufficient in practice.

function allocateFreePort(host = PORT_ALLOC_HOST) {
  return new Promise((res, rej) => {
    const probe = createNetServer();
    let done = false;
    const finish = (err, port) => {
      if (done) return;
      done = true;
      try { probe.close(); } catch { /* noop */ }
      if (err) rej(err);
      else res(port);
    };
    probe.once("error", (err) => finish(err));
    probe.listen({ host, port: 0, exclusive: true }, () => {
      const addr = probe.address();
      if (addr && typeof addr === "object" && typeof addr.port === "number") {
        finish(null, addr.port);
      } else {
        finish(new Error(`allocateFreePort: unexpected address shape ${JSON.stringify(addr)}`));
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Backend log stream (file in ~/.creativedge/logs/)
// ---------------------------------------------------------------------------

async function openBackendLogStream() {
  const logsDir = join(homedir(), ".creativedge", "logs");
  await mkdir(logsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = join(logsDir, `electron-backend-${stamp}.log`);
  const stream = createWriteStream(path, { flags: "a", encoding: "utf8" });
  stream.on("error", (e) => logMain(`backend log stream error: ${e?.message || e}`));
  // Header line so each session is easy to find inside a rolled log dir.
  stream.write(
    `\n=== CreativEdge electron-backend log opened ${new Date().toISOString()} ===\n`
  );
  return { path, stream };
}

// ---------------------------------------------------------------------------
// Crash log writer (Phase 9-D-A)
// ---------------------------------------------------------------------------
//
// On unexpected backend child exit, write a single JSON record to
// `~/.creativedge/logs/crash-<ts>.log` so the user (and any future
// "report this" UX) has a stable, reviewable record. STRICT allowlist:
// timestamp, app version, platform/arch/OS release, packaged/dev mode,
// backend entry path, frontend dist path, exit code/signal, expected
// flag, backend log path, and the last ~80 lines of the
// electron-backend-<ts>.log file (tail of stdout/stderr the user can
// already read on disk). NEVER includes chat content, memory content,
// prompts, env vars, auth tokens, or API keys — we only read the file
// the backend itself already wrote, which is already pino-redacted on
// the producing side.
//
// This is a LOCAL file. Nothing is sent anywhere. The crash log path is
// surfaced in the diagnostic page and in the new /ops/diagnostics
// route's response so the user can locate it from the chat UI.

const CRASH_TAIL_BYTES = 16 * 1024; // last ~16KB of the backend log
const CRASH_TAIL_MAX_LINES = 120;   // hard cap regardless of byte budget

async function readBackendLogTail(logPath) {
  if (!logPath) return null;
  try {
    const buf = await readFile(logPath);
    const slice = buf.length > CRASH_TAIL_BYTES
      ? buf.subarray(buf.length - CRASH_TAIL_BYTES)
      : buf;
    let text = slice.toString("utf8");
    // If we sliced mid-line, drop the first partial line so the tail
    // starts on a real line boundary.
    if (buf.length > CRASH_TAIL_BYTES) {
      const nl = text.indexOf("\n");
      if (nl >= 0) text = text.slice(nl + 1);
    }
    const lines = text.split(/\r?\n/);
    return lines.slice(-CRASH_TAIL_MAX_LINES);
  } catch (e) {
    logMain(`crash log: backend log tail read failed: ${e?.message || e}`);
    return null;
  }
}

async function writeCrashLog({ code, signal, expected }) {
  try {
    const logsDir = join(homedir(), ".creativedge", "logs");
    await mkdir(logsDir, { recursive: true });
    const ts = new Date().toISOString();
    const stamp = ts.replace(/[:.]/g, "-");
    const crashPath = join(logsDir, `crash-${stamp}.log`);

    const tail = await readBackendLogTail(backendLogPath);

    const record = {
      kind: "creativedge-backend-crash",
      schemaVersion: 1,
      timestamp: ts,
      appVersion: app.getVersion?.() ?? null,
      electronVersion: process.versions?.electron ?? null,
      nodeVersion: process.versions?.node ?? null,
      packaged: app.isPackaged === true,
      platform: osPlatform(),
      arch: osArch(),
      osRelease: osRelease(),
      backendEntry: resolvedBackendEntry,
      frontendDist: resolvedFrontendDist,
      backendPort: resolvedBackendPort,
      frontendPort: resolvedFrontendPort,
      backendChildPid,
      exit: {
        code: code ?? null,
        signal: signal ?? null,
        expected: expected === true,
      },
      backendLogPath,
      backendLogTail: tail,
    };

    const body = JSON.stringify(record, null, 2) + "\n";
    await writeFile(crashPath, body, { encoding: "utf8" });
    latestCrashLogPath = crashPath;
    logMain(`crash log written: ${crashPath}`);
    return crashPath;
  } catch (e) {
    logMain(`crash log: write failed: ${e?.message || e}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Backend child lifecycle
// ---------------------------------------------------------------------------

function spawnBackend({ backendEntry, projectRoot }, logStream, backendPort) {
  const env = {
    ...process.env,
    CREATIVEDGE_PORT: String(backendPort),
    CREATIVEDGE_HOST: BACKEND_HOST,
  };
  if (projectRoot) env.CREATIVEDGE_PROJECT_ROOT = projectRoot;

  let bin;
  let args;
  if (app.isPackaged) {
    bin = process.execPath;
    args = [backendEntry];
    env.ELECTRON_RUN_AS_NODE = "1";
  } else {
    bin = process.platform === "win32" ? "node.exe" : "node";
    args = [backendEntry];
  }

  logMain(`spawning backend: ${bin} ${args.join(" ")}`);
  const child = spawn(bin, args, {
    env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  backendChildPid = child.pid ?? null;
  logMain(`backend child pid=${backendChildPid}`);

  // Pipe child stdout/stderr to the log FILE, NOT to electron main's
  // process.stdout. On Windows GUI mode Electron's stdout is effectively
  // a closed pipe and writes from pino's SonicBoom destination throw
  // EPIPE → backend process.exit(1). Writing to a file is reliable.
  child.stdout.on("error", (e) => logMain(`backend stdout error: ${e?.message || e}`));
  child.stderr.on("error", (e) => logMain(`backend stderr error: ${e?.message || e}`));
  child.stdout.pipe(logStream, { end: false });
  child.stderr.pipe(logStream, { end: false });

  child.on("exit", (code, signal) => {
    const expected = shuttingDown;
    logMain(
      `backend child exited code=${code} signal=${signal} expected=${expected} pid=${backendChildPid}`
    );
    if (expected) return; // user-initiated quit; nothing to surface
    backendCrashed = true;
    // Phase 9-D-A — fire and forget; if the crash-log writer itself
    // fails, the diagnostic page still loads with a graceful fallback
    // ("crash log path unavailable"). We do NOT block on this write to
    // keep the diagnostic page snappy.
    void writeCrashLog({ code, signal, expected }).then((crashPath) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        void showDiagnosticPage("backendCrashed", {
          code,
          signal,
          logPath: backendLogPath,
          crashPath,
        });
      }
    });
    // Show the diagnostic page immediately (without crashPath) so the
    // user isn't staring at the chat UI while the crash log writes.
    if (mainWindow && !mainWindow.isDestroyed()) {
      logMain("backend exited unexpectedly; showing diagnostic page (window stays open)");
      void showDiagnosticPage("backendCrashed", { code, signal, logPath: backendLogPath });
    } else {
      logMain("backend exited unexpectedly with no window; quitting app");
      app.quit();
    }
  });

  child.on("error", (err) => {
    logMain(`backend spawn error: ${err?.message || err}`);
  });

  return child;
}

async function waitForHealthz(backendBaseUrl) {
  const url = `${backendBaseUrl}/healthz`;
  const startedAt = Date.now();
  while (Date.now() - startedAt < HEALTHZ_TIMEOUT_MS) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const ms = Date.now() - startedAt;
        // Sanity-check the service identifier matches CreativEdge. This is
        // defence-in-depth: we just spawned this backend ourselves with a
        // dynamic port, but if a rogue listener happened to win the port
        // alloc race we want to know immediately, not after the user
        // starts chatting.
        let serviceOk = true;
        try {
          const body = await r.json();
          if (body && typeof body.service === "string" && body.service !== APP_SERVICE_NAME) {
            serviceOk = false;
            logMain(`/healthz at ${url} returned service=${body.service} (expected ${APP_SERVICE_NAME})`);
          }
        } catch { /* body not JSON; trust the 200 anyway */ }
        if (serviceOk) {
          logMain(`backend /healthz OK at ${url} after ${ms}ms`);
          return true;
        }
      }
    } catch {
      /* not yet ready; back off */
    }
    await new Promise((res) => setTimeout(res, HEALTHZ_POLL_MS));
  }
  throw new Error(`backend /healthz did not respond at ${url} within ${HEALTHZ_TIMEOUT_MS}ms`);
}

// ---------------------------------------------------------------------------
// Tiny localhost HTTP server for the built frontend bundle
// ---------------------------------------------------------------------------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function safeJoin(root, urlPath) {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(cleanPath);
  const target = normalize(join(root, decoded));
  const rootResolved = resolve(root);
  const targetResolved = resolve(target);
  if (!targetResolved.startsWith(rootResolved)) return null;
  return targetResolved;
}

async function startStaticServer(frontendDist) {
  return new Promise((res, rej) => {
    const server = createHttpServer(async (req, response) => {
      try {
        const urlPath = req.url === "/" || !req.url ? "/index.html" : req.url;
        const filePath = safeJoin(frontendDist, urlPath);
        if (!filePath) {
          response.writeHead(403, { "Content-Type": "text/plain" });
          response.end("Forbidden");
          return;
        }
        let resolved = filePath;
        try {
          const st = await stat(resolved);
          if (st.isDirectory()) resolved = join(resolved, "index.html");
        } catch {
          resolved = join(frontendDist, "index.html");
        }
        const body = await readFile(resolved);
        const ext = extname(resolved).toLowerCase();
        const type = MIME[ext] || "application/octet-stream";
        response.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "no-store",
        });
        response.end(body);
      } catch (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end(`server error: ${err?.message || err}`);
      }
    });
    server.on("error", rej);
    // Phase 9-D-C3 - bind to port 0; kernel assigns a free ephemeral
    // port. We read it back via server.address() so the caller knows
    // which URL to load the renderer from.
    server.listen(0, FRONTEND_HOST, () => {
      const addr = server.address();
      const port = addr && typeof addr === "object" ? addr.port : null;
      if (typeof port !== "number") {
        const err = new Error(
          `static server: unexpected address shape ${JSON.stringify(addr)}`
        );
        try { server.close(); } catch { /* noop */ }
        rej(err);
        return;
      }
      logMain(`static server listening on http://${FRONTEND_HOST}:${port}`);
      res({ server, port });
    });
  });
}

// ---------------------------------------------------------------------------
// Diagnostic page (data: URL) — shown for port-busy / healthz-timeout /
// backend-crashed states. Plain HTML, no JS, no external assets.
// ---------------------------------------------------------------------------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function diagnosticHtml(kind, ctx = {}) {
  const css = `
    body { background: #101418; color: #e8ecef; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; line-height: 1.5; }
    h1 { color: #ffb86b; margin: 0 0 16px; font-size: 22px; }
    h2 { color: #cdd6f4; margin: 24px 0 8px; font-size: 16px; }
    p, li { margin: 8px 0; }
    code, pre { background: #1c2128; color: #e8ecef; padding: 2px 6px; border-radius: 4px; font-family: "Cascadia Mono", "Consolas", monospace; font-size: 13px; }
    pre { padding: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
    a { color: #79b8ff; }
    .ok  { color: #a6e3a1; }
    .warn { color: #ffb86b; }
    .err { color: #f38ba8; }
    ul { padding-left: 20px; }
  `;
  let body;
  if (kind === "spawnExhausted") {
    // Phase 9-D-C3 - we tried to allocate a free backend port + spawn the
    // backend child, and EADDRINUSE bit us repeatedly. Extremely rare on
    // a healthy machine; if it does happen, the user should restart the
    // machine or check for runaway processes.
    const { lastErr } = ctx;
    body = `
      <h1>CreativEdge — could not start the backend on a free port</h1>
      <p>The Electron wrapper tried to allocate a free loopback TCP port
      for the backend, but every attempt was raced by another process
      claiming the port before our child could bind. This is unusual
      and usually means something on your system is rapidly cycling
      through ephemeral ports.</p>
      <h2>Detail</h2>
      <pre>${escapeHtml(String(lastErr?.message ?? lastErr ?? "(no error message)"))}</pre>
      <h2>How to recover</h2>
      <ul>
        <li>Close this window and re-run <code>npm run dev:electron</code>.</li>
        <li>If it keeps failing, check for runaway processes that may be
            churning through ephemeral ports
            (<code>Get-Process | Sort-Object -Property CPU -Descending | Select -First 10</code>
            in PowerShell).</li>
      </ul>`;
  } else if (kind === "backendCrashed") {
    const { code, signal, logPath, crashPath } = ctx;
    const crashBlock = crashPath
      ? `<h2>Crash record</h2>
         <p>A structured crash record (Phase 9-D-A) was written to:</p>
         <pre>${escapeHtml(String(crashPath))}</pre>
         <p>That file contains only safe diagnostic data (timestamp, app
         version, platform, exit code/signal, and the tail of the backend
         log). It does NOT contain chat content, memory content, prompts,
         environment variables, or any credentials. Nothing was sent
         anywhere — the file lives on this computer.</p>`
      : `<h2>Crash record</h2>
         <p class="warn">The structured crash record is still being written
         (or failed to write). Use the backend log file above for the raw
         stdout/stderr tail.</p>`;
    body = `
      <h1>CreativEdge — backend process exited</h1>
      <p>The backend child died unexpectedly. The Electron window is staying
      open so you can read this diagnostic; close the window when you're done
      to quit the app.</p>
      <h2>Exit details</h2>
      <ul>
        <li>code: <code>${escapeHtml(String(code ?? "n/a"))}</code></li>
        <li>signal: <code>${escapeHtml(String(signal ?? "n/a"))}</code></li>
      </ul>
      <h2>Log file</h2>
      <p>Backend stdout/stderr were written to:</p>
      <pre>${escapeHtml(String(logPath ?? "(log path unavailable)"))}</pre>
      <p>Open that file to inspect what happened. The most recent lines at the
      bottom should explain the crash.</p>
      ${crashBlock}
      <h2>How to recover</h2>
      <ul>
        <li>Close this window. The app will quit cleanly.</li>
        <li>Fix whatever the log indicates (e.g. SQLite ABI mismatch from a
            prior <code>npm run rebuild:sqlite</code>; restore with
            <code>cd backend-api &amp;&amp; npm rebuild better-sqlite3</code>).</li>
        <li>Re-run <code>npm run dev:electron</code>.</li>
      </ul>`;
  } else if (kind === "healthzTimeout") {
    const { err } = ctx;
    body = `
      <h1>CreativEdge — backend did not respond in time</h1>
      <p>The backend child was spawned but <code>/healthz</code> never returned
      OK within ${Math.round(HEALTHZ_TIMEOUT_MS / 1000)} seconds.</p>
      <h2>Detail</h2>
      <pre>${escapeHtml(String(err?.message ?? err ?? "(no error message)"))}</pre>
      <h2>Log file</h2>
      <p>Backend stdout/stderr were written to:</p>
      <pre>${escapeHtml(String(backendLogPath ?? "(log path unavailable)"))}</pre>
      <p>Inspect the log to see why the backend failed to start.</p>`;
  } else {
    body = `<h1>CreativEdge — unknown diagnostic state</h1><p>kind=${escapeHtml(String(kind))}</p>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CreativEdge — diagnostic</title><style>${css}</style></head><body>${body}</body></html>`;
}

async function showDiagnosticPage(kind, ctx = {}) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow(/* skipLoad */ true);
  }
  const html = diagnosticHtml(kind, ctx);
  const dataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);
  try {
    await mainWindow.loadURL(dataUrl);
  } catch (e) {
    logMain(`failed to load diagnostic page: ${e?.message || e}`);
  }
}

// ---------------------------------------------------------------------------
// BrowserWindow lifecycle
// ---------------------------------------------------------------------------

function createWindow(skipLoad = false) {
  // Phase 9-D-C3 - pass the runtime config (dynamic backend + static URLs +
  // packaged flag) through `webPreferences.additionalArguments` so the
  // preload script can expose them sync via `window.ceBridge.getRuntimeConfig()`.
  // No IPC round trip is needed; the renderer reads these at module init
  // before any fetch.
  const additionalArguments = [];
  if (resolvedBackendBaseUrl) {
    additionalArguments.push(`--creativedge-backend-base=${resolvedBackendBaseUrl}`);
  }
  if (resolvedFrontendBaseUrl) {
    additionalArguments.push(`--creativedge-frontend-base=${resolvedFrontendBaseUrl}`);
  }
  if (app.isPackaged) {
    additionalArguments.push("--creativedge-packaged");
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    backgroundColor: "#101418",
    title: "CreativEdge",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      // Phase 9-D-B4 - minimal preload exposing `window.ceBridge.openExternal`
      // for explicit-intent external links. Phase 9-D-C3 extends the
      // bridge with `getRuntimeConfig()` so the renderer can resolve
      // its API base URL from the dynamic ports allocated in boot().
      // The preload runs inside the sandbox; it only uses
      // `contextBridge` + `ipcRenderer.invoke` and reads process.argv -
      // no Node API leaks to the renderer.
      preload: join(HERE, "preload.cjs"),
      additionalArguments,
    },
  });

  // Phase 9-D-B4 - handle popup requests instead of blanket-denying.
  // The renderer's `window.open(url, "_blank", ...)` triggers this
  // handler synchronously, BEFORE `will-navigate` would fire. Prior
  // to this slice the handler returned `{action:"deny"}` for every
  // URL, which logged `window.open denied for ...` and left the user
  // with a dead button. Now we filter against the same allow-list as
  // the IPC bridge; trusted URLs are forwarded to `shell.openExternal`
  // (and we still return `{action:"deny"}` so no in-app popup spawns);
  // anything else is logged + denied as before.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const reason = classifyExternalUrl(url);
    if (reason === null) {
      logMain(`window.open forwarded to OS browser: ${url}`);
      void shell.openExternal(url).catch((err) => {
        logMain(`shell.openExternal failed for ${url}: ${err?.message || err}`);
      });
      return { action: "deny" };
    }
    logMain(`window.open denied (${reason}) for ${url}`);
    return { action: "deny" };
  });

  // Defence-in-depth: if anything ever triggers an actual navigation
  // (e.g. an `<a href>` click without `target="_blank"`), reject the
  // in-window navigation and forward allow-listed HTTPS URLs to the
  // OS browser. The data: branch keeps the diagnostic page intact.
  mainWindow.webContents.on("will-navigate", (e, url) => {
    // Phase 9-D-C3 - the static-server origin is dynamic. Compare against
    // the actual base URL we recorded at allocation time. data: URLs
    // (diagnostic page) remain allowed.
    const localFrontendPrefix = resolvedFrontendBaseUrl
      ? `${resolvedFrontendBaseUrl}/`
      : null;
    const allowedLocal =
      (localFrontendPrefix !== null && url.startsWith(localFrontendPrefix)) ||
      url === resolvedFrontendBaseUrl ||
      url.startsWith("data:");
    if (allowedLocal) return;
    e.preventDefault();
    const reason = classifyExternalUrl(url);
    if (reason === null) {
      logMain(`will-navigate forwarded to OS browser: ${url}`);
      void shell.openExternal(url).catch((err) => {
        logMain(`shell.openExternal failed for ${url}: ${err?.message || err}`);
      });
    } else {
      logMain(`will-navigate denied (${reason}) for ${url}`);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (!skipLoad) {
    // Phase 9-D-C3 - load the dynamic static-server URL recorded in boot().
    if (!resolvedFrontendBaseUrl) {
      logMain(`createWindow: no resolvedFrontendBaseUrl; cannot load renderer`);
      return;
    }
    mainWindow.loadURL(`${resolvedFrontendBaseUrl}/`);
  }
}

// ---------------------------------------------------------------------------
// App boot sequence
// ---------------------------------------------------------------------------

async function boot() {
  // Phase 9-D-B4 - register the IPC bridge used by the preload script
  // (see electron/preload.cjs + window.ceBridge.openExternal). One
  // single channel, allow-list-filtered, shell.openExternal-only.
  // No file URLs, no installer download, no auth tokens - only HTTPS
  // URLs whose host + path-prefix match `EXTERNAL_URL_ALLOWLIST`.
  ipcMain.handle(EXTERNAL_OPEN_IPC_CHANNEL, async (_evt, rawUrl) => {
    const reason = classifyExternalUrl(rawUrl);
    if (reason !== null) {
      logMain(`ipc openExternal denied (${reason}) for ${String(rawUrl).slice(0, 200)}`);
      return { ok: false, reason: "not-allowed", message: `URL is not on the allow-list (${reason}).` };
    }
    try {
      await shell.openExternal(rawUrl);
      logMain(`ipc openExternal succeeded for ${rawUrl}`);
      return { ok: true };
    } catch (err) {
      const msg = err && err.message ? String(err.message) : String(err);
      logMain(`ipc openExternal failed for ${rawUrl}: ${msg}`);
      return { ok: false, reason: "open-failed", message: msg };
    }
  });

  const paths = resolvePaths();
  resolvedBackendEntry = paths.backendEntry;
  resolvedFrontendDist = paths.frontendDist;
  logMain(`backendEntry=${paths.backendEntry}`);
  logMain(`frontendDist=${paths.frontendDist}`);

  // Phase 9-D-C3 - start the static server on a dynamic port FIRST. No
  // race window here because it's our own server; whatever port the
  // kernel hands us is the port we serve from.
  try {
    const started = await startStaticServer(paths.frontendDist);
    staticServer = started.server;
    resolvedFrontendPort = started.port;
    resolvedFrontendBaseUrl = `http://${FRONTEND_HOST}:${resolvedFrontendPort}`;
    logMain(`static server: ${resolvedFrontendBaseUrl}`);
  } catch (err) {
    logMain(`fatal: static server failed to start: ${err?.message || err}`);
    app.quit();
    return;
  }

  // Open log stream BEFORE spawn so the first log lines are captured.
  try {
    const logged = await openBackendLogStream();
    backendLogPath = logged.path;
    backendLogStream = logged.stream;
    logMain(`backend logs -> ${backendLogPath}`);
  } catch (err) {
    logMain(`fatal: cannot open backend log stream: ${err?.message || err}`);
    app.quit();
    return;
  }

  // Phase 9-D-C3 - allocate a free backend port, spawn the backend, wait
  // for /healthz. If an EADDRINUSE race trips during spawn, retry the
  // alloc+spawn+healthz cycle once before surfacing a diagnostic page.
  let attempt = 0;
  let lastErr = null;
  while (attempt <= SPAWN_RETRY_LIMIT) {
    attempt += 1;
    let candidatePort;
    try {
      candidatePort = await allocateFreePort(BACKEND_HOST);
    } catch (err) {
      lastErr = err;
      logMain(`port allocation attempt ${attempt} failed: ${err?.message || err}`);
      continue;
    }
    logMain(`port allocation attempt ${attempt}: assigned 127.0.0.1:${candidatePort}`);
    resolvedBackendPort = candidatePort;
    resolvedBackendBaseUrl = `http://${BACKEND_HOST}:${candidatePort}`;
    backendChild = spawnBackend(paths, backendLogStream, candidatePort);
    try {
      await waitForHealthz(resolvedBackendBaseUrl);
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      logMain(`backend healthz failed on attempt ${attempt}: ${err?.message || err}`);
      // Best-effort: kill the failed child before retrying so it isn't
      // left holding the port mid-bind.
      try {
        if (backendChild && !backendChild.killed) backendChild.kill();
      } catch { /* noop */ }
      backendChild = null;
      backendChildPid = null;
    }
  }

  if (lastErr) {
    await app.whenReady().catch(() => {});
    // Distinguish "we kept losing the alloc race" from "the backend
    // started but never answered /healthz" by inspecting whether we
    // actually got a backend port. Both surface a friendly page;
    // neither leaks any user content.
    if (resolvedBackendPort === null) {
      await showDiagnosticPage("spawnExhausted", { lastErr });
    } else {
      await showDiagnosticPage("healthzTimeout", { err: lastErr });
    }
    return;
  }

  logMain(
    `boot ready: backend=${resolvedBackendBaseUrl} static=${resolvedFrontendBaseUrl}`
  );
  createWindow();
}

app.whenReady().then(boot).catch((err) => {
  logMain(`boot failed: ${err?.stack || err}`);
  app.quit();
});

app.on("window-all-closed", () => {
  // On Windows + Linux quit when all windows are closed. macOS keeps
  // the app alive in the dock — but we deliberately quit anywhere for
  // Phase 9-B foundation (no dock UX, no menu bar refinement).
  app.quit();
});

app.on("before-quit", () => {
  shuttingDown = true;
  if (backendChild && !backendChild.killed && !backendCrashed) {
    logMain("terminating backend child");
    try { backendChild.kill(); } catch (e) { logMain(`backend kill error: ${e?.message || e}`); }
  }
  if (staticServer) {
    logMain("closing static server");
    try { staticServer.close(); } catch (e) { logMain(`static server close error: ${e?.message || e}`); }
  }
  if (backendLogStream) {
    try { backendLogStream.end(); } catch { /* noop */ }
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0 && !shuttingDown) {
    createWindow();
  }
});
