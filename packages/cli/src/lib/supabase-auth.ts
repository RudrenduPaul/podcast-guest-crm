/**
 * Talks directly to Supabase's public GoTrue REST API, the same endpoint
 * Supabase's own client SDKs call under the hood. Documented behavior:
 * https://supabase.com/docs/reference/auth/signinwithpassword (REST form)
 *
 * This CLI never talks to the app's dev-only `Bearer dev-mock-token` bypass
 * (see apps/api/src/plugins/auth.ts). That shortcut only exists so the
 * Fastify API can be exercised locally without a live Supabase project.
 * A real login always goes through Supabase.
 */

export interface SupabaseSession {
  accessToken: string;
  refreshToken: string;
  /** Unix epoch seconds. */
  expiresAt: number;
  email: string;
}

interface GoTrueTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: { email?: string };
  error?: string;
  error_description?: string;
  msg?: string;
}

export class SupabaseAuthError extends Error {}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Parse and validate the Supabase project URL before any credential is sent to it.
 * Requires https (plain http only for loopback local development) and rebuilds the
 * request base from the parsed origin, so a tampered or mistyped URL, including one
 * read back from the cached credentials file, cannot redirect the password or refresh
 * token to an arbitrary cleartext endpoint.
 */
function tokenUrl(supabaseUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(supabaseUrl);
  } catch {
    throw new SupabaseAuthError('Invalid Supabase URL.');
  }
  const isHttps = parsed.protocol === 'https:';
  const isLocalHttp = parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname);
  if (!isHttps && !isLocalHttp) {
    throw new SupabaseAuthError('Supabase URL must use https (http is allowed only for localhost).');
  }
  const basePath = parsed.pathname.replace(/\/+$/, '');
  return `${parsed.origin}${basePath}/auth/v1/token`;
}

async function requestToken(
  supabaseUrl: string,
  anonKey: string,
  grantType: 'password' | 'refresh_token',
  body: Record<string, string>
): Promise<GoTrueTokenResponse> {
  const res = await fetch(`${tokenUrl(supabaseUrl)}?grant_type=${grantType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as GoTrueTokenResponse;

  if (!res.ok) {
    const message = json.error_description ?? json.msg ?? json.error ?? `HTTP ${res.status}`;
    throw new SupabaseAuthError(message);
  }

  return json;
}

export async function signInWithPassword(
  supabaseUrl: string,
  anonKey: string,
  email: string,
  password: string
): Promise<SupabaseSession> {
  const json = await requestToken(supabaseUrl, anonKey, 'password', { email, password });

  if (!json.access_token || !json.refresh_token) {
    throw new SupabaseAuthError('Supabase did not return an access token.');
  }

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + json.expires_in,
    email: json.user?.email ?? email,
  };
}

export async function refreshSession(
  supabaseUrl: string,
  anonKey: string,
  refreshToken: string,
  fallbackEmail: string
): Promise<SupabaseSession> {
  const json = await requestToken(supabaseUrl, anonKey, 'refresh_token', {
    refresh_token: refreshToken,
  });

  if (!json.access_token || !json.refresh_token) {
    throw new SupabaseAuthError('Supabase did not return a refreshed access token.');
  }

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + json.expires_in,
    email: json.user?.email ?? fallbackEmail,
  };
}
