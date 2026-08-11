import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { apiRequest, CliError } from '../lib/api-client.js';
import { readVersion } from '../version.js';

// Mirrors packages/types/src/guest.types.ts: GuestLifecycleStage / GuestPriority.
const STAGES = ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'] as const;
const PRIORITIES = ['low', 'medium', 'high'] as const;

interface ToolResult {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

function ok(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

/**
 * Every tool handler in this file is wrapped through here so an MCP tool call
 * can never throw: apiRequest() failures (network errors, a non-2xx response
 * from the API, "not logged in", or a malformed JSON body) all land here and
 * come back as a normal isError:true result instead of crashing the stdio
 * transport loop.
 */
function toErrorResult(err: unknown): ToolResult {
  const message = err instanceof Error ? err.message : String(err);
  const statusCode = err instanceof CliError ? err.statusCode : undefined;
  return {
    content: [{ type: 'text', text: JSON.stringify({ error: 'Error', message, statusCode }, null, 2) }],
    isError: true,
  };
}

/**
 * Podcast Guest CRM MCP server: exposes the same guest-lifecycle, outreach-drafting,
 * and analytics capability the CLI has, so an orchestrating agent can drive the
 * pipeline programmatically instead of shelling out to `podcast-guest-crm-cli`.
 * Every tool here calls the exact same apiRequest() seam every CLI command uses --
 * no logic is reimplemented for the MCP path. Requires `podcast-guest-crm-cli login`
 * to have been run first; the cached session in
 * ~/.config/podcast-guest-crm-cli/credentials.json is reused automatically.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: 'podcast-guest-crm', version: readVersion() });

  server.registerTool(
    'list_guests',
    {
      title: 'List guests',
      description:
        'List guests in the pipeline, paginated and filterable by stage, priority, and free-text ' +
        'search. Wraps GET /api/v1/guests.',
      inputSchema: {
        page: z.number().int().positive().optional().describe('Page number (default 1)'),
        limit: z.number().int().positive().max(100).optional().describe('Results per page, max 100 (default 20)'),
        stage: z.enum(STAGES).optional().describe('Filter by lifecycle stage'),
        priority: z.enum(PRIORITIES).optional().describe('Filter by priority'),
        search: z.string().optional().describe('Free-text search over name, company, and topics'),
      },
    },
    async ({ page, limit, stage, priority, search }) => {
      try {
        const res = await apiRequest('/guests', { query: { page, limit, stage, priority, search } });
        return ok(res);
      } catch (err) {
        return toErrorResult(err);
      }
    }
  );

  server.registerTool(
    'add_guest',
    {
      title: 'Add a guest',
      description:
        'Create a new guest in the discover stage. Wraps POST /api/v1/guests. Fit scoring runs ' +
        'asynchronously after creation; call list_guests or the guest detail endpoint shortly after ' +
        'to see fitScore populate.',
      inputSchema: {
        name: z.string().describe('Guest full name'),
        email: z.string().describe('Guest email'),
        title: z.string().describe('Guest job title'),
        company: z.string().describe('Guest company'),
        bio: z.string().max(2000).optional().describe('Short bio (max 2000 chars)'),
        topics: z.array(z.string()).optional().describe('Topics the guest speaks on, e.g. ["AI", "startups"]'),
        priority: z.enum(PRIORITIES).optional().describe('Initial priority'),
      },
    },
    async ({ name, email, title, company, bio, topics, priority }) => {
      try {
        const res = await apiRequest('/guests', {
          method: 'POST',
          body: { name, email, title, company, bio, topics, priority },
        });
        return ok(res);
      } catch (err) {
        return toErrorResult(err);
      }
    }
  );

  server.registerTool(
    'update_guest_stage',
    {
      title: 'Transition a guest to a new lifecycle stage',
      description:
        'Transition a guest to a new lifecycle stage. Wraps PATCH /api/v1/guests/:id/stage. Valid ' +
        'paths: discover -> outreach -> scheduled -> recorded -> published -> follow_up, with ' +
        'back-transitions outreach -> discover (declined), scheduled -> outreach (reschedule), ' +
        'recorded -> scheduled (re-record), follow_up -> outreach (invite back) or follow_up -> ' +
        'published. Invalid transitions are rejected by the API, not this tool.',
      inputSchema: {
        id: z.string().describe('Guest ID'),
        stage: z.enum(STAGES).describe('The stage to transition the guest into'),
        reason: z.string().optional().describe('Optional reason recorded with the transition'),
      },
    },
    async ({ id, stage, reason }) => {
      try {
        const res = await apiRequest(`/guests/${encodeURIComponent(id)}/stage`, {
          method: 'PATCH',
          body: { stage, reason },
        });
        return ok(res);
      } catch (err) {
        return toErrorResult(err);
      }
    }
  );

  server.registerTool(
    'draft_outreach_email',
    {
      title: 'Draft an AI outreach email',
      description:
        'Generate an AI outreach email draft for a guest. Wraps POST /api/v1/outreach/draft. Uses ' +
        'claude-sonnet-4-6 server-side (packages/ai). Returns subject, body, a confidence score, and ' +
        'the reasoning behind the draft.',
      inputSchema: {
        guestId: z.string().describe('Guest ID to draft outreach for'),
        episodeAngle: z.string().optional().describe('Suggested angle for the episode'),
        recentWork: z.string().optional().describe("Reference to the guest's recent work"),
      },
    },
    async ({ guestId, episodeAngle, recentWork }) => {
      try {
        const res = await apiRequest('/outreach/draft', {
          method: 'POST',
          body: { guestId, episodeAngle, recentWork },
        });
        return ok(res);
      } catch (err) {
        return toErrorResult(err);
      }
    }
  );

  server.registerTool(
    'get_analytics_summary',
    {
      title: 'Get pipeline analytics summary',
      description:
        'Dashboard overview: total guests, stage breakdown, average fit score, reply and booking ' +
        'conversion rates, top topics, recent activity. Wraps GET /api/v1/analytics/overview.',
      inputSchema: {},
    },
    async () => {
      try {
        const res = await apiRequest('/analytics/overview');
        return ok(res);
      } catch (err) {
        return toErrorResult(err);
      }
    }
  );

  return server;
}

export async function startStdioServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
