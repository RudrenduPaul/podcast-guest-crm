# Podcast Guest CRM — Claude Code Instructions

## Product Context

The Podcast Guest CRM manages the full guest lifecycle for podcast hosts and booking agencies:

```
Discover → Outreach → Scheduled → Recorded → Published → Follow-up
```

**Target users**: Podcast booking agencies, independent podcast hosts managing 20-100+ guests per year.

**Core pain**: Guests get lost in spreadsheets, follow-ups fall through, there's no systematic way to track where each guest is or what needs to happen next.

**Our solution**: An AI-native CRM where Claude does the heavy lifting — drafting emails, scoring fit, preparing interview briefs, generating social posts.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, Tailwind CSS, shadcn/ui, Framer Motion |
| State | TanStack Query (server), Zustand (UI) |
| Backend | Fastify v4 (Node 20), TypeScript |
| Validation | Zod (shared FE + BE) |
| ORM | Drizzle ORM + better-sqlite3 |
| Auth | Supabase Auth (mocked in dev) |
| AI | claude-sonnet-4-6 via @anthropic-ai/sdk |
| Email | Resend + React Email (mocked in dev) |
| Monorepo | Turborepo + pnpm workspaces |

## Non-Negotiable Rules

1. **Always TypeScript. Never `any`.** Use `unknown` if the type is truly unknown.
2. **All API routes must have Zod validation schemas** for body, query, and params.
3. **All API routes must require authentication** (`preHandler: [server.authenticate]`), even in dev.
4. **Shared types live in `packages/types`** — never define types inline in apps.
5. **DB changes go in `packages/db/src/schema.ts`** — never edit seed data for production logic.
6. **AI calls go through `packages/ai`** — never import `@anthropic-ai/sdk` directly from apps.
7. **Never use GPT or any model other than claude-sonnet-4-6**.
8. Run `pnpm lint && pnpm typecheck` before considering any task complete.

## Guest Lifecycle Rules

The lifecycle is enforced at the service layer:

```
discover   → outreach
outreach   → scheduled | discover (if they decline)
scheduled  → recorded | outreach (if they reschedule)
recorded   → published | scheduled (if re-recording needed)
published  → follow_up
follow_up  → outreach (invite back) | published (already published)
```

**Stage transitions go through `PATCH /api/v1/guests/:id/stage`** — never update `stage` directly via PUT.

## Architecture Patterns

### API Routes
```typescript
server.get('/resource', {
  preHandler: [server.authenticate], // Always
  schema: { tags: [...], ... },      // Always (for Swagger)
}, async (request, reply) => {
  const validated = await validateRequest(request, reply, { query: schema });
  if (!validated) return;
  // Service call
});
```

### Frontend Data Fetching
```typescript
// hooks/useResource.ts
export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: async () => {
      try {
        return await api.resource.getById(id);
      } catch {
        return fallbackMockData; // Always gracefully degrade
      }
    },
  });
}
```

### AI Service Calls
```typescript
// packages/ai/src/prompts/my-prompt.ts
export async function myAIFeature(input: Input): Promise<Output> {
  const client = getClaudeClient();
  return client.completeJSON<Output>(SYSTEM_PROMPT, buildUserMessage(input));
}
```

## Custom Commands

- `/new-feature <name>` — scaffold full feature (API + service + page + components + hook + tests)
- `/review-pr` — security + type safety + MLP review

## MLP Checklist

Every feature must pass:
- [ ] Empty states have personality copy (see `STAGE_CONFIG.emptyMessage` pattern)
- [ ] Loading states use `Skeleton` components, not blank screens
- [ ] Errors handled with actionable messages, not "An error occurred"
- [ ] Framer Motion animations on key interactions (lists, modals, state changes)
- [ ] **What's the wow moment?** If there isn't one, add one.

## Working with Seed Data

The app runs entirely on seed data. The seed guests in `packages/db/src/seeds/guests.seed.ts` include 30+ realistic guests across all 6 pipeline stages. The in-memory store in `guestService` is initialized from this seed data on startup and supports full CRUD.

To reset to seed data in tests: `guestService.reset()`.

## File Locations Quick Reference

| What | Where |
|------|-------|
| Types | `packages/types/src/` |
| Env validation | `packages/config/src/env.ts` |
| Schema | `packages/db/src/schema.ts` |
| Seed data | `packages/db/src/seeds/` |
| AI prompts | `packages/ai/src/prompts/` |
| API routes | `apps/api/src/routes/` |
| Services | `apps/api/src/services/` |
| Pages | `apps/web/app/(dashboard)/` |
| Components | `apps/web/components/` |
| Hooks | `apps/web/hooks/` |
| Stores | `apps/web/stores/` |
| API client | `apps/web/lib/api.ts` |
| Mock data | `apps/web/lib/mock-data.ts` |
