<div align="center">

<br/>

<h1>🎙️ Podcast Guest CRM</h1>

<h3>The operating system for podcast booking.<br/>AI-native. Keyboard-first. Built for agencies.</h3>

<br/>

<p>
  <strong>4.2 million podcasts. $4B+ creator economy. Zero purpose-built workflow software.</strong><br/>
  We built the tool that should have existed for the last decade.
</p>

<br/>

<!-- Build -->
<p>
  <img src="https://github.com/RudrenduPaul/podcast-guest-crm/actions/workflows/ci.yml/badge.svg" alt="CI Status"/>
  <img src="https://img.shields.io/npm/v/podcast-guest-crm-cli?style=flat-square&color=cb3837&label=npm" alt="npm version"/>
  <img src="https://img.shields.io/pypi/v/podcast-guest-crm-cli?style=flat-square&color=3775a9&label=pypi" alt="PyPI version"/>
  <img src="https://img.shields.io/badge/License-Proprietary-64748b?style=flat-square" alt="License"/>
</p>

<!-- Activity -->
<p>
  <img src="https://img.shields.io/github/last-commit/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=last%20commit" alt="Last Commit"/>
  <img src="https://img.shields.io/github/commit-activity/m/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=commits%2Fmonth" alt="Commit Activity"/>
</p>

<!-- Stack -->
<p>
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Fastify-4.29-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"/>
  <img src="https://img.shields.io/badge/pnpm-monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Claude-claude--sonnet--4--6-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI"/>
  <img src="https://img.shields.io/badge/Drizzle_ORM-SQLite%20%2F%20Turso-C5F74F?style=for-the-badge&logoColor=black" alt="Drizzle ORM"/>
  <img src="https://img.shields.io/badge/Zod-validation-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
</p>

<p>
  <img src="https://img.shields.io/badge/CodeQL-weekly%20%2B%20every%20PR-6366f1?style=for-the-badge&logo=github&logoColor=white" alt="CodeQL"/>
</p>

<br/>

