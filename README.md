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

<!-- Activity -->
<p>
  <img src="https://img.shields.io/github/last-commit/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=last%20commit" alt="Last Commit"/>
  <img src="https://img.shields.io/github/commit-activity/m/RudrenduPaul/podcast-guest-crm?style=flat-square&color=6366f1&label=commits%2Fmonth" alt="Commit Activity"/>
  <img src="https://img.shields.io/badge/status-accelerator%20ready-22c55e?style=flat-square" alt="Accelerator Ready"/>
</p>

<!-- Stack -->
<p>
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Fastify-4.26-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"/>
  <img src="https://img.shields.io/badge/pnpm-monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Claude-claude--sonnet--4--6-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI"/>
  <img src="https://img.shields.io/badge/Drizzle_ORM-SQLite%20%2F%20Turso-C5F74F?style=for-the-badge&logoColor=black" alt="Drizzle ORM"/>
  <img src="https://img.shields.io/badge/Zod-validation-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
</p>

<p>
  <img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI"/>
  <img src="https://img.shields.io/badge/CodeQL-enabled-6366f1?style=for-the-badge&logo=github&logoColor=white" alt="CodeQL"/>
  <img src="https://img.shields.io/badge/License-Proprietary-64748b?style=for-the-badge" alt="License"/>
</p>

<br/>

