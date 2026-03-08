import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import { parseServerEnv } from '@podcast-crm/config';

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  workspaceId: string;
  role: 'owner' | 'editor' | 'viewer';
  iat: number;
  exp: number;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTPayload;
  }
}

const MOCK_USER: JWTPayload = {
  sub: 'user_rudrendu_01',
  email: 'rudrendu@signalnoiseshow.com',
  workspaceId: 'ws_demo_01',
  role: 'owner',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400,
};

export async function registerAuth(server: FastifyInstance): Promise<void> {
  const env = parseServerEnv();

  await server.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Decorate with authenticate hook
  server.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Missing Authorization header',
            statusCode: 401,
          });
        }

        // In development, accept a mock token for easier testing
        if (
          env.NODE_ENV === 'development' &&
          authHeader === 'Bearer dev-mock-token'
        ) {
          request.user = MOCK_USER;
          return;
        }

        await request.jwtVerify();
      } catch (error) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
          statusCode: 401,
        });
      }
    }
  );
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
