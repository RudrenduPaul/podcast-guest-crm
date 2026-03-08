import Fastify from 'fastify';
import { parseServerEnv } from '@podcast-crm/config';
import { registerCors } from './plugins/cors';
import { registerRateLimit } from './plugins/rate-limit';
import { registerSwagger } from './plugins/swagger';
import { registerAuth } from './plugins/auth';
import { healthRoutes } from './routes/health';
import { guestRoutes } from './routes/guests';
import { outreachRoutes } from './routes/outreach';
import { aiRoutes } from './routes/ai';
import { analyticsRoutes } from './routes/analytics';

const env = parseServerEnv();

const server = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport:
      env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
});

async function bootstrap(): Promise<void> {
  // Register plugins in order
  await registerCors(server);
  await registerRateLimit(server);
  await registerSwagger(server);
  await registerAuth(server);

  // Register routes
  await server.register(healthRoutes);
  await server.register(guestRoutes, { prefix: '/api/v1' });
  await server.register(outreachRoutes, { prefix: '/api/v1' });
  await server.register(aiRoutes, { prefix: '/api/v1' });
  await server.register(analyticsRoutes, { prefix: '/api/v1' });

  // Global error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return reply.status(500).send({
      error: 'InternalServerError',
      message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
      statusCode: 500,
    });
  });

  // Not found handler
  server.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      error: 'NotFound',
      message: 'Route not found',
      statusCode: 404,
    });
  });

  await server.listen({ port: env.PORT, host: '0.0.0.0' });
  server.log.info(`Server running on port ${env.PORT}`);
  server.log.info(`API docs: http://localhost:${env.PORT}/docs`);
}

bootstrap().catch((error: unknown) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});

export { server };
