# /new-feature <name>

Scaffold a complete feature named $ARGUMENTS with:

1. **API Route** in apps/api/src/routes/<name>.ts with Zod validation
2. **Service** in apps/api/src/services/<name>.service.ts
3. **Page** in apps/web/app/dashboard/<name>/page.tsx
4. **Components** in apps/web/components/<name>/
5. **TanStack Query hook** in apps/web/hooks/use<Name>.ts
6. **Vitest test** for the API route service layer

Follow all patterns in existing routes. Use seed data for responses.

Rules:
- Never use any types
- Shared types go in packages/types
- All AI features use @podcast-crm/ai — never call Anthropic SDK directly from apps/
- All API routes must have Zod schemas + authentication
- Run pnpm lint && pnpm typecheck before finishing

Pattern reference: apps/api/src/routes/guests.ts + apps/api/src/services/guest.service.ts
