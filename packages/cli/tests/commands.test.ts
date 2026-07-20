import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Command } from 'commander';

const { apiRequestMock } = vi.hoisted(() => ({ apiRequestMock: vi.fn() }));

vi.mock('../src/lib/api-client', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api-client')>(
    '../src/lib/api-client'
  );
  return { ...actual, apiRequest: apiRequestMock };
});

import { registerGuestCommands } from '../src/commands/guest';
import { registerOutreachCommands } from '../src/commands/outreach';
import { registerAnalyticsCommands } from '../src/commands/analytics';

function buildProgram(): Command {
  const program = new Command();
  program.exitOverride(); // throw instead of process.exit so tests can catch failures
  program.option('--json');
  registerGuestCommands(program);
  registerOutreachCommands(program);
  registerAnalyticsCommands(program);
  return program;
}

describe('guest commands', () => {
  let writes: string[];

  beforeEach(() => {
    apiRequestMock.mockReset();
    writes = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('guest list --json prints the raw API envelope', async () => {
    apiRequestMock.mockResolvedValue({
      data: [{ id: 'guest_1', name: 'Ada Lovelace', company: 'Analytical Engines', stage: 'discover', priority: 'high', fitScore: 91 }],
      meta: { total: 1, page: 1, limit: 20 },
    });

    const program = buildProgram();
    await program.parseAsync(['guest', 'list', '--json'], { from: 'user' });

    expect(apiRequestMock).toHaveBeenCalledWith('/guests', {
      query: { page: undefined, limit: undefined, stage: undefined, priority: undefined, search: undefined },
    });
    const output = JSON.parse(writes.join(''));
    expect(output.data[0].name).toBe('Ada Lovelace');
    expect(output.meta.total).toBe(1);
  });

  it('guest list without --json renders a table', async () => {
    apiRequestMock.mockResolvedValue({
      data: [{ id: 'guest_1', name: 'Ada Lovelace', company: 'Analytical Engines', stage: 'discover', priority: 'high', fitScore: 91 }],
      meta: { total: 1, page: 1, limit: 20 },
    });

    const program = buildProgram();
    await program.parseAsync(['guest', 'list'], { from: 'user' });

    const output = writes.join('');
    expect(output).toContain('Ada Lovelace');
    expect(output).toContain('1 total');
  });

  it('guest stage forwards the new stage and reason to PATCH /guests/:id/stage', async () => {
    apiRequestMock.mockResolvedValue({ data: { id: 'guest_1', name: 'Ada Lovelace', stage: 'outreach' } });

    const program = buildProgram();
    await program.parseAsync(['guest', 'stage', 'guest_1', 'outreach', '--reason', 'replied positively'], {
      from: 'user',
    });

    expect(apiRequestMock).toHaveBeenCalledWith('/guests/guest_1/stage', {
      method: 'PATCH',
      body: { stage: 'outreach', reason: 'replied positively' },
    });
  });

  it('guest stage surfaces the real API validation error on an invalid transition', async () => {
    const { CliError } = await vi.importActual<typeof import('../src/lib/api-client')>(
      '../src/lib/api-client'
    );
    apiRequestMock.mockRejectedValue(
      new CliError('Cannot transition from discover to published', 400)
    );

    const program = buildProgram();
    await program.parseAsync(['guest', 'stage', 'guest_1', 'published', '--json'], { from: 'user' });

    const output = JSON.parse(writes.join(''));
    expect(output.statusCode).toBe(400);
    expect(output.message).toContain('Cannot transition from discover to published');
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });

  it('guest add sends parsed comma-separated topics and required fields', async () => {
    apiRequestMock.mockResolvedValue({ data: { id: 'guest_2', name: 'Grace Hopper' } });

    const program = buildProgram();
    await program.parseAsync(
      [
        'guest',
        'add',
        '--name', 'Grace Hopper',
        '--email', 'grace@navy.mil',
        '--title', 'Rear Admiral',
        '--company', 'US Navy',
        '--topics', 'compilers, distributed systems',
        '--json',
      ],
      { from: 'user' }
    );

    expect(apiRequestMock).toHaveBeenCalledWith('/guests', {
      method: 'POST',
      body: expect.objectContaining({
        name: 'Grace Hopper',
        email: 'grace@navy.mil',
        topics: ['compilers', 'distributed systems'],
      }),
    });
  });

  it('outreach draft prints subject, body, and confidence score', async () => {
    apiRequestMock.mockResolvedValue({
      data: {
        subject: 'A question about your recent work',
        body: 'Hi Ada, ...',
        confidenceScore: 82,
        reasoning: 'Strong topical overlap with the show.',
      },
    });

    const program = buildProgram();
    await program.parseAsync(['outreach', 'draft', 'guest_1'], { from: 'user' });

    expect(apiRequestMock).toHaveBeenCalledWith('/outreach/draft', {
      method: 'POST',
      body: { guestId: 'guest_1', episodeAngle: undefined, recentWork: undefined },
    });
    const output = writes.join('');
    expect(output).toContain('A question about your recent work');
    expect(output).toContain('Confidence: 82');
  });

  it('analytics summary computes reply/booking percentages from the real overview shape', async () => {
    apiRequestMock.mockResolvedValue({
      data: {
        totalGuests: 34,
        byStage: { discover: 10, outreach: 8, scheduled: 6, recorded: 4, published: 4, follow_up: 2 },
        avgFitScore: 71.2,
        outreachReplyRate: 0.42,
        bookingConversionRate: 0.18,
        topTopics: [{ topic: 'AI', count: 12 }],
        recentActivity: [],
      },
    });

    const program = buildProgram();
    await program.parseAsync(['analytics', 'summary'], { from: 'user' });

    const output = writes.join('');
    expect(output).toContain('Total guests: 34');
    expect(output).toContain('Outreach reply rate: 42.0%');
    expect(output).toContain('Booking conversion rate: 18.0%');
    expect(output).toContain('AI: 12');
  });
});
