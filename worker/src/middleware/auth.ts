// ─────────────────────────────────────────────
// Auth Middleware - Cloudflare Worker
// ─────────────────────────────────────────────
import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import type { Env } from '../types';

function requireSecret(secret: string | undefined): string {
  if (!secret || secret === 'secret' || secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be set to a strong value (min 32 chars)');
  }
  return secret;
}

export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: { user: any } }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    c.set('user', null);
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const secret = requireSecret(c.env.JWT_SECRET);
    const payload = await verify(token, secret, 'HS256');
    c.set('user', {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    });
  } catch {
    c.set('user', null);
  }

  return next();
};

export const requireAuth: MiddlewareHandler<{ Bindings: Env; Variables: { user: any } }> = async (c, next) => {
  const user = c.get('user');

  if (!user) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }, 401);
  }

  return next();
};

export const requireRole = (roles: string[]): MiddlewareHandler<{ Bindings: Env; Variables: { user: any } }> => {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, 401);
    }

    const hasRole = roles.some(role => (user.roles || []).includes(role));

    if (!hasRole) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      }, 403);
    }

    return next();
  };
};
