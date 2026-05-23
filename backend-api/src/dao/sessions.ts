import { randomUUID } from "node:crypto";

import type { DB } from "../storage/sqlite.js";

export interface SessionRow {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  session_id: string;
  role: string;
  content: string;
  agent_slug: string | null;
  created_at: string;
}

export interface AgentEventInsert {
  sessionId?: string | null;
  requestId: string;
  agentSlug?: string | null;
  provider?: string | null;
  fallbackUsed?: boolean;
  latencyMs?: number | null;
  status?: string | null;
  /** Compact JSON string of Claude usage / cost metadata (Phase 2.6).
   *  May be null when unavailable (mock provider, auth failure, etc.). */
  usageJson?: string | null;
}

const SESSION_TITLE_MAX = 80;

export function createSession(
  db: DB, opts: { id?: string; title?: string } = {}
): SessionRow {
  const id = opts.id ?? randomUUID();
  const now = new Date().toISOString();
  const title = opts.title?.slice(0, SESSION_TITLE_MAX) ?? null;
  db.prepare(
    "INSERT INTO sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)"
  ).run(id, title, now, now);
  return { id, title, created_at: now, updated_at: now };
}

export function touchSession(db: DB, id: string): void {
  db.prepare("UPDATE sessions SET updated_at = ? WHERE id = ?").run(
    new Date().toISOString(), id
  );
}

export function getSession(db: DB, id: string): SessionRow | undefined {
  return db
    .prepare("SELECT id, title, created_at, updated_at FROM sessions WHERE id = ?")
    .get(id) as SessionRow | undefined;
}

export function listSessions(db: DB, limit = 50): SessionRow[] {
  return db
    .prepare(
      "SELECT id, title, created_at, updated_at FROM sessions ORDER BY updated_at DESC LIMIT ?"
    )
    .all(limit) as SessionRow[];
}

export function insertMessage(
  db: DB,
  row: { sessionId: string; role: string; content: string; agentSlug?: string | null }
): MessageRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO messages (id, session_id, role, content, agent_slug, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, row.sessionId, row.role, row.content, row.agentSlug ?? null, now);
  touchSession(db, row.sessionId);
  return {
    id,
    session_id: row.sessionId,
    role: row.role,
    content: row.content,
    agent_slug: row.agentSlug ?? null,
    created_at: now,
  };
}

export function listMessages(db: DB, sessionId: string, limit = 200): MessageRow[] {
  return db
    .prepare(
      "SELECT id, session_id, role, content, agent_slug, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ?"
    )
    .all(sessionId, limit) as MessageRow[];
}

export function insertAgentEvent(db: DB, e: AgentEventInsert): void {
  db.prepare(
    "INSERT INTO agent_events (id, session_id, request_id, agent_slug, provider, fallback_used, latency_ms, status, usage_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    randomUUID(),
    e.sessionId ?? null,
    e.requestId,
    e.agentSlug ?? null,
    e.provider ?? null,
    e.fallbackUsed ? 1 : 0,
    e.latencyMs ?? null,
    e.status ?? null,
    e.usageJson ?? null,
    new Date().toISOString()
  );
}


// ---------------------------------------------------------------------------
// Phase 3.1 - routing_events DAO
// ---------------------------------------------------------------------------

export interface RoutingEventInsert {
  sessionId?: string | null;
  requestId: string;
  messageId?: string | null;
  selectedSlug: string;
  decisionType: string;
  source: string;
  confidence: string;
  score?: number | null;
  routeHitsJson?: string | null;
  shortlistJson?: string | null;
  appliedRulesJson?: string | null;
  rationale?: string | null;
  clarificationQuestion?: string | null;
  /** Phase 3.2 - JSON array of slugs convened for a `type:"convene"` row. */
  convenedSlugsJson?: string | null;
}

export function insertRoutingEvent(db: DB, e: RoutingEventInsert): void {
  db.prepare(
    "INSERT INTO routing_events " +
      "(id, session_id, request_id, message_id, selected_slug, decision_type, source, confidence, score, route_hits_json, shortlist_json, applied_rules_json, rationale, clarification_question, convened_slugs_json, created_at) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    randomUUID(),
    e.sessionId ?? null,
    e.requestId,
    e.messageId ?? null,
    e.selectedSlug,
    e.decisionType,
    e.source,
    e.confidence,
    e.score ?? null,
    e.routeHitsJson ?? null,
    e.shortlistJson ?? null,
    e.appliedRulesJson ?? null,
    e.rationale ?? null,
    e.clarificationQuestion ?? null,
    e.convenedSlugsJson ?? null,
    new Date().toISOString()
  );
}


