import { loadCliConfig, loadCredentials, saveCredentials } from './config';
import { refreshSession } from './supabase-auth';

export class CliError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export class NotLoggedInError extends CliError {
  constructor() {
    super('Not logged in. Run `podcast-guest-crm-cli login` first.');
    this.name = 'NotLoggedInError';
  }
}

interface ApiErrorBody {
  error?: string;
  message?: string;
  statusCode?: number;
}

/** 30-second buffer so a token that's about to expire mid-request still gets refreshed. */
const EXPIRY_BUFFER_SECONDS = 30;

async function getValidAccessToken(): Promise<string> {
  const creds = loadCredentials();
  if (!creds || !creds.accessToken) {
    throw new NotLoggedInError();
  }

  const now = Math.floor(Date.now() / 1000);
  if (creds.expiresAt - EXPIRY_BUFFER_SECONDS > now) {
    return creds.accessToken;
  }

  // Access token expired (or about to). Silently refresh using the stored refresh_token.
  const refreshed = await refreshSession(
    creds.supabaseUrl,
    creds.supabaseAnonKey,
    creds.refreshToken,
    creds.email
  );

  saveCredentials({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: refreshed.expiresAt,
    email: refreshed.email,
    supabaseUrl: creds.supabaseUrl,
    supabaseAnonKey: creds.supabaseAnonKey,
  });

  return refreshed.accessToken;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

/**
 * Calls the Podcast Guest CRM API (apps/api/src/routes/*.ts) with a valid
 * Supabase-issued bearer token attached. Every route in that API requires
 * `preHandler: [server.authenticate]`, so this is the single seam every
 * command goes through.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { apiUrl } = loadCliConfig();
  const accessToken = await getValidAccessToken();

  const url = new URL(`${apiUrl.replace(/\/+$/, '')}${path}`);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, init);

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errBody = json as ApiErrorBody;
    throw new CliError(
      errBody.message ?? `Request failed with status ${res.status}`,
      res.status,
      json
    );
  }

  return json as T;
}
