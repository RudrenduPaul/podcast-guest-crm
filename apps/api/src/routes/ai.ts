import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { guestService } from '../services/guest.service';
import { aiService } from '../services/ai.service';
import { validateRequest, idParamSchema } from '../middleware/validate';

const DEMO_SHOW = {
  name: 'The Signal & The Noise',
  audienceDescription: '40,000 technical founders, engineers, and investors',
  hostName: 'Rudrendu Paul',
  topics: ['AI', 'machine learning', 'startups', 'engineering', 'venture capital'],
};

const fitScoreSchema = z.object({
  guestId: z.string().min(1),
});

const interviewBriefSchema = z.object({
  guestId: z.string().min(1),
  hostNotes: z.string().max(1000).optional(),
});

const socialPostSchema = z.object({
  guestId: z.string().min(1),
  keyInsights: z.array(z.string().max(500)).min(1).max(10),
  episodeTitle: z.string().min(1).max(300).optional(),
  episodeNumber: z.number().int().positive().optional(),
  podcastUrl: z.string().url().optional(),
});

export async function aiRoutes(server: FastifyInstance): Promise<void> {
  // POST /api/v1/ai/fit-score
  server.post(
    '/ai/fit-score',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['AI'],
        summary: 'Generate AI fit score for a guest',
        description:
          'Analyzes a guest profile against show topics and returns a 0-100 fit score with rationale, suggested questions, and red flags.',
        body: {
          type: 'object',
          required: ['guestId'],
          properties: {
            guestId: { type: 'string' },
          },
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'object' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: fitScoreSchema });
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
        const research = await aiService.scoreFit(guest, {
          topics: DEMO_SHOW.topics,
          audienceDescription: DEMO_SHOW.audienceDescription,
        });

        // Update the guest's fit score in the store
        guestService.update(validated.body.guestId, request.user.workspaceId, {
          fitScore: research.fitScore,
          topics: research.topTopics.length > 0 ? research.topTopics : guest.topics,
        });

        return reply.status(200).send({ data: research });
      } catch (error) {
        server.log.error('AI fit score failed:', error);
        return reply.status(503).send({
          error: 'AIServiceError',
          message: 'Failed to generate fit score. Please try again.',
          statusCode: 503,
        });
      }
    }
  );

  // POST /api/v1/ai/interview-brief
  server.post(
    '/ai/interview-brief',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['AI'],
        summary: 'Generate pre-recording interview brief',
        description:
          'Creates a comprehensive interview brief with bio summary, questions, talking points, and controversy flags.',
        body: {
          type: 'object',
          required: ['guestId'],
          properties: {
            guestId: { type: 'string' },
            hostNotes: { type: 'string', description: 'Optional notes from the host for context' },
          },
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'object' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: interviewBriefSchema });
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
        const brief = await aiService.generateInterviewBrief(guest, {
          showName: DEMO_SHOW.name,
          hostName: DEMO_SHOW.hostName,
          audienceDescription: DEMO_SHOW.audienceDescription,
          hostNotes: validated.body.hostNotes,
        });

        return reply.status(200).send({ data: brief });
      } catch (error) {
        server.log.error('AI interview brief failed:', error);
        return reply.status(503).send({
          error: 'AIServiceError',
          message: 'Failed to generate interview brief. Please try again.',
          statusCode: 503,
        });
      }
    }
  );

  // POST /api/v1/ai/social-post
  server.post(
    '/ai/social-post',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['AI'],
        summary: 'Generate social media posts for a published episode',
        description:
          'Creates LinkedIn, Twitter/X thread, and Instagram posts for a published episode.',
        body: {
          type: 'object',
          required: ['guestId', 'keyInsights'],
          properties: {
            guestId: { type: 'string' },
            keyInsights: { type: 'array', items: { type: 'string' } },
            episodeTitle: { type: 'string' },
            episodeNumber: { type: 'number' },
            podcastUrl: { type: 'string', format: 'uri' },
          },
        },
        response: {
          200: { type: 'object', properties: { data: { type: 'object' } } },
        },
      },
    },
    async (request, reply) => {
      const validated = await validateRequest(request, reply, { body: socialPostSchema });
      if (!validated) return;

      const guest = guestService.findById(validated.body.guestId, request.user.workspaceId);
      if (!guest) {
        return reply.status(404).send({
          error: 'NotFound',
          message: `Guest ${validated.body.guestId} not found`,
          statusCode: 404,
        });
      }

      if (guest.stage !== 'published' && guest.stage !== 'follow_up') {
        return reply.status(400).send({
          error: 'InvalidStage',
          message: 'Social posts can only be generated for published episodes.',
          statusCode: 400,
        });
      }

      try {
        const posts = await aiService.generateSocialPosts(guest, {
          episodeTitle:
            validated.body.episodeTitle ?? guest.episodeTitle ?? `Episode with ${guest.name}`,
          episodeNumber: validated.body.episodeNumber ?? guest.episodeNumber ?? 0,
          keyInsights: validated.body.keyInsights,
          podcastUrl: validated.body.podcastUrl ?? guest.podcastUrl,
          showName: DEMO_SHOW.name,
        });

        return reply.status(200).send({ data: posts });
      } catch (error) {
        server.log.error('AI social post failed:', error);
        return reply.status(503).send({
          error: 'AIServiceError',
          message: 'Failed to generate social posts. Please try again.',
          statusCode: 503,
        });
      }
    }
  );
}
