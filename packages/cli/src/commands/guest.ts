import { Command } from 'commander';
import { apiRequest } from '../lib/api-client';
import { printJson, printError, printTable, type GlobalOpts } from '../lib/output';

// Mirrors packages/types/src/guest.types.ts: GuestLifecycleStage / GuestPriority.
const STAGES = ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'] as const;
const PRIORITIES = ['low', 'medium', 'high'] as const;

interface Guest {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  bio?: string;
  topics: string[];
  fitScore: number;
  stage: string;
  priority: string;
  outreachCount: number;
  episodeTitle?: string;
  createdAt: string;
  updatedAt: string;
}

interface GuestListResponse {
  data: Guest[];
  meta: { total: number; page: number; limit: number };
}

interface GuestResponse {
  data: Guest;
}

interface ListOpts extends GlobalOpts {
  page?: string;
  limit?: string;
  stage?: string;
  priority?: string;
  search?: string;
}

interface AddOpts extends GlobalOpts {
  name: string;
  email: string;
  title: string;
  company: string;
  bio?: string;
  topics?: string;
  priority?: string;
}

export function registerGuestCommands(program: Command): void {
  const guest = program.command('guest').description('Manage guests in the pipeline (GET/POST/PATCH /api/v1/guests)');

  guest
    .command('list')
    .description('List guests, paginated and filterable. Wraps GET /api/v1/guests')
    .option('--page <page>', 'Page number (default 1)')
    .option('--limit <limit>', 'Results per page, max 100 (default 20)')
    .option('--stage <stage>', `Filter by stage: ${STAGES.join(', ')}`)
    .option('--priority <priority>', `Filter by priority: ${PRIORITIES.join(', ')}`)
    .option('--search <search>', 'Free-text search')
    .action(async (opts: ListOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<GuestListResponse>('/guests', {
          query: {
            page: opts.page,
            limit: opts.limit,
            stage: opts.stage,
            priority: opts.priority,
            search: opts.search,
          },
        });

        if (json) {
          printJson(res);
          return;
        }

        printTable(
          res.data.map((g) => ({
            id: g.id,
            name: g.name,
            company: g.company,
            stage: g.stage,
            priority: g.priority,
            fitScore: String(g.fitScore),
          })),
          ['id', 'name', 'company', 'stage', 'priority', 'fitScore']
        );
        process.stdout.write(`\n${res.meta.total} total · page ${res.meta.page} · limit ${res.meta.limit}\n`);
      } catch (err) {
        printError(err, json);
      }
    });

  guest
    .command('show <id>')
    .description('Get full detail for a single guest, wraps GET /api/v1/guests/:id')
    .action(async (id: string, _opts: GlobalOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<GuestResponse>(`/guests/${encodeURIComponent(id)}`);
        if (json) {
          printJson(res);
        } else {
          printJson(res.data);
        }
      } catch (err) {
        printError(err, json);
      }
    });

  guest
    .command('add')
    .description(
      'Create a new guest, wraps POST /api/v1/guests. Fit scoring runs asynchronously ' +
        'after creation. Fetch the guest again shortly after to see fitScore populate.'
    )
    .requiredOption('--name <name>', 'Guest full name')
    .requiredOption('--email <email>', 'Guest email')
    .requiredOption('--title <title>', 'Guest job title')
    .requiredOption('--company <company>', 'Guest company')
    .option('--bio <bio>', 'Short bio (max 2000 chars)')
    .option('--topics <topics>', 'Comma-separated topics, e.g. "AI,startups"')
    .option('--priority <priority>', `One of: ${PRIORITIES.join(', ')}`)
    .action(async (opts: AddOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<GuestResponse>('/guests', {
          method: 'POST',
          body: {
            name: opts.name,
            email: opts.email,
            title: opts.title,
            company: opts.company,
            bio: opts.bio,
            topics: opts.topics ? opts.topics.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
            priority: opts.priority,
          },
        });

        if (json) {
          printJson(res);
        } else if (res.data?.id) {
          process.stdout.write(`Created guest ${res.data.id} (${res.data.name})\n`);
        } else {
          // The API's own response schema for this route doesn't declare `data`'s
          // properties, so Fastify's serializer can strip the body down to `{}` even on
          // success. Fall back to raw JSON rather than crashing on a missing field.
          printJson(res);
        }
      } catch (err) {
        printError(err, json);
      }
    });

  guest
    .command('stage <id> <newStage>')
    .description(
      'Transition a guest to a new lifecycle stage, wraps PATCH /api/v1/guests/:id/stage. ' +
        'Valid paths: discover -> outreach -> scheduled -> recorded -> published -> follow_up, ' +
        'with back-transitions outreach -> discover (declined), scheduled -> outreach ' +
        '(reschedule), recorded -> scheduled (re-record), follow_up -> outreach (invite back) ' +
        'or follow_up -> published. Invalid transitions are rejected by the API, not this CLI.'
    )
    .option('--reason <reason>', 'Optional reason recorded with the transition')
    .action(async (id: string, newStage: string, opts: { reason?: string } & GlobalOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const res = await apiRequest<GuestResponse>(`/guests/${encodeURIComponent(id)}/stage`, {
          method: 'PATCH',
          body: { stage: newStage, reason: opts.reason },
        });

        if (json) {
          printJson(res);
        } else if (res.data?.stage) {
          process.stdout.write(`${res.data.name} is now in stage: ${res.data.stage}\n`);
        } else {
          // Same schema gap as `guest add` above: the API's response schema for this
          // route doesn't declare `data`'s properties, so a successful transition can
          // still come back stripped to `{}`. Fall back to raw JSON, never crash.
          printJson(res);
        }
      } catch (err) {
        printError(err, json);
      }
    });
}
