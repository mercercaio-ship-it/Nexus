// CreativEdge Phase 9-D-B4 — Electron preload bridge.
//
// Exposes a small, typed surface on `window.ceBridge` for the renderer to
// request safe operations that require main-process privileges. Today the
// only surface is `openExternal(url)` — a request to open an HTTPS URL in
// the user's default OS browser via `shell.openExternal()`.
//
// Why a preload bridge instead of `window.open(...)`?
// ---------------------------------------------------
// Phase 9-B locked the renderer down with `nodeIntegration:false` +
// `sandbox:true` + `contextIsolation:true` + a `setWindowOpenHandler`
// that unconditionally denies all popups. That hardening was correct,
// but it also broke the renderer's `window.open(RELEASES_URL, "_blank")`
// path — the deny handler fires synchronously and rejects the URL
// before `will-navigate` (the fallback that calls `shell.openExternal`)
// ever sees it. The Phase 9-D-B3 walkthrough surfaced exactly that as
// `window.open denied for https://github.com/michelbr84/CreativEdge/releases`.
//
// This preload bridge fixes the bug in the most security-conservative
// way: instead of relaxing the deny handler, expose an explicit IPC
// channel the renderer can call. The renderer never gains direct
// Node/Electron access; it can only send a tagged URL request, which
// the main process validates against a hard allow-list before calling
// `shell.openExternal()`.
//
// Security contract (all enforced by code):
//   - Only HTTPS URLs are passed.
//   - Only URLs matching the main-process allow-list are opened.
//   - No file:// URLs. No javascript: URLs. No data: URLs.
//   - No installer downloads. No auth tokens. No telemetry.
//   - No node integration leaks to the renderer.
//   - `contextBridge.exposeInMainWorld` ensures the renderer-side
//     object is a frozen proxy — the renderer cannot mutate or replace
//     the bridge functions.

const { contextBridge, ipcRenderer } = require("electron");

/** Tag the IPC channel with a CreativEdge prefix so future bridges
 *  (if any) don't collide with anything Electron ships by default. */
const CHANNEL_OPEN_EXTERNAL = "ce:openExternal";

// ---------------------------------------------------------------------------
// Phase 9-D-C3 - runtime config bridge
// ---------------------------------------------------------------------------
//
// Electron main allocates the backend port and the static-server port at
// startup (free-port allocation via net.createServer.listen(0)), then passes
// the resulting absolute base URLs to the renderer via
// `webPreferences.additionalArguments`. Reading them here keeps the bridge
// synchronous and side-effect-free; the renderer can call
// `window.ceBridge.getRuntimeConfig()` at module init (before any fetch)
// without an extra IPC round trip.
//
// Argument format (set by electron/main.mjs:createWindow):
//   --creativedge-backend-base=http://127.0.0.1:<dynamicBackendPort>
//   --creativedge-frontend-base=http://127.0.0.1:<dynamicFrontendPort>
//   --creativedge-packaged                  (only when app.isPackaged)
//
// Any missing argument is reported as `null` in the result; the renderer's
// API client falls through to its build-time `VITE_API_URL` (browser-dev
// compat) when the bridge value is missing.
//
// Privacy: only allocation metadata is exposed. No prompts, chat, memory,
// env vars, or secrets are surfaced via this bridge.

const BACKEND_ARG_PREFIX = "--creativedge-backend-base=";
const FRONTEND_ARG_PREFIX = "--creativedge-frontend-base=";
const PACKAGED_ARG = "--creativedge-packaged";

function parseRuntimeConfigFromArgv() {
  let backendBaseUrl = null;
  let frontendBaseUrl = null;
  let packaged = false;
  const argv = Array.isArray(process.argv) ? process.argv : [];
  for (const raw of argv) {
    if (typeof raw !== "string") continue;
    if (raw.startsWith(BACKEND_ARG_PREFIX)) {
      const v = raw.slice(BACKEND_ARG_PREFIX.length);
      if (v.length > 0) backendBaseUrl = v.replace(/\/+$/, "");
    } else if (raw.startsWith(FRONTEND_ARG_PREFIX)) {
      const v = raw.slice(FRONTEND_ARG_PREFIX.length);
      if (v.length > 0) frontendBaseUrl = v.replace(/\/+$/, "");
    } else if (raw === PACKAGED_ARG) {
      packaged = true;
    }
  }
  return Object.freeze({ backendBaseUrl, frontendBaseUrl, packaged });
}

const RUNTIME_CONFIG = parseRuntimeConfigFromArgv();

/**
 * Result shape returned by the main-process handler. Mirrors what the
 * frontend's `openExternalUrl()` helper expects.
 */
function isShape(v) {
  return v && typeof v === "object" && typeof v.ok === "boolean";
}

contextBridge.exposeInMainWorld("ceBridge", {
  /**
   * Request that the main process open `url` in the user's default
   * browser via `shell.openExternal()`. Returns a discriminated
   * result so the caller can render a friendly hint without throwing.
   *
   *   { ok: true }
   *   { ok: false, reason: "not-allowed" | "invalid-url" | "open-failed", message?: string }
   */
  async openExternal(url) {
    if (typeof url !== "string" || url.length === 0) {
      return { ok: false, reason: "invalid-url", message: "URL is empty." };
    }
    try {
      const result = await ipcRenderer.invoke(CHANNEL_OPEN_EXTERNAL, url);
      if (isShape(result)) return result;
      return { ok: false, reason: "open-failed", message: "Bridge returned an unexpected shape." };
    } catch (err) {
      return {
        ok: false,
        reason: "open-failed",
        message: err && err.message ? String(err.message) : "Bridge invoke failed.",
      };
    }
  },

  /**
   * Phase 9-D-C3 - synchronous read of the runtime config injected via
   * `webPreferences.additionalArguments`. Returns a plain object that
   * the renderer can use directly to resolve its API base URL without
   * an IPC round trip.
   *
   *   { backendBaseUrl: string|null, frontendBaseUrl: string|null, packaged: boolean }
   *
   * When called in dev-browser mode (no Electron preload), the bridge
   * itself is absent; the renderer's `client.ts` falls through to its
   * `VITE_API_URL` build-time fallback.
   */
  getRuntimeConfig() {
    // Return a fresh shallow copy so the renderer can't mutate the
    // frozen original (defence-in-depth; contextBridge clones already).
    return {
      backendBaseUrl: RUNTIME_CONFIG.backendBaseUrl,
      frontendBaseUrl: RUNTIME_CONFIG.frontendBaseUrl,
      packaged: RUNTIME_CONFIG.packaged,
    };
  },
});
