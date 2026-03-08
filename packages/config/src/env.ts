import { z } from 'zod';

// Server-only env vars (never exposed to browser)
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  ANTHROPIC_API_KEY: z.string().min(1).default('sk-ant-mock-key-for-dev'),
  SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('mock-service-role-key'),
  JWT_SECRET: z
    .string()
    .min(32)
    .default('mock-jwt-secret-for-development-only-32chars'),
  RESEND_API_KEY: z.string().min(1).default('re_mock_key'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

// Public env vars (safe for browser)
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('mock-anon-key'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

// Parse with defaults — never throws in development, always throws in production if missing
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
