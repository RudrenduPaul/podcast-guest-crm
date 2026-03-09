<div align="center">

<h1>🎙️ Podcast Guest CRM</h1>

<p><em>AI-native guest lifecycle management for podcast hosts and booking agencies.<br/>
From discovery through post-episode follow-up — with Claude handling the work people dread most.</em></p>

<!-- Activity -->
<p>
  <img src="https://img.shields.io/github/last-commit/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=last%20commit" alt="Last Commit"/>
  <img src="https://img.shields.io/github/commit-activity/m/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=commits%2Fmonth" alt="Commit Activity"/>
  <img src="https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square" alt="PRs Welcome"/>
</p>

<!-- Stack -->
<p>
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Fastify-4.26-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"/>
  <img src="https://img.shields.io/badge/pnpm-monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"/>
</p>

<!-- AI & Data -->
<p>
  <img src="https://img.shields.io/badge/Claude-claude--sonnet--4--6-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI"/>
  <img src="https://img.shields.io/badge/Drizzle_ORM-SQLite%20%2F%20Turso-C5F74F?style=for-the-badge&logoColor=black" alt="Drizzle ORM"/>
  <img src="https://img.shields.io/badge/Zod-validation-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
</p>

<!-- CI & Security -->
<p>
  <img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI"/>
  <img src="https://img.shields.io/badge/CodeQL-enabled-6366f1?style=for-the-badge&logo=github&logoColor=white" alt="CodeQL"/>
  <img src="https://img.shields.io/badge/License-Proprietary-64748b?style=for-the-badge" alt="License"/>
</p>

<br/>

<p>
  Built by <strong>Rudrendu Paul</strong> &amp; <strong>Sourav Nandy</strong> &nbsp;·&nbsp; Developed with <a href="https://claude.ai/code"><strong>Claude Code</strong></a>
</p>

<p>
  <a href="#the-problem">Problem</a> &nbsp;·&nbsp;
  <a href="#whats-built">What's Built</a> &nbsp;·&nbsp;
  <a href="#architecture">Architecture</a> &nbsp;·&nbsp;
  <a href="#ai-layer">AI Features</a> &nbsp;·&nbsp;
  <a href="#claude-code-sub-agents">Sub-Agents</a> &nbsp;·&nbsp;
  <a href="#getting-started">Quick Start</a>
</p>

</div>

---

## The Problem

Every podcast host has lost a guest to the follow-up black hole. You find someone great, send an email, they don't reply, and three weeks later you can't remember the thread, the guest's name is buried in a spreadsheet somewhere, and the moment has passed.

For booking agencies managing multiple shows simultaneously — tracking hundreds of pitches, recording dates, follow-up sequences, and client reporting across 10+ concurrent campaigns — spreadsheets don't just fail, they actively destroy relationship capital.

The tools that exist don't fit the problem. Generic CRMs (HubSpot, Pipedrive) are designed for sales pipelines, not relationship pipelines. PodMatch and MatchMaker help you *find* guests; they don't help you *manage* the months-long process of booking them. Notion databases require custom engineering to do what should be obvious.

What podcast hosts actually need: a system that knows the guest lifecycle cold, handles the follow-up logic automatically, and uses AI for the creative work — not as a bolt-on feature, but as the core mechanic.

---

## What's Built

| Screen | Description |
|--------|-------------|
| **Kanban Pipeline** | Six-column drag-and-drop board across the full guest lifecycle. Optimistic updates. Confetti fires when a guest reaches "Scheduled" — because that's a real win worth acknowledging. |
| **AI Email Composer** | Select a guest, click Generate. Claude streams a personalized outreach email character by character — typewriter effect, not a spinner. Each draft includes a confidence score and the reasoning behind the approach. |
| **Guest Detail** | Full profile: animated fit score ring (counts from 0 to score on load), lifecycle timeline, topics, outreach history, and an AI action panel for outreach / brief / social in one place. |
| **Analytics** | Bar chart by stage, donut by topic, outreach activity timeline, and key conversion metrics. All from seed data — no backend dependency required to evaluate the UI. |
| **Auto-Tagging** | Add a guest bio and Claude extracts 3–8 topic tags and maps them to your show's themes. Runs on create/update, no manual input needed. |

---

## Design Philosophy: MLP, Not MVP

