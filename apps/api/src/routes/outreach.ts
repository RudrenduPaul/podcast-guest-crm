import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { guestService } from '../services/guest.service';
import { aiService } from '../services/ai.service';
import { seedOutreachEmails } from '@podcast-crm/db';
import type { OutreachEmail } from '@podcast-crm/types';
import { validateRequest, guestIdParamSchema } from '../middleware/validate';

const DEMO_SHOW = {
  name: 'The Signal & The Noise',
  description:
    'Conversations with the builders, researchers, and investors shaping the future of AI and technology.',
  hostName: 'Rudrendu Paul',
  audienceSize: '40,000 technical founders and engineers',
  recentGuests: ['Andrej Karpathy', 'Sam Altman', 'Kelsey Hightower'],
};

// In-memory outreach store
const outreachStore: Map<string, OutreachEmail> = new Map(
  seedOutreachEmails.map((e) => [e.id, e])
);

const draftOutreachSchema = z.object({
  guestId: z.string().min(1),
  episodeAngle: z.string().max(500).optional(),
  recentWork: z.string().max(500).optional(),
});

const sendOutreachSchema = z.object({
  guestId: z.string().min(1),
  subject: z.string().min(1).max(300),
  body: z.string().min(1).max(10000),
});

export async function outreachRoutes(server: FastifyInstance): Promise<void> {
  // POST /api/v1/outreach/draft
  server.post(
    '/outreach/draft',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Outreach'],
        summary: 'Generate AI outreach email draft',
        description: 'Uses claude-sonnet-4-6 to draft a personalized outreach email for a guest.',
        body: {
          type: 'object',
          required: ['guestId'],
          properties: {
            guestId: { type: 'string' },
            episodeAngle: { type: 'string', description: 'Suggested angle for the episode' },
            recentWork: { type: 'string', description: "Reference to guest's recent work" },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  body: { type: 'string' },
                  confidenceScore: { type: 'number' },
                  reasoning: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: draftOutreachSchema });
      if (!validated) return;

      const guest = guestService.findById(validated.body.guestId, request.user.workspaceId);
      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.body.guestId} not found`,
          statusCode: 404,
        });
      }

      try {
        const draft = await aiService.draftOutreachEmail(guest, {
          showName: DEMO_SHOW.name,
          showDescription: DEMO_SHOW.description,
          hostName: DEMO_SHOW.hostName,
          audienceSize: DEMO_SHOW.audienceSize,
          recentGuests: DEMO_SHOW.recentGuests,
          episodeAngle: validated.body.episodeAngle,
          recentWork: validated.body.recentWork,
        });

        return reply.status(200).send({ data: draft });
      } catch (error) {
        server.log.error('AI outreach draft failed:', error);
        return reply.status(503).send({
          error: 'AIServiceError',
          message: 'Failed to generate outreach email. Please try again.',
          statusCode: 503,
        });
      }
    }
  );

  // POST /api/v1/outreach/send
  server.post(
    '/outreach/send',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Outreach'],
        summary: 'Send outreach email (mock)',
        description: 'Records a sent outreach email. In production, delivers via Resend.',
        body: {
          type: 'object',
          required: ['guestId', 'subject', 'body'],
          properties: {
            guestId: { type: 'string' },
            subject: { type: 'string' },
            body: { type: 'string' },
          },
        },
        response: {
          201: { type: 'object', properties: { data: { type: 'object' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: sendOutreachSchema });
      if (!validated) return;

      const guest = guestService.findById(validated.body.guestId, request.user.workspaceId);
      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.body.guestId} not found`,
          statusCode: 404,
        });
      }

      const now = new Date().toISOString();
      const email: OutreachEmail = {
        id: `email_${Date.now()}`,
        guestId: validated.body.guestId,
        workspaceId: request.user.workspaceId,
        subject: validated.body.subject,
        body: validated.body.body,
        generatedByAI: false,
        sentAt: now,
        status: 'sent',
        createdAt: now,
      };

      outreachStore.set(email.id, email);

      // Update guest outreach count and last contacted date
      guestService.update(validated.body.guestId, request.user.workspaceId, {
        outreachCount: (guest.outreachCount ?? 0) + 1,
        lastContactedAt: now,
      });

      // In production: await resend.emails.send({ from, to, subject, html })
      server.log.info(`[MOCK] Email sent to ${guest.email}: ${validated.body.subject}`);

      return reply.status(201).send({ data: email });
    }
  );

  // GET /api/v1/outreach/:guestId
  server.get(
    '/outreach/:guestId',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Outreach'],
        summary: 'Get outreach history for a guest',
        params: {
          type: 'object',
          properties: { guestId: { type: 'string' } },
          required: ['guestId'],
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'array' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { params: guestIdParamSchema });
      if (!validated) return;

      const guest = guestService.findById(validated.params.guestId, request.user.workspaceId);
      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.params.guestId} not found`,
          statusCode: 404,
        });
      }

      const emails = Array.from(outreachStore.values())
        .filter(
          (e) =>
            e.guestId === validated.params.guestId &&
            e.workspaceId === request.user.workspaceId
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return reply.status(200).send({ data: emails });
    }
  );
}
