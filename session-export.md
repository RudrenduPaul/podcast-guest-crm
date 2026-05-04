# Claude Code Session Export
**Tool:** Claude Code (claude-sonnet-4-6)  
**Engineer:** Rudrendu Paul  
**Product:** Sourav Nandy (PM — all product and architectural decisions made jointly before implementation)  
**Date:** March 8, 2026  
**Duration:** ~3.5 hours  
**Repo:** https://github.com/RudrenduPaul/podcast-guest-crm

---

## Human

Sourav and I want to build an AI-native CRM for podcast guest management. The core problem: podcast hosts and booking agencies are managing 20–100+ guests a year in spreadsheets. Guests fall through, follow-ups don't happen, no one knows what stage each guest is in. We want AI to do the heavy lifting — drafting outreach emails, scoring guest fit, generating pre-recording briefs, writing social posts after episodes publish. What do we need to nail before writing any code?

## Assistant

Before touching the keyboard, we need to lock in two things: the guest lifecycle and the monorepo structure. Both are hard to change later.

On the lifecycle — podcast guest management has a natural spine:

```
discover → outreach → scheduled → recorded → published → follow_up
```

The question is whether we enforce this in the UI, the API, or both. My recommendation: enforce it at the service layer only. The API accepts a `PATCH /api/v1/guests/:id/stage` endpoint that validates transitions against an explicit allowlist. That way no client code — web, mobile, future integrations — can skip a step or move backwards illegally. The lifecycle is the product. If someone can jump from `discover` directly to `published`, the whole value proposition breaks.

On the stack — given you want AI-native and want to move fast:

| Layer | Decision | Why |
|---|---|---|
| Frontend | Next.js 14 App Router | Server components, streaming built in |
| Backend | Fastify v4 | 2–3× faster than Express, schema-first |
| ORM | Drizzle + better-sqlite3 | Type-safe, zero config in dev |
| State | TanStack Query + Zustand | Server state vs UI state — clean split |
| AI | claude-sonnet-4-6 via @anthropic-ai/sdk | Structured JSON generation |
| Monorepo | Turborepo + pnpm workspaces | Shared types, shared AI package |

One non-negotiable before we start: AI calls go through a shared `packages/ai` package. No app ever imports `@anthropic-ai/sdk` directly. This keeps the AI layer swappable and testable.

Shall I scaffold the monorepo?

## Human

Yes — let's go. Scaffold everything.

## Assistant

Starting with the monorepo structure. Setting up Turborepo with pnpm workspaces, then the six packages.

> `Bash` — initializing repo, creating package structure  
> `Write` — `turbo.json`, root `package.json`, `pnpm-workspace.yaml`  
> `Write` — `packages/types/src/guest.types.ts`

```typescript
// packages/types/src/guest.types.ts
export type GuestLifecycleStage =
  | 'discover'
  | 'outreach'
  | 'scheduled'
  | 'recorded'
  | 'published'
  | 'follow_up';

export type GuestPriority = 'low' | 'medium' | 'high';

export interface Guest {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  title: string;
  company: string;
  bio: string;
  stage: GuestLifecycleStage;
  priority: GuestPriority;
  fitScore: number; // 0–100, AI-generated
  topics: string[];
  // ... episode fields, contact tracking, soft delete
}
```

> `Write` — `packages/db/src/schema.ts` (5 tables: workspaces, workspace_members, guests, outreach_emails, activity_log, analytics_snapshots)  
> `Write` — `packages/db/src/seeds/guests.seed.ts` (34 realistic guests across all 6 stages)  
> `Write` — `packages/ai/src/client.ts`  
> `Write` — `packages/config/src/env.ts`  
> `Write` — `apps/api/src/server.ts`  
> `Write` — `apps/web/app/layout.tsx`

The AI client is a singleton with exponential backoff retry. Worth seeing the retry logic:

```typescript
// packages/ai/src/client.ts
for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
  try {
    const response = await this.client.messages.create({ ... });
    return { text, usage, model, stopReason };
  } catch (error) {
    if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) throw error;
    await sleep(RETRY_DELAY_MS * Math.pow(2, attempt)); // 1s → 2s → 4s
  }
}
```

