import Database from "better-sqlite3";

/**
 * SQLite storage layer.
 *
 * Phase 2.1: opened the DB, applied an idempotent baseline schema, set
 * safe pragmas.
 *
 * Phase 5.5-A: refactored the inline schema into a numbered migrations
 * array tracked by `schema_migrations`. Every migration is idempotent on
 * its own (CREATE ... IF NOT EXISTS, PRAGMA-guarded ALTER TABLE) AND
 * recorded in `schema_migrations` once it runs so the runner can skip it
 * on the next boot. Adding a migration is now an array push at the
 * bottom of MIGRATIONS - no rewrite of existing tables, no destructive
 * operations. The baseline migration is a no-op on databases that have
 * already passed through the pre-5.5-A initDatabase code path; it just
 * records the baseline ID so the runner stops re-issuing the baseline
 * CREATE statements on every boot.
 *
 * What this module is NOT responsible for:
 *   - Provider, runtime, routing, convening, handoff, or memory-file logic.
 *   - LLM calls of any kind.
 *   - External HTTP. The only third-party dependency is `better-sqlite3`,
 *     which ships SQLite with FTS5 enabled.
 */
export type DB = Database.Database;

// ---------------------------------------------------------------------------
// Migration types + helpers
// ---------------------------------------------------------------------------

interface Migration {
  /** Stable identifier. Never rename. Used as the primary key in
   *  `schema_migrations`. */
  id: string;
  /** Human-readable label for boot logs. Never used as a lookup key. */
  label: string;
  /** The actual schema change. Must be safe to re-run if the runner ever
   *  loses track of `schema_migrations` (CREATE IF NOT EXISTS, ALTER guarded
   *  by PRAGMA table_info, etc.). */
  up: (db: DB) => void;
}

/**
 * Add a column to an existing table if it isn't already present. SQLite
 * does not support `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, so we
 * inspect PRAGMA table_info first. Safe to call on every boot.
 */
