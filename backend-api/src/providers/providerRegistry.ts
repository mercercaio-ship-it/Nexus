import { loadProvidersConfig } from "../config/runtimeConfig.js";
import { ClaudeProvider } from "./ClaudeProvider.js";
import { MockProvider } from "./MockProvider.js";
import type { Provider, ProviderReadiness } from "./Provider.js";

export interface ProviderRegistry {
  primaryName: string;
  primary: Provider;
  byName: Record<string, Provider>;
  readiness: Record<string, ProviderReadiness>;
  configuredPrimary: string;
}

/**
 * Boot-time provider initialization.
 *
 * Reads ~/.creativedge/providers.json, instantiates the providers that are
 * `enabled !== false`, runs a best-effort `checkReady()` on each, and picks
 * the primary.
 *
 * Selection logic:
 *   - If the configured primary exists in `byName`, use it.
 *   - Otherwise, fall back to `mock`. This is only safe because the routes
 *     in Phase 2.1 don't actually make user-facing model calls; later
 *     phases must NOT silently downgrade real chat turns to mock.
 */
export async function initProviderRegistry(
  providersPath: string
): Promise<ProviderRegistry> {
  const config = await loadProvidersConfig(providersPath);

  const byName: Record<string, Provider> = {};
  if (config.providers.claude?.enabled !== false) byName.claude = new ClaudeProvider(config.providers.claude ?? {});
  if (config.providers.mock?.enabled !== false) byName.mock = new MockProvider();
  // openai + ollama deferred (Phase 2.3+)
  if (config.providers.openrouter?.enabled !== false && config.providers.openrouter) {
    const orCfg = config.providers.openrouter as Record<string, unknown>;
    const { OpenRouterProvider } = await import('./OpenRouterProvider.js');
    byName.openrouter = new OpenRouterProvider({
      apiKey: String(orCfg.apiKey ?? ""),
      model: String(orCfg.model ?? ""),
    });
  }

  const configuredPrimary = config.primary;
  const primaryName =
    byName[configuredPrimary] !== undefined
      ? configuredPrimary
      : "mock";

  const primary = byName[primaryName];
  if (!primary) {
    // Defensive: only happens if both claude and mock are disabled in config.
    throw new Error(
      "No providers enabled - at least one of {claude, mock} must be enabled in providers.json"
    );
  }

  // Best-effort readiness check per provider. Never throws — readiness
  // failures are reported via /healthz.
  const readiness: Record<string, ProviderReadiness> = {};
  for (const [name, p] of Object.entries(byName)) {
    try {
      readiness[name] = await p.checkReady();
    } catch (err) {
      readiness[name] = {
        ready: false,
        reason: `checkReady threw: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  return { primaryName, primary, byName, readiness, configuredPrimary };
}