// ---------------------------------------------------------------------------
// Phase 3.3 - handoff_events DAO
// ---------------------------------------------------------------------------

/**
 * Status values:
 *   "completed"
 *   "ignored_invalid_slug"
 *   "ignored_same_slug"
 *   "ignored_missing_reason"
 *   "ignored_malformed_json"
 *   "ignored_nexus_target"
 *   "ignored_max_handoff_reached"
 *   "failed_target_call"
 */
export interface HandoffEventInsert {
  sessionId?: string | null;
  requestId: string;
  messageId?: string | null;
  fromSlug: string;
  toSlug: string;
  reason: string;
  status: string;
  ignoredReason?: string | null;
}

export function insertHandoffEvent(db: DB, e: HandoffEventInsert): void {
  db.prepare(
    "INSERT INTO handoff_events " +
      "(id, session_id, request_id, message_id, from_slug, to_slug, reason, status, ignored_reason, created_at) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    randomUUID(),
    e.sessionId ?? null,
    e.requestId,
    e.messageId ?? null,
    e.fromSlug,
    e.toSlug,
    e.reason,
    e.status,
    e.ignoredReason ?? null,
    new Date().toISOString()
  );
}
// ---------------------------------------------------------------------------
// Phase 5.5-A - FTS5 message search over `messages_fts`
// ---------------------------------------------------------------------------

/**
 * Compact result row for `searchMessages`. Excludes the full message
 * body; callers get a `snippet` instead so the response stays compact
 * and the search UI gets ready-to-render highlight markers.
 */
export interface SearchResult {
  sessionId: string;
  messageId: string;
  role: string;
  agentSlug: string | null;
  createdAt: string;
  /** SQLite FTS5 `snippet()` output with HTML-style `<mark>` highlights
   *  around the matched terms. Capped at ~16 tokens of context per side. */
  snippet: string;
}

/**
 * Run an FTS5 MATCH query against `messages_fts` and join back to
 * `messages` for the surrounding metadata. `query` must already be
 * sanitized (the route strips FTS5 operators) so the helper accepts any
 * string and passes it through verbatim.
 *
 * Bounded: the caller's `limit` is clamped to [1, 100] upstream so the
 * helper trusts the value it receives.
 *
 * Privacy: returns a snippet (not the full content). The snippet may
 * still contain user-typed text; callers are searching their own
 * message history, so this is intentional.
 */
export function searchMessages(
  db: DB,
  query: string,
  limit = 50
): SearchResult[] {
  const stmt = db.prepare(
    "SELECT m.session_id AS sessionId, " +
      "m.id AS messageId, " +
      "m.role AS role, " +
      "m.agent_slug AS agentSlug, " +
      "m.created_at AS createdAt, " +
      "snippet(messages_fts, 0, '<mark>', '</mark>', '\u2026', 16) AS snippet " +
      "FROM messages_fts " +
      "JOIN messages m ON m.rowid = messages_fts.rowid " +
      "WHERE messages_fts MATCH ? " +
      "ORDER BY rank " +
      "LIMIT ?"
  );
  return stmt.all(query, limit) as SearchResult[];
}

// ---------------------------------------------------------------------------
// Phase 6-C validation patch (2026-05-20)
// ---------------------------------------------------------------------------
// `getLastAgentSlugBySession` returns the most recent assistant
// message's `agent_slug` for a given sessionId, or null if no
// assistant message has been recorded yet. Used by the session list
// route to surface a "primary agent" hint in the sidebar without
// blowing up the response shape with full message rows.
//
// Read-only single-row query against the existing `messages` table.
// No mutation. Bounded by the existing `(session_id, created_at)`
// access pattern.
export function getLastAgentSlugBySession(
  db: DB,
  sessionId: string
): string | null {
  const row = db
    .prepare(
      "SELECT agent_slug FROM messages WHERE session_id = ? AND role = 'assistant' AND agent_slug IS NOT NULL ORDER BY created_at DESC LIMIT 1"
    )
    .get(sessionId) as { agent_slug: string | null } | undefined;
  return row?.agent_slug ?? null;
}
