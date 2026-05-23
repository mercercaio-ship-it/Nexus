import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ALLOWED_FIELDS = new Set([
  "tagline",
  "voice",
  "color",
  "values",
  "strengths",
  "watch_outs",
]);

export interface AgentOverrides {
  tagline?: string;
  voice?: string;
  color?: string;
  values?: string[];
  strengths?: string[];
  watch_outs?: string[];
  updated_at?: string;
}

export function overridesPathFor(runtimeAgentsDir: string, slug: string): string {
  return join(runtimeAgentsDir, slug, "overrides.json");
}

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

export async function loadOverrides(
  runtimeAgentsDir: string, slug: string
): Promise<AgentOverrides> {
  const p = overridesPathFor(runtimeAgentsDir, slug);
  if (!(await exists(p))) return {};
  try {
    const raw = await readFile(p, "utf-8");
    return JSON.parse(raw) as AgentOverrides;
  } catch {
    return {};
  }
}

export interface ValidationResult {
  ok: boolean;
  cleaned: AgentOverrides;
  rejected: { field: string; reason: string }[];
}

export function validateOverridesPatch(patch: unknown): ValidationResult {
  const rejected: { field: string; reason: string }[] = [];
  const cleaned: AgentOverrides = {};
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return {
      ok: false, cleaned,
      rejected: [{ field: "<body>", reason: "must be a JSON object" }],
    };
  }
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    if (!ALLOWED_FIELDS.has(k)) {
      rejected.push({
        field: k,
        reason: "field not allowed via PUT /agents/:slug; Phase 2.2 only supports tagline, voice, color, values, strengths, watch_outs",
      });
      continue;
    }
    if (k === "tagline" || k === "voice" || k === "color") {
      if (typeof v !== "string") { rejected.push({ field: k, reason: "must be a string" }); continue; }
      if (v.length > 2000) { rejected.push({ field: k, reason: "too long (max 2000)" }); continue; }
      if (k === "color" && !/^#[0-9a-fA-F]{6}$/.test(v)) {
        rejected.push({ field: k, reason: "must be a #RRGGBB hex color" }); continue;
      }
      (cleaned as Record<string, unknown>)[k] = v;
    } else {
      if (!Array.isArray(v) || v.some((x) => typeof x !== "string") || v.length > 50) {
        rejected.push({ field: k, reason: "must be an array of up to 50 strings" }); continue;
      }
      (cleaned as Record<string, unknown>)[k] = v;
    }
  }
  return { ok: rejected.length === 0, cleaned, rejected };
}

export async function saveOverrides(
  runtimeAgentsDir: string, slug: string, patch: AgentOverrides
): Promise<AgentOverrides> {
  const existing = await loadOverrides(runtimeAgentsDir, slug);
  const merged: AgentOverrides = {
    ...existing, ...patch, updated_at: new Date().toISOString(),
  };
  const p = overridesPathFor(runtimeAgentsDir, slug);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  return merged;
}
