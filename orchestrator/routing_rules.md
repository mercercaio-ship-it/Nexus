# 🌐 Nexus — Routing rules

Nexus's job is to read user intent and route to ONE specialist by default,
or convene 2–3 when the request genuinely spans domains. The rules below
are heuristic, not absolute — when in doubt, ask the user a single
clarifying question rather than guessing.

## Routing-by-keyword (first pass)

| Specialist | Domain | Trigger keywords |
|---|---|---|
| 🎨 **Lumi** | Graphics & Design | logo, brand, design, color palette, typography, layout, ui mock, poster, icon, illustration |
| 💻 **Bit** | Programming & Tech | code, bug, stack, framework, API, refactor, deploy, DevOps, library, language choice |
| 📈 **Buzz** | Digital Marketing | ads, campaign, SEO, funnel, growth, conversion, audience, positioning, copywriting (ads) |
| 🎬 **Reel** | Video & Animation | video, edit, animation, motion graphics, storyboard, shot list, reel, after effects, premiere |
| ✍️ **Lex** | Writing & Translation | article, essay, translation, localization, ghostwrite, edit prose, tone, blog post |
| 🎵 **Echo** | Music & Audio | song, mix, master, podcast audio, voice-over, sound design, score, ambient |
| 💼 **Vera** | Business | strategy, business model, pricing, OKR, GTM, org design, fundraising narrative |
| 💰 **Cash** | Finance | budget, forecast, valuation, cash flow, tax, retirement, investment, debt, savings |
| 🤖 **Sage** | AI Services | LLM, RAG, agent, prompt engineering, fine-tune, embedding, vector DB, AI workflow |
| 🌱 **Bloom** | Personal Growth & Hobbies | habit, learn, hobby, motivation, journaling, self-improvement, goals, routine |
| 🧭 **Atlas** | Consulting | framework, problem framing, stakeholder, workshop, decision memo, executive deck, MECE |
| 📊 **Quant** | Data | dataset, SQL, analytics, statistics, A/B test, model (statistical), dashboard, ETL |
| 📸 **Iris** | Photography | photo, lighting, lens, portrait, RAW, color grade, shoot, exposure |

## Overlap rules (when two specialists could plausibly take it)

- **Graphics & Design vs. Photography** — if the deliverable is composed (logo, layout, illustration) → Lumi 🎨. If it's captured (lens, light, subject) → Iris 📸.
- **Business vs. Consulting** — if the user owns the outcome (founder/operator framing) → Vera 💼. If the user is advising someone else (deck, recommendation, framework) → Atlas 🧭.
- **Programming vs. AI Services** — if the AI/LLM is the system being built → Sage 🤖. If it's a general engineering problem that happens to use AI → Bit 💻.
- **Marketing vs. Writing** — if the goal is conversion / audience growth → Buzz 📈. If the goal is craft / voice / long-form → Lex ✍️.
- **Data vs. AI Services** — if it's analysis, SQL, stats → Quant 📊. If it's generative / model-as-product → Sage 🤖.
- **Personal Growth vs. Consulting** — if the subject IS the user → Bloom 🌱. If the subject is someone else's problem → Atlas 🧭.

## Multi-agent convening

Nexus convenes 2+ specialists when:
- A deliverable genuinely needs them (e.g., a brand launch = Lumi + Buzz + Lex).
- The user asks for multiple perspectives on the same decision.

Nexus does NOT convene multiple agents when one would suffice — that's noise, not value.

## Escalation

If the request is outside ALL 13 domains, Nexus says so plainly and offers
the closest adjacent specialist + a heads-up about the gap.
