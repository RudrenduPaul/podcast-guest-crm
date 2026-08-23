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

// The `.default()` placeholders above let the app boot without any .env file
// in local dev. They are NOT safe in production: if any of these values ever
// reach a production process, the app would be silently running with a
// guessable/public secret (e.g. a known JWT signing key). The list below is
// every security-critical placeholder that must never survive into prod.
const INSECURE_PRODUCTION_DEFAULTS: Partial<Record<keyof ServerEnv, string>> = {
  ANTHROPIC_API_KEY: 'dev-placeholder-replace-in-production',
  SUPABASE_SERVICE_ROLE_KEY: 'dev-placeholder-replace-in-production',
  JWT_SECRET: 'dev-placeholder-jwt-secret-replace-in-production-32+',
  RESEND_API_KEY: 'dev-placeholder-replace-in-production',
};

// In production (NODE_ENV=production), Zod throws at startup if any required
// env var is missing or invalid. That alone is not enough: every secret above
// also has a `.default()`, so a missing env var doesn't fail Zod validation,
// it silently falls back to a well-known, publicly-visible placeholder value.
// This second check closes that gap: in production mode, the server refuses
// to boot if any security-critical secret still equals its insecure default.
export function parseServerEnv(): ServerEnv {
  const env = serverEnvSchema.parse(process.env);

  if (env.NODE_ENV === 'production') {
    const insecure = (Object.keys(INSECURE_PRODUCTION_DEFAULTS) as Array<keyof ServerEnv>).filter(
      (key) => env[key] === INSECURE_PRODUCTION_DEFAULTS[key]
    );

    if (insecure.length > 0) {
      throw new Error(
        `Refusing to start: NODE_ENV=production but the following secret(s) are still set to ` +
          `their insecure dev placeholder value: ${insecure.join(', ')}. Set real values via ` +
          `environment variables or a secrets manager (e.g. Doppler, AWS Secrets Manager, Vercel env vars) ` +
          `before deploying.`
      );
    }
  }

  return env;
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