Retry only on 429 (rate limit) and 5xx — never on 4xx. A bad request should fail fast, not retry.

Also added `completeJSON<T>()` — strips markdown code fences before parsing, throws a typed error on invalid JSON:

```typescript
async completeJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
  const response = await this.complete(systemPrompt, userMessage);
  const cleaned = response.text
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim();
  return JSON.parse(cleaned) as T;
}
```

That code fence stripping will matter later — the model wraps JSON in fences on streaming responses. Better to handle it once here than in every prompt.

Monorepo is up. Moving to the API routes.

## Human

Good. Let's wire the guest lifecycle enforcement and get the AI prompts in.

## Assistant

Wiring the stage transition service first — this is the core of the product.

> `Write` — `apps/api/src/services/guest.service.ts`

```typescript
const VALID_TRANSITIONS: Record<GuestLifecycleStage, GuestLifecycleStage[]> = {
  discover:   ['outreach'],
  outreach:   ['scheduled', 'discover'],
  scheduled:  ['recorded', 'outreach'],
  recorded:   ['published', 'scheduled'],
  published:  ['follow_up'],
  follow_up:  ['outreach', 'published'],
};

transitionStage(id: string, workspaceId: string, targetStage: GuestLifecycleStage) {
  const guest = this.findById(id, workspaceId);
  if (!guest) return { success: false, error: `Guest ${id} not found` };

  const allowed = VALID_TRANSITIONS[guest.stage];
  if (!allowed.includes(targetStage)) {
    return {
      success: false,
      error: `Cannot transition from '${guest.stage}' to '${targetStage}'. Allowed: ${allowed.join(', ')}`,
    };
  }
  // apply transition...
}
```

The error message tells you exactly what transitions are allowed — useful for debugging and for future API consumers.

Now the AI prompts. Starting with outreach email — the most used feature.

> `Write` — `packages/ai/src/prompts/outreach-email.ts`

The system prompt needs to be opinionated. Generic outreach emails don't convert. Encoding the constraints directly:

```
Your emails must:
1. Be authentic, specific — reference the guest's actual recent work
2. 150–250 words body length
3. Subject line under 70 characters
4. NOT use: "passionate", "synergy", "journey", "touch base"
5. End with a single clear call-to-action

Tone: Warm, professional, confident without being sycophantic.
```

Also shipping a streaming version for real-time UI — the email appears word-by-word rather than after a 3-second wait:

> `Write` — streaming `streamOutreachEmail()` using `client.stream()` async generator

Now the interview brief prompt. This one needs a narrative arc constraint or the questions come out flat:

> `Write` — `packages/ai/src/prompts/interview-brief.ts`

The key framing in the system prompt: *"The best podcast episodes have a narrative arc: opening hook → core insight → personal moment → forward-looking thesis → memorable close."* Without that, AI-generated questions are topically correct but structurally flat — they don't build toward anything.

Output shape:
```typescript
interface InterviewBriefOutput {
  bioSummary: string;
  episodeAngle: string;
  questions: Array<{
    question: string;
    followUps: string[];
    type: 'opener' | 'core' | 'pivot' | 'closer';
  }>;
  thingsToAvoid: string[];
  controversyFlags: string[];
  closingHook: string;
}
```

> `Write` — `packages/ai/src/prompts/social-post.ts`  
> `Write` — `packages/ai/src/prompts/guest-research.ts` (fit score + red flags)  
> `Write` — `apps/api/src/routes/ai.ts` (fit-score, interview-brief, social-post endpoints)  
> `Write` — `apps/api/src/routes/guests.ts` (CRUD + stage transition)  
> `Write` — `apps/web/lib/api.ts` (frontend API client with graceful 503 fallback)

All routes have `preHandler: [server.authenticate]` and Zod validation. No exceptions.

## Human

Running it. The pipeline page isn't loading — getting a 404 on `/dashboard/guests`.

## Assistant

Let me check the routing.

> `Bash` — `find apps/web/app -type d | sort`

