import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { parseServerEnv } from '@podcast-crm/config';

export async function registerCors(server: FastifyInstance): Promise<void> {
  const env = parseServerEnv();

  // Allowlist-based CORS — never use wildcard in production
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  await server.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl in dev)
      if (!origin || env.NODE_ENV === 'development') {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Id'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  });
}
