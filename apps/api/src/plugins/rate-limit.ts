import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function registerRateLimit(server: FastifyInstance): Promise<void> {
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (_request, context) => ({
      error: 'TooManyRequests',
      message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
      statusCode: 429,
      retryAfter: Math.ceil(context.ttl / 1000),
    }),
    keyGenerator: (request) => {
      // Rate limit by IP, but also consider authenticated user
      const forwarded = request.headers['x-forwarded-for'];
      const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded ?? request.ip;
      return ip ?? 'unknown';
    },
    // Exempt health check from rate limiting
    allowList: (request) => request.routerPath === '/health',
  });
}
