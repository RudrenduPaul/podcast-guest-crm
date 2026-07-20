import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// node:os's `homedir` export isn't a configurable property (Node builtin modules are
// sealed), so vi.spyOn can't stub it directly. Route it through a mutable holder that
// vi.mock swaps in for the whole module graph of this test file only. This can't race
// with other test files vitest runs concurrently, since each file gets its own isolated
// module registry.
const { getHomedir, setHomedir } = vi.hoisted(() => {
  let dir = '';
  return { getHomedir: () => dir, setHomedir: (d: string) => (dir = d) };
});

vi.mock('node:os', async () => {
  const actual = await vi.importActual<typeof import('node:os')>('node:os');
  return { ...actual, homedir: () => getHomedir() };
});

describe('config (credentials storage)', () => {
  let tempHome: string;

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'pgcrm-cli-test-'));
    setHomedir(tempHome);
  });

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true });
  });

  it('writes credentials.json under ~/.config/podcast-guest-crm-cli with 0600 permissions', async () => {
    const { saveCredentials, getCredentialsPath, loadCredentials } = await import('../src/lib/config');

    saveCredentials({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresAt: 9999999999,
      email: 'host@show.com',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-key',
    });

    const path = getCredentialsPath();
    expect(existsSync(path)).toBe(true);

    const mode = statSync(path).mode & 0o777;
    expect(mode).toBe(0o600);

    const loaded = loadCredentials();
    expect(loaded?.accessToken).toBe('access-1');
    expect(loaded?.email).toBe('host@show.com');
  });

  it('loadCredentials returns null when no credentials file exists', async () => {
    const { loadCredentials } = await import('../src/lib/config');
    expect(loadCredentials()).toBeNull();
  });

  it('loadCliConfig falls back to localhost:3001/api/v1 when no env var is set', async () => {
    delete process.env.PODCAST_GUEST_CRM_API_URL;
    const { loadCliConfig } = await import('../src/lib/config');
    expect(loadCliConfig().apiUrl).toBe('http://localhost:3001/api/v1');
  });

  it('loadCliConfig reads PODCAST_GUEST_CRM_API_URL when set', async () => {
    process.env.PODCAST_GUEST_CRM_API_URL = 'https://api.example.com/api/v1';
    const { loadCliConfig } = await import('../src/lib/config');
    expect(loadCliConfig().apiUrl).toBe('https://api.example.com/api/v1');
    delete process.env.PODCAST_GUEST_CRM_API_URL;
  });
});
