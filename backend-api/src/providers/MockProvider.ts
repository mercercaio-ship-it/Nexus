import type {
  Provider,
  ProviderCallOptions,
  ProviderChunk,
  ProviderMessage,
  ProviderReadiness,
} from "./Provider.js";

/**
 * MockProvider — always ready, emits a short, deterministic streamed
 * response. Used for:
 *   - /healthz readiness reporting
 *   - local development before Claude auth is wired
 *   - tests
 *
 * NOT a fallback for production user conversations. The provider registry
 * only falls back to mock when the primary provider is unverified AND the
 * caller explicitly opts in. We never silently downgrade a real chat turn
 * to mock.
 */
export class MockProvider implements Provider {
  readonly name = "mock";

  async checkReady(): Promise<ProviderReadiness> {
    return { ready: true };
  }

  async *call(
    messages: ProviderMessage[],
    _options: ProviderCallOptions
  ): AsyncIterable<ProviderChunk> {
    const last = messages[messages.length - 1]?.content ?? "";
    const trimmed = last.length > 120 ? last.slice(0, 120) + "…" : last;
    const reply = `🧪 mock - I received: "${trimmed}"`;

    // Stream in small chunks so consumers exercise the streaming path.
    const parts = reply.match(/.{1,16}/g) ?? [reply];
    for (const p of parts) {
      yield { type: "text", text: p };
    }
    yield { type: "done" };
  }
}
