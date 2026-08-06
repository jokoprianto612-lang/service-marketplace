// ─────────────────────────────────────────────
// Validation Middleware
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return async function (app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
      const result = schema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request body validation failed',
            details: result.error.flatten().fieldErrors,
            statusCode: 400,
          },
        });
      }
      request.body = result.data;
    });
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async function (app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
      const result = schema.safeParse(request.query);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Query parameters validation failed',
            details: result.error.flatten().fieldErrors,
            statusCode: 400,
          },
        });
      }
      request.query = result.data;
    });
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async function (app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
      const result = schema.safeParse(request.params);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Route parameters validation failed',
            details: result.error.flatten().fieldErrors,
            statusCode: 400,
          },
        });
      }
      request.params = result.data;
    });
  };
}