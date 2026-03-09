import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(server: FastifyInstance): Promise<void> {
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Podcast Guest CRM API',
        description:
          'AI-native CRM for podcast hosts and booking agencies. Manage the full guest lifecycle from discovery to post-episode follow-up.',
        version: '1.0.0',
        contact: {
          name: 'Rudrendu Paul & Sourav Nandy',
          url: 'https://github.com/RudrenduPaul/podcast-guest-crm',
        },
        license: {
          name: 'Proprietary',
          url: 'https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE',
        },
      },
      servers: [
        { url: 'http://localhost:3001', description: 'Development' },
        { url: 'https://api.podcastguestcrm.com', description: 'Production' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description:
              'JWT token from Supabase Auth. In development, use: Bearer dev-mock-token',
          },
        },
      },
      security: [{ BearerAuth: [] }],
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Guests', description: 'Guest management and lifecycle transitions' },
        { name: 'Outreach', description: 'AI-powered outreach email management' },
        { name: 'AI', description: 'AI feature endpoints (claude-sonnet-4-6)' },
        { name: 'Analytics', description: 'Pipeline and performance analytics' },
      ],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      defaultModelsExpandDepth: 3,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
