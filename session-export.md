# Claude Code Session Export — Podcast Guest CRM

**Engineer:** Rudrendu Paul (all code, Claude Code sessions)  
**Product:** Sourav Nandy (PM — all architectural and product decisions made together before implementation)  
**Session date:** March 8, 2026  
**Duration:** ~3.5 hours (3:49 PM – 7:27 PM MDT)  
**Tool:** Claude Code (claude-sonnet-4-6)  
**Repo:** https://github.com/RudrenduPaul/podcast-guest-crm

---

## What We Set Out to Build

Podcast hosts and booking agencies manage 20–100+ guests per year across spreadsheets, email inboxes, and sticky notes. Guests fall through the cracks. Follow-ups don't happen. There's no systematic way to see where each guest is in the pipeline or what needs to happen next.

We wanted to build an AI-native CRM purpose-built for podcast guest management — one where the AI does the heavy lifting: drafting outreach emails, scoring guest fit, generating pre-recording interview briefs, and creating social posts after an episode publishes. The guest lifecycle would be enforced at the service layer, not left to user discipline.

**Target users:** Podcast booking agencies and independent hosts  
**Core insight:** The "CRM" category exists but nothing is built for audio content workflows specifically. The AI layer isn't a chatbot bolted on — it's load-bearing infrastructure.

---

## Architecture Decisions Made Upfront

Before writing any feature code, we aligned on the stack and non-negotiables:

| Layer | Decision | Why |
|---|---|---|
| Frontend | Next.js 14 App Router | Server components + streaming out of the box |
| Backend | Fastify v4 | 2–3× faster than Express, schema-first via Swagger |
| ORM | Drizzle + better-sqlite3 | Type-safe, zero config in dev, swap to Postgres in prod |
| State | TanStack Query (server) + Zustand (UI) | Clean separation — no prop drilling, no Redux boilerplate |
| AI | Anthropic claude-sonnet-4-6 | Strongest reasoning for structured JSON generation |
| Monorepo | Turborepo + pnpm workspaces | Shared types, shared AI package, single lint pass |
| Auth | Supabase Auth (mocked in dev) | JWT preHandler on every route — no unprotected endpoints |

**Rule we enforced from the start:** No `any` types. Shared types live in `packages/types` only. AI calls go through `packages/ai` — apps never import `@anthropic-ai/sdk` directly.

---

## Session Timeline

### 3:49 PM — Repository initialized

Started with an empty README. The initial commit was just the scaffolding question: what does this product actually do at each step?

We mapped the guest lifecycle before writing a single component:

```
discover → outreach → scheduled → recorded → published → follow_up
```

And we decided the transitions would be enforced in code:

```typescript
// apps/api/src/services/guest.service.ts
const VALID_TRANSITIONS: Record<GuestLifecycleStage, GuestLifecycleStage[]> = {
  discover:   ['outreach'],
  outreach:   ['scheduled', 'discover'],
  scheduled:  ['recorded', 'outreach'],
  recorded:   ['published', 'scheduled'],
  published:  ['follow_up'],
  follow_up:  ['outreach', 'published'],
};
```

This meant `PATCH /api/v1/guests/:id/stage` was the only path to change a guest's stage. Direct `PUT` with a stage field would be rejected. The lifecycle is the product — we didn't want any code path that could skip a step.

### 3:52–4:16 PM — Monorepo scaffolding

Set up Turborepo with pnpm workspaces. Key packages created:

- `packages/types` — shared TypeScript types (Guest, OutreachEmail, GuestLifecycleStage, API response shapes)
- `packages/db` — Drizzle schema + seed data (34 realistic guests across all 6 stages)
- `packages/ai` — ClaudeClient wrapper, all prompt files
- `packages/config` — Zod-validated env parsing (fails fast at boot, not at runtime)
- `apps/api` — Fastify v4 server
- `apps/web` — Next.js 14 App Router frontend

### 5:05 PM — CI, environment, config hardening

Added GitHub Actions CI (`.github/workflows/ci.yml`), `.env.example` files for both apps, and tightened the env validation:

```typescript
// packages/config/src/env.ts
export const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().default('./dev.db'),
  JWT_SECRET: z.string().min(32),
  // ...
});
```

The env parser throws at startup if any required var is missing. No silent undefined.

### 5:23 PM — Route fix + UX improvements

Discovered the Next.js App Router route group `(dashboard)/` was causing a path resolution bug. Claude Code caught it: the route group folder name `(dashboard)` becomes invisible in the URL but was being referenced as a literal path in several components and documentation.

Fixed across 9 files:

```
apps/web/app/(dashboard)/ → apps/web/app/dashboard/
```