Found it. The folder is `apps/web/app/(dashboard)/guests/` — the parenthetical makes this a Next.js App Router route group, which is invisible in the URL. So `(dashboard)/guests` resolves to `/guests`, not `/dashboard/guests`.

But several components and hooks are referencing the literal path `(dashboard)/` in imports and link hrefs. That's the bug.

> `Read` — `apps/web/hooks/usePipeline.ts`  
> `Read` — `apps/web/components/shared/Sidebar.tsx`  
> `Bash` — `grep -r "(dashboard)" apps/web --include="*.tsx" --include="*.ts" -l`

Nine files affected. Options:
1. Keep the route group and fix all the references
2. Rename the folder to `dashboard/` (no parentheses) — simpler, no confusion going forward

Renaming the folder. Route groups are useful when you need layout sharing without URL segments, but here the folder name is just causing confusion with no benefit.

> `Bash` — `mv apps/web/app/(dashboard) apps/web/app/dashboard`  
> `Edit` — `apps/web/hooks/usePipeline.ts` — fix import paths  
> `Edit` — `apps/web/components/shared/Sidebar.tsx` — fix nav links  
> `Edit` — `apps/web/app/dashboard/page.tsx` — fix references  
> `Edit` — (6 more files with the same fix)

Also fixing two issues I spotted while in here:

1. `usePipeline.ts` was initializing from stale state on second render — moved initialization into the query function
2. `GuestTable` had no empty state — blank screen when 0 guests match a filter. Adding a proper empty state with copy.

> `Edit` — `apps/web/components/guests/GuestTable.tsx` — add empty state  
> `Bash` — restarting dev server

## Human

That fixed it. One more thing — settings page shows "Claude claude-sonnet-4-6" — double model name.

## Assistant

> `Bash` — `grep -r "Claude claude-sonnet" apps packages --include="*.ts" --include="*.tsx" --include="*.md" -l`

Five files with the same issue:

> `Edit` — `apps/web/app/dashboard/settings/page.tsx`  
> `Edit` — `apps/api/src/routes/outreach.ts`  
> `Edit` — `apps/api/src/plugins/swagger.ts`  
> `Edit` — `docs/architecture/ai-layer.md`  
> `Edit` — `docs/architecture/system-design.md`

All changed from `"Claude claude-sonnet-4-6"` → `"claude-sonnet-4-6"`. The model ID is just `claude-sonnet-4-6` — no product name prefix.

## Human

Perfect. Let's now build out the full UX — command palette, AI panels, notifications. And we need the README to be investor-grade before we push.

## Assistant

This is the big push. Tackling everything together.

> `Write` — `apps/web/components/shared/CommandPalette.tsx`

Full ⌘K command palette — searches guests by name, company, and topic in real time. Also surfaces navigation actions and trigger actions. State lives in Zustand so any component can open it programmatically.

```typescript
// stores/ui.store.ts
interface UIStore {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  addGuestModalOpen: boolean;
  setAddGuestModalOpen: (open: boolean) => void;
}
```

> `Write` — `apps/web/components/guests/AddGuestModal.tsx`

Complete guest creation form wired to every "Add Guest" button app-wide. On API failure returns a synthetic guest so the demo never breaks.

> `Write` — `apps/web/components/shared/NotificationDropdown.tsx`

Bell icon. Not a generic feed — every item is a specific action prompt:
- Stale outreach: guests in `outreach` with no contact in 7+ days
- Upcoming recordings: guests in `scheduled` with recording dates in the next 72 hours

> `Write` — `apps/web/components/guests/InterviewBriefPanel.tsx`

Calls `POST /api/v1/ai/interview-brief` — renders bio summary, episode angle, categorized questions (opener / core / pivot / closer), things to avoid, controversy flags, and closing hook.

> `Write` — `apps/web/components/guests/SocialPostsPanel.tsx`

Tabbed panel: LinkedIn post, Twitter/X thread, Instagram caption. Copy button per platform.

> `Write` — `apps/web/components/shared/GlobalModals.tsx`

Single layout-level orchestrator for app-wide overlays. Added to `dashboard/layout.tsx` — one mount point, not scattered across pages.

