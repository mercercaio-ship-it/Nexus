import { access, appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { FastifyInstance } from "fastify";

import { readAgentSnapshot } from "../agents/agentReader.js";
import { containsSensitiveContent } from "../agents/agentRuntimeContext.js";
import {
  buildCompactionBlock,
  buildEpisodicCompactionPreview,
  findEpisodicMatch,
  getEpisodicCompactionStatus,
  MemoryFilesError,
  resolveMemoryPath,
  safeAppendUnique,
  safeReplaceOnce,
} from "../agents/memoryFiles.js";
import { findEntry, loadRegistry, specialistSlugs } from "../agents/registry.js";
import { saveOverrides, validateOverridesPatch } from "../agents/overrides.js";

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

// Defensive slug validator - also blocks path traversal (no slashes, no dots).
const SLUG_RE = /^[a-z][a-z0-9-]{1,40}$/;
function isValidSlug(s: unknown): s is string {
  return typeof s === "string" && SLUG_RE.test(s);
}

const ENTRY_MAX = 4000;
// Phase 5.3-B: per-bullet cap for compaction-apply preview bullets. Bounds
// the payload of a single bullet so the dedup fingerprint stays compact and
// the response can't be abused to smuggle 4 KB blobs per bullet.
const COMPACTION_BULLET_MAX = 400;

export async function agentRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /agents - registry summary
  fastify.get("/agents", async () => {
    const reg = await loadRegistry(fastify.runtime.projectRoot);
    return {
      schemaVersion: reg.schema_version ?? 1,
      count: reg.count ?? { orchestrator: 1, specialists: specialistSlugs(reg).length },
      entries: reg.entries.map((e) => ({
        slug: e.slug,
        name: e.name,
        domain: e.domain ?? null,
        emoji: e.emoji,
        mbti: e.mbti ?? null,
        color: e.color ?? null,
        role: e.role,
        routing_keywords: e.routing_keywords ?? [],
      })),
    };
  });

  // GET /agents/:slug - full snapshot (project template + runtime memory + overrides)
  fastify.get<{ Params: { slug: string } }>("/agents/:slug", async (req, reply) => {
    const slug = req.params.slug;
    if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });

    const reg = await loadRegistry(fastify.runtime.projectRoot);
    const entry = findEntry(reg, slug);
    if (!entry) return reply.code(404).send({ error: `unknown agent: ${slug}` });

    const snap = await readAgentSnapshot(
      fastify.runtime.projectRoot,
      fastify.runtime.agentsDir,
      slug,
      entry
    );
    return { registryEntry: entry, ...snap };
  });

  // PUT /agents/:slug - safe runtime overrides only
  fastify.put<{ Params: { slug: string }; Body: unknown }>(
    "/agents/:slug",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const result = validateOverridesPatch(req.body);
      if (Object.keys(result.cleaned).length === 0) {
        return reply.code(400).send({
          error: "no valid fields to update",
          rejected: result.rejected,
          hint: "Only these fields are accepted in Phase 2.2: tagline, voice, color, values, strengths, watch_outs. Other fields stay project-level until a later slice.",
        });
      }
      const saved = await saveOverrides(fastify.runtime.agentsDir, slug, result.cleaned);
      // Partial apply: valid fields are saved, rejected fields are reported but not fatal.
      return reply
        .code(result.rejected.length === 0 ? 200 : 207)
        .send({ ok: true, slug, overrides: saved, rejected: result.rejected });
    }
  );

  // GET /agents/:slug/memory
  fastify.get<{ Params: { slug: string } }>(
    "/agents/:slug/memory",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const dir = join(fastify.runtime.agentsDir, slug, "memory");
      const corePath = join(dir, "core_memory.md");
      const epPath = join(dir, "episodic_memory.md");
      const core = (await exists(corePath)) ? await readFile(corePath, "utf-8") : "";
      const episodic = (await exists(epPath)) ? await readFile(epPath, "utf-8") : "";
      return {
        slug,
        core,
        episodic,
        paths: { core: corePath, episodic: epPath },
      };
    }
  );

  // POST /agents/:slug/memory/episodic
  fastify.post<{ Params: { slug: string }; Body: { entry?: string } }>(
    "/agents/:slug/memory/episodic",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const entry = req.body?.entry;
      if (typeof entry !== "string" || entry.trim().length === 0) {
        return reply.code(400).send({ error: "body.entry must be a non-empty string" });
      }
      if (entry.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.entry too long (max ${ENTRY_MAX} chars)` });
      }

      const path = join(fastify.runtime.agentsDir, slug, "memory", "episodic_memory.md");
      await mkdir(dirname(path), { recursive: true });
      const stamp = new Date().toISOString();
      const block = `\n## ${stamp}\n${entry.trim()}\n`;
      await appendFile(path, block, "utf-8");
      return {
        ok: true,
        slug,
        timestamp: stamp,
        bytesAppended: Buffer.byteLength(block, "utf-8"),
      };
    }
  );

  // POST /agents/:slug/memory/promote - core memory append (requires confirmed:true)
  fastify.post<{ Params: { slug: string }; Body: { entry?: string; confirmed?: boolean } }>(
    "/agents/:slug/memory/promote",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const { entry, confirmed } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to promote to core memory",
          hint: "Send { \"entry\": \"...\", \"confirmed\": true }.",
        });
      }
      if (typeof entry !== "string" || entry.trim().length === 0) {
        return reply.code(400).send({ error: "body.entry must be a non-empty string" });
      }
      if (entry.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.entry too long (max ${ENTRY_MAX} chars)` });
      }

      // Phase 5.2 bridge: defense-in-depth sensitive-content guard.
      // Even with `confirmed:true` from the client, refuse to write entries
      // that look like credit cards, SSNs, API keys, bearer tokens, or PEM
      // private keys. Same patterns as `appendEpisodicSummary`. The category
      // is deliberately NOT echoed back so the response can't be used as a
      // sensitivity oracle. The server-side log line names the phase.
      if (containsSensitiveContent(entry)) {
        fastify.log.warn(
          {
            phase: "memory-promote",
            slug,
            reason: "sensitive-content guard refused write",
            entryChars: entry.length,
          },
          "promote refused: sensitive content detected"
        );
        return reply.code(422).send({
          error: "entry contains sensitive content; refusing to promote to core memory",
          hint: "Strip the sensitive fragment (account number, key, SSN, etc.) and resubmit.",
        });
      }

      // Phase 5.2-B - delegate path resolution, duplicate guard, and the
      // atomic append to the shared memory-write helper. The helper takes
      // a file lock (`<file>.lock`) so two concurrent /promote callers
      // can't both pass the duplicate check and double-write the same
      // entry, and so future Phase 5 mutation paths (`editCore`, the
      // episodic-to-core movement variant of `promoteToCore`, the `forget`
      // surgical delete) share one source of truth for IO safety.
      let path: string;
      try {
        path = resolveMemoryPath(fastify.runtime.agentsDir, slug, "core");
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "invalid_slug") {
          return reply.code(400).send({ error: "invalid slug" });
        }
        if (err instanceof MemoryFilesError && err.code === "path_traversal") {
          fastify.log.warn(
            { phase: "memory-promote", slug, reason: "path_traversal blocked" },
            "promote refused: path traversal attempt"
          );
          return reply.code(400).send({ error: "invalid slug" });
        }
        throw err;
      }
      const stamp = new Date().toISOString();
      const cleaned = entry.trim();
      const block = `\n<!-- promoted ${stamp} -->\n${cleaned}\n`;
      let result;
      try {
        result = await safeAppendUnique(path, block, { dedupNeedle: cleaned });
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "lock_timeout") {
          fastify.log.warn(
            { phase: "memory-promote", slug, reason: "lock_timeout" },
            "promote retry exhausted on file lock"
          );
          return reply.code(503).send({
            error: "memory file is busy; please retry shortly",
          });
        }
        throw err;
      }
      if (result.duplicate) {
        return reply.code(200).send({
          ok: true,
          slug,
          duplicate: true,
          timestamp: stamp,
        });
      }
      return {
        ok: true,
        slug,
        timestamp: stamp,
        bytesAppended: result.bytesAppended,
      };
    }
  );

  // POST /agents/:slug/memory/promote-episodic
  // Phase 5.2-C - episodic-to-core promotion variant.
  // Promotes ONE matching line from `episodic_memory.md` into
  // `core_memory.md`. The matching line is identified by an explicit
  // `episodicNeedle` substring supplied by the caller. The user must set
  // `confirmed:true` for the write to happen. This slice does NOT delete
  // the line from episodic memory - that's a follow-up slice tied to the
  // §5.4 forget flow.
  //
  // Body: { episodicNeedle: string, confirmed: true }
  //
  // Response contract:
  //   - 200 { ok:true, slug, promoted:true, timestamp, bytesAppended }
  //   - 200 { ok:true, slug, duplicate:true, timestamp }  (already in core)
  //   - 400 invalid slug / missing confirmed:true / bad needle shape
  //   - 404 unknown slug | no matching episodic entry | episodic file missing
  //   - 409 multiple matching episodic entries (needs refinement)
  //   - 422 matching line contains sensitive content
  //   - 503 file lock timeout (transient; safe to retry)
  fastify.post<{
    Params: { slug: string };
    Body: { episodicNeedle?: string; confirmed?: boolean };
  }>(
    "/agents/:slug/memory/promote-episodic",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const { episodicNeedle, confirmed } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to promote an episodic entry to core memory",
          hint: "Send { \"episodicNeedle\": \"...\", \"confirmed\": true }.",
        });
      }
      if (typeof episodicNeedle !== "string" || episodicNeedle.trim().length === 0) {
        return reply.code(400).send({ error: "body.episodicNeedle must be a non-empty string" });
      }
      if (episodicNeedle.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.episodicNeedle too long (max ${ENTRY_MAX} chars)` });
      }
      if (episodicNeedle.trim().length < 3) {
        return reply.code(400).send({ error: "body.episodicNeedle must be at least 3 non-whitespace chars" });
      }

      // Resolve both paths via the §5.2-B helper (defense-in-depth slug
      // regex + path-traversal-resolved-prefix guard).
      let corePath: string;
      let episodicPath: string;
      try {
        corePath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "core");
        episodicPath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "episodic");
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-promote-episodic", slug, reason: "path_traversal blocked" },
              "promote-episodic refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Read episodic. Missing file == no match (404 with a generic message
      // so the response isn't an existence oracle).
      let episodicContent: string;
      try {
        episodicContent = await readFile(episodicPath, "utf-8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
          return reply.code(404).send({ error: "no matching episodic entry" });
        }
        throw err;
      }

      const m = findEpisodicMatch(episodicContent, episodicNeedle);
      if (m.status === "none") {
        return reply.code(404).send({ error: "no matching episodic entry" });
      }
      if (m.status === "multiple") {
        // Don't echo back `count` to avoid leaking how many similar facts
        // exist in episodic memory; the route stays a non-oracle.
        return reply.code(409).send({
          error: "multiple matching episodic entries; refine the needle so it identifies exactly one",
        });
      }

      const cleaned = m.line.trim();
      if (cleaned.length === 0) {
        return reply.code(404).send({ error: "no matching episodic entry" });
      }

      // Sensitive guard on the matched line. Generic 422 with no category
      // echoed in the response (parity with the §5.2-A /promote handler).
      if (containsSensitiveContent(cleaned)) {
        fastify.log.warn(
          {
            phase: "memory-promote-episodic",
            slug,
            reason: "sensitive-content guard refused write",
            lineChars: cleaned.length,
          },
          "promote-episodic refused: matched line contains sensitive content"
        );
        return reply.code(422).send({
          error: "matching episodic line contains sensitive content; refusing to promote",
          hint: "Strip the sensitive fragment from episodic memory and resubmit.",
        });
      }

      // Append to core via the §5.2-B lock-guarded helper, with the cleaned
      // line as the dedup needle so a second identical promote is idempotent.
      const stamp = new Date().toISOString();
      const block = `\n<!-- promoted-from-episodic ${stamp} -->\n${cleaned}\n`;
      let result;
      try {
        result = await safeAppendUnique(corePath, block, { dedupNeedle: cleaned });
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "lock_timeout") {
          fastify.log.warn(
            { phase: "memory-promote-episodic", slug, reason: "lock_timeout" },
            "promote-episodic retry exhausted on file lock"
          );
          return reply.code(503).send({
            error: "memory file is busy; please retry shortly",
          });
        }
        throw err;
      }
      if (result.duplicate) {
        return reply.code(200).send({
          ok: true,
          slug,
          duplicate: true,
          timestamp: stamp,
        });
      }
      return {
        ok: true,
        slug,
        promoted: true,
        timestamp: stamp,
        bytesAppended: result.bytesAppended,
      };
    }
  );

  // PATCH /agents/:slug/memory/core
  // Phase 5.2-D - diff-based edit of `core_memory.md`.
  //
  // Replaces exactly one occurrence of `body.find` with `body.replace`
  // inside the agent's `core_memory.md`. The caller must set
  // `confirmed:true`. The read + match-count + replace + atomic write
  // sequence runs INSIDE the §5.2-B file lock (via `safeReplaceOnce`) so
  // two concurrent editors cannot both pass the match-count check.
  //
  // The sensitive-content guard is applied to `body.replace` only - the
  // guard's job is to refuse INTRODUCING new sensitive content; if the
  // caller's intent is to remove existing sensitive content from core,
  // they can supply a sensitive `find` and a non-sensitive `replace`.
  //
  // Body: { find: string, replace: string, confirmed: true }
  //
  // Response contract:
  //   - 200 { ok:true, slug, edited:true,    timestamp, bytesWritten }
  //   - 200 { ok:true, slug, unchanged:true, timestamp }
  //   - 400 invalid slug / missing confirmed:true / bad find/replace shape
  //   - 404 unknown slug | no matching core entry | core file missing
  //   - 409 multiple matching core entries (refine `find`)
  //   - 422 `replace` contains sensitive content
  //   - 503 file lock timeout (transient; safe to retry)
  fastify.patch<{
    Params: { slug: string };
    Body: { find?: string; replace?: string; confirmed?: boolean };
  }>(
    "/agents/:slug/memory/core",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const { find, replace, confirmed } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to edit core memory",
          hint: "Send { \"find\": \"...\", \"replace\": \"...\", \"confirmed\": true }.",
        });
      }
      if (typeof find !== "string" || find.trim().length === 0) {
        return reply.code(400).send({ error: "body.find must be a non-empty string" });
      }
      if (find.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.find too long (max ${ENTRY_MAX} chars)` });
      }
      if (find.trim().length < 3) {
        return reply.code(400).send({ error: "body.find must be at least 3 non-whitespace chars" });
      }
      if (typeof replace !== "string") {
        return reply.code(400).send({ error: "body.replace must be a string" });
      }
      if (replace.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.replace too long (max ${ENTRY_MAX} chars)` });
      }

      // Defense-in-depth: refuse if the NEW content (`replace`) is sensitive.
      // Note we do NOT guard `find` - the caller may legitimately be removing
      // existing sensitive content from core memory by replacing it with a
      // benign string (or an empty string).
      if (containsSensitiveContent(replace)) {
        fastify.log.warn(
          {
            phase: "memory-edit-core",
            slug,
            reason: "sensitive-content guard refused write",
            replaceChars: replace.length,
          },
          "edit-core refused: replacement contains sensitive content"
        );
        return reply.code(422).send({
          error: "replacement contains sensitive content; refusing to edit core memory",
          hint: "Strip the sensitive fragment from the replacement and resubmit.",
        });
      }

      // Resolve the core path via the §5.2-B helper (defense-in-depth slug
      // regex + path-traversal-resolved-prefix guard).
      let corePath: string;
      try {
        corePath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "core");
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-edit-core", slug, reason: "path_traversal blocked" },
              "edit-core refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Lock + read + match-count + atomic-replace, all in one helper call.
      const stamp = new Date().toISOString();
      let result;
      try {
        result = await safeReplaceOnce(corePath, find, replace);
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "lock_timeout") {
          fastify.log.warn(
            { phase: "memory-edit-core", slug, reason: "lock_timeout" },
            "edit-core retry exhausted on file lock"
          );
          return reply.code(503).send({
            error: "memory file is busy; please retry shortly",
          });
        }
        throw err;
      }

      if (result.status === "none") {
        return reply.code(404).send({ error: "no matching core entry" });
      }
      if (result.status === "multiple") {
        // Don't echo `count`; the route stays a non-oracle (parity with
        // §5.2-C `/promote-episodic`).
        return reply.code(409).send({
          error: "multiple matching core entries; refine the find so it identifies exactly one",
        });
      }
      if (result.status === "unchanged") {
        return reply.code(200).send({
          ok: true,
          slug,
          unchanged: true,
          timestamp: stamp,
        });
      }
      return {
        ok: true,
        slug,
        edited: true,
        timestamp: stamp,
        bytesWritten: result.bytesWritten,
      };
    }
  );

  // POST /agents/:slug/memory/forget
  // Phase 5.4 - surgical memory delete.
  //
  // Removes exactly one occurrence of `body.find` from `core_memory.md`
  // (when `body.kind === "core"`) or `episodic_memory.md` (when
  // `body.kind === "episodic"`). The user must set `confirmed:true`.
  //
  // Implementation is a thin wrapper over the §5.2-D primitive
  // `safeReplaceOnce(path, find, "")` so the read + match-count + delete
  // + atomic write all happen inside the §5.2-B file lock. No new code
  // path; no `episodic_memory.md` mutation primitive is needed because
  // the surgical delete is just a degenerate edit where `replace === ""`.
  //
  // Body: { kind: "core" | "episodic", find: string, confirmed: true }
  //
  // Response contract:
  //   - 200 { ok:true, slug, kind, forgotten:true, timestamp, bytesWritten }
  //   - 400 invalid slug / missing confirmed:true / invalid kind / bad find shape
  //   - 404 unknown slug | no matching memory entry | memory file missing
  //   - 409 multiple matching memory entries (refine `find`)
  //   - 503 file lock timeout (transient; safe to retry)
  fastify.post<{
    Params: { slug: string };
    Body: { kind?: string; find?: string; confirmed?: boolean };
  }>(
    "/agents/:slug/memory/forget",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const { kind, find, confirmed } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to forget a memory entry",
          hint: "Send { \"kind\": \"core\"|\"episodic\", \"find\": \"...\", \"confirmed\": true }.",
        });
      }
      if (kind !== "core" && kind !== "episodic") {
        return reply.code(400).send({
          error: "body.kind must be \"core\" or \"episodic\"",
        });
      }
      if (typeof find !== "string" || find.trim().length === 0) {
        return reply.code(400).send({ error: "body.find must be a non-empty string" });
      }
      if (find.length > ENTRY_MAX) {
        return reply.code(400).send({ error: `body.find too long (max ${ENTRY_MAX} chars)` });
      }
      if (find.trim().length < 3) {
        return reply.code(400).send({ error: "body.find must be at least 3 non-whitespace chars" });
      }

      // Resolve the target path via the §5.2-B helper (defense-in-depth slug
      // regex + path-traversal-resolved-prefix guard).
      let path: string;
      try {
        path = resolveMemoryPath(fastify.runtime.agentsDir, slug, kind);
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-forget", slug, kind, reason: "path_traversal blocked" },
              "forget refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Surgical delete is a degenerate replace: find -> "". The same
      // §5.2-D primitive enforces exactly-one-match, lock-guarded read,
      // atomic write.
      const stamp = new Date().toISOString();
      let result;
      try {
        result = await safeReplaceOnce(path, find, "");
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "lock_timeout") {
          fastify.log.warn(
            { phase: "memory-forget", slug, kind, reason: "lock_timeout" },
            "forget retry exhausted on file lock"
          );
          return reply.code(503).send({
            error: "memory file is busy; please retry shortly",
          });
        }
        throw err;
      }

      if (result.status === "none") {
        return reply.code(404).send({ error: "no matching memory entry" });
      }
      if (result.status === "multiple") {
        // Don't echo `count`; parity with §5.2-C and §5.2-D non-oracle responses.
        return reply.code(409).send({
          error: "multiple matching memory entries; refine the find so it identifies exactly one",
        });
      }
      if (result.status === "unchanged") {
        // Defensive branch: since `replace` is the empty string and a
        // non-empty `find` was matched exactly once, the file must have
        // changed. If we somehow land here, treat it as "nothing actually
        // deleted" and report 404 so the caller's mental model stays simple.
        return reply.code(404).send({ error: "no matching memory entry" });
      }
      return {
        ok: true,
        slug,
        kind,
        forgotten: true,
        timestamp: stamp,
        bytesWritten: result.bytesWritten,
      };
    }
  );

  // POST /agents/:slug/memory/compact/preview
  // Phase 5.3-A - manual episodic memory compaction preview.
  //
  // READ-ONLY. Reads `episodic_memory.md` and returns a deterministic
  // preview (no LLM call, no writes). The user is expected to inspect the
  // preview and submit a separate confirmed apply request in a future
  // slice. This slice deliberately does NOT include an apply endpoint -
  // the apply path will land in §5.3-B once the preview shape stabilizes.
  //
  // Body: { maxEntries?: number }
  //   - default: 10
  //   - bounded: 1..100 (rejected with 400 if outside that range)
  //
  // Response contract:
  //   - 200 { ok:true, slug, empty:true }
  //         when the episodic file is missing or contains no parseable entries.
  //   - 200 { ok:true, slug, entryCount, consideredCount, preview, requiresConfirmation:true }
  //         when there is at least one entry. `preview` is 0..5 bullets,
  //         each capped at ~200 chars; sensitive bullets are redacted to
  //         "[redacted - sensitive content]" so the response never leaks
  //         credit cards / SSNs / tokens / PEM keys.
  //   - 400 invalid slug | maxEntries outside the allowed range
  //   - 404 unknown slug
  fastify.post<{
    Params: { slug: string };
    Body: { maxEntries?: number };
  }>(
    "/agents/:slug/memory/compact/preview",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      // Validate maxEntries (optional). If supplied, must be a positive
      // integer in [1, 100]. Coerced via Math.floor so 9.7 becomes 9.
      let cappedMax = 10;
      if (req.body?.maxEntries !== undefined) {
        const v = req.body.maxEntries;
        if (typeof v !== "number" || !Number.isFinite(v) || v < 1 || v > 100) {
          return reply.code(400).send({
            error: "body.maxEntries must be an integer between 1 and 100",
          });
        }
        cappedMax = Math.floor(v);
      }

      // Resolve the episodic path via the §5.2-B helper. Path-traversal
      // and invalid-slug errors are both surfaced as a generic 400 so the
      // response can't be used as a slug oracle.
      let episodicPath: string;
      try {
        episodicPath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "episodic");
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-compact-preview", slug, reason: "path_traversal blocked" },
              "compact preview refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Read episodic. Missing file -> empty:true.
      let content: string;
      try {
        content = await readFile(episodicPath, "utf-8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
          return reply.code(200).send({ ok: true, slug, empty: true });
        }
        throw err;
      }
      if (content.trim().length === 0) {
        return reply.code(200).send({ ok: true, slug, empty: true });
      }

      // Build the preview. Pass `containsSensitiveContent` as the redactor
      // so any sensitive gist is replaced by the generic redaction marker.
      // The helper itself stays decoupled from the sensitive-pattern code.
      const summary = buildEpisodicCompactionPreview(
        content,
        cappedMax,
        containsSensitiveContent
      );

      // Server-side log: counts only, never content.
      fastify.log.info(
        {
          phase: "memory-compact-preview",
          slug,
          entryCount: summary.entryCount,
          consideredCount: summary.consideredCount,
          previewBullets: summary.preview.length,
          maxEntries: cappedMax,
        },
        "compact preview generated"
      );

      return reply.code(200).send({
        ok: true,
        slug,
        entryCount: summary.entryCount,
        consideredCount: summary.consideredCount,
        preview: summary.preview,
        requiresConfirmation: true,
      });
    }
  );

  // POST /agents/:slug/memory/compact/apply
  // Phase 5.3-B - manual episodic compaction apply (write side).
  //
  // Appends a user-confirmed compaction block to `core_memory.md`. The
  // caller passes the bullet array they want preserved (typically the
  // array returned by the §5.3-A `/compact/preview` route, or a manually
  // edited version of it). The user MUST set `confirmed:true` for the
  // write to happen.
  //
  // This slice intentionally does NOT delete or truncate
  // `episodic_memory.md`. The compaction is purely additive on the core
  // side; episodic deletion lands in a later slice via the §5.4-A
  // `/forget` route or a follow-up `/compact/apply` mode.
  //
  // Body: { preview: string[], confirmed: true, mode: "append-core" }
  //   - preview: 1..5 non-empty strings, each <= 400 chars after trim
  //   - mode: only "append-core" is accepted in this slice
  //
  // Response contract:
  //   - 200 { ok:true, slug, applied:true,   mode:"append-core", bytesAppended, timestamp }
  //   - 200 { ok:true, slug, duplicate:true, mode:"append-core", timestamp }
  //         when the exact bullet fingerprint already exists in core memory
  //   - 400 invalid slug / missing confirmed / invalid mode / bad preview shape
  //   - 404 unknown agent
  //   - 422 any preview bullet contains sensitive content
  //   - 503 file lock timeout (transient; safe to retry)
  fastify.post<{
    Params: { slug: string };
    Body: { preview?: unknown; confirmed?: boolean; mode?: string };
  }>(
    "/agents/:slug/memory/compact/apply",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      const { preview, confirmed, mode } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to apply a compaction to core memory",
          hint: "Send { \"preview\": [...], \"mode\": \"append-core\", \"confirmed\": true }.",
        });
      }
      if (mode !== "append-core") {
        return reply.code(400).send({
          error: "body.mode must be \"append-core\"",
        });
      }
      if (!Array.isArray(preview)) {
        return reply.code(400).send({
          error: "body.preview must be an array of 1..5 non-empty strings",
        });
      }
      if (preview.length < 1 || preview.length > 5) {
        return reply.code(400).send({
          error: "body.preview must have between 1 and 5 bullets",
        });
      }

      const cleaned: string[] = [];
      for (const b of preview) {
        if (typeof b !== "string") {
          return reply.code(400).send({
            error: "body.preview bullets must all be strings",
          });
        }
        const t = b.trim();
        if (t.length === 0) {
          return reply.code(400).send({
            error: "body.preview bullets must not be empty after trim",
          });
        }
        if (t.length > COMPACTION_BULLET_MAX) {
          return reply.code(400).send({
            error: `body.preview bullets must be <= ${COMPACTION_BULLET_MAX} chars each`,
          });
        }
        cleaned.push(t);
      }

      // Sensitive guard: refuse if ANY bullet matches credit-card / SSN /
      // API-key / bearer / PEM patterns. Same generic 422 wording as the
      // other mutation routes; category is not echoed.
      for (const b of cleaned) {
        if (containsSensitiveContent(b)) {
          fastify.log.warn(
            {
              phase: "memory-compact-apply",
              slug,
              reason: "sensitive-content guard refused write",
              bulletChars: b.length,
            },
            "compact apply refused: preview contains sensitive content"
          );
          return reply.code(422).send({
            error: "compaction preview contains sensitive content; refusing to apply",
            hint: "Strip the sensitive fragment from the preview and resubmit.",
          });
        }
      }

      // Resolve the core path via the §5.2-B helper.
      let corePath: string;
      try {
        corePath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "core");
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-compact-apply", slug, reason: "path_traversal blocked" },
              "compact apply refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Format the block. `fingerprint` is the dedup needle (bullets only,
      // no timestamp) so two consecutive applies of identical bullets
      // dedup correctly.
      const stamp = new Date().toISOString();
      const { block, fingerprint } = buildCompactionBlock(cleaned, stamp);

      // Append via the lock-guarded §5.2-B helper.
      let result;
      try {
        result = await safeAppendUnique(corePath, block, { dedupNeedle: fingerprint });
      } catch (err) {
        if (err instanceof MemoryFilesError && err.code === "lock_timeout") {
          fastify.log.warn(
            { phase: "memory-compact-apply", slug, reason: "lock_timeout" },
            "compact apply retry exhausted on file lock"
          );
          return reply.code(503).send({
            error: "memory file is busy; please retry shortly",
          });
        }
        throw err;
      }

      // Server-side log: counts only, never bullet content.
      fastify.log.info(
        {
          phase: "memory-compact-apply",
          slug,
          mode: "append-core",
          bullets: cleaned.length,
          bytesAppended: result.bytesAppended,
          duplicate: result.duplicate,
        },
        "compact apply completed"
      );

      if (result.duplicate) {
        return reply.code(200).send({
          ok: true,
          slug,
          duplicate: true,
          mode: "append-core",
          timestamp: stamp,
        });
      }
      return {
        ok: true,
        slug,
        applied: true,
        mode: "append-core",
        timestamp: stamp,
        bytesAppended: result.bytesAppended,
      };
    }
  );

  // GET /agents/:slug/memory/compact/status
  // Phase 5.3-D - scheduled compaction readiness check.
  //
  // READ-ONLY. Reports whether the agent's `episodic_memory.md` has
  // crossed the compaction threshold (default 100 parseable entries; due
  // when entryCount > threshold, strict greater-than so the boundary
  // value is NOT considered due). No writes. No LLM call. No background
  // timer. No mutation of memory. Episodic CONTENT is never returned in
  // the response or logged.
  //
  // This slice ships single-agent status only. An all-agent variant
  // (`GET /agents/memory/compact/status`) is deferred to a follow-up
  // slice to keep the scope tight - the same helper would back it.
  //
  // Response contract:
  //   - 200 missing/empty:
  //       { ok:true, slug, threshold:100, entryCount:0, due:false, empty:true,
  //         previewAvailable:false, requiresConfirmation:true, nextAction:"none" }
  //   - 200 not due:
  //       { ok:true, slug, threshold:100, entryCount:N, due:false,
  //         previewAvailable:false, requiresConfirmation:true, nextAction:"none" }
  //   - 200 due:
  //       { ok:true, slug, threshold:100, entryCount:N, due:true,
  //         previewAvailable:true, requiresConfirmation:true, nextAction:"preview" }
  //   - 400 invalid slug (regex / path-traversal guard)
  //   - 404 unknown agent
  fastify.get<{ Params: { slug: string } }>(
    "/agents/:slug/memory/compact/status",
    async (req, reply) => {
      const slug = req.params.slug;
      if (!isValidSlug(slug)) return reply.code(400).send({ error: "invalid slug" });
      const reg = await loadRegistry(fastify.runtime.projectRoot);
      if (!findEntry(reg, slug)) return reply.code(404).send({ error: `unknown agent: ${slug}` });

      // Resolve the episodic path via the §5.2-B helper.
      let episodicPath: string;
      try {
        episodicPath = resolveMemoryPath(fastify.runtime.agentsDir, slug, "episodic");
      } catch (err) {
        if (err instanceof MemoryFilesError) {
          if (err.code === "path_traversal") {
            fastify.log.warn(
              { phase: "memory-compact-status", slug, reason: "path_traversal blocked" },
              "compact status refused: path traversal attempt"
            );
            return reply.code(400).send({ error: "invalid slug" });
          }
          if (err.code === "invalid_slug") {
            return reply.code(400).send({ error: "invalid slug" });
          }
        }
        throw err;
      }

      // Read episodic. ENOENT / whitespace-only -> empty:true response.
      let content: string;
      try {
        content = await readFile(episodicPath, "utf-8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
          return reply.code(200).send({
            ok: true,
            slug,
            threshold: 100,
            entryCount: 0,
            due: false,
            empty: true,
            previewAvailable: false,
            requiresConfirmation: true,
            nextAction: "none",
          });
        }
        throw err;
      }
      if (content.trim().length === 0) {
        return reply.code(200).send({
          ok: true,
          slug,
          threshold: 100,
          entryCount: 0,
          due: false,
          empty: true,
          previewAvailable: false,
          requiresConfirmation: true,
          nextAction: "none",
        });
      }

      const status = getEpisodicCompactionStatus(content);

      // Server-side log: counts only, never content.
      fastify.log.info(
        {
          phase: "memory-compact-status",
          slug,
          entryCount: status.entryCount,
          threshold: status.threshold,
          due: status.due,
          empty: status.empty,
        },
        "compact status computed"
      );

      const body: {
        ok: true;
        slug: string;
        threshold: number;
        entryCount: number;
        due: boolean;
        empty?: true;
        previewAvailable: boolean;
        requiresConfirmation: true;
        nextAction: "none" | "preview";
      } = {
        ok: true,
        slug,
        threshold: status.threshold,
        entryCount: status.entryCount,
        due: status.due,
        previewAvailable: status.due,
        requiresConfirmation: true,
        nextAction: status.due ? "preview" : "none",
      };
      if (status.empty) body.empty = true;
      return reply.code(200).send(body);
    }
  );
}