Updated all references in hooks, components, and docs to match. Also:

- Added time-aware greeting to the dashboard homepage (morning / afternoon / evening)
- Added empty state to `GuestTable` when 0 guests match filters — with personality copy, not a blank screen
- Fixed `usePipeline.ts` hook — it was initializing from stale state on second render

### 5:36 PM — Model naming + path consistency pass

Swept the entire codebase for `(dashboard)/` references in documentation and config files. Also fixed model naming (one file had written "Claude claude-sonnet-4-6" — redundant product name prefix). Affected files:

- `apps/api/src/routes/outreach.ts`
- `apps/api/src/plugins/swagger.ts`
- `apps/web/app/dashboard/settings/page.tsx`
- `docs/architecture/ai-layer.md`
- `docs/architecture/system-design.md`

### 5:47–5:55 PM — README rewrite

Rewrote README for VC/accelerator evaluation with real substance:

- Market sizing (4.2M podcasts, $2.5B ad revenue market)
- TAM/SAM breakdown
- Business model with unit economics
- "Why now" AI timing narrative
- Five named architectural decisions with reasoning
- Competitive positioning table
- Prompt engineering approach exposed (system constraints, JSON-only responses, retry logic)

### 6:10 PM — Demo credentials

Updated the demo login to `user@signalnoiseshow.com` — a realistic show name for demos vs. the generic placeholder.

### 6:39 PM — The big shipping commit

2,032 lines added in a single commit. This was the UX overhaul that turned the app from "CRUD with an AI route" into something that felt like a product. Six new components shipped together: CommandPalette, AddGuestModal, NotificationDropdown, InterviewBriefPanel, SocialPostsPanel, and GlobalModals. The dashboard gained a "Today's Focus" section surfacing stale outreach and upcoming recordings. Keyboard shortcuts (⌘K, ⌘N) were wired globally through the navbar. The README was rewritten for investor evaluation in the same commit — market sizing, architecture decisions, business model, and prompt engineering approach all documented alongside the code that made them real.

---

## Key Features Built

### 1. AI Outreach Email Generation

**File:** `packages/ai/src/prompts/outreach-email.ts`

The prompt is engineered around what actually makes cold emails convert. The system prompt explicitly prohibits buzzwords ("passionate", "synergy", "journey", "touch base"), enforces 150–250 word body length, and requires a single clear CTA. The AI returns structured JSON with a confidence score and reasoning field so the host understands *why* the email is framed a specific way.

Also implemented a streaming version (`streamOutreachEmail`) for real-time UI feedback — the email appears word-by-word rather than appearing all at once after a 3-second wait.

```typescript
export interface OutreachEmailOutput {
  subject: string;
  body: string;
  confidenceScore: number; // 0–100
  reasoning: string;       // Why this angle will resonate
}
```

### 2. AI Interview Brief Generation

**File:** `packages/ai/src/prompts/interview-brief.ts`

The most complex prompt in the system. Generates a pre-recording brief with:

- A bio summary the host can read verbatim on air
- The specific narrative angle (not generic "let's talk about AI")
- Categorized questions: `opener | core | pivot | closer`
- Follow-up questions for each
- Things to avoid (prior interview fatigue, topics the guest has visibly tired of)
- Controversy flags (things that might require careful handling)
- A memorable closing hook

The key design decision here was giving the model an explicit narrative arc as a constraint: "opening hook → core insight → personal moment → forward-looking thesis → memorable close." Without that framing, AI-generated questions tend to be topically correct but structurally flat — they don't build toward anything. Anchoring the model to a narrative arc was the difference between a list of questions and a brief that actually prepares a host.

### 3. Social Posts Panel

**File:** `apps/web/components/guests/SocialPostsPanel.tsx`

After an episode publishes, the panel generates platform-specific content:
- LinkedIn post (professional framing, 150–250 words, 3 key insights)
- Twitter/X thread (hook tweet + 4–5 follow-up tweets)
- Instagram caption (more personal, visual language, CTA)

Tabbed UI so the host can switch platforms and copy directly.

### 4. Command Palette (⌘K)

**File:** `apps/web/components/shared/CommandPalette.tsx`

Full keyboard-navigable command palette. Searches guests by name/company/topic in real time. Also surfaces navigation actions ("Go to Pipeline", "Go to Analytics") and trigger actions ("Add Guest", "Generate outreach for [selected guest]"). State lives in Zustand so any component can open it programmatically.

```typescript
// stores/ui.store.ts
interface UIState {
  commandPaletteOpen: boolean;
  addGuestModalOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openAddGuestModal: () => void;
  closeAddGuestModal: () => void;
}
```