The "ship fast and iterate" advantage is mostly gone — a competent developer can scaffold a CRM in a weekend, and Claude Code compresses that to hours. What's left as a moat is craft.

The apps people open every day are the ones that have a personality. A witty empty state. An animation that validates the work you just did. A nudge that feels like a smart assistant, not a scheduled task.

We call this the **Minimum Lovable Product** threshold — and it's an explicit checklist item on every PR.

**Specific moments we built for:**

- When a guest moves to Scheduled, confetti fires. Podcast hosts treat a confirmed booking as a genuine win. The app should too.
- Claude's email output types out in real time. This isn't just aesthetics — streaming makes it feel like working *with* something, not waiting *for* something.
- Every empty state has a voice. "Your discovery list is empty — your next great episode is one outreach away" beats "No data found" because the first one tells you what to do next.
- The fit score doesn't just render — it counts up from zero. Takes about 600ms. Users watch it. That makes the score feel earned, not arbitrary.
- When a guest has been in Outreach for more than 7 days with no reply, a toast appears: "Sara hasn't replied in 8 days — want to send a friendly bump?" Proactive, not nagging.

---

## Architecture

```
Browser (Next.js 14 App Router)
├── TanStack Query v5  — server state with optimistic updates
├── Zustand            — UI state, persisted to localStorage
├── lib/api.ts         — API client; falls back to lib/mock-data.ts if API unavailable
└── components/        — shadcn/ui + Framer Motion

        │ HTTP REST + JWT (Bearer dev-mock-token in dev)
        ▼

Fastify v4 API (Node.js 20, TypeScript)
├── Plugins: CORS, @fastify/rate-limit, @fastify/jwt, @fastify/swagger-ui
├── Routes: /guests, /outreach, /ai, /analytics
├── Middleware: Zod request validation on all routes (body + query + params)
└── Services: guestService (in-memory store, seeded on startup)

        │                    │
        ▼                    ▼
  packages/db          packages/ai
  Drizzle schema +     ClaudeClient wrapper +
  34 seed guests       6 prompt modules
                            │
                            ▼
                   Anthropic API (claude-sonnet-4-6)
```

Full documentation: [`docs/architecture/system-design.md`](docs/architecture/system-design.md)

---

## AI Layer

All AI features live in `packages/ai` and are called through a single `ClaudeClient` class — never directly from `apps/`. The client handles retries (exponential backoff on 429 + 5xx), token tracking, and strips markdown formatting from JSON responses.

Two call modes: `completeJSON<T>()` for structured output and `stream()` for the typewriter UI effect. The outreach email composer uses both — streaming for the live preview, JSON for the copy-ready output with confidence score.

| Feature | Prompt File | What Claude does |
|---------|------------|-----------------|
| Outreach Email | `outreach-email.ts` | Writes 150-250 word pitch referencing the guest's actual recent work. Returns subject, body, confidence score (0–100), and the reasoning behind the approach. |
| Guest Fit Scoring | `guest-research.ts` | Scores 0–100 against your show's topic themes. Returns score, alignment rationale, red flags, and estimated booking difficulty. |
| Interview Brief | `interview-brief.ts` | Pre-recording brief: bio intro, 5 question types (depth/surface/controversial/career/forward-looking), controversy flags, closing hook suggestion. |
| Topic Tagging | `topic-tagging.ts` | Extracts 3–8 topic tags from bio + LinkedIn summary. Maps to primary category and confidence. Runs on every guest create/update. |
| Follow-Up Sequence | `follow-up-sequence.ts` | Three-email arc: friendly bump (Day 7), direct follow-up (Day 14), final attempt with subject line "Last one from me" (Day 21). |
| Social Posts | `social-post.ts` | Post-episode package: LinkedIn post, Twitter/X thread (5–7 tweets), Instagram caption. Tailored per platform tone. |

Example from the outreach prompt (so you can see the actual constraint set):

```typescript
export const OUTREACH_EMAIL_SYSTEM_PROMPT = `You are an expert podcast booking agent...
Your emails must:
1. Be authentic, specific, and not generic — reference the guest's actual recent work
2. Clearly state the show's value proposition and audience
3. Make the ask simple and low-friction
4. Be concise: 150-250 words for the body
5. Have a subject line under 70 characters
6. NOT use buzzwords like "passionate", "synergy", "journey", or "touch base"
7. End with a single clear call-to-action`;
```

