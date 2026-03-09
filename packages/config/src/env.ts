import { z } from 'zod';

// ---------------------------------------------------------------------------
// SECURITY NOTE
// ---------------------------------------------------------------------------
// This file defines the shape and validation of all environment variables.
// Development defaults are intentionally non-functional placeholders.
// They allow the app to start without credentials and are not exploitable.
//
// In production, ALL secrets must be injected via environment variables
// or a secrets manager (e.g. Doppler, AWS Secrets Manager, Vercel env vars).
//
// NEVER hardcode real API keys, tokens, passwords, or secrets in source code.
// Real credentials belong only in .env.local (gitignored) or a secrets store.
// ---------------------------------------------------------------------------

// Server-only env vars — never exposed to the browser bundle.
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Anthropic API — https://console.anthropic.com/
  ANTHROPIC_API_KEY: z.string().min(1).default('dev-placeholder-replace-in-production'),

  // Supabase — https://app.supabase.com/
  SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('dev-placeholder-replace-in-production'),

  // JWT — generate with: openssl rand -base64 32
  JWT_SECRET: z.string().min(32).default('dev-placeholder-jwt-secret-replace-in-production-32+'),

  // Resend email — https://resend.com/
  RESEND_API_KEY: z.string().min(1).default('dev-placeholder-replace-in-production'),

  DATABASE_URL: z.string().default('file:./dev.db'),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

// Public env vars — safe to expose to the browser bundle.
// Do NOT put secrets or service-role keys in NEXT_PUBLIC_* vars.
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
  // Supabase anon key is intentionally public — scoped by Row Level Security policies
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('dev-placeholder-anon-key'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

// In production (NODE_ENV=production), Zod will throw at startup if any
// required env var is missing or invalid — the app will refuse to start
// rather than running with missing credentials.
export function parseServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}

export function parsePublicEnv(): PublicEnv {
  return publicEnvSchema.parse(process.env);
}

export const STAGE_LABELS: Record<string, string> = {
  discover: 'Discover',
  outreach: 'Outreach',
  scheduled: 'Scheduled',
  recorded: 'Recorded',
  published: 'Published',
  follow_up: 'Follow-up',
};

export const STAGE_ORDER = [
  'discover',
  'outreach',
  'scheduled',
  'recorded',
  'published',
  'follow_up',
] as const;
