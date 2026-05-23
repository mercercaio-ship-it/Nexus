import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";
import pino, { type Logger } from "pino";

/**
 * Structured JSONL logger.
 *
 * Writes one JSON object per line to:
 *   ~/.creativedge/logs/creativedge-YYYY-MM-DD.log
 *
 * Conversation content is never logged. Fastify request hooks log:
 *   timestamp, level, requestId, method, url, statusCode, latencyMs, error?
 *
 * Auth headers are redacted defensively (we don't send any today, but if
 * a downstream proxy adds Authorization later, we never want it persisted).
 */
export function createLogger(logsDir: string): Logger {
  mkdirSync(logsDir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const file = join(logsDir, `creativedge-${date}.log`);
  const stream = createWriteStream(file, { flags: "a" });

  return pino(
    {
      level: process.env.LOG_LEVEL ?? "info",
      base: { service: "creativedge-backend" },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.headers['x-api-key']",
        ],
        remove: true,
      },
      // Make sure conversation content never sneaks in via auto-serialization.
      serializers: {
        req(req: { method?: string; url?: string; id?: string; headers?: Record<string, unknown> }) {
          return {
            id: req.id,
            method: req.method,
            url: req.url,
            // headers intentionally summarized — no body, no cookies
            host: req.headers?.host,
            ua: req.headers?.["user-agent"],
          };
        },
        res(res: { statusCode?: number }) {
          return { statusCode: res.statusCode };
        },
      },
    },
    stream
  );
}