function addColumnIfMissing(
  db: DB,
  table: string,
  column: string,
  columnType: string
): void {
  const rows = db
    .prepare(`PRAGMA table_info(${table})`)
    .all() as Array<{ name: string }>;
  if (rows.some((r) => r.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${columnType}`);
}

// ---------------------------------------------------------------------------
// Migrations array - append-only. Never edit historical migrations.
// ---------------------------------------------------------------------------

const MIGRATIONS: Migration[] = [
  {
    id: "001-baseline",
    label: "baseline schema (sessions, messages, agent_events, routing_events, handoff_events)",
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
          id          TEXT PRIMARY KEY,
          title       TEXT,
          created_at  TEXT NOT NULL,
          updated_at  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS messages (
          id          TEXT PRIMARY KEY,
          session_id  TEXT NOT NULL,
          role        TEXT NOT NULL,
          content     TEXT NOT NULL,
          agent_slug  TEXT,
          created_at  TEXT NOT NULL,
          FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);

        CREATE TABLE IF NOT EXISTS agent_events (
          id             TEXT PRIMARY KEY,
          session_id     TEXT,
          request_id     TEXT NOT NULL,
          agent_slug     TEXT,
          provider       TEXT,
          fallback_used  INTEGER NOT NULL DEFAULT 0,
          latency_ms     INTEGER,
          status         TEXT,
          created_at     TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_events_session ON agent_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_events_request ON agent_events(request_id);

        -- Phase 3.1: per-/chat-turn routing decision audit log.
        CREATE TABLE IF NOT EXISTS routing_events (
          id                     TEXT PRIMARY KEY,
          session_id             TEXT,
          request_id             TEXT NOT NULL,
          message_id             TEXT,
          selected_slug          TEXT NOT NULL,
          decision_type          TEXT NOT NULL,
          source                 TEXT NOT NULL,
          confidence             TEXT NOT NULL,
          score                  INTEGER,
          route_hits_json        TEXT,
          shortlist_json         TEXT,
          applied_rules_json     TEXT,
          rationale              TEXT,
          clarification_question TEXT,
          created_at             TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_routing_session ON routing_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_routing_request ON routing_events(request_id);

        -- Phase 3.3: per-/chat-turn hand-off audit log. One row per detected
        -- handoff attempt, regardless of whether it completed or was ignored.
        -- Status values:
        --   completed                   - target specialist replied successfully.
        --   ignored_invalid_slug        - target slug not in registry or wrong role.
        --   ignored_same_slug           - target equals originating specialist.
        --   ignored_missing_reason      - block had no non-empty reason field.
        --   ignored_malformed_json      - block payload could not be parsed.
        --   ignored_nexus_target        - block targeted the orchestrator.
        --   ignored_max_handoff_reached - one handoff already happened this turn.
        --   failed_target_call          - target call errored or returned no text.
        CREATE TABLE IF NOT EXISTS handoff_events (
          id              TEXT PRIMARY KEY,
          session_id      TEXT,
          request_id      TEXT NOT NULL,
          message_id      TEXT,
          from_slug       TEXT NOT NULL,
          to_slug         TEXT NOT NULL,
          reason          TEXT NOT NULL,
          status          TEXT NOT NULL,
          ignored_reason  TEXT,
          created_at      TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_handoff_session ON handoff_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_handoff_request ON handoff_events(request_id);
      `);
    },
  },
  {
    id: "002-agent-events-usage-json",
    label: "agent_events.usage_json (Phase 2.6 Claude usage/cost metadata)",
    up: (db) => addColumnIfMissing(db, "agent_events", "usage_json", "TEXT"),
  },
  {
    id: "003-routing-events-convened-slugs-json",
    label: "routing_events.convened_slugs_json (Phase 3.2 multi-specialist convening)",
    up: (db) =>
      addColumnIfMissing(db, "routing_events", "convened_slugs_json", "TEXT"),
  },
  {
    id: "004-fts5-messages",
    label: "messages_fts FTS5 virtual table + sync triggers + backfill",
    up: (db) => {
      // External-content mode: the FTS5 vtable doesn't store its own copy
      // of `content`. It references the source `messages` table via its
      // implicit rowid. Three triggers keep the index in sync on
      // INSERT / DELETE / UPDATE of the source table. `content_rowid='rowid'`
      // is the default and is spelled out for clarity.
      db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
          content,
          content='messages',
          content_rowid='rowid',
          tokenize='unicode61 remove_diacritics 1'
        );

        CREATE TRIGGER IF NOT EXISTS messages_fts_ai
          AFTER INSERT ON messages BEGIN
          INSERT INTO messages_fts(rowid, content) VALUES (new.rowid, new.content);
        END;

        CREATE TRIGGER IF NOT EXISTS messages_fts_ad
          AFTER DELETE ON messages BEGIN
          INSERT INTO messages_fts(messages_fts, rowid, content)
            VALUES('delete', old.rowid, old.content);
        END;

        CREATE TRIGGER IF NOT EXISTS messages_fts_au
          AFTER UPDATE ON messages BEGIN
          INSERT INTO messages_fts(messages_fts, rowid, content)
            VALUES('delete', old.rowid, old.content);
          INSERT INTO messages_fts(rowid, content)
            VALUES (new.rowid, new.content);
        END;
      `);

      // Backfill: any existing messages rows that aren't yet indexed get
      // inserted into the FTS table. The `WHERE rowid NOT IN ...` clause
      // makes the backfill idempotent if the migration ever runs on a DB
      // where the table was already partially populated.
      db.exec(`
        INSERT INTO messages_fts(rowid, content)
          SELECT rowid, content FROM messages
          WHERE rowid NOT IN (SELECT rowid FROM messages_fts);
      `);
    },
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function initDatabase(dbPath: string): DB {
  const db = new Database(dbPath);

  // Safer defaults for a local desktop app.
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = NORMAL");

  runMigrations(db);
  return db;
}

/**
 * Apply pending migrations in `MIGRATIONS` order, recording each one in
 * `schema_migrations`. Already-applied migrations are skipped. Each
 * migration runs inside its own transaction so a partial failure doesn't
 * leave the tracker out of sync with the actual schema.
 *
 * Re-runnable: calling this on a DB that's already fully migrated is a
 * cheap no-op (one SELECT, no writes).
 *
 * Re-callable safety: even if `schema_migrations` is deleted and the
 * baseline migration runs again, its body is purely `CREATE IF NOT EXISTS`
 * and `PRAGMA`-guarded `ALTER TABLE`, so it can't drop or duplicate data.
 * The same is true for the FTS5 migration: `CREATE VIRTUAL TABLE IF NOT EXISTS`
 * and `CREATE TRIGGER IF NOT EXISTS`, plus a `WHERE rowid NOT IN (...)`
 * guard on the backfill insert.
 */
export function runMigrations(db: DB): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id          TEXT PRIMARY KEY,
      applied_at  TEXT NOT NULL
    );
  `);
  const appliedRows = db
    .prepare("SELECT id FROM schema_migrations")
    .all() as Array<{ id: string }>;
  const applied = new Set(appliedRows.map((r) => r.id));

  const insertRecord = db.prepare(
    "INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)"
  );

  for (const m of MIGRATIONS) {
    if (applied.has(m.id)) continue;
    const txn = db.transaction(() => {
      m.up(db);
      insertRecord.run(m.id, new Date().toISOString());
    });
    txn();
  }
}

/** Liveness probe used by /healthz. Returns true iff a trivial query succeeds. */
export function pingDatabase(db: DB): boolean {
  try {
    const row = db.prepare("SELECT 1 AS ok").get() as { ok: number } | undefined;
    return row?.ok === 1;
  } catch {
    return false;
  }
}

/** List the IDs of every applied migration in source order. Used by the
 *  /healthz endpoint (optional) and the test runner. */
export function listAppliedMigrations(db: DB): string[] {
  try {
    const rows = db
      .prepare("SELECT id FROM schema_migrations ORDER BY applied_at ASC")
      .all() as Array<{ id: string }>;
    return rows.map((r) => r.id);
  } catch {
    return [];
  }
}
