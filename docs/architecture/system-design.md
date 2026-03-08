# System Design

## Overview

Podcast Guest CRM is a full-stack monorepo application for managing the complete podcast guest lifecycle, from discovery through post-episode follow-up. The system is AI-native, using Claude claude-sonnet-4-6 for outreach drafting, guest fit scoring, interview prep, and social media automation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser (Next.js 14)                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Kanban     │  │  AI Outreach │  │    Analytics Dashboard   │  │
│  │   Pipeline   │  │   Composer   │  │    (Recharts)            │  │
│  │  (DnD Kit)   │  │ (Streaming)  │  │                          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────────┘  │
│         │                 │                       │                  │
│  ┌──────▼─────────────────▼───────────────────────▼──────────────┐  │
│  │           TanStack Query + Zustand (State Management)          │  │
│  └──────────────────────────────┬─────────────────────────────────┘  │
│                                 │                                    │
│                         lib/api.ts (fetch)                          │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │ HTTP (REST)
                                  │ Authorization: Bearer JWT
┌─────────────────────────────────▼────────────────────────────────────┐
│                    Fastify API (Node.js 20)                          │
│                                                                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   CORS   │  │Rate Limit │  │   JWT Auth   │  │    Swagger    │  │
│  │ Plugin   │  │ (100/min) │  │  (mock/prod) │  │  (/docs)      │  │
│  └──────────┘  └───────────┘  └──────────────┘  └───────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Route Handlers                                │ │
│  │  /guests  /outreach  /ai  /analytics  /health                   │ │
│  └──────────────────────────┬──────────────────────────────────────┘ │
│                              │                                       │
│  ┌────────────────────────────▼──────────────────────────────────┐   │
│  │                    Service Layer                               │   │
│  │  guestService (in-memory seed store)                          │   │
│  │  aiService (wraps @podcast-crm/ai)                            │   │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                    │                          │
          ┌─────────▼──────────┐    ┌──────────▼──────────────────┐
          │   packages/db      │    │     packages/ai              │
          │                    │    │                              │
          │  Drizzle ORM       │    │  Claude SDK Wrapper          │
          │  SQLite (dev)      │    │  Retry logic                │
          │  Seed data (30+)   │    │  Token tracking             │
          │                    │    │  6 AI prompts               │
          └────────────────────┘    └────────────┬────────────────┘
                                                 │
                                    ┌────────────▼────────────────┐
                                    │   Anthropic Claude API       │
                                    │   claude-sonnet-4-6          │
                                    │   (mocked in dev if no key) │
                                    └─────────────────────────────┘
```

## Data Flow: Outreach Email Generation

1. User selects a guest in the AI Outreach page
2. User clicks "Generate with Claude"
3. `AIAssistPanel` calls `api.outreach.draft(guestId)`
4. Fastify route `/api/v1/outreach/draft` validates JWT + Zod schema
5. `guestService.findById()` retrieves guest from in-memory store
6. `aiService.draftOutreachEmail()` calls `@podcast-crm/ai`
7. `packages/ai/src/prompts/outreach-email.ts` builds prompt with guest context
8. Claude API returns structured JSON `{ subject, body, confidenceScore, reasoning }`
9. Response streamed back to UI with typewriter animation
10. User reviews, edits, and sends via `POST /api/v1/outreach/send`

## Data Flow: Stage Transition (Kanban Drag & Drop)

1. User drags a guest card to a new column
2. `usePipeline.handleDragEnd()` fires
3. Optimistic update applied to React Query cache immediately
4. `PATCH /api/v1/guests/:id/stage` called with `{ stage: 'scheduled' }`
5. `guestService.transitionStage()` validates against `VALID_TRANSITIONS` map
6. If valid: guest updated, confetti fires if stage === 'scheduled'
7. If invalid: 400 returned, React Query cache rolled back to previous state

## Packages

| Package | Purpose |
|---------|---------|
| `@podcast-crm/types` | Shared TypeScript interfaces (Guest, OutreachEmail, etc.) |
| `@podcast-crm/config` | Zod env validation, stage constants |
| `@podcast-crm/db` | Drizzle schema + 30+ realistic seed guests |
| `@podcast-crm/ai` | Claude SDK wrapper + 6 prompt modules |

## Key Technical Decisions

See `docs/decisions/` for full ADRs:
- 001: Turborepo for monorepo management
- 002: Fastify over Express for the API
- 003: Drizzle over Prisma for the ORM