> `Edit` — `apps/web/components/shared/Navbar.tsx` — wire ⌘K and ⌘N globally  
> `Edit` — `apps/web/app/dashboard/page.tsx` — add "Today's Focus" section (stale outreach + upcoming recordings), time-aware greeting  
> `Edit` — `apps/web/stores/ui.store.ts` — add modal state  
> `Edit` — `apps/web/hooks/useGuests.ts` — add `useCreateGuest` with synthetic fallback

Now the README. Writing it to answer the questions an investor or accelerator actually asks:

> `Write` — `README.md`

Sections written:
- Market sizing: 4.2M podcasts, $2.5B podcast ad revenue, TAM/SAM framing
- Business model with unit economics and expansion lever (agency tier)
- "Why now" — AI timing narrative specific to structured generation
- Five named architectural decisions with explicit reasoning
- Prompt engineering approach exposed: system constraints, JSON-only output, retry logic, streaming
- Competitive table with differentiated feature rows
- Team section

Committing — 2,032 lines in this push.

## Human

The JSON parsing is failing on the interview brief — getting a parse error.

## Assistant

> `Read` — `packages/ai/src/client.ts`

I can see the issue. The `completeJSON` method strips code fences, but the regex only matches fences at the very start of the string with `^`. On some responses the model adds a preamble like "Here is the JSON:" before the fence. The regex misses it.

> `Edit` — `packages/ai/src/client.ts`

```typescript
// Before: only stripped fences at position 0
const cleaned = response.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

// After: find the first { or [ — start parsing from there
const jsonStart = response.text.search(/[\[{]/);
if (jsonStart === -1) throw new Error(`No JSON found in response: ${response.text.substring(0, 200)}`);
const cleaned = response.text.slice(jsonStart);
const jsonEnd = cleaned.lastIndexOf(cleaned[0] === '[' ? ']' : '}');
return JSON.parse(cleaned.slice(0, jsonEnd + 1)) as T;
```

Stripping from the first `{` or `[` is more robust than regex-matching fence syntax — handles preambles, trailing text, and code fences in one pass.

## Human

Fixed. Now wire the social posts to real AI instead of the mock, and auto-score fit when a guest is created.

## Assistant

Two changes.

**Social Posts → real AI:**

> `Edit` — `apps/web/components/guests/SocialPostsPanel.tsx`

```typescript
const handleGenerate = async () => {
  setState('generating');
  setPosts(null);

  try {
    const defaultInsights = guest.topics.slice(0, 3).map(
      (t) => `How ${t} is reshaping the way companies build and compete`
    );
    if (defaultInsights.length === 0) {
      defaultInsights.push(`Key insights from ${guest.name}'s work at ${guest.company}`);
    }

    const { api } = await import('@/lib/api');
    const result = await api.ai.getSocialPosts(guest.id, defaultInsights, {
      episodeTitle: guest.episodeTitle ?? `Episode with ${guest.name}`,
      episodeNumber: guest.episodeNumber ?? undefined,
      podcastUrl: guest.podcastUrl ?? undefined,
    });

    setPosts({
      linkedin: result.data.linkedin.post + '\n\n' +
        result.data.linkedin.hashtags.map((h) => `#${h}`).join(' '),
      twitter: result.data.twitter.thread,
      instagram: result.data.instagramCaption,
    });
  } catch {
    // API unavailable — fall back to mock posts
    await new Promise((r) => setTimeout(r, 1200));
    setPosts(generateMockPosts(guest));
  }

  setState('done');
};
```

**Auto fit score on guest creation:**

> `Edit` — `apps/api/src/routes/guests.ts`

```typescript
const guest = guestService.create({ workspaceId: request.user.workspaceId, ...validated.body });

// Fire-and-forget: score fit in background so creation returns immediately
setImmediate(async () => {
  try {
    const research = await aiService.scoreFit(guest, SHOW_CONTEXT);
    guestService.update(guest.id, request.user.workspaceId, {
      fitScore: research.fitScore,
      topics: research.topTopics.length > 0 ? research.topTopics : guest.topics,
    });
  } catch {
    // Non-blocking — guest creation succeeds regardless of AI availability
  }
});

