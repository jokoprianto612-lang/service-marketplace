// ─────────────────────────────────────────────
// Error Handler - Cloudflare Worker
// ─────────────────────────────────────────────
import { ErrorHandler } from 'hono';

export const errorHandler: ErrorHandler<{ Bindings: Env }> = (err, c) => {
  console.error('Worker error:', err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.errors,
      },
    }, 400);
  }

  // Custom HTTP errors
  if (err.status) {
    return c.json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message,
      },
    }, err.status);
  }

  // Generic server error
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  }, 500);
};

export class HTTPError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number = 500, code: string = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message: string) => new HTTPError(message, 400, 'BAD_REQUEST');
export const unauthorized = (message: string = 'Unauthorized') => new HTTPError(message, 401, 'UNAUTHORIZED');
export const forbidden = (message: string = 'Forbidden') => new HTTPError(message, 403, 'FORBIDDEN');
export const notFound = (message: string = 'Not found') => new HTTPError(message, 404, 'NOT_FOUND');
export const conflict = (message: string) => new HTTPError(message, 409, 'CONFLICT');
export const internal = (message: string = 'Internal server error') => new HTTPError(message, 500, 'INTERNAL_ERROR');