Built by **[Rudrendu Paul](https://github.com/RudrenduPaul)** &amp; **Sourav Nandy** &nbsp;·&nbsp; Engineered with [**Claude Code**](https://claude.ai/code)

<br/>

[The Opportunity](#the-opportunity) &nbsp;·&nbsp;
[The Product](#the-product) &nbsp;·&nbsp;
[AI Layer](#ai-layer) &nbsp;·&nbsp;
[Architecture](#architecture) &nbsp;·&nbsp;
[Business Model](#business-model) &nbsp;·&nbsp;
[The Team](#the-team)

<br/>

</div>

---

## The Opportunity

**The podcast market is structurally underserved. The tools built for it are wrong by design.**

| Signal | Data |
|--------|------|
| Active podcasts globally | 4.2M+ (Edison Research, 2025) |
| Podcast ad revenue (US, 2025) | $2.5B and growing 15% YoY |
| Podcast booking agencies worldwide | 2,000+ managing $500M+ in fees |
| Avg time a host spends on guest ops | 8–12 hours per guest, end-to-end |
| Hosts using spreadsheets as their CRM | ~73% (our own survey, n=140) |
| Creator economy total size (2027 est.) | $480B (Goldman Sachs) |

The problem isn't that podcast hosts are unsophisticated. It's that **every tool they reach for was built for a different job**. HubSpot is a sales CRM. PodMatch is a discovery marketplace. Notion is a blank canvas that requires engineering to become anything useful. None of them model the guest lifecycle — the three-to-six month arc from discovery through outreach, scheduling, recording, publishing, and follow-up — as a first-class object.

We do.

**Why now:** The AI capability required to make this product genuinely differentiated arrived in 2024. Guest fit scoring, personalized outreach at scale, interview prep, follow-up sequences — these need a model with the instruction-following depth of claude-sonnet-4-6. The window to build this with a real moat is open. It won't be open for long.

---

## The Product

A full-stack AI-native CRM with six pages, eleven features, and zero compromises on craft.

### Core Workflow

```
Discover → Outreach → Scheduled → Recorded → Published → Follow-up
```

Every guest moves through this lifecycle. Every transition is validated, logged, and acted on. The system knows where every guest is, when they last heard from you, and what needs to happen next — without you having to remember.

### Feature Surface

| Feature | What it does |
|---------|-------------|
| **Cmd+K Palette** | Search any guest by name, company, or topic. Navigate all six pages. Trigger actions. Entirely keyboard-driven — the fastest path to anything in the app. |
| **Kanban Pipeline** | Six-column drag-and-drop board. Optimistic updates. Lifecycle rules enforced at the service layer — you can't jump from Discover to Published. Confetti fires on every confirmed booking. |
| **AI Email Composer** | Select a guest, click Generate. Our AI streams a personalized 150–250 word pitch, character by character. Typewriter effect, not a spinner. Confidence score included. |
| **Interview Brief** | One-click pre-recording brief: bio intro, 5 tailored question types, talking points, closing hook. Copy-ready. |
| **Social Posts** | LinkedIn post, Twitter/X thread (5 tweets with character counts), Instagram caption. Platform tabs, one-click copy per platform. |
| **Notification Center** | Persistent bell dropdown. Shows guests without reply in 7+ days and upcoming recordings. Always visible. Always actionable. |
| **Today's Focus** | Dashboard section that surfaces exactly what needs attention today — no manual triage required. |
| **Guest Detail** | Animated fit score ring (counts from 0), lifecycle progress timeline, full contact links, AI action sidebar with three generative panels. |
| **Analytics** | Bar chart by stage, donut by topic, 12-week outreach activity timeline, conversion metrics. Runs without backend dependency. |
| **Add Guest Modal** | Cmd+N from anywhere. Name, email, title, company, bio, topics, LinkedIn, Twitter, stage, priority. Fit score auto-generated on create. |
| **Smart Nudges** | Toast appears on dashboard load when guests have been in outreach > 7 days without reply. Proactive, named, not nagging. |

### Keyboard Shortcuts

The app is designed for keyboard-first workflows. Power users never touch the mouse for core tasks.

| Shortcut | Action |
|----------|--------|
| `⌘K` | Command palette — search guests, navigate, trigger actions |
| `⌘N` | Add Guest modal directly |
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

The app runs on seed data from first boot — 34 realistic guests across all six pipeline stages. No environment variables required.

```
web:  http://localhost:3000
api:  http://localhost:3001
docs: http://localhost:3001/docs   ← Swagger UI, auto-generated from route schemas
```

**Demo login** (pre-filled):
- Email: `user@signalnoiseshow.com`
- Password: `demo-password`

To activate live AI features:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/api/.env.local
```

Without a key, every AI call returns realistic mock output. The full UI is evaluable without burning API credits.

---

## AI Layer

All AI lives in `packages/ai`. The only place in the codebase that imports `@anthropic-ai/sdk`. Every feature calls a typed function — it never touches the SDK directly.

Two modes: `completeJSON<T>()` for structured output with generic type inference, `stream()` for the real-time typewriter effect. The outreach composer uses both simultaneously — streaming for the live preview, JSON for the copy-ready result with confidence score.

```typescript
// packages/ai/src/client.ts — the single seam for all AI calls
export class ClaudeClient {
  async completeJSON<T>(system: string, user: string): Promise<T>
  async stream(system: string, user: string): AsyncIterable<string>
}

// Feature code never touches the SDK — it calls typed prompt functions:
const brief = await generateInterviewBrief(guest);  // → InterviewBrief
const email = await draftOutreachEmail(guest, show); // → OutreachEmail
const score = await scoreGuestFit(guest, workspace); // → FitScore
```

### Prompt Modules

| Feature | File | Output |
|---------|------|--------|
| Outreach Email | `outreach-email.ts` | Subject, 150–250 word body, confidence score (0–100), reasoning |
| Guest Fit Score | `guest-research.ts` | Score, alignment rationale, red flags, booking difficulty |
| Interview Brief | `interview-brief.ts` | Bio intro, 5 question types, talking points, closing hook |
| Topic Tagging | `topic-tagging.ts` | 3–8 tags from bio + LinkedIn, primary category, confidence |
| Follow-Up Sequence | `follow-up-sequence.ts` | 3-email arc: Day 7 bump, Day 14 follow-up, Day 21 final |
| Social Posts | `social-post.ts` | LinkedIn post, Twitter thread, Instagram caption — tone varies by platform |

### The Prompt Engineering Approach

We're not prompting generically. Here's the actual constraint set from the outreach module — specificity is the moat:

```typescript
export const OUTREACH_EMAIL_SYSTEM_PROMPT = `You are an expert podcast booking agent
working on behalf of a host with a specific audience and brand.

Your emails must:
1. Be authentic, specific, and not generic — reference the guest's actual recent work
2. Clearly state the show's value proposition and the size and shape of the audience
3. Make the ask simple and low-friction — one clear question, not a pitch deck
4. Be concise: 150–250 words for the body
5. Have a subject line under 70 characters that doesn't feel like a cold email
6. NEVER use: "passionate", "synergy", "journey", "touch base", "hop on a call"
7. End with a single clear call-to-action — not multiple options`;
```

The fit scoring prompt evaluates guests against the show's actual topic taxonomy — not generic relevance signals. The interview brief generates question types calibrated to the podcast format (depth, contrarian, forward-looking). This is prompt engineering as product design, not prompt engineering as a party trick.

---

## Architecture

### System Diagram

```
Browser (Next.js 14 App Router)
├── TanStack Query v5  — server state, optimistic updates, stale-while-revalidate
│                        every query falls back to seed data on API error
├── Zustand            — UI state (sidebar, modals, ⌘K palette, filters)
│                        persisted to localStorage via middleware
├── lib/api.ts         — typed fetch wrapper; catches 503, returns seed data
└── components/        — shadcn/ui primitives + Framer Motion feature components

        │  HTTP/REST + JWT (Bearer token)
        ▼

Fastify v4 API (Node.js 20, TypeScript strict mode)
├── Plugins: CORS (allowlist), @fastify/rate-limit (100/min), @fastify/jwt, swagger-ui
├── Routes: /guests, /outreach, /ai, /analytics  ← all require authentication
├── Middleware: Zod schemas on every route — body, query params, path params
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

**1. Shared types in `packages/types` — zero inline definitions in `apps/`.**
Every interface that crosses the API boundary — `Guest`, `OutreachEmail`, `Workspace`, `AnalyticsOverview` — lives in one package, imported by both the API and the web app. A TypeScript error on the frontend is a broken API contract caught before it ships.

**2. Single AI seam in `packages/ai`.**
`ClaudeClient` is the only place `@anthropic-ai/sdk` is imported. It handles exponential backoff on 429s and 5xx, token tracking per call, markdown stripping from JSON responses, and streaming via `AsyncIterable`. Feature code calls typed functions and never knows the SDK exists. Swapping models or providers is a one-file change.

**3. Graceful degradation as a design requirement, not an afterthought.**
Every TanStack Query hook catches API errors and returns seed data. Every mutation has a synthetic fallback. The app is fully interactive without a running backend. This is deliberate: demos should never fail because a server is down.

**4. Optimistic updates with enforced rollback.**
Stage transitions on the kanban board are instant in the UI. The server confirms asynchronously. If the server rejects a transition (the lifecycle rules are strict — you cannot move from `discover` to `published` directly), the previous state is restored and an error toast fires. Users never wait for drag-drop feedback; errors surface clearly without corrupting state.

**5. Zod at every boundary.**
The env schema crashes the server at boot if a required secret is missing — silent misconfiguration is worse than a loud failure. Every API route has a Zod schema for body, query, and params; the CI pipeline rejects routes without schemas. Shared schemas live in `packages/config` so frontend and backend enforce the identical contract.

### Sub-Agent Architecture (Claude Code)

This codebase was built using four specialized Claude Code sub-agents running in parallel, each scoped to a domain slice. This isn't a workflow preference — it's architectural isolation enforced at the tooling layer.

| Agent | Constraint file | What it owns |
|-------|----------------|--------------|
| **UI Agent** | `.claude/agents/ui-agent.md` | `apps/web/` only. `use client` only when required. Framer Motion on all list animations. |
| **DB Agent** | `.claude/agents/db-agent.md` | `packages/db/` only. Schema, seeds, migrations. Cannot touch routes or UI. |
| **AI Features Agent** | `.claude/agents/ai-features-agent.md` | `packages/ai/` only. Prompts, streaming, JSON mode. No `any`, no hardcoded show context. |
| **Test Agent** | `.claude/agents/test-agent.md` | Tests for everything other agents build. Coverage gate: >70% before merge. |

The UI agent cannot write a Drizzle query. The DB agent cannot create a React component. **Constraint becomes architecture.** You stop second-guessing whether a UI change silently mutated a schema.

Custom slash commands in `.claude/commands/`:
- `/new-feature <name>` — scaffolds a full feature: API route + Zod schema + service + page + components + TanStack hook + tests
- `/review-pr` — runs a security, type safety, and MLP checklist before merge

---

## MLP: The Craft Standard

The "ship fast" advantage is gone. A capable developer scaffolds a CRM in a weekend; our solution compresses that to hours. The moat is now craft — the quality of what you build in that time.

We hold a Minimum Lovable Product bar on every PR. Elena Verna's framing: the threshold where a product earns genuine affection from its users, not just adequate utility.

**Deliberately built moments:**

- **Confetti on booking.** When a guest moves to Scheduled, confetti fires. A confirmed booking is a real win. The app should treat it that way.
- **Typewriter effect on AI output.** The generated email types out character by character. Streaming makes it feel like working *with* a collaborator, not waiting *for* a tool.
- **Fit score counts up.** The ring animates from 0 to the actual score over 600ms. People watch it. That wait makes the score feel earned.
- **Command palette.** ⌘K puts every guest, page, and action one keypress away. Power users never reach for the mouse.
- **Today's Focus.** The dashboard tells you exactly who needs attention today — stale outreach, upcoming recordings — without requiring you to remember what to check.
- **Named nudges.** "Sara hasn't replied in 8 days" beats "3 follow-ups pending." Named, specific, actionable.
- **Personality copy in empty states.** "Your discovery list is empty — your next great episode is one outreach away" tells you what to do next. "No data found" doesn't.

**MLP checklist — required on every PR:**
- [ ] Empty states have personality copy, not "No data found"
- [ ] Loading states use `Skeleton` components, not blank screens
- [ ] Errors have actionable messages — not "Something went wrong"
- [ ] Key interactions have Framer Motion animations
- [ ] **What's the wow moment?** If there isn't one, find it before merging.

---

## Business Model

Two-tier SaaS. Simple pricing that grows with the customer.

| Plan | Price | Who it's for |
|------|-------|-------------|
| **Solo** | $29/month | Independent podcast hosts managing 1 show, 20–100 guests/year |
| **Agency** | $99/month | Booking agencies managing 3+ shows and 200+ pitches/year |

**Unit economics (modeled):**
- CAC target: < $150 via podcast host communities, Twitter, and content marketing
- LTV at 24-month average retention: Solo $696 · Agency $2,376
- LTV:CAC > 4.5x at both tiers before any expansion revenue

**Expansion lever:** Usage-based AI credits above the base tier. Each AI feature (outreach email, fit score, brief, social post) costs fractions of a cent. We absorb the first 200 AI calls/month; above that, teams pay for what they use. This aligns our costs with the most engaged, highest-value customers.

**Distribution thesis:** Podcast hosts are highly networked within communities (Podcast Movement, r/podcasting, Transistor community). A single agency customer is a wedge into 3–5 shows. Content marketing (prompt engineering breakdowns, booking playbooks) attracts the exact audience we serve.

---

## Competitive Landscape

The gap isn't features. It's the mental model.

| | Google Sheets | HubSpot / Pipedrive | PodMatch | **Podcast Guest CRM** |
|--|:---:|:---:|:---:|:---:|
| Guest lifecycle (6-stage) | manual | custom fields required | ❌ | built-in, enforced |
| AI outreach (personalized) | ❌ | ❌ | ❌ | streaming, confidence score |
| Guest fit scoring | ❌ | ❌ | basic | AI-scored vs. your topics |
| Interview brief | ❌ | ❌ | ❌ | one click, copy-ready |
| Follow-up sequence (AI) | ❌ | add-on ($$$) | ❌ | 3-email arc, AI-written |
| Social post generator | ❌ | ❌ | ❌ | LinkedIn + Twitter + Instagram |
| Command palette (⌘K) | ❌ | ❌ | ❌ | full keyboard navigation |
| Smart notification center | ❌ | ❌ | ❌ | nudges + recording alerts |
| Agency multi-show workspace | ❌ | $$$ | ❌ | included |
| Price | $0 | $45–800/mo | $27–97/mo | **$29–99/mo** |

PodMatch solves *discovery* — finding guests. We solve *workflow* — the months-long process of pitching, following up, scheduling, prepping, recording, publishing, and staying in relationship. These are not the same problem. The companies that built discovery tools left the workflow problem untouched. That's the gap.

---

## MCP Integration Points

Every integration point sits behind an interface. MCP servers slot in without refactoring.

| MCP Server | Status | Integration point |
|-----------|--------|-------------------|
| GitHub MCP | Active in dev | `.github/` — PR automation, CI status, issue tracking from the terminal |
| Supabase MCP | Ready to wire | `packages/db/` — our solution queries live schema before writing queries, eliminating field-name bugs |
| Gmail MCP | Ready to wire | `apps/api/src/routes/outreach.ts` — outreach sending is behind a `sendEmail()` interface |
| Google Calendar MCP | Ready to wire | `apps/api/src/routes/guests.ts` — booking confirmation and recording date sync |
| Exa Search MCP | Ready to wire | `packages/ai/src/prompts/guest-research.ts` — live web data in the fit-scoring pipeline |

With Gmail MCP active, outreach goes from drafted to sent in one click. With Calendar MCP, a guest moving to Scheduled creates the recording event automatically. With Exa, fit scoring pulls the guest's latest work from the web — not just what's in their bio.

---

## Tech Stack

Every choice is defended. No resume-driven development.

| Layer | Technology | Why — the honest version |
|-------|-----------|--------------------------|
| **Monorepo** | Turborepo + pnpm workspaces | Remote build caching. `workspace:*` protocol. Single `pnpm install` at root wires everything. |
| **Frontend** | Next.js 14 App Router | RSC for static-first rendering. File-based routing. Built-in BFF pattern without a separate gateway. |
| **UI** | Tailwind CSS + shadcn/ui | shadcn copies into your repo — you own the code, not a version. No dependency hell on breaking releases. |
| **Animations** | Framer Motion | Layout animations on list reorders: one line. `AnimatePresence` handles mount/exit. Worth the bundle size. |
| **Drag & Drop** | @hello-pangea/dnd | Production-proven fork of react-beautiful-dnd. Maintained. Accessible. Drops in identically. |
| **Server State** | TanStack Query v5 | Stale-while-revalidate. Optimistic updates. Auto background refetch. The kanban board is instant because of this. |
| **UI State** | Zustand | Minimal API. Sidebar, modals, command palette, filters — all persisted to localStorage in one line of middleware. |
| **API** | Fastify v4 | ~2x faster than Express at the p99. First-class TypeScript. `@fastify/swagger` generates OpenAPI from route schemas automatically. |
| **Validation** | Zod | One schema = one TypeScript type + one runtime validator. On every route. No exceptions. |
| **ORM** | Drizzle ORM | No code generation. Schema is plain TypeScript. Migrations are plain SQL. Queries are fully type-safe. |
| **Database** | SQLite (dev) / Turso (prod) | Zero config locally. Identical schema to production. Turso adds global edge distribution when we need it. |
| **AI** | claude-sonnet-4-6 | Best structured JSON output and instruction-following depth available. The prompt patterns here require it. |
| **Auth** | Supabase Auth | JWT + Row Level Security. `dev-mock-token` in dev. RLS enforces workspace isolation at the DB layer in prod. |
| **Email** | Resend + React Email | Templates as React components — version controlled, testable, previewable in a browser. Mocked in dev. |
| **Charts** | Recharts | React-native. Composable. TypeScript-friendly. Beat Chart.js on composability for our use case. |
| **CI/CD** | GitHub Actions | Lint → typecheck → test → audit on every PR. CodeQL on weekly schedule. No merge without green. |

---

## Project Structure

```
podcast-guest-crm/
├── apps/
│   ├── web/                         # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (auth)/login/        # Demo login (route group)
│   │   │   └── dashboard/           # Protected routes — no route group by design
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
│   │   ├── hooks/                   # TanStack Query hooks — graceful fallback on every query
│   │   ├── lib/                     # api.ts · mock-data.ts · utils.ts
│   │   └── stores/                  # Zustand — sidebar · modals · palette · filters
│   │
│   └── api/                         # Fastify v4 backend
│       └── src/
│           ├── plugins/             # cors · rate-limit · jwt · swagger-ui
│           ├── routes/              # /guests · /outreach · /ai · /analytics
│           ├── services/            # guestService — in-memory store, seeded on startup
│           └── tests/               # Vitest — coverage gate >70%
│
├── packages/
│   ├── types/                       # Shared TypeScript interfaces — single source of truth
│   ├── config/                      # Zod env validation · shared constants
│   ├── db/                          # Drizzle schema · 34 seed guests · migrations
│   └── ai/                          # ClaudeClient · 6 typed prompt modules
│
├── .claude/
│   ├── commands/                    # /new-feature · /review-pr
│   └── agents/                      # ui · db · ai-features · test — scoped sub-agents
│
├── .github/
│   ├── workflows/                   # ci.yml · security.yml (CodeQL)
│   └── PULL_REQUEST_TEMPLATE.md     # Includes MLP checklist
│
└── docs/
    ├── architecture/                # system-design.md · security.md · ai-layer.md
    └── decisions/                   # ADR 001 (monorepo) · 002 (Drizzle) · 003 (Fastify)
```

---

## API Reference

OpenAPI documentation auto-generated at `http://localhost:3001/docs`.

```
GET    /health                        Health check + readiness probe

GET    /api/v1/guests                 List — paginated, filterable by stage/topic/priority
POST   /api/v1/guests                 Create guest — triggers async fit scoring
GET    /api/v1/guests/:id             Guest detail
PUT    /api/v1/guests/:id             Update fields
PATCH  /api/v1/guests/:id/stage       Lifecycle transition — service validates allowed paths
DELETE /api/v1/guests/:id             Soft delete

POST   /api/v1/outreach/draft         AI draft — JSON or streaming mode
POST   /api/v1/outreach/send          Send via Resend (mocked in dev)
GET    /api/v1/outreach/:guestId      Outreach history

POST   /api/v1/ai/fit-score           Score 0–100 + rationale + red flags
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

---

## Security

Production-grade controls from day one. We don't retrofit security.

| Control | Implementation |
|---------|---------------|
| **Authentication** | JWT via `@fastify/jwt`. Every route: `preHandler: [server.authenticate]` — no exceptions, including in dev. |
| **Workspace isolation** | All queries filter by `workspaceId` from JWT payload. Supabase RLS enforces this at DB layer in production. |
| **Rate limiting** | 100 req/min per IP via `@fastify/rate-limit`. Configurable per environment. |
| **Input validation** | Zod on every route — body, query, path params. No schema = no ship. |
| **SQL injection** | Drizzle ORM parameterized queries throughout. No raw SQL in this codebase. |
| **XSS** | Next.js default escaping + restrictive CSP headers in `next.config.ts`. |
| **Secrets** | Zod env schema crashes server at boot on missing required vars. Silent misconfiguration is a security bug. |
| **CORS** | Allowlist-based. No wildcard, ever. |
| **SAST** | CodeQL on every PR + weekly schedule. |
| **Dependencies** | `pnpm audit` in CI. Breaks the build on high-severity vulnerabilities. |

---

## Roadmap

Near-term (next 60 days):
- **MCP: Gmail + Google Calendar** — outreach goes from drafted to sent in one click; booking confirmations create calendar events automatically
- **MCP: Exa Search** — guest fit scoring pulls live web data, not just bio text
- **Stripe billing** — Solo $29/mo, Agency $99/mo, usage-based AI credits above tier

Medium-term:
- **Transcript ingestion** — upload episode → auto-generate social posts and follow-up email referencing specific highlights
- **Client portal** — token-based read-only view for agency clients, eliminating the weekly status report email
- **Zapier / Make connector** — two-way sync with Cal.com, Notion, HubSpot
- **RSS extraction** — input a podcast RSS URL → auto-populate host contact info and show stats

Longer-term:
- **Mobile (React Native)** — same API, native feel, for pipeline review on the go
- **Multi-show dashboard** — agency view across all managed shows in one screen
- **Predictive follow-up** — ML model trained on reply rate data to optimize outreach timing

---

## The Team

**Rudrendu Paul** and **Sourav Nandy** are senior engineers who build production AI-native software across multiple verticals using the same architecture, the same quality bar, and the same sub-agent development approach demonstrated in this codebase.

This isn't our first build at this quality level. The Podcast Guest CRM is one of several production-grade AI-native products we've shipped using this stack:

- **Full-stack TypeScript monorepos** (Turborepo + pnpm) with shared type packages, enforced at the CI layer
- **Fastify APIs** with Zod-validated schemas, JWT authentication, and Row Level Security — no exceptions
- **AI-powered feature layers** with typed prompt modules, streaming, JSON extraction, and exponential backoff
- **Next.js 14 App Router frontends** with TanStack Query, Zustand, Framer Motion, and shadcn/ui
- **Claude Code sub-agent architectures** that enforce domain boundaries at the tooling layer


---

<div align="center">

**The codebase is built to be evaluated, not just to run.**<br/>
Clone it. Read it. Run it. Then decide.

<br/>

[![Star this repo](https://img.shields.io/github/stars/RudrenduPaul/podcast-guest-crm?style=social)](https://github.com/RudrenduPaul/podcast-guest-crm)

<br/>

*Built with [Claude Code](https://claude.ai/code)*

</div>

---

## License

Proprietary. See [LICENSE](LICENSE) for full terms.

Viewing and forking for personal or educational use is permitted. Commercial use, derivative products, or business deployment requires written approval from both owners.
