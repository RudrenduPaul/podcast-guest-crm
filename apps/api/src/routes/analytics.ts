import type { FastifyInstance } from 'fastify';
import {
  analyticsOverview,
  outreachActivityTimeline,
  pipelineFunnelData,
  topicsBreakdown,
} from '@podcast-crm/db';
import { guestService } from '../services/guest.service';

export async function analyticsRoutes(server: FastifyInstance): Promise<void> {
  // GET /api/v1/analytics/overview
  server.get(
    '/analytics/overview',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Analytics'],
        summary: 'Get analytics overview',
        description: 'Returns key metrics: total guests, stage breakdown, reply rate, booking conversion, top topics, and recent activity.',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  totalGuests: { type: 'number' },
                  byStage: { type: 'object' },
                  avgFitScore: { type: 'number' },
                  outreachReplyRate: { type: 'number' },
                  bookingConversionRate: { type: 'number' },
                  topTopics: { type: 'array' },
                  recentActivity: { type: 'array' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Compute live stats from in-memory guest store (augment seed analytics)
      const byStage = guestService.getByStage(request.user.workspaceId);
      const allGuests = Object.values(byStage).flat();

      const totalGuests = allGuests.length;
      const avgFitScore =
        totalGuests > 0
          ? Math.round(
              (allGuests.reduce((sum, g) => sum + g.fitScore, 0) / totalGuests) * 10
            ) / 10
          : 0;

      return reply.status(200).send({
        data: {
          ...analyticsOverview,
          totalGuests,
          avgFitScore,
          byStage: {
            discover: byStage.discover.length,
            outreach: byStage.outreach.length,
            scheduled: byStage.scheduled.length,
            recorded: byStage.recorded.length,
            published: byStage.published.length,
            follow_up: byStage.follow_up.length,
          },
        },
      });
    }
  );

  // GET /api/v1/analytics/pipeline
  server.get(
    '/analytics/pipeline',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ['Analytics'],
        summary: 'Get pipeline funnel data',
        description: 'Returns stage-by-stage conversion funnel data for pipeline analytics.',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  funnel: { type: 'array' },
                  outreachTimeline: { type: 'array' },
                  topicsBreakdown: { type: 'array' },
                },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.status(200).send({
        data: {
          funnel: pipelineFunnelData,
          outreachTimeline: outreachActivityTimeline,
          topicsBreakdown,
        },
      });
    }
  );
}
