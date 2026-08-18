// ─────────────────────────────────────────────
// Custom Rate Limiter
// ─────────────────────────────────────────────
// ponytail: in-memory global store; per-account locks if throughput matters
import { FastifyRequest, FastifyReply } from 'fastify';

interface RateLimitOptions {
  max: number;
  timeWindow: string; // e.g., '1 minute', '1 hour'
  keyGenerator?: (request: FastifyRequest) => string;
}

const store = new Map<string, { count: number; resetAt: number }>();

function parseTimeWindow(window: string): number {
  const match = window.match(/^(\d+)\s*(second|minute|hour|day)s?$/);
  if (!match) return 60000; // default 1 minute
  const value = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case 'second':
      return value * 1000;
    case 'minute':
      return value * 60 * 1000;
    case 'hour':
      return value * 60 * 60 * 1000;
    case 'day':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

export function createRateLimiter(options: RateLimitOptions) {
  const { max, timeWindow, keyGenerator } = options;
  const windowMs = parseTimeWindow(timeWindow);

  return async function (request: FastifyRequest, reply: FastifyReply) {
    const key = keyGenerator ? keyGenerator(request) : request.ip;
    const now = Date.now();

    let record = store.get(key);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
      store.set(key, record);
    }

    record.count++;

    const remaining = Math.max(0, max - record.count);
    const resetAt = new Date(record.resetAt).toISOString();

    reply.header('X-RateLimit-Limit', max.toString());
    reply.header('X-RateLimit-Remaining', remaining.toString());
    reply.header('X-RateLimit-Reset', resetAt);

    if (record.count > max) {
      return reply.status(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
          statusCode: 429,
        },
      });
    }
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) {
      store.delete(key);
    }
  }
}, 60000);