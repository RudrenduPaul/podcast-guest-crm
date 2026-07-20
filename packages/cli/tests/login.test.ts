import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Command } from 'commander';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { signInWithPasswordMock } = vi.hoisted(() => ({ signInWithPasswordMock: vi.fn() }));

vi.mock('../src/lib/supabase-auth', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/supabase-auth')>(
    '../src/lib/supabase-auth'
  );
  return { ...actual, signInWithPassword: signInWithPasswordMock };
});

// See tests/config.test.ts for why node:os is mocked this way rather than via vi.spyOn.
const { getHomedir, setHomedir } = vi.hoisted(() => {
  let dir = '';
  return { getHomedir: () => dir, setHomedir: (d: string) => (dir = d) };
});

vi.mock('node:os', async () => {
  const actual = await vi.importActual<typeof import('node:os')>('node:os');
  return { ...actual, homedir: () => getHomedir() };
});

describe('login command', () => {
  let tempHome: string;
  let writes: string[];

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), 'pgcrm-cli-login-test-'));
    setHomedir(tempHome);
    signInWithPasswordMock.mockReset();
    writes = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    });
  });

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('authenticates against Supabase and persists credentials with 0600 perms', async () => {
    signInWithPasswordMock.mockResolvedValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
      email: 'host@show.com',
    });

    const { registerLoginCommand } = await import('../src/commands/login');
    const { loadCredentials } = await import('../src/lib/config');

    const program = new Command();
    program.exitOverride();
    program.option('--json');
    registerLoginCommand(program);

    await program.parseAsync(
      [
        'login',
        '--email', 'host@show.com',
        '--password', 'correct-password',
        '--supabase-url', 'https://project.supabase.co',
        '--supabase-anon-key', 'anon-key',
        '--json',
      ],
      { from: 'user' }
    );

    expect(signInWithPasswordMock).toHaveBeenCalledWith(
      'https://project.supabase.co',
      'anon-key',
      'host@show.com',
      'correct-password'
    );

    const output = JSON.parse(writes.join(''));
    expect(output).toEqual({ loggedIn: true, email: 'host@show.com' });

    const creds = loadCredentials();
    expect(creds?.accessToken).toBe('access-1');
    expect(creds?.supabaseUrl).toBe('https://project.supabase.co');
  });

  it('fails clearly when Supabase project config is missing', async () => {
    delete process.env.PODCAST_GUEST_CRM_SUPABASE_URL;
    delete process.env.PODCAST_GUEST_CRM_SUPABASE_ANON_KEY;

    const { registerLoginCommand } = await import('../src/commands/login');

    const program = new Command();
    program.exitOverride();
    program.option('--json');
    registerLoginCommand(program);

    await program.parseAsync(
      ['login', '--email', 'host@show.com', '--password', 'pw', '--json'],
      { from: 'user' }
    );

    const output = JSON.parse(writes.join(''));
    expect(output.message).toContain('Missing Supabase project config');
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });
});
