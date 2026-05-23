/**
 * Entry point for the CreativEdge backend service.
 *
 * Phase 2.1: service skeleton only.
 * - Bootstrap ~/.creativedge runtime directory
 * - Start Fastify on localhost
 * - Expose GET /healthz
 *
 * Configuration via env (all optional, none required):
 *   CREATIVEDGE_PORT          default 3001
 *   CREATIVEDGE_HOST          default 127.0.0.1
 *   CREATIVEDGE_RUNTIME_DIR   override ~/.creativedge for testing
 *   CREATIVEDGE_PROJECT_ROOT  override project root for testing
 *   LOG_LEVEL                 pino level, default "info"
 */

import { startServer } from "./server.js";

const PORT = Number(process.env.CREATIVEDGE_PORT) || 3001;
const HOST = process.env.CREATIVEDGE_HOST || "127.0.0.1";

startServer({ port: PORT, host: HOST }).catch((err) => {
  // Bootstrap or listen failed — emit a structured error to stderr and exit
  // non-zero so a process supervisor (Electron, nodemon, systemd) can react.
  process.stderr.write(
    JSON.stringify({
      level: "fatal",
      service: "creativedge-backend",
      msg: "failed to start",
      error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err),
      time: new Date().toISOString(),
    }) + "\n"
  );
  process.exit(1);
});
