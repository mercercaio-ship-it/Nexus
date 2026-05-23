import type { FastifyInstance } from "fastify";

import {
  BackupConfigError,
  getDefaultBackupConfig,
  loadBackupConfig,
  saveBackupConfig,
  type BackupConfig,
} from "../backup/backupConfig.js";
import {
  BackupGitError,
  commitBackup,
  ensureBackupRepo,
  getGitStatus,
  gitAvailable,
  hasOriginRemote,
  isBackupRepoInitialized,
  pushBackup,
  redactRemote,
  syncAgentsToBackupRepo,
  writeBackupGitignore,
} from "../backup/backupGit.js";

/**
 * Phase 5.6-A - opt-in backup routes.
 *
 * Four endpoints, all confirmed-by-default-false:
 *
 *   GET  /backup/status     read-only readiness + sanitized config view.
 *   POST /backup/config     merge a config patch; `confirmed:true` required.
 *   POST /backup/dry-run    copy + status only; no commit, no push.
 *   POST /backup/run        copy + status + commit; push only when `push:true`
 *                           AND remote configured AND `confirmed:true`.
 *
 * Hard contract for the slice:
 *   - Backups are OFF by default. Every mutation path checks `enabled`
 *     in `backup.json` and returns 400 with a "backup not enabled" hint
 *     when the user hasn't opted in.
 *   - `/backup/run` NEVER pushes unless `push:true` is in the body AND
 *     the config has a non-null remote AND the local `origin` remote
 *     resolves. Two of the three are double-checked server-side.
 *   - `sessions.db`, logs, `providers.json`, `.env`, `*.key`, `*.pem` are
 *     excluded by both the copy filter (only `*.md` files inside
 *     `agents/<slug>/memory/` are eligible) AND the generated `.gitignore`.
 *   - Remote URLs are redacted before being echoed in responses or logs.
 *   - No GitHub API call, no token storage, no nightly schedule, no
 *     destructive restore - all deferred to §5.6-B / §5.6-C.
 */