---

## Claude Code Sub-Agents

This project was built with Claude Code using a four-agent architecture. Each agent has a scoped `agents/*.md` file in `.claude/` that constrains it to its domain, preventing cross-contamination and allowing parallel work.

| Agent | File | Scope |
|-------|------|-------|
| **UI Agent** | `.claude/agents/ui-agent.md` | `apps/web/` only. Server components by default, `use client` only when necessary. Framer Motion on all list animations. |
| **DB Agent** | `.claude/agents/db-agent.md` | `packages/db/` only. Schema changes, seed data, migrations. Never touches routes or components. |
| **AI Features Agent** | `.claude/agents/ai-features-agent.md` | `packages/ai/` only. Prompt engineering, JSON mode, streaming. Never uses `any` types, never hardcodes show context. |
| **Test Agent** | `.claude/agents/test-agent.md` | Tests for every feature another agent builds. Coverage gate: >70% before merge. |

Custom slash commands in `.claude/commands/`:
- `/new-feature <name>` — scaffolds full feature: API route + service + page + components + hook + tests
- `/review-pr` — security, type safety, and MLP review checklist before merge

---

## MCP Integration Points

The codebase is structured so MCP servers slot in without refactoring. Each integration point is already abstracted behind an interface:

| MCP Server | Status | Where it connects |
|-----------|--------|-------------------|
| GitHub MCP | Active in dev | `.github/` — PR creation, issue tracking, CI status from the terminal |
| Supabase MCP | Ready to wire | `packages/db/` — live schema queries during development sessions |
| Gmail MCP | Ready to wire | `apps/api/src/routes/outreach.ts` — email sending is behind a `sendEmail()` interface |
| Google Calendar MCP | Ready to wire | `apps/api/src/routes/guests.ts` — booking confirmation flow |
| Exa Search MCP | Ready to wire | `packages/ai/src/prompts/guest-research.ts` — guest research pipeline |

Using MCP during development changes what Claude Code can produce. With Supabase MCP active, Claude queries your actual schema before writing queries — eliminating a whole category of type/field-name bugs. With Gmail MCP, outreach features get tested against real email threads, not fabricated fixtures.

---

## Tech Stack

| Layer | Technology | The actual reason |
|-------|-----------|-----------------|
| **Monorepo** | Turborepo + pnpm workspaces | Remote build caching; `workspace:*` protocol means a single `pnpm install` at root. |
| **Frontend** | Next.js 14 App Router | RSC for static-first rendering, file-based routing, built-in API layer for the BFF pattern. |
| **UI Components** | Tailwind CSS + shadcn/ui | shadcn copies components into your repo — no version dependency hell, full ownership. |
| **Animations** | Framer Motion | Layout animations on list reorders are one line. `AnimatePresence` handles mount/exit. Worth the bundle cost. |
| **Drag and Drop** | @hello-pangea/dnd | Production-proven react-beautiful-dnd fork, maintained, accessible. |
| **Server State** | TanStack Query v5 | Stale-while-revalidate, optimistic updates, automatic background refetch. |
| **UI State** | Zustand | Minimal API. Sidebar state, filter state, modal state — all persist to localStorage with one line. |
| **API** | Fastify v4 | ~2x faster than Express under load, first-class TypeScript, `@fastify/swagger` auto-generates OpenAPI. |
| **Validation** | Zod | One schema defines both the TypeScript type and the runtime validator. Used on every route. |
| **ORM** | Drizzle ORM | No code generation step. Schema is plain TypeScript, migrations are plain SQL, queries are type-safe. |
| **Database** | SQLite (dev) / Turso (prod) | Zero-config for local dev with identical schema to production. Turso adds global distribution at the edge. |
| **AI** | Anthropic claude-sonnet-4-6 | Best-in-class structured JSON output and instruction following for the prompt patterns we use. |
| **Auth** | Supabase Auth | JWT + Row Level Security. Mocked in dev with `dev-mock-token`. |
| **Email** | Resend + React Email | Email templates as React components — version controlled, testable, previewable in a browser. |
| **Charts** | Recharts | React-native chart library, composable, TypeScript-friendly. Recharts vs. Chart.js was close; Recharts won on composability. |
| **CI/CD** | GitHub Actions | Lint → typecheck → test → security audit on every PR. CodeQL on weekly schedule. |

