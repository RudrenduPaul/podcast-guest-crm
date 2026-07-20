import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signInWithPassword, refreshSession, SupabaseAuthError } from '../src/lib/supabase-auth';

describe('supabase-auth', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('signInWithPassword hits the real GoTrue password grant endpoint with the anon key', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'access-123',
        refresh_token: 'refresh-123',
        expires_in: 3600,
        user: { email: 'host@show.com' },
      }),
    });

    const session = await signInWithPassword(
      'https://project.supabase.co',
      'anon-key',
      'host@show.com',
      'correct-password'
    );

    expect(session.accessToken).toBe('access-123');
    expect(session.refreshToken).toBe('refresh-123');
    expect(session.email).toBe('host@show.com');

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://project.supabase.co/auth/v1/token?grant_type=password');
    expect(init.headers.apikey).toBe('anon-key');
    expect(JSON.parse(init.body)).toEqual({ email: 'host@show.com', password: 'correct-password' });
  });

  it('trims a trailing slash on the Supabase URL', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ access_token: 'a', refresh_token: 'r', expires_in: 3600 }),
    });

    await signInWithPassword('https://project.supabase.co/', 'anon-key', 'a@b.com', 'pw');

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://project.supabase.co/auth/v1/token?grant_type=password');
  });

  it('throws SupabaseAuthError with the real error_description on invalid credentials', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
    });

    await expect(
      signInWithPassword('https://project.supabase.co', 'anon-key', 'a@b.com', 'wrong')
    ).rejects.toThrow(SupabaseAuthError);
    await expect(
      signInWithPassword('https://project.supabase.co', 'anon-key', 'a@b.com', 'wrong')
    ).rejects.toThrow('Invalid login credentials');
  });

  it('refreshSession uses the refresh_token grant', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        expires_in: 3600,
        user: { email: 'host@show.com' },
      }),
    });

    const session = await refreshSession(
      'https://project.supabase.co',
      'anon-key',
      'old-refresh',
      'host@show.com'
    );

    expect(session.accessToken).toBe('new-access');
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://project.supabase.co/auth/v1/token?grant_type=refresh_token');
    expect(JSON.parse(init.body)).toEqual({ refresh_token: 'old-refresh' });
  });
});