Keyboard shortcuts wired globally in `Navbar.tsx`:
- `⌘K` → command palette
- `⌘N` → add guest modal

### 5. Notification Dropdown

**File:** `apps/web/components/shared/NotificationDropdown.tsx`

Bell icon in the navbar. Surfaces actionable nudges:
- Stale outreach (guests in `outreach` stage with no contact in 7+ days)
- Upcoming recordings (guests in `scheduled` stage with recording dates in the next 72 hours)

Not a generic notification feed — every item is a specific action prompt with a direct link.

### 6. Add Guest Modal

**File:** `apps/web/components/guests/AddGuestModal.tsx`

Complete guest creation form: name, email, title, company, bio, LinkedIn URL, Twitter handle, topics, priority. Wired to every "Add Guest" button app-wide via the Zustand modal state. On submit, calls `POST /api/v1/guests`. On API failure (in dev), returns a synthetic guest object so the demo never breaks.

### 7. Database Schema

**File:** `packages/db/src/schema.ts`

Five tables with proper foreign keys and soft delete on guests:

- `workspaces` — multi-tenant root, `solo` and `agency` plans
- `workspace_members` — role-based access (`owner | editor | viewer`)
- `guests` — full guest record with all lifecycle fields, fit score, soft delete
- `outreach_emails` — per-guest email history with open/reply tracking
- `activity_log` — audit trail: stage changes, outreach sent, replies, publishes
- `analytics_snapshots` — daily rollup for the analytics dashboard

### 8. ClaudeClient Singleton

**File:** `packages/ai/src/client.ts`

Wrapper around `@anthropic-ai/sdk` with:
- Exponential backoff retry (3 attempts, 2× delay: 1s → 2s → 4s)
- Retry only on 429 (rate limit) and 5xx (server errors) — not 4xx
- `completeJSON<T>()` method that strips accidental markdown code fences and validates JSON parse
- Async generator streaming method for real-time UI
- Singleton pattern — one instance per server process

### 9. Graceful API Degradation

Every frontend hook falls back to seed data if the API is unreachable. This means the demo works even if the backend isn't running:

```typescript
// hooks/useGuests.ts
queryFn: async () => {
  try {
    return await api.guests.list(params);
  } catch {
    return fallbackMockData; // Always gracefully degrade
  }
}
```

This pattern is consistent across all 4 data hooks (`useGuests`, `usePipeline`, `useAnalytics`, `useOutreach`).

---

## Key Debugging Moments

**Route group resolution bug:** Next.js App Router route groups (parenthetical folder names) are invisible in the URL — `(dashboard)/guests` resolves to `/guests`, not `/dashboard/guests`. But we had hardcoded `(dashboard)` in several import paths and documentation references. Claude Code flagged this across 9 files in one pass and refactored the folder structure.

**AI JSON parsing edge case:** On streaming responses, the model occasionally wrapped its JSON in markdown code fences (` ```json ... ``` `). The `completeJSON` method was failing on those. Fixed with a regex strip before parsing:

```typescript
const cleaned = response.text
  .replace(/^```(?:json)?\n?/m, '')
  .replace(/\n?```$/m, '')
  .trim();
return JSON.parse(cleaned) as T;
```

---

## What's Production-Ready vs. Demo-Ready

| Feature | Status |
|---|---|
| Guest CRUD | Production-ready |
| Stage lifecycle enforcement | Production-ready |
| Zod validation on all API routes | Production-ready |
| JWT auth preHandler | Production-ready |
| AI outreach email (JSON) | Production-ready |
| AI outreach email (streaming) | Production-ready |
| AI interview brief | Production-ready |
| AI social posts | Demo-ready (needs streaming) |
| Database (SQLite) | Dev only — swap to Postgres for prod |
| Email sending (Resend) | Mocked in dev |
| Supabase Auth | Mocked in dev |
| Analytics | Seed data only |

---

## Lines of Code Added

| Area | ~Lines |
|---|---|
| packages/ai (prompts + client) | ~800 |
| packages/db (schema + seeds) | ~600 |
| packages/types | ~200 |
| apps/api (routes + services) | ~900 |
| apps/web (pages + components + hooks) | ~2,400 |
| packages/config + CI | ~150 |
| **Total** | **~5,050** |

---

## Repository

GitHub: https://github.com/RudrenduPaul/podcast-guest-crm

Stack: Next.js 14 · Fastify v4 · Drizzle ORM · Turborepo · claude-sonnet-4-6 · TypeScript throughout

Built by Rudrendu Paul and Sourav Nandy, developed with Claude Code.
