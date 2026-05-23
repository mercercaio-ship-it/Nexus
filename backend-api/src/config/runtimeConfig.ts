import { readFile } from "node:fs/promises";

/**
 * Shape of ~/.creativedge/providers.json.
 *
 * Phase 2.1 only consumes `primary` and the per-provider `enabled` flag.
 * Other fields (authMode, baseUrl) are intentionally tolerated as opaque
 * so we don't break older configs when later phases add fields.
 */
export interface ProviderEntryConfig {
  enabled?: boolean;
  authMode?: string;
  baseUrl?: string;
  /** Time-to-first-assistant-text (ms). Phase 2.4. Optional. */
  firstChunkTimeoutMs?: number;
  /** Hard turn timeout (ms). Phase 2.4. Optional. */
  turnTimeoutMs?: number;
  /** Soft cap on total prompt characters before we start trimming session
   *  transcript. Phase 2.6. Optional. */
  maxContextChars?: number;
  /** How many chars to reserve for the model's response within the soft cap.
   *  Phase 2.6. Optional. */
  reservedResponseChars?: number;
  /** Hard cap on how many recent session messages to include even if budget
   *  allows more. Phase 2.6. Optional. */
  recentMessageLimit?: number;
  /** Hard cap (ms) on the Nexus synthesis call used by Phase 3.2 convening.
   *  Set generously (default 150000) because synthesis runs AFTER fan-out
   *  completes and has to read several specialist drafts + generate a long
   *  composite answer. Optional. */
  conveningSynthesisTimeoutMs?: number;
  /** Phase 4.1: how many trailing episodic-memory entries to inject into
   *  every specialist invocation's system prompt. Default 10. Set to 0 to
   *  disable episodic injection. Optional. */
  recentEpisodicLimit?: number;
  [key: string]: unknown;
}

export interface ProvidersConfig {
  schemaVersion: number;
  primary: string;
  providers: Record<string, ProviderEntryConfig>;
}

export async function loadProvidersConfig(path: string): Promise<ProvidersConfig> {
  const raw = await readFile(path, "utf-8");
  const parsed = JSON.parse(raw) as Partial<ProvidersConfig>;
  return {
    schemaVersion: typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 1,
    primary: typeof parsed.primary === "string" ? parsed.primary : "claude",
    providers: parsed.providers ?? {},
  };
}
