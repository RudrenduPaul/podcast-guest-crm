import type { FastifyInstance } from 'fastify';

const VERSION = '1.0.0';

export async function healthRoutes(server: FastifyInstance): Promise<void> {
  server.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns API health status. Not rate-limited.',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              timestamp: { type: 'string', format: 'date-time' },
              version: { type: 'string', example: '1.0.0' },
              uptime: { type: 'number', description: 'Server uptime in seconds' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.status(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: VERSION,
        uptime: process.uptime(),
      });
    }
  );
}
