import { randomUUID } from "node:crypto";

/**
 * Generate a request id, honoring an upstream `x-request-id` header if
 * the client supplied one (Electron shell, internal tooling, traces).
 *
 * Wired into Fastify via the `genReqId` constructor option in server.ts;
 * downstream handlers read `request.id`.
 */
export function generateRequestId(headers: Record<string, unknown>): string {
  const incoming = headers["x-request-id"];
  if (typeof incoming === "string" && incoming.length > 0 && incoming.length <= 128) {
    return incoming;
  }
  return randomUUID();
}
