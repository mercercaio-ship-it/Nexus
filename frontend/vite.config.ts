import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CreativEdge Phase 6-A: Vite config for the chat UI.
//
// Dev proxy: forwards every backend route to the local Fastify server on
// 127.0.0.1:3001 so the browser only ever sees same-origin traffic. This
// matters for `/chat` specifically because that route calls `reply.hijack()`
// to write raw SSE - after hijack, Fastify's CORS plugin can't flush the
// `Access-Control-Allow-Origin` header to the streaming response, and a
// dev-cross-origin fetch fails with the generic "Failed to fetch" the
// browser surfaces for blocked CORS streams. Proxying solves that without
// touching the backend; the backend stays exactly as Phase 5 validated.
//
// Production builds set `import.meta.env.VITE_API_URL` to whatever absolute
// URL the deployed backend lives at; the proxy here is dev-only.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: "127.0.0.1",
    proxy: {
      "/chat": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        // SSE: don't buffer; pass the stream through verbatim.
        ws: false,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            // Discourage any intermediate compression that would
            // hold the stream until close.
            delete proxyRes.headers["content-length"];
          });
        },
      },
      "/agents": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/sessions": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/backup": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/healthz": { target: "http://127.0.0.1:3001", changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
