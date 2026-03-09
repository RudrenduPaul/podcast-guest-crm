# Podcast Guest CRM

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4.26-white?logo=fastify&logoColor=black)
![Claude AI](https://img.shields.io/badge/Claude-claude--sonnet--4--6-D97757?logo=anthropic&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-2.0-EF4444?logo=turborepo&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-slate)

> AI-native CRM for podcast hosts and booking agencies — manage the full guest lifecycle from discovery to post-episode follow-up, without the spreadsheet chaos.

**Built by Rudrendu Paul & Sourav Nandy** | Developed with Claude Code

---

## The Problem

Every podcast host knows the follow-up black hole. You find a great guest, send one email, they don't reply, and six weeks later you can't remember who you pitched, what you said, or where the conversation stood.

**The booking agency problem is worse at scale.** Agencies managing 5-15 shows simultaneously track hundreds of guests across Excel sheets, sticky notes, and half-remembered DMs. A single week without follow-up can mean losing a guest you spent three months cultivating.

The existing tools don't fit. CRMs built for sales teams have the wrong mental model — podcast booking is relational, not transactional. Notion databases require custom engineering. Calendly handles scheduling but nothing else.

What podcast hosts actually need: a purpose-built system that knows the guest lifecycle, automates the administrative work, and uses AI to handle the creative work they dread — cold outreach, interview prep, post-episode social.

---

## Product Demo

```
apps/web running on http://localhost:3000
apps/api running on http://localhost:3001
API docs: http://localhost:3001/docs
```

| Screen | Description |
|--------|-------------|
| **Pipeline (Kanban)** | Six-column drag-and-drop board covering the full guest lifecycle. Confetti fires when a guest reaches "Scheduled." Optimistic updates for instant feedback. |
| **AI Email Composer** | Select a guest, click Generate — Claude drafts a personalized outreach email with typewriter animation. Confidence score shown. Regenerate or copy. |
| **Guest Detail** | Full profile with animated fit score progress bar, lifecycle timeline, topics, outreach history, and AI action panel (outreach / brief / social). |
| **Analytics Dashboard** | Bar chart by stage, donut chart by topic, outreach activity line chart, and key conversion metrics — all from seed data. |

---

## Design Philosophy: MLP, Not MVP

The Minimum Viable Product gets you to launch. The **Minimum Lovable Product** gets you to retention.

In 2026, with AI-assisted development collapsing build time, the "build it fast and iterate" advantage is gone. What remains is craft. The apps people use every day are the ones that spark a small moment of joy — an unexpected animation, a witty empty state, a feature that feels like someone thought deeply about the user's actual situation.

**Lovemarks in this product:**

- **Confetti on scheduling**: When you move a guest to "Scheduled," confetti fires. It's a small thing. But podcast hosts celebrate this moment — a confirmed guest is a win — and the app should celebrate with them.
- **Typewriter AI output**: Claude's response types out character by character. This isn't just aesthetics — it feels collaborative, like working alongside someone rather than waiting for a result.
- **Personality in empty states**: "Your discovery list is empty" beats "No data found." Every empty state tells you what to do next with the show's voice.
- **Fit score as a ring**: The guest fit score renders as an animated circular progress ring, not just a number. Immediately scannable, viscerally satisfying.
- **Stage transition validation**: You can't jump from Discover to Published. The system enforces the lifecycle spine — which also happens to make the data trustworthy.

---

## Tech Stack

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| **Monorepo** | Turborepo + pnpm workspaces | Remote build caching, `workspace:*` protocol, single `pnpm dev` |
| **Frontend** | Next.js 14 App Router | RSC for server-side rendering, file-based routing, TypeScript-first |
| **UI Components** | Tailwind CSS + shadcn/ui | Zero-runtime CSS, fully owned components (no package dependency) |
| **Animations** | Framer Motion | Layout animations, drag feedback, mount/exit transitions |
| **Drag and Drop** | @hello-pangea/dnd | Production-proven (fork of react-beautiful-dnd), accessible |
| **Server State** | TanStack Query v5 | Stale-while-revalidate, optimistic updates, automatic retries |
| **UI State** | Zustand | Minimal API, persisted to localStorage, no boilerplate |
| **API** | Fastify v4 | 2-3x faster than Express, first-class TypeScript, auto-generated Swagger |
| **Validation** | Zod | Shared FE/BE schemas, type inference, no runtime/compile split |
| **ORM** | Drizzle ORM | No code generation, SQL-close API, works in all runtimes |
| **Database** | SQLite (dev) / Turso (prod) | Zero-config local dev, globally distributed in production |
| **AI** | Anthropic claude-sonnet-4-6 | Best-in-class reasoning, structured JSON output, streaming |
| **Auth** | Supabase Auth | Row Level Security, JWTs, magic links — mocked in dev |
| **Email** | Resend + React Email | Deliverability-first, components-as-email, mocked in dev |
| **Charts** | Recharts | React-native, composable, TypeScript-friendly |
| **CI/CD** | GitHub Actions | Free for public repos, CodeQL security scanning |

---

## Architecture

```
Browser (Next.js 14 App Router)
├── TanStack Query + Zustand (state)
├── lib/api.ts → falls back to lib/mock-data.ts if API unavailable
└── components/ (shadcn/ui + Framer Motion)
        │
        │ HTTP REST + JWT
        ▼
Fastify API (Node.js 20)
├── Plugins: CORS, rate-limit, JWT auth, Swagger
├── Routes: /guests, /outreach, /ai, /analytics
└── Services: guestService (in-memory seed store)
        │
        ├──────────────────────┐
        ▼                      ▼
packages/db               packages/ai
(Drizzle schema +         (Claude SDK wrapper +
 30+ seed guests)          6 prompt modules)
                               │
                               ▼
                    Anthropic API (claude-sonnet-4-6)
```

For the full architecture diagram and data flow documentation, see [`docs/architecture/system-design.md`](docs/architecture/system-design.md).

---

## AI Features

All AI features use **claude-sonnet-4-6** via `packages/ai`.

| Feature | Endpoint | Input | Output |
|---------|----------|-------|--------|
| **Outreach Email Drafting** | `POST /api/v1/outreach/draft` | Guest profile + show context | Subject line, body, confidence score, reasoning |
| **Guest Fit Scoring** | `POST /api/v1/ai/fit-score` | Guest profile + show topics | Score (0-100), rationale, red flags, booking difficulty |
| **Interview Brief** | `POST /api/v1/ai/interview-brief` | Guest + host notes | Bio intro, 5 typed questions, controversy flags, closing hook |
| **Topic Tagging** | Internal | Guest bio text | 3-8 topic tags, primary category, confidence |
| **Follow-up Sequence** | Internal | Guest + original email | 3-email arc (friendly bump, firm follow-up, final attempt) |
| **Social Posts** | `POST /api/v1/ai/social-post` | Episode + key insights | LinkedIn post, Twitter thread (5-7 tweets), Instagram caption |

---

## Security

| Control | Layer | Implementation |
|---------|-------|---------------|
| Authentication | API | JWT validation via `@fastify/jwt`, Supabase in production |
| Workspace isolation | Service | All queries filter by `workspaceId` from JWT payload |
| Rate limiting | API | 100 req/min per IP via `@fastify/rate-limit` |
| Input validation | API | Zod schemas on all routes (body, query, params) |
| SQL injection | ORM | Drizzle ORM parameterized queries only |
| XSS prevention | Frontend | Next.js default escaping + restrictive CSP |
| Clickjacking | Headers | `X-Frame-Options: DENY` |
| CORS | API | Allowlist-based, no wildcard in production |
| Secrets | Config | Zod env validation, mock defaults in dev, never in source |
| SAST | CI | CodeQL on every PR + weekly schedule |
| Dependency scanning | CI | `pnpm audit` in GitHub Actions |

Full security architecture: [`docs/architecture/security.md`](docs/architecture/security.md)

---

## Project Structure

```
podcast-guest-crm/
├── apps/
│   ├── web/                    # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (auth)/login/   # Demo-mode login page
│   │   │   └── dashboard/      # Protected routes
│   │   │       ├── page.tsx    # Dashboard overview
│   │   │       ├── guests/     # Guest table + filters
│   │   │       ├── pipeline/   # Kanban board + guest detail
│   │   │       ├── outreach/   # AI email composer
│   │   │       ├── analytics/  # Charts + metrics
│   │   │       └── settings/   # Workspace + team
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── guests/         # GuestCard, GuestTable
│   │   │   ├── pipeline/       # KanbanBoard, KanbanColumn
│   │   │   ├── outreach/       # AIAssistPanel (streaming)
│   │   │   └── shared/         # Sidebar, Navbar, EmptyState
│   │   ├── hooks/              # TanStack Query hooks
│   │   ├── lib/                # api.ts, mock-data.ts, utils.ts
│   │   └── stores/             # Zustand UI store
│   └── api/                    # Fastify backend
│       └── src/
│           ├── plugins/        # cors, rate-limit, auth, swagger
│           ├── routes/         # guests, outreach, ai, analytics
│           ├── services/       # guest.service, ai.service
│           └── tests/          # Vitest test suite
├── packages/
│   ├── types/                  # Shared TypeScript interfaces
│   ├── config/                 # Zod env validation + constants
│   ├── db/                     # Drizzle schema + 30+ seed guests
│   └── ai/                     # Claude SDK + 6 prompt modules
├── .claude/
│   ├── commands/               # /new-feature, /review-pr
│   └── agents/                 # ui-, db-, ai-features-, test-agent
├── .github/
│   ├── workflows/              # ci.yml, security.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── architecture/           # system-design, security, ai-layer
│   └── decisions/              # ADR 001-003
├── CLAUDE.md                   # Claude Code instructions
└── turbo.json                  # Build pipeline
```

---

## Getting Started

```bash
git clone https://github.com/RudrenduPaul/podcast-guest-crm
cd podcast-guest-crm
pnpm install
pnpm dev
# web: http://localhost:3000
# api: http://localhost:3001
# api docs: http://localhost:3001/docs
```

No environment variables required. The app runs entirely on mock seed data with default config values.

**Demo credentials** (pre-filled on login page):
- Email: `rudrendu@signalnoiseshow.com`
- Password: `demo-password`

To use real Claude AI (optional):
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/api/.env.local
```

---

## API Documentation

The Fastify API auto-generates OpenAPI documentation at `http://localhost:3001/docs` via `@fastify/swagger-ui`.

Key endpoints:

```
GET    /health                           Health check
GET    /api/v1/guests                    List guests (paginated, filterable)
POST   /api/v1/guests                    Create guest
GET    /api/v1/guests/:id                Get guest by ID
PUT    /api/v1/guests/:id                Update guest
PATCH  /api/v1/guests/:id/stage         Lifecycle transition (validated)
DELETE /api/v1/guests/:id               Soft delete

POST   /api/v1/outreach/draft           AI-draft outreach email
POST   /api/v1/outreach/send            Send email (mock Resend)
GET    /api/v1/outreach/:guestId        Outreach history

POST   /api/v1/ai/fit-score             Generate guest fit score
POST   /api/v1/ai/interview-brief       Generate pre-recording brief
POST   /api/v1/ai/social-post           Generate LinkedIn + Twitter posts

GET    /api/v1/analytics/overview        Key metrics + recent activity
GET    /api/v1/analytics/pipeline        Stage funnel + outreach timeline
```

All endpoints require `Authorization: Bearer dev-mock-token` in development.

---

## Roadmap

| Feature | Priority | Notes |
|---------|----------|-------|
| MCP integration for Riverside/Squadcast | High | Auto-ingest recorded episode details |
| Stripe billing (solo $29/mo, agency $99/mo) | High | Usage-based AI credits |
| Zapier / Make.com connector | Medium | Two-way sync with Cal.com, Notion |
| Episode transcript ingestion | Medium | Auto-generate social posts from transcript |
| Guest CRM mobile app (React Native) | Low | Same API, native feel |
| Podcast RSS feed monitoring | Low | Track if guest has been on competing shows |
| Email deliverability warming | Low | Gradually ramp outreach volume |

---

## License and Ownership

This software is proprietary. See [LICENSE](LICENSE) for full terms.

All intellectual property rights are jointly owned by **Rudrendu Paul** and **Sourav Nandy**. Viewing and forking for personal or educational use is permitted. Any commercial use, derivative product, or business deployment requires prior written approval from both owners.

---

## About the Builders

**Rudrendu Paul** and **Sourav Nandy** are engineers who believe the best software is both technically excellent and genuinely delightful to use. This project was built as a showcase of production-grade architecture, AI integration depth, and product craft — demonstrating what a senior engineering team can build when given the right tools and a clear product vision.

Built with [Claude Code](https://claude.ai/code) — Anthropic's agentic coding assistant.
