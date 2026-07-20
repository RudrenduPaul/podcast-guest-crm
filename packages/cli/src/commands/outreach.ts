import { Command } from 'commander';
import { apiRequest } from '../lib/api-client';
import { printJson, printError, type GlobalOpts } from '../lib/output';

interface OutreachDraft {
  subject: string;
  body: string;
  confidenceScore: number;
  reasoning: string;
}

interface DraftResponse {
  data: OutreachDraft;
}

interface DraftOpts extends GlobalOpts {
  episodeAngle?: string;
  recentWork?: string;
}

export function registerOutreachCommands(program: Command): void {
  const outreach = program.command('outreach').description('AI-assisted outreach email drafting (/api/v1/outreach)');

  outreach
    .command('draft <guestId>')
    .description(
      'Generate an AI outreach email draft for a guest, wraps POST /api/v1/outreach/draft. ' +
        'Uses claude-sonnet-4-6 server-side (packages/ai). Returns subject, body, a ' +
        'confidence score, and the reasoning behind the draft.'
    )
    .option('--episode-angle <angle>', 'Suggested angle for the episode')
    .option('--recent-work <work>', "Reference to the guest's recent work")
    .action(async (guestId: string, opts: DraftOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<DraftResponse>('/outreach/draft', {
          method: 'POST',
          body: {
            guestId,
            episodeAngle: opts.episodeAngle,
            recentWork: opts.recentWork,
          },
        });

        if (json || !res.data?.subject) {
          printJson(res);
          return;
        }

        const { subject, body, confidenceScore, reasoning } = res.data;
        process.stdout.write(`Subject: ${subject}\n\n${body}\n\n`);
        process.stdout.write(`Confidence: ${confidenceScore}\nReasoning: ${reasoning}\n`);
      } catch (err) {
        printError(err, json);
      }
    });
}
