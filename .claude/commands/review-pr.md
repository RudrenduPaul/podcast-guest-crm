# /review-pr

Review all changed files for:

1. **Security**
   - Auth on every API route (preHandler: [server.authenticate])
   - No exposed secrets or API keys in code
   - No raw SQL (use Drizzle ORM)
   - All inputs validated with Zod
   - CORS origins are allowlisted, not wildcard

2. **Performance**
   - No N+1 queries in service layer
   - No missing React Suspense boundaries on async server components
   - Images use next/image with proper sizing
   - TanStack Query staleTime set appropriately

3. **UX quality**
   - Every empty state has personality copy (not "No data found")
   - Error states handled with meaningful messages
   - Loading states with Skeleton components (not spinners alone)
   - Framer Motion animations on key interactions

4. **MLP check — Is this lovable?**
   - Does this feature spark joy or just work?
   - Is there a microinteraction opportunity?
   - Would a podcast host actually use this daily?
   - What's the "wow moment" in this feature?

5. **Type safety**
   - No `any` types anywhere
   - Strict TypeScript — no `as` casts without justification
   - Shared types from @podcast-crm/types, not defined inline
   - API response types match the ApiResponse<T> wrapper

6. **Test coverage**
   - Service layer has Vitest tests
   - Happy path tested
   - Error cases tested (not found, wrong workspace, invalid input)
