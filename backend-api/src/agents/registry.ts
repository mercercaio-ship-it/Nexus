import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface RegistryEntry {
  slug: string;
  name: string;
  domain?: string;
  emoji: string;
  mbti?: string;
  color?: string;
  role: "orchestrator" | "specialist";
  path?: string;
  routing_keywords?: string[];
}

export interface Registry {
  schema_version?: number;
  generated?: string;
  count?: { orchestrator?: number; specialists?: number };
  entries: RegistryEntry[];
}

export async function loadRegistry(projectRoot: string): Promise<Registry> {
  const p = join(projectRoot, "orchestrator", "registry.json");
  const raw = await readFile(p, "utf-8");
  return JSON.parse(raw) as Registry;
}

export function specialistSlugs(reg: Registry): string[] {
  return reg.entries.filter((e) => e.role === "specialist").map((e) => e.slug);
}

export function findEntry(reg: Registry, slug: string): RegistryEntry | undefined {
  return reg.entries.find((e) => e.slug === slug);
}
