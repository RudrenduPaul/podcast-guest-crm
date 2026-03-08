import type { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError, type ZodSchema } from 'zod';

export interface ValidationTarget {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
}

/**
 * Validates request data against Zod schemas.
 * Returns parsed, type-safe data or throws a 400 error.
 */
export async function validateRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
>(
  request: FastifyRequest,
  reply: FastifyReply,
  schemas: ValidationTarget
): Promise<{
  body: TBody;
  query: TQuery;
  params: TParams;
} | null> {
  try {
    const body = schemas.body
      ? (schemas.body.parse(request.body) as TBody)
      : (request.body as TBody);

    const query = schemas.query
      ? (schemas.query.parse(request.query) as TQuery)
      : (request.query as TQuery);

    const params = schemas.params
      ? (schemas.params.parse(request.params) as TParams)
      : (request.params as TParams);

    return { body, query, params };
  } catch (error) {
    if (error instanceof ZodError) {
      await reply.status(400).send({
        error: 'ValidationError',
        message: formatZodError(error),
        statusCode: 400,
        details: error.errors,
      });
      return null;
    }
    throw error;
  }
}

// Common Zod schemas for reuse across routes
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const guestIdParamSchema = z.object({
  guestId: z.string().min(1),
});
