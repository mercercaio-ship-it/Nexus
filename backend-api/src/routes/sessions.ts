import type { FastifyInstance } from "fastify";

import {
  getLastAgentSlugBySession,
  getSession,
  listMessages,
  listSessions,
  searchMessages,
  type MessageRow,
  type SessionRow,
} from "../dao/sessions.js";

// Phase 6-C validation patch (2026-05-20)
// ---------------------------------------------------------------------------
// `GET /sessions` and `GET /sessions/:id` now return a camelCase payload
// with `ok:true` at the top, matching the contract the Phase 6-C UI
// (SessionSidebar + App.selectSession) expects. The DAO still works on
// snake_case SQLite columns; the route layer is purely a JSON shape
// adapter. `GET /sessions` additionally surfaces `lastAgentSlug` per
// session — the most recent message's agent_slug — so the sidebar can
// show "Session X · graphics-design" at a glance without an extra
// round-trip per row. `/sessions/search` was already camelCase and is
// unchanged. No DAO mutation, no provider call, no memory file read.

interface SessionListItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  lastAgentSlug: string | null;
}

interface SessionDetailItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MessageItem {
  id: string;
  role: string;
  content: string;
  agentSlug: string | null;
  createdAt: string;
}

function mapSessionDetail(row: SessionRow): SessionDetailItem {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row: MessageRow): MessageItem {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    agentSlug: row.agent_slug,
    createdAt: row.created_at,
  };
}

export async function sessionRoutes(fastify: FastifyInstance): Promise<void> {
  // -------------------------------------------------------------------------
  // GET /sessions?limit=<n>
  // Compact list, newest-first by updated_at, with lastAgentSlug pulled
  // from each session's most recent message (single SQL query per id).
  // Bounded limit: max 200, default 50.
  // -------------------------------------------------------------------------
  fastify.get<{ Querystring: { limit?: string } }>("/sessions", async (req) => {
    const raw = Number(req.query?.limit ?? 50);
    const limit = Math.min(Number.isFinite(raw) && raw > 0 ? raw : 50, 200);
    const rows = listSessions(fastify.db, limit);
    const items: SessionListItem[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastAgentSlug: getLastAgentSlugBySession(fastify.db, row.id),
    }));
    return { ok: true, sessions: items };
  });

  // -------------------------------------------------------------------------
  // GET /sessions/search?q=<query>&limit=<n>
  // Phase 5.5-A - FTS5-backed message search over `messages_fts`.
  // Read-only; preserved verbatim. Already camelCase in its result rows.
  // -------------------------------------------------------------------------
  fastify.get<{ Querystring: { q?: string; limit?: string } }>(
    "/sessions/search",
    async (req, reply) => {
      const rawQ = req.query?.q;
      if (typeof rawQ !== "string" || rawQ.trim().length === 0) {
        return reply.code(400).send({ error: "q must be a non-empty string" });
      }
      if (rawQ.length > 200) {
        return reply.code(400).send({ error: "q too long (max 200 chars)" });
      }

      const cleaned = rawQ
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned.length === 0) {
        return reply
          .code(400)
          .send({ error: "q has no searchable tokens after sanitization" });
      }

      const rawLimit = Number(req.query?.limit ?? 50);
      const limit = Math.min(
        Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 50,
        100
      );

      let results;
      try {
        results = searchMessages(fastify.db, cleaned, limit);
      } catch (err) {
        fastify.log.warn(
          {
            phase: "messages-search",
            reason: err instanceof Error ? err.message : String(err),
          },
          "search failed"
        );
        return reply.code(500).send({ error: "search failed" });
      }

      fastify.log.info(
        {
          phase: "messages-search",
          qChars: cleaned.length,
          limit,
          results: results.length,
        },
        "message search ran"
      );

      return reply
        .code(200)
        .send({ ok: true, q: cleaned, count: results.length, results });
    }
  );

  // -------------------------------------------------------------------------
  // GET /sessions/:id
  // Returns session metadata + messages, both camelCase. 404 if not found.
  // -------------------------------------------------------------------------
  fastify.get<{ Params: { id: string } }>("/sessions/:id", async (req, reply) => {
    const id = req.params.id;
    if (typeof id !== "string" || id.length === 0 || id.length > 64) {
      return reply.code(400).send({ error: "invalid session id" });
    }
    const session = getSession(fastify.db, id);
    if (!session) return reply.code(404).send({ error: "session not found" });
    const rows = listMessages(fastify.db, id);
    return {
      ok: true,
      session: mapSessionDetail(session),
      messages: rows.map(mapMessage),
    };
  });
}
