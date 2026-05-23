import Fastify from "fastify";
import cors from "@fastify/cors";

import { ensureRuntimeDir, type RuntimeContext } from "./bootstrap/ensureRuntimeDir.js";
import { initDatabase, type DB } from "./storage/sqlite.js";
import { initProviderRegistry, type ProviderRegistry } from "./providers/providerRegistry.js";
import { createLogger } from "./logging/logger.js";
import { generateRequestId } from "./utils/requestId.js";
import { healthRoutes } from "./routes/health.js";
import { agentRoutes } from "./routes/agents.js";
import { sessionRoutes } from "./routes/sessions.js";
import { backupRoutes } from "./routes/backup.js";
import { chatRoutes } from "./routes/chat.js";
import { opsRoutes } from "./routes/ops.js";

declare module "fastify" {
  interface FastifyInstance {
    runtime: RuntimeContext;
    db: DB;
    providers: ProviderRegistry;
  }
}

export interface ServerOptions {
  port: number;
  host: string;
}

export interface StartedServer {
  fastify: unknown;
  runtime: RuntimeContext;
  db: DB;
}

export async function startServer(opts: ServerOptions): Promise<StartedServer> {
  const runtime = await ensureRuntimeDir();

  const logger = createLogger(runtime.logsDir);
  logger.info(
    {
      runtimeDir: runtime.rootDir,
      projectRoot: runtime.projectRoot,
      seededAgents: runtime.seededAgentSlugs.length,
    },
    "runtime ready"
  );

  const db = initDatabase(runtime.dbPath);
  logger.info({ dbPath: runtime.dbPath }, "sqlite ready");

  const providers = await initProviderRegistry(runtime.providersPath);
  logger.info(
    {
      configuredPrimary: providers.configuredPrimary,
      selectedPrimary: providers.primaryName,
      readiness: providers.readiness,
    },
    "providers initialized"
  );

  const fastify = Fastify({
    loggerInstance: logger,
    genReqId: (req) => generateRequestId(req.headers as Record<string, unknown>),
    disableRequestLogging: false,
    trustProxy: false,
  });

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      try {
        const u = new URL(origin);
        const isLocal =
          u.hostname === "localhost" ||
          u.hostname === "127.0.0.1" ||
          u.hostname === "[::1]";
        if (isLocal) return cb(null, true);
      } catch {
        /* fall through to deny */
      }
      return cb(new Error("CORS: origin not allowed (" + origin + ")"), false);
    },
    credentials: false,
  });

  fastify.decorate("runtime", runtime);
  fastify.decorate("db", db);
  fastify.decorate("providers", providers);

  await fastify.register(healthRoutes);
  await fastify.register(agentRoutes);
  await fastify.register(sessionRoutes);
  await fastify.register(backupRoutes);
  await fastify.register(opsRoutes);
  await fastify.register(chatRoutes);

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info({ signal }, "shutting down");
    try {
      await fastify.close();
    } catch (err) {
      logger.error({ err }, "fastify close failed");
    }
    try {
      db.close();
    } catch (err) {
      logger.error({ err }, "db close failed");
    }
    process.exit(0);
  };
  process.once("SIGINT", () => { void shutdown("SIGINT"); });
  process.once("SIGTERM", () => { void shutdown("SIGTERM"); });

  await fastify.listen({ port: opts.port, host: opts.host });
  logger.info({ port: opts.port, host: opts.host }, "listening");

  return { fastify, runtime, db };
}
