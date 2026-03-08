# ADR 001: Monorepo with Turborepo

**Status**: Accepted  
**Date**: 2026-03-01  
**Authors**: Rudrendu Paul, Sourav Nandy

## Context

The Podcast Guest CRM has three distinct applications (web, api) and shared packages (types, config, db, ai). We needed a strategy for code sharing and build orchestration.

Options considered:
1. Separate repositories for each app
2. Monorepo with Lerna
3. Monorepo with Nx
4. Monorepo with Turborepo

## Decision

We chose **Turborepo + pnpm workspaces**.

## Rationale

- **Turborepo** provides intelligent build caching and task orchestration with minimal configuration
- **pnpm workspaces** handles dependency management with disk-efficient linking
- `workspace:*` protocol enables safe internal package references with proper version tracking
- Remote cache (Vercel) will dramatically reduce CI times at scale
- The `turbo.json` task graph ensures packages build before the apps that depend on them

Compared to alternatives:
- Lerna is legacy tooling with a complex plugin model
- Nx is powerful but has steep learning curve and more configuration overhead
- Separate repos would require publishing packages to npm for each change — unacceptable for rapid iteration

## Consequences

**Positive:**
- Single `pnpm dev` starts all services
- Type changes in `@podcast-crm/types` immediately reflected across all apps
- CI can skip unchanged packages (task caching)

**Negative:**
- New contributors must understand monorepo concepts
- pnpm version must be pinned (`>=9`) across the team
- Some tooling (ESLint, TypeScript) requires root-level and per-package configs
