import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { apiRequestMock } = vi.hoisted(() => ({ apiRequestMock: vi.fn() }));

vi.mock('../src/lib/api-client', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api-client')>(
    '../src/lib/api-client'
  );
  return { ...actual, apiRequest: apiRequestMock };
});

import { createServer } from '../src/mcp/server';
import { CliError } from '../src/lib/api-client';

/** Minimal in-memory transport pair so tests can call tools without a real stdio pipe. */
async function callTool(name: string, args: Record<string, unknown>) {
  const server = createServer();
  // registerTool stores handlers privately; the public surface for invoking one in-process
  // is the McpServer's underlying request-handling `_registeredTools` map exposed by the SDK.
  const tool = (server as unknown as {
    _registeredTools: Record<string, { handler: (args: unknown, extra: unknown) => Promise<unknown> }>;
  })._registeredTools[name];
  if (!tool) throw new Error(`Tool ${name} not registered`);
  return tool.handler(args, {});
}

describe('mcp server', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers the expected tools', () => {
    const server = createServer();
    const tools = Object.keys(
      (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools
    );
    expect(tools.sort()).toEqual(
      ['add_guest', 'draft_outreach_email', 'get_analytics_summary', 'list_guests', 'update_guest_stage'].sort()
    );
  });

  it('list_guests calls apiRequest with the right query and returns JSON', async () => {
    apiRequestMock.mockResolvedValue({
      data: [{ id: 'guest_1', name: 'Ada Lovelace' }],
      meta: { total: 1, page: 1, limit: 20 },
    });

    const result = (await callTool('list_guests', { stage: 'discover' })) as {
      content: Array<{ type: string; text: string }>;
      isError?: boolean;
    };

    expect(apiRequestMock).toHaveBeenCalledWith('/guests', {
      query: { page: undefined, limit: undefined, stage: 'discover', priority: undefined, search: undefined },
    });
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.data[0].name).toBe('Ada Lovelace');
  });

  it('update_guest_stage forwards stage and reason to PATCH /guests/:id/stage', async () => {
    apiRequestMock.mockResolvedValue({ data: { id: 'guest_1', stage: 'outreach' } });

    await callTool('update_guest_stage', { id: 'guest_1', stage: 'outreach', reason: 'replied positively' });

    expect(apiRequestMock).toHaveBeenCalledWith('/guests/guest_1/stage', {
      method: 'PATCH',
      body: { stage: 'outreach', reason: 'replied positively' },
    });
  });

  it('draft_outreach_email returns the draft payload', async () => {
    apiRequestMock.mockResolvedValue({
      data: { subject: 'Hello', body: 'Body', confidenceScore: 80, reasoning: 'Good fit' },
    });

    const result = (await callTool('draft_outreach_email', { guestId: 'guest_1' })) as {
      content: Array<{ type: string; text: string }>;
    };

    expect(apiRequestMock).toHaveBeenCalledWith('/outreach/draft', {
      method: 'POST',
      body: { guestId: 'guest_1', episodeAngle: undefined, recentWork: undefined },
    });
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.data.subject).toBe('Hello');
  });

  it('get_analytics_summary calls GET /analytics/overview', async () => {
    apiRequestMock.mockResolvedValue({ data: { totalGuests: 34 } });

    const result = (await callTool('get_analytics_summary', {})) as {
      content: Array<{ type: string; text: string }>;
    };

    expect(apiRequestMock).toHaveBeenCalledWith('/analytics/overview');
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.data.totalGuests).toBe(34);
  });

  it('never throws: an apiRequest failure comes back as isError, not an exception', async () => {
    apiRequestMock.mockRejectedValue(new CliError('Not logged in.', undefined));

    const result = (await callTool('list_guests', {})) as {
      content: Array<{ type: string; text: string }>;
      isError?: boolean;
    };

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.message).toBe('Not logged in.');
  });

  it('add_guest surfaces a non-CliError failure as isError without throwing', async () => {
    apiRequestMock.mockRejectedValue(new TypeError('fetch failed'));

    const result = (await callTool('add_guest', {
      name: 'Grace Hopper',
      email: 'grace@navy.mil',
      title: 'Rear Admiral',
      company: 'US Navy',
    })) as { content: Array<{ type: string; text: string }>; isError?: boolean };

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.message).toBe('fetch failed');
  });
});