---

## Security

| Control | Implementation |
|---------|---------------|
| Authentication | JWT validation via `@fastify/jwt`. Every route has `preHandler: [server.authenticate]` — no exceptions, including dev. |
| Workspace isolation | All service queries filter by `workspaceId` extracted from JWT payload. Row Level Security in Supabase enforces this at the DB layer in production. |
| Rate limiting | 100 req/min per IP via `@fastify/rate-limit`. |
| Input validation | Zod schemas on all routes — body, query params, and path params. Routes without schemas don't ship. |
| SQL injection | Drizzle ORM uses parameterized queries only. Raw SQL doesn't appear in this codebase. |
| XSS | Next.js default escaping + restrictive Content-Security-Policy headers in `next.config.ts`. |
| Secrets | Zod-validated env schema at startup (`packages/config/env.ts`). The server crashes on boot if any required secret is missing — silent misconfiguration is worse than a crash. |
| CORS | Allowlist-based. No wildcard in production config. |
| SAST | CodeQL scanning on every PR + weekly schedule. |
| Dependency audit | `pnpm audit` in CI. |

Full security documentation: [`docs/architecture/security.md`](docs/architecture/security.md)

---

## Project Structure

```
podcast-guest-crm/
├── apps/
│   ├── web/                    # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (auth)/login/   # Demo login
│   │   │   └── dashboard/      # Protected routes (no route group)
│   │   │       ├── page.tsx    # Overview + time-aware greeting
│   │   │       ├── guests/     # Table view, filters, full CRUD
│   │   │       ├── pipeline/   # Kanban + guest detail modal
│   │   │       ├── outreach/   # AI email composer (streaming)
│   │   │       ├── analytics/  # Charts + conversion metrics
│   │   │       └── settings/   # Workspace + AI model config
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── guests/         # GuestCard, GuestTable, FitScoreRing
│   │   │   ├── pipeline/       # KanbanBoard, KanbanColumn, DragDrop
│   │   │   ├── outreach/       # AIAssistPanel (streaming typewriter)
│   │   │   └── shared/         # Sidebar, Navbar, EmptyState
│   │   ├── hooks/              # TanStack Query hooks (useGuests, usePipeline, etc.)
│   │   ├── lib/                # api.ts, mock-data.ts, utils.ts
│   │   └── stores/             # Zustand UI store
│   └── api/                    # Fastify backend
│       └── src/
│           ├── plugins/        # cors, rate-limit, jwt auth, swagger
│           ├── routes/         # guests, outreach, ai, analytics
│           ├── services/       # guest.service.ts (in-memory seed store)
│           └── tests/          # Vitest test suite
├── packages/
│   ├── types/                  # Shared TypeScript interfaces (no inline types in apps)
│   ├── config/                 # Zod env validation + constants
│   ├── db/                     # Drizzle schema + 34 seed guests across all 6 stages
│   └── ai/                     # ClaudeClient + 6 prompt modules
├── .claude/
│   ├── commands/               # /new-feature, /review-pr
│   └── agents/                 # ui-, db-, ai-features-, test-agent
├── .github/
│   ├── workflows/              # ci.yml (lint+typecheck+test), security.yml (CodeQL)
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── architecture/           # system-design.md, security.md, ai-layer.md
│   └── decisions/              # ADR 001-003
└── CLAUDE.md                   # Master Claude Code instructions
```

---

## Getting Started

```bash
git clone https://github.com/RudrenduPaul/podcast-guest-crm
cd podcast-guest-crm
pnpm install
pnpm dev
```

That's it. No environment variables required — the app runs entirely on seed data with default config.

```
web:  http://localhost:3000
api:  http://localhost:3001
docs: http://localhost:3001/docs
```

**Demo credentials** (pre-filled on the login page):
- Email: `rudrendu@signalnoiseshow.com`
- Password: `demo-password`

To use real Claude AI (all six features become live):
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/api/.env.local
```

Without a key, every AI call returns realistic mock output — the UI is fully functional either way.

---

## API

The Fastify server auto-generates OpenAPI documentation at `http://localhost:3001/docs` via `@fastify/swagger-ui`.

Key endpoints:

