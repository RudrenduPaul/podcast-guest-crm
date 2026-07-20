import { mkdirSync, readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CONFIG_DIR_NAME = 'podcast-guest-crm-cli';

export interface StoredCredentials {
  accessToken: string;
  refreshToken: string;
  /** Unix epoch seconds when accessToken expires. */
  expiresAt: number;
  email: string;
  /** Persisted so `refresh_token` grant calls don't require re-supplying config on every command. */
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function getConfigDir(): string {
  return join(homedir(), '.config', CONFIG_DIR_NAME);
}

export function getCredentialsPath(): string {
  return join(getConfigDir(), 'credentials.json');
}

export function saveCredentials(creds: StoredCredentials): void {
  const dir = getConfigDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  const path = getCredentialsPath();
  writeFileSync(path, JSON.stringify(creds, null, 2), { mode: 0o600 });
  // writeFileSync's mode option is only applied on file creation; chmod again
  // in case the file already existed (e.g. re-login overwriting stale creds).
  chmodSync(path, 0o600);
}

export function loadCredentials(): StoredCredentials | null {
  const path = getCredentialsPath();
  if (!existsSync(path)) return null;
  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  const path = getCredentialsPath();
  if (existsSync(path)) {
    writeFileSync(path, JSON.stringify({}));
  }
}

/** Resolved runtime configuration, layered from env vars with sane fallbacks. */
export interface CliConfig {
  apiUrl: string;
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
}

export function loadCliConfig(): CliConfig {
  return {
    apiUrl: process.env.PODCAST_GUEST_CRM_API_URL ?? 'http://localhost:3001/api/v1',
    supabaseUrl: process.env.PODCAST_GUEST_CRM_SUPABASE_URL,
    supabaseAnonKey: process.env.PODCAST_GUEST_CRM_SUPABASE_ANON_KEY,
  };
}
