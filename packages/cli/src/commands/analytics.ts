import { Command } from 'commander';
import { apiRequest } from '../lib/api-client';
import { printJson, printError, type GlobalOpts } from '../lib/output';

interface AnalyticsOverview {
  totalGuests: number;
  byStage: Record<string, number>;
  avgFitScore: number;
  outreachReplyRate: number;
  bookingConversionRate: number;
  topTopics: Array<{ topic: string; count: number }>;
  recentActivity: Array<{ description: string; timestamp: string }>;
}

interface OverviewResponse {
  data: AnalyticsOverview;
}

interface PipelineResponse {
  data: {
    funnel: unknown[];
    outreachTimeline: unknown[];
    topicsBreakdown: unknown[];
  };
}

export function registerAnalyticsCommands(program: Command): void {
  const analytics = program.command('analytics').description('Pipeline metrics (/api/v1/analytics)');

  analytics
    .command('summary')
    .description(
      'Dashboard overview: total guests, stage breakdown, average fit score, reply and ' +
        'booking conversion rates, top topics, recent activity. Wraps GET /api/v1/analytics/overview.'
    )
    .action(async (_opts: GlobalOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<OverviewResponse>('/analytics/overview');

        if (json) {
          printJson(res);
          return;
        }

        const d = res.data;
        process.stdout.write(`Total guests: ${d.totalGuests}\n`);
        process.stdout.write(`Average fit score: ${d.avgFitScore}\n`);
        process.stdout.write(`Outreach reply rate: ${(d.outreachReplyRate * 100).toFixed(1)}%\n`);
        process.stdout.write(`Booking conversion rate: ${(d.bookingConversionRate * 100).toFixed(1)}%\n\n`);
        process.stdout.write('By stage:\n');
        const stageEntries = Object.entries(d.byStage ?? {});
        if (stageEntries.length === 0) {
          process.stdout.write('  (none returned)\n');
        }
        for (const [stage, count] of stageEntries) {
          process.stdout.write(`  ${stage.padEnd(12)} ${count}\n`);
        }
        if (d.topTopics.length > 0) {
          process.stdout.write('\nTop topics:\n');
          for (const t of d.topTopics) {
            process.stdout.write(`  ${t.topic}: ${t.count}\n`);
          }
        }
      } catch (err) {
        printError(err, json);
      }
    });

  analytics
    .command('pipeline')
    .description(
      'Stage-by-stage conversion funnel, outreach activity timeline, and topic breakdown. ' +
        'Wraps GET /api/v1/analytics/pipeline.'
    )
    .action(async (_opts: GlobalOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<PipelineResponse>('/analytics/pipeline');
        // Funnel/timeline/topic-breakdown shapes don't collapse into a useful single-line
        // human summary, so this command always prints structured JSON regardless of --json.
        printJson(res);
      } catch (err) {
        printError(err, json);
      }
    });
}
