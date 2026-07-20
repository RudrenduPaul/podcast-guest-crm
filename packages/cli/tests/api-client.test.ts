import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { loadCliConfigMock, loadCredentialsMock, saveCredentialsMock, refreshSessionMock, fetchMock } =
  vi.hoisted(() => ({
    loadCliConfigMock: vi.fn(),
    loadCredentialsMock: vi.fn(),
    saveCredentialsMock: vi.fn(),
    refreshSessionMock: vi.fn(),
    fetchMock: vi.fn(),
  }));

vi.mock('../src/lib/config', () => ({
  loadCliConfig: loadCliConfigMock,
  loadCredentials: loadCredentialsMock,
  saveCredentials: saveCredentialsMock,
}));

vi.mock('../src/lib/supabase-auth', () => ({
  refreshSession: refreshSessionMock,
}));

describe('apiRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    loadCliConfigMock.mockReset();
    loadCredentialsMock.mockReset();
    saveCredentialsMock.mockReset();
    refreshSessionMock.mockReset();

    loadCliConfigMock.mockReturnValue({ apiUrl: 'http://localhost:3001/api/v1' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws NotLoggedInError when no credentials are stored', async () => {
    loadCredentialsMock.mockReturnValue(null);
    const { apiRequest, NotLoggedInError } = await import('../src/lib/api-client');

    await expect(apiRequest('/guests')).rejects.toThrow(NotLoggedInError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('attaches the bearer token and calls the real API path', async () => {
    const farFuture = Math.floor(Date.now() / 1000) + 3600;
    loadCredentialsMock.mockReturnValue({
      accessToken: 'valid-token',
      refreshToken: 'refresh-token',
      expiresAt: farFuture,
      email: 'host@show.com',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });

    const { apiRequest } = await import('../src/lib/api-client');
    await apiRequest('/guests', { query: { stage: 'discover' } });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('http://localhost:3001/api/v1/guests?stage=discover');
    expect(init.headers.Authorization).toBe('Bearer valid-token');
    expect(refreshSessionMock).not.toHaveBeenCalled();
  });

  it('silently refreshes an expired access token before making the request', async () => {
    const expired = Math.floor(Date.now() / 1000) - 100;
    loadCredentialsMock.mockReturnValue({
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: expired,
      email: 'host@show.com',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    refreshSessionMock.mockResolvedValue({
      accessToken: 'refreshed-token',
      refreshToken: 'new-refresh-token',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
      email: 'host@show.com',
    });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });

    const { apiRequest } = await import('../src/lib/api-client');
    await apiRequest('/guests');

    expect(refreshSessionMock).toHaveBeenCalledWith(
      'https://project.supabase.co',
      'anon-key',
      'refresh-token',
      'host@show.com'
    );
    expect(saveCredentialsMock).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: 'refreshed-token' })
    );
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer refreshed-token');
  });

  it('throws CliError with the real API error message on a non-2xx response', async () => {
    const farFuture = Math.floor(Date.now() / 1000) + 3600;
    loadCredentialsMock.mockReturnValue({
      accessToken: 'valid-token',
      refreshToken: 'refresh-token',
      expiresAt: farFuture,
      email: 'host@show.com',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-key',
    });
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'NotFound', message: 'Guest guest_999 not found', statusCode: 404 }),
    });

    const { apiRequest, CliError } = await import('../src/lib/api-client');

    await expect(apiRequest('/guests/guest_999')).rejects.toThrow(CliError);
    await expect(apiRequest('/guests/guest_999')).rejects.toThrow('Guest guest_999 not found');
  });
});