```
GET    /health                        Health check + readiness probe
GET    /api/v1/guests                 List (paginated, filterable by stage/topic/priority)
POST   /api/v1/guests                 Create guest
GET    /api/v1/guests/:id             Get guest detail
PUT    /api/v1/guests/:id             Update guest fields
PATCH  /api/v1/guests/:id/stage       Lifecycle transition — validated against allowed transitions
DELETE /api/v1/guests/:id             Soft delete

POST   /api/v1/outreach/draft         AI-draft outreach email (JSON or streaming)
POST   /api/v1/outreach/send          Send email via Resend (mocked in dev)
GET    /api/v1/outreach/:guestId      Outreach history for a guest

POST   /api/v1/ai/fit-score           Score guest against show topics (0-100 + rationale)
POST   /api/v1/ai/interview-brief     Pre-recording brief with structured questions
POST   /api/v1/ai/social-post         LinkedIn + Twitter thread + Instagram caption

GET    /api/v1/analytics/overview     Dashboard metrics + recent activity
GET    /api/v1/analytics/pipeline     Stage funnel + outreach timeline
```

Stage transitions are enforced at the service layer — you cannot jump from `discover` to `published`. The allowed path:

```
discover → outreach → scheduled → recorded → published → follow_up
                ↑___________↑         ↑__________↑
           (reschedule)         (re-record)
```

All endpoints require `Authorization: Bearer dev-mock-token` in development. In production, Supabase JWTs are validated and workspace isolation is enforced by both the service layer and RLS policies.

---

## Competitive Landscape

The market gap isn't features — it's the right mental model.

| | Google Sheets | HubSpot/Pipedrive | PodMatch | **Podcast Guest CRM** |
|--|:---:|:---:|:---:|:---:|
| Guest lifecycle tracking | manual | custom fields required | ❌ | 6-stage pipeline, built-in |
| AI outreach drafting | ❌ | ❌ | ❌ | Claude-powered, streaming |
| Guest fit scoring | ❌ | ❌ | basic match | AI-scored against your topics |
| Interview brief generator | ❌ | ❌ | ❌ | pre-recording brief in one click |
| Follow-up sequence automation | ❌ | add-on ($$$) | ❌ | 3-email arc, AI-written |
| Social post generator | ❌ | ❌ | ❌ | LinkedIn + Twitter + Instagram |
| Agency multi-workspace | ❌ | $$$ | ❌ | included in Agency plan |
| Price | $0 | $45–$800/mo | $27–$97/mo | $29–$99/mo |

The gap PodMatch and MatchMaker leave: they solve *discovery* (finding guests). They don't solve *workflow* — the 3-to-6 month process of pitching, following up, scheduling, prepping, recording, publishing, and staying in relationship afterward.

---

## Roadmap

| Feature | Notes |
|---------|-------|
| MCP: Gmail + Google Calendar | Wire up live outreach sending and booking confirmation to real calendars |
| MCP: Exa Search | Guest research pipeline pulling live web data during the fit scoring step |
| Stripe billing | Solo $29/mo, Agency $99/mo. Usage-based AI credits above the base tier. |
| Episode transcript ingestion | Upload transcript → auto-generate social posts and follow-up email referencing episode highlights |
| Client portal | Token-based read-only view for agency clients. Eliminates the weekly status report email. |
| Zapier / Make connector | Two-way sync with Cal.com, Notion, HubSpot for agencies already in those tools |
| RSS email extraction | Input a podcast RSS feed URL → auto-populate host name, contact email, show stats |
| Mobile (React Native) | Same API, native feel — primarily for reviewing the pipeline on the go |

---

## About the Builders

**Rudrendu Paul** and **Sourav Nandy** built this as an engineering showcase — the kind of project that demonstrates what a small, senior team can actually ship when they treat AI tooling as a development multiplier, not a shortcut.

The technical choices here — Turborepo, Drizzle, the sub-agent architecture, the deliberate MLP bar on every feature — are all choices we'd make again on a production product. The codebase is built to be read and evaluated, not just to run.

We're pursuing accelerator opportunities with this project (YC, Antler, Techstars). If you're building something in the podcast, creator economy, or AI-native tools space, we're happy to talk.

Built with [Claude Code](https://claude.ai/code) — Anthropic's agentic coding assistant.

---

## License

Proprietary. See [LICENSE](LICENSE) for full terms.

Viewing and forking for personal or educational use is permitted. Commercial use, derivative products, or business deployment requires written approval from both owners.
