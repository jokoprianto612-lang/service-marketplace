// ─────────────────────────────────────────────
// Rate Limiter - Cloudflare Worker (using KV)
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
      return next(); // Skip if KV not available
    }

    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const key = `${keyPrefix}${ip}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      // Get current count
      const data = await kv.get(key, 'json') as { count: number; windowStart: number } | null;
      
      let count = 1;
      let currentWindowStart = now;

      if (data && data.windowStart > windowStart) {
        count = data.count + 1;
        currentWindowStart = data.windowStart;
      }

      // Check limit
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

      // Update counter
      await kv.put(key, JSON.stringify({ count, windowStart: currentWindowStart }), {
        expirationTtl: Math.ceil(windowMs / 1000) + 1,
      });

      // Add rate limit headers
      c.header('X-RateLimit-Limit', maxRequests.toString());
      c.header('X-RateLimit-Remaining', (maxRequests - count).toString());
      c.header('X-RateLimit-Reset', Math.ceil((currentWindowStart + windowMs) / 1000).toString());

    } catch (err) {
      console.error('Rate limiter error:', err);
      // Fail open - don't block on rate limiter errors
    }

    return next();
  };
}