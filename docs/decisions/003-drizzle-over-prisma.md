# ADR 003: Drizzle ORM over Prisma

**Status**: Accepted  
**Date**: 2026-03-01  
**Authors**: Rudrendu Paul, Sourav Nandy

## Context

We needed an ORM for database interactions. The primary options were Prisma and Drizzle ORM.

## Decision

We chose **Drizzle ORM v0.30**.

## Rationale

**Type safety**: Drizzle is SQL-first — the TypeScript types are inferred directly from the schema definition. There is no code generation step, no `.prisma` file compilation, and no runtime overhead from a query engine.

**Performance**: Drizzle adds minimal overhead because it generates standard SQL. Prisma's query engine runs as a separate binary and adds ~100ms cold start time (critical in serverless/edge).

**Flexibility**: Complex queries are easy to write in Drizzle because it mirrors SQL closely. Prisma's abstraction sometimes requires raw SQL escape hatches for advanced queries.

**Bundle size**: Drizzle's core is ~30kb. Prisma's client is ~2MB+ and doesn't work in edge runtimes without special configuration.

**SQLite compatibility**: Drizzle works seamlessly with better-sqlite3 for development and can target Turso (libSQL) for production without schema changes.

Example: Schema definition is just TypeScript — no separate `.prisma` file:

```typescript
export const guests = sqliteTable('guests', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  stage: text('stage', { enum: [...] }).notNull().default('discover'),
});
```

## Consequences

**Positive:**
- Zero code generation — no build step for schema changes
- SQL-close API means developers understand what queries are being run
- Works in all environments including edge runtimes
- Easy to switch databases (SQLite → Turso → PostgreSQL) by changing the driver

**Negative:**
- Less mature ecosystem than Prisma
- No GUI/Studio comparable to Prisma Studio (use Drizzle Studio or DB browser)
- Fewer ready-made patterns for complex relationships (requires manual joins)
