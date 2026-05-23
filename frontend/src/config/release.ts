// CreativEdge Phase 9-D-B1 — shared release / update-check config.
//
// Single source of truth for the GitHub repository coordinates used by
// the Ops console's manual update-check button and "Open releases page"
// link. Centralised here so future surfaces (admin console, first-run
// wizard, NOTES.md cross-link) all reference the same constants instead
// of re-hardcoding the owner/repo.
//
// Phase 9-D-B1 scope (verbatim from todo.md):
//   - No electron-updater dependency.
//   - No background polling.
//   - No telemetry.
//   - No auto-download, no auto-install.
//   - Manual click-triggered fetch only.
//
// Privacy: the helper hits GitHub's *unauthenticated* public REST API.
// No token is included; no User-Agent identifying the installation is
// sent; no headers beyond the browser default. If GitHub returns 403
// (rate-limited) or 404 (no release) the caller renders a friendly
// hint and stops — nothing is retried in the background.

/** GitHub repository owner (organization or user). */
export const RELEASE_OWNER = "michelbr84";

/** GitHub repository name (case-sensitive in the API path). */
export const RELEASE_REPO = "CreativEdge";

/** Human-facing releases page; opens via window.open → Electron's
 *  will-navigate handler routes external http(s) URLs through
 *  shell.openExternal so it opens in the user's OS default browser. */
export const RELEASES_URL = `https://github.com/${RELEASE_OWNER}/${RELEASE_REPO}/releases`;

/** GitHub REST endpoint for the most recent published (non-draft,
 *  non-prerelease) release. Returns 404 when the repo has no releases
 *  yet, which the UI handles as a friendly "no release published yet"
 *  message rather than an error. */
export const LATEST_RELEASE_API_URL = `https://api.github.com/repos/${RELEASE_OWNER}/${RELEASE_REPO}/releases/latest`;

// ---------------------------------------------------------------------------
// Tag normalisation + comparison
// ---------------------------------------------------------------------------
//
// We intentionally avoid adding a semver dependency for this slice — the
// only comparison we need is "is the local app version exactly equal to
// the latest GitHub tag, after stripping a leading `v`?". Anything more
// nuanced (pre-release qualifiers, build metadata, range matching) is
// out of scope for Phase 9-D-B1 and would be handled by a later slice
// alongside auto-update.

/** Lower-case, leading-`v` stripped, whitespace-trimmed. Returns the
 *  input unchanged when it isn't a plausible version string (we still
 *  show it verbatim so the user can see what GitHub returned). */
export function normaliseVersionTag(raw: string | null | undefined): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.replace(/^v/i, "").toLowerCase();
}

/** Three-state comparison result used by the Ops console badge. */
export type ReleaseComparison =
  | "up-to-date"
  | "release-available"
  | "unable-to-compare";

/** Pure equality comparison after normalisation. If either side is
 *  missing / blank / `"—"`, we cannot make a confident statement and
 *  return `"unable-to-compare"`. A more permissive semver compare
 *  belongs to whatever phase actually wires electron-updater. */
export function compareLocalToLatest(
  localVersion: string | null | undefined,
  latestTag: string | null | undefined
): ReleaseComparison {
  const a = normaliseVersionTag(localVersion);
  const b = normaliseVersionTag(latestTag);
  if (a.length === 0 || b.length === 0) return "unable-to-compare";
  if (a === b) return "up-to-date";
  return "release-available";
}

// ---------------------------------------------------------------------------
// Latest-release fetch
// ---------------------------------------------------------------------------

/** A small subset of the GitHub "Get the latest release" response shape;
 *  every field is optional so the type matches both happy-path and
 *  partial responses. */
export interface LatestReleaseInfo {
  tagName: string | null;
  name: string | null;
  publishedAt: string | null;
  htmlUrl: string | null;
}

/** Discriminated union used by the UI to render the right card state
 *  without prop-drilling raw error objects. */
export type LatestReleaseResult =
  | { status: "ok"; info: LatestReleaseInfo }
  | { status: "no-release"; message: string }
  | { status: "rate-limited"; message: string }
  | { status: "network-error"; message: string }
  | { status: "error"; message: string };

/** Manual, click-triggered fetch. NEVER called from a setInterval /
 *  setTimeout / on-mount path. Returns a discriminated union so the
 *  caller can render a friendly hint for every observable outcome:
 *
 *    - 200 OK           → { status: "ok" }
 *    - 404              → { status: "no-release" }  (repo has no releases)
 *    - 403 + rate-limit → { status: "rate-limited" }
 *    - network failure  → { status: "network-error" }
 *    - everything else  → { status: "error" }
 *
 *  No retries. No exponential backoff. The user clicks the button
 *  again if they want to retry. */
