import type { FastifyInstance } from "fastify";

import { pingDatabase } from "../storage/sqlite.js";

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/healthz", async (request) => {
    const runtime = fastify.runtime;
    const providers = fastify.providers;

    const dbReady = pingDatabase(fastify.db);
    const claudeReadiness = providers.readiness.claude ?? {
      ready: false,
      reason: "claude provider not registered",
    };
    const mockReadiness = providers.readiness.mock ?? {
      ready: false,
      reason: "mock provider not registered",
    };

    const primaryReadiness = providers.readiness[providers.primaryName];
    const degraded = !(primaryReadiness?.ready === true);
    const setupRequired = Boolean(claudeReadiness.setupRequired);

    return {
      ok: true,
      degraded,
      setupRequired,
      ...(claudeReadiness.setupHint ? { setupHint: claudeReadiness.setupHint } : {}),
      version: "0.2.0",
      service: "creativedge-backend",
      runtimeDir: runtime.rootDir,
      storageReady: true,
      dbReady,
      providers: {
        primary: providers.primaryName,
        claude: claudeReadiness,
        mock: mockReadiness,
      },
      seededAgentSlugs: runtime.seededAgentSlugs,
      requestId: request.id,
    };
  });
}