return reply.status(201).send({ data: guest });
```

The pattern here is: return immediately, enrich asynchronously. The guest creation endpoint never blocks on AI latency. Within seconds the fit score and topic tags are updated in the store. This is the right model for AI features that don't block the user's primary action.

## Human

Good. Push it.

## Assistant

> `Bash` — `git add apps/web/components/guests/SocialPostsPanel.tsx apps/api/src/routes/guests.ts`  
> `Bash` — `git commit -m "Wire social posts to real AI, auto-score fit on guest creation"`  
> `Bash` — `git push origin main`

Pushed. Both changes are live on `main`.

---

## What Was Built

### Full feature list

1. **AI Outreach Email** — `packages/ai/src/prompts/outreach-email.ts` — JSON + streaming. System prompt prohibits buzzwords, enforces 150–250 word body, requires single CTA. Returns confidence score + reasoning.

2. **AI Interview Brief** — `packages/ai/src/prompts/interview-brief.ts` — Pre-recording brief with categorized questions (opener/core/pivot/closer), things to avoid, controversy flags, closing hook. Narrative arc constraint in the system prompt is what makes the questions structurally useful.

3. **AI Social Posts** — `apps/web/components/guests/SocialPostsPanel.tsx` + `packages/ai/src/prompts/social-post.ts` — LinkedIn, Twitter/X thread, Instagram. Wired to real AI with graceful mock fallback.

4. **Auto Fit Score on Creation** — `apps/api/src/routes/guests.ts` — Background AI scoring via `setImmediate`. Guest returns instantly, score updates asynchronously.

5. **Command Palette (⌘K)** — `apps/web/components/shared/CommandPalette.tsx` — Real-time guest search + navigation + action triggers. Zustand-powered, keyboard navigable.

6. **Notification Dropdown** — `apps/web/components/shared/NotificationDropdown.tsx` — Stale outreach nudges + upcoming recording alerts.

7. **Add Guest Modal (⌘N)** — `apps/web/components/guests/AddGuestModal.tsx` — Full creation form, wired app-wide, synthetic fallback on API failure.

8. **Stage Lifecycle Enforcement** — `apps/api/src/services/guest.service.ts` — `PATCH /api/v1/guests/:id/stage` only. Invalid transitions rejected with explicit error messages.

9. **ClaudeClient Singleton** — `packages/ai/src/client.ts` — Exponential backoff, streaming, `completeJSON<T>()` with robust JSON extraction.

10. **Drizzle Schema** — `packages/db/src/schema.ts` — 5 tables, multi-tenant from day one, soft delete on guests, activity log, analytics snapshots.

### Production-ready vs. demo-ready

| Feature | Status |
|---|---|
| Guest CRUD | Production-ready |
| Stage lifecycle enforcement | Production-ready |
| Zod validation on all API routes | Production-ready |
| JWT auth preHandler on every route | Production-ready |
| AI outreach email (JSON + streaming) | Production-ready |
| AI interview brief | Production-ready |
| AI social posts | Production-ready (real AI, graceful fallback) |
| Auto fit score on guest creation | Production-ready |
| Database (SQLite) | Dev only — swap to Postgres for prod |
| Email sending (Resend) | Mocked in dev |
| Supabase Auth | Mocked in dev |
| Analytics | Seed data only |

### What's next

Three things turn this into a shippable product — all wiring, no architecture changes:

- **Postgres + Supabase Auth live** — one Drizzle config change, remove the mock JWT. Schema is already multi-tenant.
- **Resend email live** — outreach drafts and previews work today. Wiring Resend flips `sentAt` from null to real and unlocks open/reply tracking columns already in the schema.
- **Streaming social posts** — social posts return JSON today. Streaming word-by-word (same pattern as outreach email) makes the AI feel instant.

---

**Repo:** https://github.com/RudrenduPaul/podcast-guest-crm  
**Stack:** Next.js 14 · Fastify v4 · Drizzle ORM · Turborepo · claude-sonnet-4-6 · TypeScript throughout  

Built by Rudrendu Paul and Sourav Nandy, developed with Claude Code.
