# ADR 002: Fastify over Express

**Status**: Accepted  
**Date**: 2026-03-01  
**Authors**: Rudrendu Paul, Sourav Nandy

## Context

We needed a Node.js web framework for the API layer. The primary options were Express.js and Fastify.

## Decision

We chose **Fastify v4**.

## Rationale

Performance: Fastify is 2-3x faster than Express in benchmarks (requests/second), primarily due to its highly optimized routing and JSON serialization.

Type safety: Fastify has first-class TypeScript support with typed request/reply objects and plugin decorators. Express requires significant `@types` gymnastics.

Schema validation: Fastify's built-in schema system (JSON Schema) integrates directly with Swagger/OpenAPI generation via `@fastify/swagger`. In our implementation, we use Zod for validation (type safety) and provide JSON Schema for documentation.

Plugin ecosystem:
- `@fastify/cors` — allowlist-based CORS
- `@fastify/rate-limit` — rate limiting with Redis (or in-memory for dev)
- `@fastify/jwt` — JWT validation
- `@fastify/swagger` + `@fastify/swagger-ui` — auto-generated API docs

Auto-documentation: Every route with a schema definition is automatically documented at `/docs`. This is a showcase feature for accelerator reviewers.

## Consequences

**Positive:**
- Excellent performance characteristics for production
- Auto-generated OpenAPI documentation
- First-class TypeScript without `any` casts

**Negative:**
- Smaller ecosystem than Express (though all needed plugins exist)
- Team members more familiar with Express need to learn plugin patterns
- Some Express middleware is not directly compatible (requires wrapping)
