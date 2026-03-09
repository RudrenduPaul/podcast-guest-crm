<div align="center">

<h1>🎙️ Podcast Guest CRM</h1>

<p><strong>Podcast hosts lose guests in spreadsheets. Booking agencies drown in follow-up threads.</strong><br/>
We built the tool we wished existed — and used Claude Code's sub-agent architecture to do it.</p>

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

Built by **Rudrendu Paul** &amp; **Sourav Nandy** &nbsp;·&nbsp; Developed with [**Claude Code**](https://claude.ai/code)

<br/>

[The Problem](#the-problem) &nbsp;·&nbsp;
[What's Built](#whats-built) &nbsp;·&nbsp;
[Quick Start](#getting-started) &nbsp;·&nbsp;
[AI Features](#ai-layer) &nbsp;·&nbsp;
[Sub-Agents](#claude-code-sub-agents) &nbsp;·&nbsp;
[Architecture](#architecture)

</div>

---

## What Makes This Different

Three things separate this from "another CRUD app with an AI button":

**1. Claude is the engine, not the trim.**
Every piece of creative work — outreach emails, fit scores, interview briefs, follow-up sequences, social posts — routes through `packages/ai`, a typed wrapper around the Anthropic API. Two modes: `completeJSON<T>()` for structured data and `stream()` for the real-time typewriter effect. The UI responds to Claude the way good UI responds to a fast API: instantly, progressively.

**2. We held an MLP bar, not MVP.**
Minimum Lovable Product is an explicit checklist on every PR. The fit score ring counts up from zero. Confetti fires when a guest books. The AI email types out character by character. None of these are necessary for the feature to work — all of them are necessary for it to feel good.

**3. Four Claude Code sub-agents. Parallel. Scoped.**
UI agent. DB agent. AI features agent. Test agent. Each constrained to its slice of the codebase. This is what building with AI tooling seriously looks like in a production monorepo.

---

## The Problem

Every podcast host has lost a guest to the follow-up black hole. You find someone great, send a pitch, they don't reply — and three weeks later the moment has passed. Their name is buried in a spreadsheet somewhere you stopped maintaining.

For booking agencies running multiple shows simultaneously — hundreds of pitches, recording dates, follow-up sequences, client reporting — spreadsheets don't just fail. They actively destroy relationship capital.

The tools that exist solve the wrong problems. HubSpot and Pipedrive are built for sales pipelines, not relationship pipelines. PodMatch helps you *find* guests — it doesn't help you manage the three-to-six month process of booking them. Notion requires custom engineering for what should be built-in behavior.

What podcast hosts need: a system that knows the guest lifecycle cold, handles follow-up logic automatically, and uses AI for creative work — not as a feature bolt-on, but as the core mechanic.

---

## Getting Started

```bash
git clone https://github.com/RudrenduPaul/podcast-guest-crm
cd podcast-guest-crm
pnpm install
pnpm dev
```

No environment variables needed. The app runs entirely on seed data — 34 realistic guests spread across all six pipeline stages.

```
web:  http://localhost:3000
api:  http://localhost:3001
docs: http://localhost:3001/docs   ← Swagger UI, auto-generated from route schemas
```

**Demo login** (pre-filled on the login page):
- Email: `rudrendu@signalnoiseshow.com`
- Password: `demo-password`

To activate all six AI features live:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/api/.env.local
```

Without a key, every AI call returns realistic mock output. The UI is fully functional either way — useful for evaluating the interface without burning API credits.

---

## What's Built

| Screen | What it does |
|--------|-------------|
| **Kanban Pipeline** | Six-column drag-and-drop board across the full guest lifecycle. Optimistic updates. Confetti fires when a guest hits Scheduled — because a confirmed booking is a real win worth acknowledging. |
| **AI Email Composer** | Select a guest, click Generate. Claude streams a personalized pitch character by character — typewriter effect, not a spinner. Each draft includes a confidence score and the reasoning behind it. |
| **Guest Detail** | Animated fit score ring that counts from 0 to score on load, lifecycle timeline, topics, outreach history, and an AI action panel — outreach, brief, and social posts in one place. |
| **Analytics** | Bar chart by stage, donut by topic, outreach activity timeline, key conversion metrics. Runs entirely on seed data, no backend dependency required to evaluate the UI. |
| **Auto-Tagging** | Add a guest bio and Claude extracts 3–8 topic tags mapped to your show's themes. Runs automatically on every guest create/update — no manual input needed. |

---

## AI Layer

All AI features live in `packages/ai` and are invoked through a single `ClaudeClient` class — never imported directly from `apps/`. The client handles retries (exponential backoff on 429 and 5xx), token tracking, and strips markdown formatting from JSON responses.

Two call modes: `completeJSON<T>()` for structured output, `stream()` for the typewriter effect. The outreach composer uses both — streaming for the live preview, JSON for the copy-ready output with confidence score.

| Feature | Prompt File | What Claude produces |
|---------|------------|---------------------|
| Outreach Email | `outreach-email.ts` | 150–250 word pitch referencing the guest's actual recent work. Subject line, body, confidence score (0–100), reasoning. |
| Guest Fit Scoring | `guest-research.ts` | Score against your show's topic themes (0–100), alignment rationale, red flags, estimated booking difficulty. |
| Interview Brief | `interview-brief.ts` | Pre-recording brief: bio intro, 5 question types (depth / surface / controversial / career / forward-looking), controversy flags, closing hook. |
| Topic Tagging | `topic-tagging.ts` | Extracts 3–8 topic tags from bio + LinkedIn summary. Maps to primary category with confidence score. Runs on every guest create/update. |
| Follow-Up Sequence | `follow-up-sequence.ts` | Three-email arc: friendly bump (Day 7), direct follow-up (Day 14), final attempt with subject "Last one from me" (Day 21). |
| Social Posts | `social-post.ts` | Post-episode package: LinkedIn post, Twitter/X thread (5–7 tweets), Instagram caption. Platform tone varies deliberately. |

Here's the actual constraint set from the outreach prompt, so you can see the prompt engineering approach:

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

This is the part most developers ask about first.

We built this using a four-agent architecture inside Claude Code. Each agent has a constraints file in `.claude/agents/` that scopes it to its domain — the agents physically cannot make changes outside their assigned slice of the codebase. This isn't just a workflow preference; it's architectural isolation enforced at the tooling layer.

| Agent | File | What it owns |
|-------|------|--------------|
| **UI Agent** | `.claude/agents/ui-agent.md` | `apps/web/` only. Server components by default, `use client` only when genuinely needed. Framer Motion on all list animations — non-negotiable. |
| **DB Agent** | `.claude/agents/db-agent.md` | `packages/db/` only. Schema changes, seed data, migrations. Never touches routes or UI. |
| **AI Features Agent** | `.claude/agents/ai-features-agent.md` | `packages/ai/` only. Prompt engineering, JSON mode, streaming. No `any` types, no hardcoded show context in prompts. |
| **Test Agent** | `.claude/agents/test-agent.md` | Tests for everything another agent builds. Coverage gate: >70% before merge. |

The real benefit is trust. With a scoped agent, you stop second-guessing whether a UI change silently mutated a schema, or whether an AI prompt update accidentally broke a route. The UI agent cannot write a Drizzle query. The DB agent cannot create a React component. Constraint becomes architecture.

Custom slash commands in `.claude/commands/`:
- `/new-feature <name>` — scaffolds a full feature end-to-end: API route + service + page + components + hook + tests
- `/review-pr` — security, type safety, and MLP checklist before merge

---

## MLP: The Design Bar

The "ship fast and iterate" advantage is mostly gone. A capable developer can scaffold a CRM in a weekend; Claude Code compresses that to hours. What remains as a real moat is craft.

The apps people open every day are the ones with personality. A witty empty state. An animation that acknowledges what you just did. A nudge that feels like a smart collaborator, not a scheduled task. Elena Verna calls the threshold where a product earns genuine affection the **Minimum Lovable Product** — and it's an explicit checklist on every PR here.

**Moments we built deliberately:**

- When a guest moves to Scheduled, confetti fires. Podcast hosts treat a confirmed booking as a genuine win. The app should too.
- Claude's email output types out in real time. This isn't aesthetics — streaming makes it feel like working *with* something, not waiting *for* something.
- Every empty state has a voice. "Your discovery list is empty — your next great episode is one outreach away" beats "No data found." One tells you what happened; the other tells you what to do next.
- The fit score ring doesn't just render a number — it counts up from zero. Takes about 600ms. People watch it. That brief wait makes the score feel earned, not arbitrary.
- When a guest has been in Outreach for more than 7 days without a reply, a toast appears: "Sara hasn't replied in 8 days — want to send a friendly bump?" Proactive. Named. Not nagging.

The MLP checklist every PR must pass:
- [ ] Empty states have personality copy, not "No data found"
- [ ] Loading states use `Skeleton` components, not blank screens
- [ ] Errors have actionable messages — not "Something went wrong"
- [ ] Key interactions have Framer Motion animations
- [ ] **What's the wow moment?** If there isn't one, find it before merging.

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

## MCP Integration Points

The codebase is structured so MCP servers slot in without refactoring. Every integration point sits behind an interface.

| MCP Server | Status | Where it connects |
|-----------|--------|-------------------|
| GitHub MCP | Active in dev | `.github/` — PR creation, issue tracking, CI status from the terminal |
| Supabase MCP | Ready to wire | `packages/db/` — live schema queries during dev sessions |
| Gmail MCP | Ready to wire | `apps/api/src/routes/outreach.ts` — email sending is behind a `sendEmail()` interface |
| Google Calendar MCP | Ready to wire | `apps/api/src/routes/guests.ts` — booking confirmation flow |
| Exa Search MCP | Ready to wire | `packages/ai/src/prompts/guest-research.ts` — live web data in the research pipeline |

With Supabase MCP active, Claude queries your actual schema before writing queries — eliminating a whole category of field-name bugs before they happen. With Gmail MCP, outreach features get tested against real email threads, not fabricated fixtures.

---

## Tech Stack

| Layer | Technology | The actual reason |
|-------|-----------|-----------------|
| **Monorepo** | Turborepo + pnpm workspaces | Remote build caching; `workspace:*` protocol means a single `pnpm install` at root. |
| **Frontend** | Next.js 14 App Router | RSC for static-first rendering, file-based routing, built-in BFF pattern. |
| **UI** | Tailwind CSS + shadcn/ui | shadcn copies components into your repo — no version dependency hell, full ownership of the code. |
| **Animations** | Framer Motion | Layout animations on list reorders are one line. `AnimatePresence` handles mount/exit. Worth the bundle cost. |
| **Drag and Drop** | @hello-pangea/dnd | Production-proven react-beautiful-dnd fork — maintained, accessible, drops in identically. |
| **Server State** | TanStack Query v5 | Stale-while-revalidate, optimistic updates, automatic background refetch. The pipeline board uses this for instant drag feedback. |
| **UI State** | Zustand | Minimal API. Sidebar state, filter state, modal state — all persist to localStorage with one line. |
| **API** | Fastify v4 | ~2x faster than Express under load, first-class TypeScript, `@fastify/swagger` auto-generates OpenAPI. |
| **Validation** | Zod | One schema defines both the TypeScript type and the runtime validator. Used on every single route. |
| **ORM** | Drizzle ORM | No code generation step. Schema is plain TypeScript, migrations are plain SQL, queries are type-safe. |
| **Database** | SQLite (dev) / Turso (prod) | Zero-config for local dev with an identical schema to production. Turso adds global distribution at the edge. |
| **AI** | Anthropic claude-sonnet-4-6 | Best-in-class structured JSON output and instruction following for the prompt patterns here. |
| **Auth** | Supabase Auth | JWT + Row Level Security. Mocked in dev with `dev-mock-token`. |
| **Email** | Resend + React Email | Email templates as React components — version controlled, testable, previewable in a browser. |
| **Charts** | Recharts | React-native chart library, composable, TypeScript-friendly. Beat Chart.js on composability. |
| **CI/CD** | GitHub Actions | Lint → typecheck → test → security audit on every PR. CodeQL on weekly schedule. |

---

## Security

| Control | Implementation |
|---------|---------------|
| Authentication | JWT validation via `@fastify/jwt`. Every route has `preHandler: [server.authenticate]` — no exceptions, including dev. |
| Workspace isolation | All service queries filter by `workspaceId` extracted from JWT payload. Row Level Security in Supabase enforces this at the DB layer in production. |
| Rate limiting | 100 req/min per IP via `@fastify/rate-limit`. |
| Input validation | Zod schemas on all routes — body, query params, path params. Routes without schemas don't ship. |
| SQL injection | Drizzle ORM uses parameterized queries only. No raw SQL in this codebase. |
| XSS | Next.js default escaping + restrictive Content-Security-Policy headers in `next.config.ts`. |
| Secrets | Zod-validated env schema at startup. The server crashes on boot if any required secret is missing — silent misconfiguration is worse than a loud crash. |
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

## API Reference

The Fastify server auto-generates OpenAPI documentation at `http://localhost:3001/docs` via `@fastify/swagger-ui`.

```
GET    /health                        Health check + readiness probe
GET    /api/v1/guests                 List (paginated, filterable by stage/topic/priority)
POST   /api/v1/guests                 Create guest
GET    /api/v1/guests/:id             Get guest detail
PUT    /api/v1/guests/:id             Update guest fields
PATCH  /api/v1/guests/:id/stage       Lifecycle transition — validated against allowed paths
DELETE /api/v1/guests/:id             Soft delete

POST   /api/v1/outreach/draft         AI-draft outreach email (JSON or streaming)
POST   /api/v1/outreach/send          Send via Resend (mocked in dev)
GET    /api/v1/outreach/:guestId      Outreach history for a guest

POST   /api/v1/ai/fit-score           Score guest against show topics (0–100 + rationale)
POST   /api/v1/ai/interview-brief     Pre-recording brief with structured questions
POST   /api/v1/ai/social-post         LinkedIn + Twitter thread + Instagram caption

GET    /api/v1/analytics/overview     Dashboard metrics + recent activity
GET    /api/v1/analytics/pipeline     Stage funnel + outreach timeline
```

Stage transitions are enforced at the service layer — you cannot jump from `discover` to `published`:

```
discover → outreach → scheduled → recorded → published → follow_up
               ↑___________↑          ↑__________↑
          (reschedule)          (re-record)
```

All endpoints require `Authorization: Bearer dev-mock-token` in development. In production, Supabase JWTs are validated and workspace isolation is enforced by both the service layer and RLS policies.

---

## Competitive Landscape

The market gap isn't features — it's the right mental model.

| | Google Sheets | HubSpot / Pipedrive | PodMatch | **Podcast Guest CRM** |
|--|:---:|:---:|:---:|:---:|
| Guest lifecycle tracking | manual | custom fields required | ❌ | 6-stage pipeline, built-in |
| AI outreach drafting | ❌ | ❌ | ❌ | Claude-powered, streaming |
| Guest fit scoring | ❌ | ❌ | basic match | AI-scored against your topics |
| Interview brief generator | ❌ | ❌ | ❌ | pre-recording brief, one click |
| Follow-up sequence | ❌ | add-on ($$$) | ❌ | 3-email arc, AI-written |
| Social post generator | ❌ | ❌ | ❌ | LinkedIn + Twitter + Instagram |
| Agency multi-workspace | ❌ | $$$ | ❌ | included in Agency plan |
| Price | $0 | $45–$800/mo | $27–$97/mo | $29–$99/mo |

The gap PodMatch and MatchMaker leave: they solve *discovery* — finding guests. They don't solve *workflow* — the months-long process of pitching, following up, scheduling, prepping, recording, publishing, and staying in relationship afterward.

---

## Roadmap

| Feature | Notes |
|---------|-------|
| MCP: Gmail + Google Calendar | Live outreach sending and booking confirmation to real calendars |
| MCP: Exa Search | Guest research pipeline pulling live web data during fit scoring |
| Stripe billing | Solo $29/mo, Agency $99/mo. Usage-based AI credits above the base tier. |
| Transcript ingestion | Upload episode transcript → auto-generate social posts and follow-up email referencing specific highlights |
| Client portal | Token-based read-only view for agency clients. Kills the weekly status report email. |
| Zapier / Make connector | Two-way sync with Cal.com, Notion, HubSpot for agencies already running those tools |
| RSS extraction | Input a podcast RSS feed URL → auto-populate host name, contact email, show stats |
| Mobile (React Native) | Same API, native feel — primarily for reviewing the pipeline on the go |

---

## About the Builders

**Rudrendu Paul** and **Sourav Nandy** built this as a technical showcase — the kind that demonstrates what a small senior team can actually ship when they treat AI tooling as a development multiplier rather than a shortcut.

Every technical choice here — Turborepo, Drizzle, the sub-agent architecture, the MLP bar on every PR — is a choice we'd make again on a production product. The codebase is built to be read and evaluated, not just to run.

We're pursuing accelerator opportunities with this project (YC, Antler, Techstars). If you're building in podcast, creator economy, or AI-native SaaS, we'd like to talk.

Built with [Claude Code](https://claude.ai/code) — Anthropic's agentic coding assistant.

---

<div align="center">

**If this codebase teaches you something or saves you time — a star helps other developers find it.**

[![Star this repo](https://img.shields.io/github/stars/RudrenduPaul/podcast-guest-crm?style=social)](https://github.com/RudrenduPaul/podcast-guest-crm)

</div>

---

## License

Proprietary. See [LICENSE](LICENSE) for full terms.

Viewing and forking for personal or educational use is permitted. Commercial use, derivative products, or business deployment requires written approval from both owners.
