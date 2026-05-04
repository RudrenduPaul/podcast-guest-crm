import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { guestService } from '../services/guest.service';
import { aiService } from '../services/ai.service';
import { validateRequest, paginationSchema, idParamSchema } from '../middleware/validate';

const SHOW_CONTEXT = {
  topics: ['AI', 'machine learning', 'startups', 'engineering', 'venture capital'],
  audienceDescription: '40,000 technical founders, engineers, and investors',
};

const createGuestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  bio: z.string().max(2000).optional(),
  avatarUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  twitterHandle: z.string().max(50).optional(),
  websiteUrl: z.string().url().optional(),
  topics: z.array(z.string().max(100)).max(20).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  notes: z.string().max(5000).optional(),
});

const updateGuestSchema = createGuestSchema.partial().extend({
  fitScore: z.number().min(0).max(100).optional(),
  stage: z.enum(['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up']).optional(),
  episodeTitle: z.string().max(300).optional(),
  episodeNumber: z.number().int().positive().optional(),
  recordingDate: z.string().datetime().optional(),
  publishedDate: z.string().datetime().optional(),
  podcastUrl: z.string().url().optional(),
  nextFollowUpDate: z.string().datetime().optional(),
});

const stageTransitionSchema = z.object({
  stage: z.enum(['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up']),
  reason: z.string().max(500).optional(),
});

const guestQuerySchema = paginationSchema.extend({
  stage: z.enum(['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().max(200).optional(),
  topics: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }),
});

export async function guestRoutes(server: FastifyInstance): Promise<void> {
  // GET /api/v1/guests
  server.get(
    '/guests',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'List guests',
        description: 'Returns paginated, filterable list of guests for the authenticated workspace.',
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 20, maximum: 100 },
            stage: { type: 'string', enum: ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            search: { type: 'string' },
            topics: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'array' },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { query: guestQuerySchema });
      if (!validated) return;

      const result = guestService.list({
        workspaceId: request.user.workspaceId,
        ...validated.query,
      });

      return reply.status(200).send({
        data: result.guests,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    }
  );

  // GET /api/v1/guests/:id
  server.get(
    '/guests/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'Get guest by ID',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'object' } } },
          404: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' }, statusCode: { type: 'number' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { params: idParamSchema });
      if (!validated) return;

      const guest = guestService.findById(validated.params.id, request.user.workspaceId);
      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.params.id} not found`,
          statusCode: 404,
        });
      }

      return reply.status(200).send({ data: guest });
    }
  );

  // POST /api/v1/guests
  server.post(
    '/guests',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'Create a new guest',
        body: {
          type: 'object',
          required: ['name', 'email', 'title', 'company'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            title: { type: 'string' },
            company: { type: 'string' },
            bio: { type: 'string' },
            topics: { type: 'array', items: { type: 'string' } },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        },
        response: {
          201: { type: 'object', properties: { data: { type: 'object' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: createGuestSchema });
      if (!validated) return;

      const guest = guestService.create({
        workspaceId: request.user.workspaceId,
        ...validated.body,
      });

      // Fire-and-forget: score fit in background so creation returns immediately
      setImmediate(async () => {
        try {
          const research = await aiService.scoreFit(guest, SHOW_CONTEXT);
          guestService.update(guest.id, request.user.workspaceId, {
            fitScore: research.fitScore,
            topics: research.topTopics.length > 0 ? research.topTopics : guest.topics,
          });
        } catch {
          // Non-blocking — guest creation succeeds regardless of AI availability
        }
      });

      return reply.status(201).send({ data: guest });
    }
  );

  // PUT /api/v1/guests/:id
  server.put(
    '/guests/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'Update a guest',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'object' } } },
          404: { type: 'object' },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, {
        params: idParamSchema,
        body: updateGuestSchema,
      });
      if (!validated) return;

      const guest = guestService.update(
        validated.params.id,
        request.user.workspaceId,
        validated.body
      );

      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.params.id} not found`,
          statusCode: 404,
        });
      }

      return reply.status(200).send({ data: guest });
    }
  );

  // PATCH /api/v1/guests/:id/stage
  server.patch(
    '/guests/:id/stage',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'Transition guest lifecycle stage',
        description: 'Validates and applies a stage transition. Enforces valid lifecycle paths.',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
        body: {
          type: 'object',
          required: ['stage'],
          properties: {
            stage: {
              type: 'string',
              enum: ['discover', 'outreach', 'scheduled', 'recorded', 'published', 'follow_up'],
            },
            reason: { type: 'string' },
          },
        },
        response: {
          200: { type: 'object' },
          400: { type: 'object' },
          404: { type: 'object' },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, {
        params: idParamSchema,
        body: stageTransitionSchema,
      });
      if (!validated) return;

      const result = guestService.transitionStage(
        validated.params.id,
        request.user.workspaceId,
        validated.body.stage
      );

      if (!result.success) {
        const statusCode = result.error?.includes('not found') ? 404 : 400;
        return reply.status(statusCode).send({
          error: statusCode === 404 ? 'NotFound' : 'InvalidTransition',
          message: result.error,
          statusCode,
        });
      }

      return reply.status(200).send({ data: result.guest });
    }
  );

  // DELETE /api/v1/guests/:id
  server.delete(
    '/guests/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Guests'],
        summary: 'Delete a guest (soft delete)',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
        response: {
          204: { type: 'null' },
          404: { type: 'object' },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { params: idParamSchema });
      if (!validated) return;

      const deleted = guestService.delete(validated.params.id, request.user.workspaceId);

      if (!deleted) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.params.id} not found`,
          statusCode: 404,
        });
      }

      return reply.status(204).send();
    }
  );
}
