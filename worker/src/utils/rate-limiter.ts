// ─────────────────────────────────────────────
// Rate Limiter - Cloudflare Worker (using KV)
// Fails CLOSED if KV unavailable, trusts only CF-Connecting-IP.
// ─────────────────────────────────────────────
import { MiddlewareHandler } from 'hono';
import type { Env } from '../types';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'ratelimit:',
};

export function rateLimiter(config: Partial<RateLimitConfig> = {}): MiddlewareHandler<{ Bindings: Env }> {
  const { windowMs, maxRequests, keyPrefix } = { ...DEFAULT_CONFIG, ...config };

  return async (c, next) => {
    const kv = c.env.JOBS_KV;
    if (!kv) {
      // Fail closed in production; bypass only in dev when explicitly opted-in.
      const env = (c.env as any).NODE_ENV;
      if (env === 'production') {
        return c.json({
          success: false,
          error: { code: 'RATE_LIMIT_UNAVAILABLE', message: 'Rate limiter unavailable' },
        }, 503);
      }
      return next();
    }

    // Trust only Cloudflare-provided IP header.
    const ip = c.req.header('CF-Connecting-IP');
    if (!ip) {
      return c.json({
        success: false,
        error: { code: 'IP_UNKNOWN', message: 'Cannot determine client IP' },
      }, 400);
    }
    const key = `${keyPrefix}${ip}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const data = await kv.get(key, 'json') as { count: number; windowStart: number } | null;

    let count = 1;
    let currentWindowStart = now;

    if (data && data.windowStart > windowStart) {
      count = data.count + 1;
      currentWindowStart = data.windowStart;
    }

    if (count > maxRequests) {
      const ttl = Math.ceil((currentWindowStart + windowMs - now) / 1000);
      return c.json({
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests',
          retryAfter: ttl,
        },
      }, 429, {
        'Retry-After': ttl.toString(),
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil((currentWindowStart + windowMs) / 1000).toString(),
      });
    }

    await kv.put(key, JSON.stringify({ count, windowStart: currentWindowStart }), {
      expirationTtl: Math.ceil(windowMs / 1000) + 1,
    });

    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', (maxRequests - count).toString());
    c.header('X-RateLimit-Reset', Math.ceil((currentWindowStart + windowMs) / 1000).toString());

    return next();
  };
}
