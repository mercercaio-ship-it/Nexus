# CreativEdge — Architecture

## The shape of a turn

```
user ──▶ 🌐 Nexus (orchestrator)
              │
              │  reads intent
              │  ├─ unambiguous → routes to ONE specialist
              │  └─ ambiguous   → asks ONE clarifying question, then routes
              ▼
       one of the 13 specialists
              │
              ▼
       response back through Nexus
              │
              ▼
            user
```

For multi-domain requests, Nexus convenes 2–3 specialists in parallel and
synthesizes their answers into a single reply (with attribution).

## MBTI assignments

| Agent | Domain | MBTI | Temperament |
|---|---|---|---|
| 🌐 Nexus | Orchestration | ESFJ — The Consul | Sentinel |
| 🎨 Lumi | Graphics & Design | ISFP — The Artist | Explorer |
| 💻 Bit | Programming & Tech | INTP — The Logician | Analyst |
| 📈 Buzz | Digital Marketing | ENTP — The Debater | Analyst |
| 🎬 Reel | Video & Animation | ENFP — The Campaigner | Diplomat |
| ✍️ Lex | Writing & Translation | INFJ — The Advocate | Diplomat |
| 🎵 Echo | Music & Audio | INFP — The Mediator | Diplomat |
| 💼 Vera | Business | ENTJ — The Commander | Analyst |
| 💰 Cash | Finance | ISTJ — The Logistician | Sentinel |
| 🤖 Sage | AI Services | INTJ — The Architect | Analyst |
| 🌱 Bloom | Personal Growth & Hobbies | ENFJ — The Protagonist | Diplomat |
| 🧭 Atlas | Consulting | ESTJ — The Executive | Sentinel |
| 📊 Quant | Data | ISTP — The Virtuoso | Explorer |
| 📸 Iris | Photography | ISFJ — The Defender | Sentinel |

### Temperament balance

- **Analysts (NT)** — Bit (INTP), Buzz (ENTP), Vera (ENTJ), Sage (INTJ)
- **Diplomats (NF)** — Reel (ENFP), Lex (INFJ), Echo (INFP), Bloom (ENFJ)
- **Sentinels (SJ)** — Cash (ISTJ), Atlas (ESTJ), Iris (ISFJ), Nexus (ESFJ)
- **Explorers (SP)** — Lumi (ISFP), Quant (ISTP)

This isn't a uniform spread (3 of 16 types are unused), but the four
temperaments are all represented, which is what matters for behavioral
variety across the system.

## Memory model

Each agent owns:
- **`memory/core_memory.md`** — durable facts. Always prepended to the
  agent's context when it's invoked.
- **`memory/episodic_memory.md`** — append-only per-session notes. Older
  entries are summarized into `core_memory.md` on a cadence (manual for now).

Nexus has its own memory at `orchestrator/memory/` — primarily for
user-level preferences ("the user prefers concise answers", "the user is
a designer working on a finance project") that should bias routing.

## Wiring (suggested)

A minimal runtime would:

1. Load `orchestrator/registry.json` on boot.
2. On each user turn, call Nexus with the user message + registry.
3. Nexus returns a routing decision: `{ "specialist": "<slug>", "reason": "..." }` (or a list for multi-agent turns).
4. Load `agents/<slug>/system_prompt.md` + `agents/<slug>/memory/core_memory.md` and run the turn.
5. After the response, append a one-line note to `agents/<slug>/memory/episodic_memory.md`.

The folder layout is intentionally framework-agnostic — it's just files.
