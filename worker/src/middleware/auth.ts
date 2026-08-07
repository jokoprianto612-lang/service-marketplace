// ─────────────────────────────────────────────
// Auth Middleware - Cloudflare Worker
// ─────────────────────────────────────────────
import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import type { Env } from '../types';

export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: { user: any } }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    c.set('user', null);
    return next();
  }

  const token = authHeader.slice(7);
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'secret', 'HS256');
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

    const hasRole = roles.some(role => user.roles.includes(role));
    
    if (!hasRole) {
      return c.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } 
      }, 403);
    }

    return next();
  };
};