export async function backupRoutes(fastify: FastifyInstance): Promise<void> {
  const runtimeRoot = fastify.runtime.rootDir;

  // -------------------------------------------------------------------
  // GET /backup/status
  // -------------------------------------------------------------------
  fastify.get("/backup/status", async (_req, reply) => {
    const cfg =
      (await safeLoadConfig(fastify, runtimeRoot)) ??
      getDefaultBackupConfig(runtimeRoot);
    const gitReady = await gitAvailable();
    const repoReady = await isBackupRepoInitialized(cfg.repoDir);
    const remoteConfigured = repoReady ? await hasOriginRemote(cfg.repoDir) : false;
    const setupRequired = !(gitReady && repoReady && cfg.enabled);
    const nextAction = !gitReady
      ? "install-git"
      : !cfg.enabled
        ? "configure"
        : !repoReady
          ? "dry-run"
          : remoteConfigured
            ? "run"
            : "configure-remote";
    return reply.code(200).send({
      ok: true,
      enabled: cfg.enabled,
      gitReady,
      repoReady,
      remoteConfigured,
      remote: redactRemote(cfg.remote),
      includeSessionsDb: cfg.includeSessionsDb,
      setupRequired,
      nextAction,
      repoDir: cfg.repoDir,
      sourceDir: cfg.sourceDir,
    });
  });

  // -------------------------------------------------------------------
  // POST /backup/config
  // -------------------------------------------------------------------
  fastify.post<{
    Body: {
      enabled?: boolean;
      remote?: string | null;
      includeSessionsDb?: boolean;
      confirmed?: boolean;
    };
  }>("/backup/config", async (req, reply) => {
    const { enabled, remote, includeSessionsDb, confirmed } = req.body ?? {};
    if (confirmed !== true) {
      return reply.code(400).send({
        error: "confirmed must be true to change backup config",
        hint: 'Send { "enabled": true, "confirmed": true } at minimum.',
      });
    }
    try {
      const merged = await saveBackupConfig(runtimeRoot, {
        enabled,
        remote,
        includeSessionsDb,
      });
      fastify.log.info(
        {
          phase: "backup-config",
          enabled: merged.enabled,
          includeSessionsDb: merged.includeSessionsDb,
          remoteConfigured: merged.remote !== null,
        },
        "backup config updated"
      );
      return reply.code(200).send({
        ok: true,
        enabled: merged.enabled,
        remote: redactRemote(merged.remote),
        includeSessionsDb: merged.includeSessionsDb,
        repoDir: merged.repoDir,
        sourceDir: merged.sourceDir,
        updatedAt: merged.updatedAt,
      });
    } catch (err) {
      if (err instanceof BackupConfigError) {
        if (err.code === "invalid_remote") {
          return reply.code(400).send({ error: err.message });
        }
        if (err.code === "path_escapes_runtime" || err.code === "invalid_path") {
          return reply.code(400).send({ error: err.message });
        }
        return reply.code(500).send({ error: "backup config IO failed" });
      }
      throw err;
    }
  });

  // -------------------------------------------------------------------
  // POST /backup/dry-run
  // -------------------------------------------------------------------
  fastify.post<{ Body: { confirmed?: boolean } }>(
    "/backup/dry-run",
    async (req, reply) => {
      const { confirmed } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to run a backup dry-run",
        });
      }
      const cfg = await safeLoadConfig(fastify, runtimeRoot);
      if (!cfg || !cfg.enabled) {
        return reply.code(400).send({
          error: "backup is not enabled",
          hint: "POST /backup/config with { enabled:true, confirmed:true } first.",
        });
      }
      if (!(await gitAvailable())) {
        return reply.code(503).send({
          error: "git is not installed or not on PATH",
          setupRequired: true,
          nextAction: "install-git",
        });
      }
      try {
        await ensureBackupRepo(cfg.repoDir);
        await writeBackupGitignore(cfg.repoDir);
        const copy = await syncAgentsToBackupRepo(cfg.sourceDir, cfg.repoDir);
        const status = await getGitStatus(cfg.repoDir);
        fastify.log.info(
          {
            phase: "backup-dry-run",
            filesConsidered: copy.filesConsidered,
            filesCopied: copy.filesCopied,
            added: status.added,
            modified: status.modified,
            deleted: status.deleted,
            untracked: status.untracked,
          },
          "backup dry-run summary"
        );
        return reply.code(200).send({
          ok: true,
          changed: status.changed,
          filesConsidered: copy.filesConsidered,
          filesCopied: copy.filesCopied,
          filesSkippedCount: copy.filesSkipped.length,
          statusSummary: {
            added: status.added,
            modified: status.modified,
            deleted: status.deleted,
            untracked: status.untracked,
          },
          pushReady: false,
        });
      } catch (err) {
        return mapBackupError(reply, err);
      }
    }
  );

  // -------------------------------------------------------------------
  // POST /backup/run
  // -------------------------------------------------------------------
  fastify.post<{ Body: { confirmed?: boolean; push?: boolean } }>(
    "/backup/run",
    async (req, reply) => {
      const { confirmed, push } = req.body ?? {};
      if (confirmed !== true) {
        return reply.code(400).send({
          error: "confirmed must be true to run a backup",
        });
      }
      const cfg = await safeLoadConfig(fastify, runtimeRoot);
      if (!cfg || !cfg.enabled) {
        return reply.code(400).send({
          error: "backup is not enabled",
          hint: "POST /backup/config with { enabled:true, confirmed:true } first.",
        });
      }
      if (!(await gitAvailable())) {
        return reply.code(503).send({
          error: "git is not installed or not on PATH",
          setupRequired: true,
          nextAction: "install-git",
        });
      }
      try {
        await ensureBackupRepo(cfg.repoDir);
        await writeBackupGitignore(cfg.repoDir);
        const copy = await syncAgentsToBackupRepo(cfg.sourceDir, cfg.repoDir);
        const status = await getGitStatus(cfg.repoDir);
        if (!status.changed) {
          fastify.log.info(
            {
              phase: "backup-run",
              changed: false,
              filesConsidered: copy.filesConsidered,
            },
            "backup run: nothing to commit"
          );
          return reply.code(200).send({
            ok: true,
            changed: false,
            committed: false,
            pushed: false,
          });
        }
        const message = "backup: update CreativEdge agent memory";
        const commit = await commitBackup(cfg.repoDir, message);

        // Pushing requires:
        //   - push:true explicitly in the request body
        //   - cfg.remote not null
        //   - local repo has an `origin` remote configured (user must
        //     `git remote add origin <url>` once)
        let pushResult: { pushed: boolean; reason?: string } = {
          pushed: false,
          reason: "push not requested",
        };
        if (push === true) {
          if (!cfg.remote) {
            pushResult = {
              pushed: false,
              reason: "no remote configured in backup.json",
            };
          } else if (!(await hasOriginRemote(cfg.repoDir))) {
            pushResult = {
              pushed: false,
              reason:
                "local origin remote not set; run `git remote add origin <url>` in " +
                cfg.repoDir,
            };
          } else {
            pushResult = await pushBackup(cfg.repoDir);
          }
        }

        fastify.log.info(
          {
            phase: "backup-run",
            changed: true,
            committed: commit.committed,
            pushed: pushResult.pushed,
            filesConsidered: copy.filesConsidered,
            filesCopied: copy.filesCopied,
          },
          "backup run completed"
        );

        return reply.code(200).send({
          ok: true,
          changed: true,
          committed: commit.committed,
          commitHash: commit.hash,
          commitMessage: commit.message,
          pushed: pushResult.pushed,
          pushReason: pushResult.reason ?? null,
          statusSummary: {
            added: status.added,
            modified: status.modified,
            deleted: status.deleted,
            untracked: status.untracked,
          },
        });
      } catch (err) {
        return mapBackupError(reply, err);
      }
    }
  );
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function safeLoadConfig(
  fastify: FastifyInstance,
  runtimeRoot: string
): Promise<BackupConfig | null> {
  try {
    return await loadBackupConfig(runtimeRoot);
  } catch (err) {
    fastify.log.warn(
      {
        phase: "backup-config-load",
        reason: err instanceof Error ? err.message : String(err),
      },
      "backup.json read failed"
    );
    return null;
  }
}

function mapBackupError(reply: import("fastify").FastifyReply, err: unknown) {
  if (err instanceof BackupGitError) {
    if (err.code === "git_missing") {
      return reply.code(503).send({
        error: err.message,
        setupRequired: true,
        nextAction: "install-git",
      });
    }
    if (err.code === "git_failed") {
      return reply.code(500).send({ error: err.message });
    }
    if (err.code === "path_escapes_repo") {
      return reply.code(400).send({ error: err.message });
    }
    if (err.code === "too_many_files") {
      return reply.code(413).send({ error: err.message });
    }
    if (err.code === "io_error") {
      return reply.code(500).send({ error: err.message });
    }
  }
  if (err instanceof BackupConfigError) {
    if (err.code === "invalid_remote" || err.code === "path_escapes_runtime" || err.code === "invalid_path") {
      return reply.code(400).send({ error: err.message });
    }
    return reply.code(500).send({ error: err.message });
  }
  throw err;
}