export async function fetchLatestRelease(
  signal?: AbortSignal
): Promise<LatestReleaseResult> {
  let res: Response;
  try {
    res = await fetch(LATEST_RELEASE_API_URL, {
      method: "GET",
      // GitHub recommends the v3+JSON accept header but treats it as
      // optional. We include it so the response shape is stable.
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      status: "network-error",
      message: `Could not reach GitHub (${msg}). Are you offline?`,
    };
  }

  if (res.status === 404) {
    return {
      status: "no-release",
      message:
        "No published release found on GitHub yet. The releases page will be empty until the first release is published.",
    };
  }

  if (res.status === 403) {
    // GitHub rate-limit headers are best-effort; missing values just
    // mean we can't tell the user when the limit resets.
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = res.headers.get("x-ratelimit-reset");
    const resetHint = reset
      ? ` Reset at ${new Date(Number(reset) * 1000).toLocaleTimeString()}.`
      : "";
    return {
      status: "rate-limited",
      message:
        remaining === "0"
          ? `GitHub API rate limit reached for this IP.${resetHint} Try again later or open the releases page directly.`
          : `GitHub returned 403 (likely rate-limited).${resetHint}`,
    };
  }

  if (!res.ok) {
    return {
      status: "error",
      message: `GitHub returned HTTP ${res.status}. Try the Open releases page button instead.`,
    };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return {
      status: "error",
      message: "GitHub returned a response that wasn't valid JSON.",
    };
  }
  if (!body || typeof body !== "object") {
    return {
      status: "error",
      message: "GitHub returned an unexpected response shape.",
    };
  }
  const o = body as Record<string, unknown>;
  return {
    status: "ok",
    info: {
      tagName: typeof o.tag_name === "string" ? o.tag_name : null,
      name: typeof o.name === "string" ? o.name : null,
      publishedAt: typeof o.published_at === "string" ? o.published_at : null,
      htmlUrl: typeof o.html_url === "string" ? o.html_url : null,
    },
  };
}

// ---------------------------------------------------------------------------
// Phase 9-D-B4 - external-URL opener helper
// ---------------------------------------------------------------------------
//
// Centralised, allow-list-filtered helper for opening trusted external
// URLs in the user's OS default browser. Prefers the Electron preload
// bridge (`window.ceBridge.openExternal`) when available - that path
// goes through `shell.openExternal` in the main process, which is the
// only Electron-supported way to escape the renderer's sandbox.
//
// Falls back to plain `window.open(..., "_blank", "noopener,noreferrer")`
// in non-Electron contexts (Vite dev mode in a regular browser tab)
// so the same `openExternalUrl()` call works in both environments.
//
// Privacy / security:
//   - Allow-list-filtered in the renderer AND re-checked in the main
//     process (defence-in-depth).
//   - HTTPS-only.
//   - No auth tokens. No telemetry. No installer download.
//   - No tracking parameters added - the URL is passed through as-is.

/**
 * Allow-list of external destinations the app may open in the OS
 * browser. Must stay in sync with `EXTERNAL_URL_ALLOWLIST` in
 * `electron/main.mjs` - the main process re-validates against its
 * own copy so a renderer compromise cannot widen the surface.
 */
export const EXTERNAL_URL_ALLOWLIST: ReadonlyArray<{
  readonly label: string;
  readonly host: string;
  readonly pathPrefix: string;
}> = [
  {
    label: "github-releases",
    host: "github.com",
    pathPrefix: `/${RELEASE_OWNER}/${RELEASE_REPO}/releases`,
  },
];

/** Pure predicate. Returns true if `url` parses as HTTPS and matches
 *  at least one allow-list entry (same rule as the main process). */
export function isExternalUrlAllowed(url: string): boolean {
  if (typeof url !== "string" || url.length === 0) return false;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  for (const entry of EXTERNAL_URL_ALLOWLIST) {
    if (u.host === entry.host && u.pathname.startsWith(entry.pathPrefix)) {
      return true;
    }
  }
  return false;
}

/** Discriminated result the caller can render as a friendly hint. */
export type OpenExternalResult =
  | { status: "ok"; via: "bridge" | "window-open" }
  | { status: "not-allowed"; message: string }
  | { status: "open-failed"; message: string };

interface CowBridge {
  openExternal(url: string): Promise<{
    ok: boolean;
    reason?: string;
    message?: string;
  }>;
}

/** Narrow check: do we have the Electron preload bridge attached? */
function getElectronBridge(): CowBridge | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { ceBridge?: unknown }).ceBridge;
  if (!candidate || typeof candidate !== "object") return null;
  const c = candidate as { openExternal?: unknown };
  if (typeof c.openExternal !== "function") return null;
  return candidate as CowBridge;
}

/**
 * Open `url` in the user's OS default browser via the safest available
 * path. Resolves to a discriminated result so the caller can render a
 * friendly hint without throwing.
 *
 * Resolution rules:
 *   1. `isExternalUrlAllowed(url)` must be true; otherwise the result
 *      is `{ status: "not-allowed" }` and no network/IPC call is made.
 *   2. If `window.ceBridge.openExternal` is attached (Electron preload
 *      present), call it and return its result tagged `via: "bridge"`.
 *   3. Otherwise (Vite dev mode in a normal browser), fall back to
 *      `window.open(url, "_blank", "noopener,noreferrer")` and tag
 *      the result `via: "window-open"`. If the browser blocks the
 *      popup (popup blocker) we return `{ status: "open-failed" }`.
 */
export async function openExternalUrl(url: string): Promise<OpenExternalResult> {
  if (!isExternalUrlAllowed(url)) {
    return {
      status: "not-allowed",
      message: "This URL isn't on the app's allow-list and was not opened.",
    };
  }
  const bridge = getElectronBridge();
  if (bridge) {
    try {
      const r = await bridge.openExternal(url);
      if (r && r.ok === true) return { status: "ok", via: "bridge" };
      return {
        status: "open-failed",
        message: r?.message ?? "Could not open the link in your default browser.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { status: "open-failed", message };
    }
  }
  // Non-Electron fallback (dev mode in a normal browser tab).
  try {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w === null) {
      return {
        status: "open-failed",
        message: "Your browser's popup blocker prevented opening the link.",
      };
    }
    return { status: "ok", via: "window-open" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "open-failed", message };
  }
}
