// ─────────────────────────────────────────────
// Auth Routes - Cloudflare Worker
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign } from 'hono/jwt';
import { badRequest, conflict, unauthorized } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/password';
import type { Env } from '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  name: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function requireSecret(secret: string | undefined): string {
  if (!secret || secret === 'secret' || secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be set to a strong value (min 32 chars)');
  }
  return secret;
}

export const authRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

// POST /auth/register - Register new user
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, name } = c.req.valid('json');

  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (existing) {
    throw conflict('User with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const result = await c.env.DB.prepare(
    'INSERT INTO users (email, password_hash, name, roles) VALUES (?, ?, ?, ?) RETURNING id'
  ).bind(email, passwordHash, name, JSON.stringify(['user'])).first();

  if (!result) {
    throw new Error('Failed to create user');
  }

  const userId = result.id as string;
  const secret = requireSecret(c.env.JWT_SECRET);
  const token = await sign(
    { sub: userId, email, roles: ['user'] },
    secret
  );

  return c.json({
    success: true,
    data: {
      user: { id: userId, email, name, roles: ['user'] },
      token,
    },
  }, 201);
});

// POST /auth/login - Login user
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const user = await c.env.DB.prepare(
    'SELECT id, email, password_hash, name, roles FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    throw unauthorized('Invalid credentials');
  }

  const valid = await verifyPassword(password, user.password_hash as string);
  if (!valid) {
    throw unauthorized('Invalid credentials');
  }

  const roles = JSON.parse(user.roles as string);
  const secret = requireSecret(c.env.JWT_SECRET);
  const token = await sign(
    { sub: user.id, email: user.email, roles },
    secret
  );

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
      },
      token,
    },
  });
});

// GET /auth/me - Get current user
authRoutes.get('/me', async (c) => {
  const user = c.get('user');

  if (!user) {
    throw unauthorized('Not authenticated');
  }

  return c.json({ success: true, data: user });
});
