# Security Architecture

## Authentication

- **Provider**: Supabase Auth in production, mock JWT in development
- **Token format**: JWT (RS256 in production, HS256 in development)
- **Header**: `Authorization: Bearer <token>`
- **Dev mock**: `Bearer dev-mock-token` accepted in NODE_ENV=development

Every API route (except `/health`) uses `preHandler: [server.authenticate]`.

## Authorization

- **Workspace isolation**: Every service method accepts `workspaceId` from the JWT payload
- Data is filtered by `workspaceId` at the service layer — no cross-workspace data leakage
- **Row Level Security**: Schema ready for Supabase RLS policies in production

## Input Validation

- Every API route body, query, and params validated with Zod schemas
- Validation errors return HTTP 400 with structured error details
- No raw SQL — all queries via Drizzle ORM (parameterized by default)

## Rate Limiting

- 100 requests per minute per IP (via @fastify/rate-limit)
- `/health` endpoint exempt from rate limiting
- 429 response includes `Retry-After` header

## Transport Security

- CORS: Allowlist-based, never wildcard (`*`) in production
- HTTPS: Enforced via HSTS in production
- Security headers (set in next.config.ts):
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy`: Restrictive CSP preventing XSS

## Secrets Management

- All secrets loaded from environment variables via Zod validation
- Default mock values for development (never production-usable)
- Production: secrets from Supabase/Vercel environment — never in source
- `parseServerEnv()` called at startup — fails fast if required vars missing in prod
- `.env*.local` in `.gitignore`

## Static Analysis

- **CodeQL**: GitHub Actions workflow runs on every PR and weekly
- **Dependency audit**: `pnpm audit` in CI, flagging high-severity vulnerabilities
- **TruffleHog**: Secret scanning to detect accidentally committed credentials

## AI Security

- Anthropic API key stored server-side only (never in browser)
- No user-controlled prompt injection — all prompts are server-side templates
- AI outputs are validated before use (JSON parsing with error handling)
- Token usage logged for cost monitoring and anomaly detection