![CLI login and first command](https://raw.githubusercontent.com/RudrenduPaul/podcast-guest-crm/main/docs/demo.gif)

<br/>

Built by **[Rudrendu Paul](https://github.com/RudrenduPaul)** &amp; **Sourav Nandy** &nbsp;·&nbsp; Engineered with [**Claude Code**](https://claude.ai/code)

<br/>

[The Problem](#the-problem) &nbsp;·&nbsp;
[The Product](#the-product) &nbsp;·&nbsp;
[Quick Start](#quick-start) &nbsp;·&nbsp;
[AI Layer](#ai-layer) &nbsp;·&nbsp;
[Architecture](#architecture) &nbsp;·&nbsp;
[CLI](#cli) &nbsp;·&nbsp;
[FAQ](#faq)

<br/>

</div>

---

## The Problem

**Every tool a podcast host reaches for was built for a different job.** HubSpot is a sales CRM. PodMatch is a discovery marketplace. Notion is a blank canvas that requires engineering to become anything useful. None of them model the guest lifecycle (discovery through outreach, scheduling, recording, publishing, and follow-up) as a first-class object.

This tool does. Guest fit scoring, personalized outreach drafting, interview prep, and follow-up sequences run on `claude-sonnet-4-6`, which is what makes automating those specific steps viable now.

---

## The Product

A full-stack AI-native CRM with six pages and eleven features.

### Core Workflow

```
Discover → Outreach → Scheduled → Recorded → Published → Follow-up
```

Every guest moves through this lifecycle. Every transition is validated at the API layer and logged. The system tracks where each guest is, when they last heard from you, and what needs to happen next.

### Feature Surface

| Feature | What it does |
|---------|-------------|
| **Cmd+K Palette** | Search any guest by name, company, or topic. Navigate all six pages. Trigger actions. Entirely keyboard-driven. |
| **Kanban Pipeline** | Six-column drag-and-drop board (`@hello-pangea/dnd`). Optimistic updates. Lifecycle rules enforced at the service layer, so you can't drag a card from Discover straight to Published. Confetti (`canvas-confetti`) fires on every confirmed booking. |
| **AI Email Composer** | Select a guest, click Generate. The AI streams a personalized 150-250 word pitch token by token. Confidence score included. |
| **Interview Brief** | One-click pre-recording brief: bio intro, 5 tailored question types, talking points, closing hook. Copy-ready. |
| **Social Posts** | LinkedIn post, Twitter/X thread (5 tweets with character counts), Instagram caption. Platform tabs, one-click copy per platform. |
| **Notification Center** | Persistent bell dropdown. Surfaces guests without a reply in 7+ days and upcoming recordings. |
| **Today's Focus** | Dashboard section that lists exactly what needs attention today. |
| **Guest Detail** | Animated fit score ring (counts up from 0), lifecycle progress timeline, contact links, AI action sidebar with three generative panels. |
| **Analytics** | Bar chart by stage, donut by topic, 12-week outreach activity timeline, conversion metrics (Recharts). Falls back to seed data if the API is unreachable. |
| **Add Guest Modal** | `⌘N` from anywhere. Name, email, title, company, bio, topics, LinkedIn, Twitter, stage, priority. Fit score generates asynchronously on create. |
| **Smart Nudges** | Toast on dashboard load when guests have sat in outreach for more than 7 days without a reply. |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Command palette: search guests, navigate, trigger actions |
| `⌘N` | Open the Add Guest modal directly |
| `↑ ↓` | Navigate palette results |
| `↵` | Select |
| `Esc` | Close any modal |

---

## Quick Start

```bash
git clone https://github.com/RudrenduPaul/podcast-guest-crm
cd podcast-guest-crm
pnpm install
pnpm dev
```

The app runs on seed data from first boot: 34 guests across all six pipeline stages, no environment variables required.

```
web:  http://localhost:3000
api:  http://localhost:3001
docs: http://localhost:3001/docs   ← Swagger UI, generated from route schemas
```

**Tested on Node 20.20.2.** `pnpm install` fails compiling `better-sqlite3` from source on Node 24, because no prebuilt binary exists yet for that Node ABI on this platform; Node 20 (the version pinned in CI) installs cleanly. If `pnpm dev` starts the web app but the API crashes with `unable to determine transport target for "pino-pretty"`, see the [FAQ](#faq): run `pnpm add -D pino-pretty --filter api` once and re-run `pnpm dev`.

---

## AI Layer

All AI lives in `packages/ai`, the only place in the codebase that imports `@anthropic-ai/sdk`. Every feature calls a typed function instead of touching the SDK directly.

Two modes: `completeJSON<T>()` for structured output with generic type inference, `stream()` for the real-time typewriter effect. The outreach composer uses both at once: streaming for the live preview, JSON for the copy-ready result with a confidence score.

```typescript
// packages/ai/src/client.ts, the single seam for all AI calls
export class ClaudeClient {
  async completeJSON<T>(system: string, user: string): Promise<T>
  async stream(system: string, user: string): AsyncIterable<string>
}

// Feature code never touches the SDK. It calls typed prompt functions:
const brief = await generateInterviewBrief(guest);  // → InterviewBrief
const email = await draftOutreachEmail(guest, show); // → OutreachEmail
const score = await scoreGuestFit(guest, workspace); // → FitScore
```

### Prompt Modules

| Feature | File | Output |
|---------|------|--------|
| Outreach Email | `outreach-email.ts` | Subject, 150-250 word body, confidence score (0-100), reasoning |
| Guest Fit Score | `guest-research.ts` | Score, alignment rationale, red flags, booking difficulty |
| Interview Brief | `interview-brief.ts` | Bio intro, 5 question types, talking points, closing hook |
| Topic Tagging | `topic-tagging.ts` | 3-8 tags from bio + LinkedIn, primary category, confidence |
| Follow-Up Sequence | `follow-up-sequence.ts` | 3-email arc: Day 7 bump, Day 14 follow-up, Day 21 final |
| Social Posts | `social-post.ts` | LinkedIn post, Twitter thread, Instagram caption, tone varies by platform |

### The Prompt Engineering Approach

Here's the actual constraint set from the outreach module:

```typescript
export const OUTREACH_EMAIL_SYSTEM_PROMPT = `You are an expert podcast booking agent
working on behalf of a host with a specific audience and brand.

Your emails must:
1. Be authentic, specific, and not generic. Reference the guest's actual recent work
2. Clearly state the show's value proposition and the size and shape of the audience
3. Make the ask simple and low-friction. One clear question, not a pitch deck
4. Be concise: 150-250 words for the body
5. Have a subject line under 70 characters that doesn't feel like a cold email
6. NEVER use: "passionate", "synergy", "journey", "touch base", "hop on a call"
7. End with a single clear call-to-action. Not multiple options`;
```

The fit scoring prompt evaluates guests against the show's actual topic taxonomy instead of generic relevance signals. The interview brief generates question types calibrated to the podcast format (depth, contrarian, forward-looking).

---

## Architecture

### System Diagram

```
Browser (Next.js 14 App Router)
├── TanStack Query v5 : server state, optimistic updates, stale-while-revalidate
│                        every query falls back to seed data on API error
├── Zustand           : UI state (sidebar, modals, ⌘K palette, filters)
│                        persisted to localStorage via middleware
├── lib/api.ts        : typed fetch wrapper; catches 503, returns seed data
└── components/       : shadcn/ui primitives + Framer Motion feature components

        │  HTTP/REST + JWT (Bearer token)
        ▼

Fastify v4 API (Node.js 20, TypeScript strict mode)
├── Plugins: CORS (allowlist), @fastify/rate-limit (100/min), @fastify/jwt, swagger-ui
├── Routes: /guests, /outreach, /ai, /analytics  ← all require authentication
├── Middleware: Zod schemas on every route (body, query params, path params)
└── Services: guestService (in-memory store seeded from packages/db on startup)

        │                       │
        ▼                       ▼
  packages/db             packages/ai
  Drizzle ORM schema +    ClaudeClient +
  34 seed guests          6 typed prompt modules
  SQLite (dev)                  │
  Turso (prod)                  ▼
                       Anthropic API
                       claude-sonnet-4-6
```

### Five Architectural Decisions Worth Reading

**1. Shared types in `packages/types`, zero inline definitions in `apps/`.**
Every interface that crosses the API boundary (`Guest`, `OutreachEmail`, `Workspace`, `AnalyticsOverview`) lives in one package, imported by both the API and the web app. A TypeScript error on the frontend means a broken API contract, caught before it ships.

**2. Single AI seam in `packages/ai`.**
`ClaudeClient` is the only place `@anthropic-ai/sdk` is imported. It handles exponential backoff on 429s and 5xx, per-call token tracking, markdown stripping from JSON responses, and streaming via `AsyncIterable`. Swapping models or providers is a one-file change.

**3. Graceful degradation as a design requirement.**
Every TanStack Query hook catches API errors and returns seed data. Every mutation has a synthetic fallback. The app stays interactive without a running backend, so a demo never fails because a server is down.

**4. Optimistic updates with enforced rollback.**
Stage transitions on the kanban board are instant in the UI. The server confirms asynchronously. The lifecycle rules are strict (you cannot move from `discover` to `published` directly); if the server rejects a transition, the previous state is restored and an error toast fires.

**5. Zod at every boundary.**
The env schema crashes the server at boot if a required secret is missing, since a silent misconfiguration is worse than a loud failure. Every API route has a Zod schema for body, query, and params. Shared schemas live in `packages/config` so frontend and backend enforce the identical contract.

### How This Codebase Was Built

The four apps and packages in this monorepo (`apps/web`, `apps/api`, `packages/db`, `packages/ai`) were developed as separate domain slices using Claude Code, each scoped to one package boundary at a time: UI, database schema, AI prompt modules, and tests were built and reviewed independently before merging. The local agent configuration that enforced those boundaries during development (`.claude/`) is intentionally excluded from this repository via `.gitignore`, so it will not appear in a fresh clone.

---

## MLP: The Craft Standard

The "ship fast" advantage is gone. A capable developer scaffolds a CRM in a weekend; this stack compresses that to hours. What's left to compete on is craft: the quality of what you build in that time.

We hold a Minimum Lovable Product bar on every PR. Elena Verna's framing: the threshold where a product earns genuine affection from its users, past the point of merely adequate utility.

**Deliberately built moments:**

- **Confetti on booking.** When a guest moves to Scheduled, confetti fires. A confirmed booking is a real win, and the app treats it that way.
- **Typewriter effect on AI output.** The generated email types out character by character. Streaming makes it feel like working with a collaborator instead of waiting for a tool.
- **Fit score counts up.** The ring animates from 0 to the actual score over 600ms.
- **Command palette.** `⌘K` puts every guest, page, and action one keypress away.
- **Today's Focus.** The dashboard surfaces exactly who needs attention today (stale outreach, upcoming recordings) without requiring you to remember what to check.
- **Named nudges.** "Sara hasn't replied in 8 days" beats "3 follow-ups pending."
- **Personality copy in empty states.** "Your discovery list is empty. Your next great episode is one outreach away" tells you what to do next. "No data found" doesn't.

**MLP checklist, required on every PR** (from `.github/PULL_REQUEST_TEMPLATE.md`):
- [ ] Empty states have personality copy, not "No data found"
- [ ] Loading states use `Skeleton` components, not blank screens
- [ ] Errors have actionable messages, not "Something went wrong"
- [ ] Key interactions have Framer Motion animations
- [ ] **What's the wow moment?** If there isn't one, find it before merging.

---

## Pricing

Two-tier SaaS model the product is designed around: Solo and Agency. Stripe billing integration is not live yet (it's the next near-term roadmap item), so these are the target prices, not a currently checkoutable plan.

| Plan | Price | Who it's for |
|------|-------|-------------|
| **Solo** | $29/month | Independent podcast hosts managing 1 show, 20-100 guests/year |
| **Agency** | $99/month | Booking agencies managing 3+ shows and 200+ pitches/year |

Usage-based AI credits above the base tier: the first 200 AI calls/month (outreach email, fit score, brief, social post) are included, above that teams pay for what they use.

---

## Competitive Landscape

The gap isn't features. It's the mental model.

| | Google Sheets | HubSpot / Pipedrive | PodMatch | **Podcast Guest CRM** |
|--|:---:|:---:|:---:|:---:|
| Guest lifecycle (6-stage) | manual | custom fields required | not offered | built-in, enforced |
| AI outreach (personalized) | not offered | not offered | not offered | streaming, confidence score |
| Guest fit scoring | not offered | not offered | basic | AI-scored against your topics |
| Interview brief | not offered | not offered | not offered | one click, copy-ready |
| Follow-up sequence (AI) | not offered | add-on, paid | not offered | 3-email arc, AI-written |
| Social post generator | not offered | not offered | not offered | LinkedIn + Twitter + Instagram |
| Command palette (⌘K) | not offered | not offered | not offered | full keyboard navigation |
| Agency multi-show workspace | not offered | enterprise tier | not offered | included |
| Price | $0 | $20-150/user/mo (Sales Hub Starter-Enterprise) | $6-64/mo (host plans) | $29-99/mo |

Prices for HubSpot Sales Hub and Pipedrive verified against their own pricing pages (monthly billing, per seat). PodMatch prices are dynamically rendered on their pricing page and are cited here from third-party pricing trackers (talks.co, SaaSWorthy), not PodMatch's own static HTML.

PodMatch solves discovery: finding guests. This solves workflow: the months-long process of pitching, following up, scheduling, prepping, recording, publishing, and staying in relationship. Those are different problems, and the companies that built discovery tools left the workflow problem untouched.

---

## MCP Integration Points

Every integration point sits behind an interface, so MCP servers slot in without a refactor.

| MCP Server | Status | Integration point |
|-----------|--------|-------------------|
| GitHub MCP | Active in dev | PR automation, CI status, issue tracking from the terminal |
| Supabase MCP | Ready to wire | `packages/db/`: query the live schema before writing queries |
| Gmail MCP | Ready to wire | `apps/api/src/routes/outreach.ts`: outreach sending sits behind a `sendEmail()` interface |
| Google Calendar MCP | Ready to wire | `apps/api/src/routes/guests.ts`: booking confirmation and recording date sync |
| Exa Search MCP | Ready to wire | `packages/ai/src/prompts/guest-research.ts`: live web data in the fit-scoring pipeline |

With Gmail MCP wired in, outreach goes from drafted to sent in one click. With Calendar MCP, a guest moving to Scheduled creates the recording event automatically. With Exa, fit scoring can pull the guest's recent work from the web instead of just their bio.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|--------------------------|
| **Monorepo** | Turborepo + pnpm workspaces | Remote build caching, `workspace:*` protocol, one `pnpm install` at root wires everything |
| **Frontend** | Next.js 14 App Router | RSC for static-first rendering, file-based routing, a built-in BFF pattern without a separate gateway |
| **UI** | Tailwind CSS + shadcn/ui | shadcn copies components into your repo, so you own the code instead of a version pinned in `node_modules` |
| **Animations** | Framer Motion | Layout animations on list reorders in one line; `AnimatePresence` handles mount/exit |
| **Drag & Drop** | @hello-pangea/dnd | Maintained fork of react-beautiful-dnd, accessible, drops in identically |
| **Server State** | TanStack Query v5 | Stale-while-revalidate, optimistic updates, auto background refetch. The kanban board feels instant because of this |
| **UI State** | Zustand | Sidebar, modals, command palette, filters, all persisted to localStorage in one line of middleware |
| **API** | Fastify v4 | Commonly benchmarked at roughly 2x the throughput of Express under similar load; first-class TypeScript; `@fastify/swagger` generates OpenAPI from route schemas |
| **Validation** | Zod | One schema, one TypeScript type, one runtime validator, on every route |
| **ORM** | Drizzle ORM | No code generation; schema is plain TypeScript; migrations are plain SQL; queries are type-safe |
| **Database** | SQLite (dev) / Turso (prod) | Zero config locally, identical schema to production |
| **AI** | claude-sonnet-4-6 | Structured JSON output and instruction-following depth the prompt patterns here rely on |
| **Auth** | Supabase Auth | JWT + Row Level Security; a `dev-mock-token` shortcut in dev only, never in production |
| **Email** | Resend + React Email | Templates as React components, version controlled, previewable in a browser, mocked in dev |
| **Charts** | Recharts | React-native and composable |
| **CI/CD** | GitHub Actions | Lint → typecheck → test → build on every PR, Node 20, pnpm 9. No merge without green |

---

## Project Structure

```
podcast-guest-crm/
├── apps/
│   ├── web/                         # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (auth)/login/        # Demo login (route group)
│   │   │   └── dashboard/           # Protected routes. No route group by design
│   │   │       ├── page.tsx         # Overview · Today's Focus · Recent Activity
│   │   │       ├── layout.tsx       # Sidebar + Navbar + GlobalModals
│   │   │       ├── guests/          # Table · filters · Add Guest modal
│   │   │       ├── pipeline/        # Kanban board
│   │   │       │   └── [id]/        # Guest detail · AI action sidebar
│   │   │       ├── outreach/        # AI email composer (streaming)
│   │   │       ├── analytics/       # Charts · conversion metrics
│   │   │       └── settings/        # Workspace · AI model config
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui primitives
│   │   │   ├── shared/              # Sidebar · Navbar · CommandPalette
│   │   │   │                        # NotificationDropdown · GlobalModals · EmptyState
│   │   │   ├── guests/              # GuestCard · GuestTable · AddGuestModal
│   │   │   │                        # InterviewBriefPanel · SocialPostsPanel
│   │   │   ├── pipeline/            # KanbanBoard · KanbanColumn
│   │   │   └── outreach/            # AIAssistPanel (streaming typewriter)
│   │   ├── hooks/                   # TanStack Query hooks, graceful fallback on every query
│   │   ├── lib/                     # api.ts · mock-data.ts · utils.ts
│   │   └── stores/                  # Zustand: sidebar · modals · palette · filters
│   │
│   └── api/                         # Fastify v4 backend
│       └── src/
│           ├── plugins/             # cors · rate-limit · jwt · swagger-ui
│           ├── routes/              # /guests · /outreach · /ai · /analytics
│           ├── services/            # guestService, in-memory store, seeded on startup
│           └── tests/                # Vitest
│
├── packages/
│   ├── types/                       # Shared TypeScript interfaces, single source of truth
│   ├── config/                      # Zod env validation, shared constants
│   ├── db/                          # Drizzle schema · 34 seed guests · migrations
│   ├── ai/                          # ClaudeClient · 6 typed prompt modules
│   ├── cli/                         # podcast-guest-crm-cli: TypeScript CLI, wraps apps/api
│   └── cli-pypi-wrapper/            # Thin pip/pipx wrapper, shells out to the npm CLI
│
├── .github/
│   ├── workflows/                   # ci.yml · security.yml (CodeQL + audit + secret scan)
│   └── PULL_REQUEST_TEMPLATE.md     # Includes the MLP checklist
│
└── docs/
    ├── architecture/                # system-design.md · security.md · ai-layer.md
    └── decisions/                   # ADR 001 (monorepo) · 002 (Drizzle) · 003 (Fastify)
```

---

## API Reference

OpenAPI documentation is generated at `http://localhost:3001/docs`.

```
GET    /health                        Health check + readiness probe

GET    /api/v1/guests                 List, paginated, filterable by stage/topic/priority
POST   /api/v1/guests                 Create guest, triggers async fit scoring
GET    /api/v1/guests/:id             Guest detail
PUT    /api/v1/guests/:id             Update fields
PATCH  /api/v1/guests/:id/stage       Lifecycle transition, service validates allowed paths
DELETE /api/v1/guests/:id             Soft delete

POST   /api/v1/outreach/draft         AI draft, JSON or streaming mode
POST   /api/v1/outreach/send          Send via Resend (mocked in dev)
GET    /api/v1/outreach/:guestId      Outreach history

POST   /api/v1/ai/fit-score           Score 0-100 + rationale + red flags
POST   /api/v1/ai/interview-brief     Pre-recording brief with question structure
POST   /api/v1/ai/social-post         LinkedIn + Twitter thread + Instagram caption

GET    /api/v1/analytics/overview     Dashboard metrics + recent activity feed
GET    /api/v1/analytics/pipeline     Stage funnel + outreach activity timeline
```

Lifecycle transitions enforced at the service layer:

```
discover → outreach → scheduled → recorded → published → follow_up
               ↑___________↑          ↑__________↑
          (reschedule)          (re-record needed)
```

Every route above requires a valid JWT except `/health`, which is exempt from rate limiting. All requests are capped at 100/minute per IP.

---

## CLI

`podcast-guest-crm-cli` is a real TypeScript CLI (`packages/cli`) that wraps the API above. Every command maps to a real route; there are no invented endpoints.

```bash
npm install -g podcast-guest-crm-cli
# or, for Python-first / pip environments (thin wrapper, shells out to the npm package via npx):
pip install podcast-guest-crm-cli
```

Both installs expose two equivalent commands: `podcast-guest-crm-cli` and the shorter alias `pgcrm`.

### Command Reference

Reference below is the actual `--help` output from the installed CLI (v0.1.3), not remembered from an old README.

```
Usage: podcast-guest-crm-cli [options] [command]

Options:
  -V, --version    output the version number
  --json           Output machine-readable JSON instead of human-formatted text
                    (every data-returning command supports this)
  -h, --help       display help for command

Commands:
  login [options]                  Log in and cache the session
  guest list [options]             List guests, paginated and filterable
  guest show <id>                  Get full detail for a single guest
  guest add [options]              Create a new guest
  guest stage [options] <id> <newStage>   Transition a guest to a new lifecycle stage
  outreach draft [options] <guestId>      Generate an AI outreach email draft
  analytics summary                Dashboard overview
  analytics pipeline               Stage funnel + activity timeline
```

| Command | Key flags | Wraps |
|---------|-----------|-------|
| `login` | `-e/--email`, `-p/--password`, `--supabase-url`, `--supabase-anon-key` | Supabase password grant |
| `guest list` | `--page`, `--limit` (max 100), `--stage`, `--priority`, `--search` | `GET /api/v1/guests` |
| `guest show <id>` | none | `GET /api/v1/guests/:id` |
| `guest add` | `--name`, `--email`, `--title`, `--company`, `--bio`, `--topics`, `--priority` | `POST /api/v1/guests` |
| `guest stage <id> <newStage>` | `--reason` | `PATCH /api/v1/guests/:id/stage` |
| `outreach draft <guestId>` | `--episode-angle`, `--recent-work` | `POST /api/v1/outreach/draft` |
| `analytics summary` | none | `GET /api/v1/analytics/overview` |
| `analytics pipeline` | none | `GET /api/v1/analytics/pipeline` |

```bash
podcast-guest-crm-cli login
podcast-guest-crm-cli guest list --stage published --limit 5
podcast-guest-crm-cli guest show <id>
podcast-guest-crm-cli guest add --name "Ada Lovelace" --email ada@example.com --title "Engineer" --company "Analytical Engines"
podcast-guest-crm-cli guest stage <id> outreach --reason "replied positively"
podcast-guest-crm-cli outreach draft <guest-id> --episode-angle "AI safety"
podcast-guest-crm-cli analytics summary
podcast-guest-crm-cli analytics pipeline
```

Add `--json` to any data-returning command for machine-readable output, meant for scripts and agents:

```bash
podcast-guest-crm-cli guest list --stage discover --json
```

`login` authenticates directly against Supabase's own REST auth endpoint (`POST <SUPABASE_URL>/auth/v1/token?grant_type=password`), the same identity provider the web app uses. It never uses the dev-only `Bearer dev-mock-token` shortcut in `apps/api/src/plugins/auth.ts`; that bypass exists purely for local API testing. The resulting session is cached to `~/.config/podcast-guest-crm-cli/credentials.json` (permissions `0600`) and refreshed silently with the stored refresh token when it expires.

![CLI guest list and analytics summary](https://raw.githubusercontent.com/RudrenduPaul/podcast-guest-crm/main/docs/usage.gif)

---

## Security

| Control | Implementation |
|---------|---------------|
| **Authentication** | JWT via `@fastify/jwt`. Every route: `preHandler: [server.authenticate]`, no exceptions, including in dev |
| **Workspace isolation** | All queries filter by `workspaceId` from the JWT payload. Supabase RLS enforces this at the DB layer in production |
| **Rate limiting** | 100 req/min per IP via `@fastify/rate-limit`; `/health` is exempt |
| **Input validation** | Zod on every route: body, query, path params |
| **SQL injection** | Drizzle ORM parameterized queries throughout, no raw SQL |
| **XSS** | Next.js default escaping + restrictive CSP headers in `next.config.ts` |
| **Secrets** | Zod env schema crashes the server at boot on missing required vars |
| **CORS** | Allowlist-based, no wildcard |
| **SAST** | CodeQL on every PR and on a weekly schedule (`.github/workflows/security.yml`) |
| **Secret scanning** | TruffleHog runs in CI on every PR (`continue-on-error`, reports but does not block merge yet) |
| **Dependency audit** | `pnpm audit --audit-level=high` runs in CI on every PR (`continue-on-error`, reports but does not block merge yet) |

---

## Roadmap

Near-term (next 60 days):
- **Stripe billing:** Solo $29/mo, Agency $99/mo, usage-based AI credits above tier
- **MCP: Gmail + Google Calendar:** outreach goes from drafted to sent in one click; booking confirmations create calendar events automatically
- **MCP: Exa Search:** guest fit scoring pulls in live web data alongside the guest's bio text

Medium-term:
- **Transcript ingestion:** upload an episode, auto-generate social posts and a follow-up email referencing specific highlights
- **Client portal:** token-based read-only view for agency clients, replacing the weekly status report email
- **Zapier / Make connector:** two-way sync with Cal.com, Notion, HubSpot
- **RSS extraction:** input a podcast RSS URL, auto-populate host contact info and show stats

Longer-term:
- **Mobile (React Native):** same API, native feel, for pipeline review on the go
- **Multi-show dashboard:** agency view across all managed shows in one screen
- **Predictive follow-up:** a model trained on reply rate data to optimize outreach timing

---

## The Team

**Rudrendu Paul** and **Sourav Nandy** built this.

The stack used:

- Full-stack TypeScript monorepo (Turborepo + pnpm) with shared type packages, enforced at the CI layer
- Fastify APIs with Zod-validated schemas, JWT authentication, and Row Level Security
- AI-powered feature layers with typed prompt modules, streaming, JSON extraction, and exponential backoff
- Next.js 14 App Router frontend with TanStack Query, Zustand, Framer Motion, and shadcn/ui

---

<div align="center">

**Star it if you find it useful.**

<br/>

[![Star this repo](https://img.shields.io/github/stars/RudrenduPaul/podcast-guest-crm?style=social)](https://github.com/RudrenduPaul/podcast-guest-crm)

<br/>

*Built with [Claude Code](https://claude.ai/code)*

</div>

---

## FAQ

**What is `podcast-guest-crm-cli` and how is it different from using the web app?**

It's a real TypeScript command-line client (`packages/cli`) for the same API the Next.js web app calls. It wraps the guest lifecycle endpoints (`guest list/add/show/stage`), the AI outreach drafting endpoint (`outreach draft`), and the analytics endpoints (`analytics summary/pipeline`). The differentiator is agent-native output: every data-returning command supports `--json`, so a script or an AI agent can drive the same pipeline a human would drive from the dashboard, without scraping HTML or maintaining its own HTTP client.

**How is this different from PodMatch or a general CRM like HubSpot?**

PodMatch is a discovery marketplace: it matches hosts and guests who don't know each other yet, priced $6-64/mo depending on the plan. HubSpot and Pipedrive are general-purpose sales CRMs with a guest lifecycle bolted on via custom fields, priced $20-150/user/mo and $24-99/user/mo respectively. Neither models the six-stage podcast booking lifecycle natively, and neither has AI outreach drafting, fit scoring, interview briefs, or a follow-up sequence generator built in. This CRM is built around that lifecycle from the schema up, at $29-99/mo.

**What platforms and runtimes does it support?**

The npm package (`podcast-guest-crm-cli` on npm, requires Node.js 20 or newer) runs on macOS, Linux, and Windows anywhere Node runs. A separate PyPI package of the same name (`packages/cli-pypi-wrapper`) is a thin wrapper for pip/pipx users: it doesn't reimplement the CLI in Python, it checks that `node` and `npx` are on `PATH` and shells out to the npm package, pinned to the wrapper's own version, falling back to npm's `latest` release if that exact version was never published to npm rather than failing outright. Both entry points (`podcast-guest-crm-cli` and `pgcrm`) are verified working from a clean `npm install -g` and a clean `pip install` in an isolated virtualenv.

**I ran `pnpm dev` and the API crashed with `unable to determine transport target for "pino-pretty"`. What's going on?**

This is a real, current gap: `apps/api/src/server.ts` configures Fastify's dev-mode logger with `transport: { target: 'pino-pretty' }`, but `pino-pretty` isn't listed as a dependency in `apps/api/package.json` or the lockfile, so Node can't resolve it at startup. Running `pnpm add -D pino-pretty --filter api` once installs it and fixes the crash for all future `pnpm dev` runs; `pnpm build` and the production path aren't affected, since the pretty transport is only wired up outside `NODE_ENV=production`. Also worth knowing: `pnpm install` itself fails on Node 24 because `better-sqlite3` has no prebuilt binary for that Node ABI yet and its from-source build breaks on newer compiler toolchains. Node 20, the version this project's own CI pins, installs cleanly.

**How does the CLI's login work?**

`podcast-guest-crm-cli login` prompts for your email and password, then authenticates directly against your Supabase project's own REST endpoint (`POST <SUPABASE_URL>/auth/v1/token?grant_type=password`), the same identity provider the web app uses. You'll need your deployment's Supabase project URL and anon key (`--supabase-url` / `--supabase-anon-key`, or `PODCAST_GUEST_CRM_SUPABASE_URL` / `PODCAST_GUEST_CRM_SUPABASE_ANON_KEY`), matching the values your deployment already sets as `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The resulting access and refresh tokens are cached to `~/.config/podcast-guest-crm-cli/credentials.json` with `0600` permissions, and the access token refreshes silently once it expires.

**Why did a command print `{"data": {}}` instead of the fields I expected?**

That's a real, current gap in a few of the API's own Fastify response schemas (`apps/api/src/routes/guests.ts`), not a CLI bug: routes like `PATCH /guests/:id/stage`, `POST /guests`, and `GET /guests/:id` declare their response shape as a bare `{ type: 'object' }` with no listed properties, so Fastify's JSON serializer strips the body down to an empty object even on success. The CLI detects this and prints the raw (empty) response instead of crashing on a missing field. `guest list` isn't affected, since its schema declares an array with no fixed item shape.

**Can I use this CLI in an automated pipeline or hand it to an AI agent?**

Yes, that's the primary design goal. Every data-returning command accepts `--json` for structured output, exit codes are nonzero on failure, and error responses are JSON objects with `error` and `message` fields (plus `statusCode` when the failure came back from the API rather than a local check, like being logged out) when `--json` is set. There's no interactive-only path required for any command except `login`'s password prompt, which also accepts `--email` and `--password` flags for non-interactive use.

**Can I use this CLI, or the rest of this codebase, commercially?**

Not without written approval. This repository (including `packages/cli` and `packages/cli-pypi-wrapper`) is proprietary, jointly owned by Rudrendu Paul and Sourav Nandy. See [LICENSE](LICENSE) for the exact permitted and restricted uses; commercial use, derivative products, and white-labeling all require prior written approval from both owners.

**Does the CLI ever store or transmit my password?**

No. The password you enter at the `login` prompt is sent once, over HTTPS, directly to Supabase's password grant endpoint, and is never written to disk. Only the resulting access token, refresh token, and their expiry are cached locally.

**What happens if my session expires while I'm running a command?**

The CLI checks the cached access token's expiry (with a 30-second buffer) before every request. If it's expired, the CLI calls Supabase's refresh-token grant with the stored refresh token, saves the new session, and retries, all without prompting you to log in again. You'll only see `login` errors again once the refresh token itself is invalidated, for example after a password change.

---

## License

Proprietary. See [LICENSE](LICENSE) for full terms.

Viewing and forking for personal or educational use is permitted. Commercial use, derivative products, or business deployment requires written approval from both owners.
</content>
