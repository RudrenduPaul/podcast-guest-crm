import type { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError, type ZodSchema } from 'zod';

export interface ValidationTarget<
  TBodySchema extends ZodSchema | undefined = ZodSchema | undefined,
  TQuerySchema extends ZodSchema | undefined = ZodSchema | undefined,
  TParamsSchema extends ZodSchema | undefined = ZodSchema | undefined,
> {
  body?: TBodySchema;
  query?: TQuerySchema;
  params?: TParamsSchema;
}

export function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
}

type InferOrUnknown<TSchema extends ZodSchema | undefined> =
  TSchema extends ZodSchema ? z.infer<TSchema> : unknown;

/**
 * Validates request data against Zod schemas.
 * Returns parsed, type-safe data (inferred from the schemas passed in) or
 * throws a 400 error.
 */
export async function validateRequest<
  TBodySchema extends ZodSchema | undefined = undefined,
  TQuerySchema extends ZodSchema | undefined = undefined,
  TParamsSchema extends ZodSchema | undefined = undefined,
>(
  request: FastifyRequest,
  reply: FastifyReply,
  schemas: ValidationTarget<TBodySchema, TQuerySchema, TParamsSchema>
): Promise<{
  body: InferOrUnknown<TBodySchema>;
  query: InferOrUnknown<TQuerySchema>;
  params: InferOrUnknown<TParamsSchema>;
} | null> {
  try {
    const body = (
      schemas.body ? schemas.body.parse(request.body) : request.body
    ) as InferOrUnknown<TBodySchema>;

    const query = (
      schemas.query ? schemas.query.parse(request.query) : request.query
    ) as InferOrUnknown<TQuerySchema>;

    const params = (
      schemas.params ? schemas.params.parse(request.params) : request.params
    ) as InferOrUnknown<TParamsSchema>;

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
