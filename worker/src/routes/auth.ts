// ─────────────────────────────────────────────
// Auth Routes - Cloudflare Worker
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign } from 'hono/jwt';
import { badRequest, conflict, unauthorized } from '../utils/errors';
import type { Env } from '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

// POST /auth/register - Register new user
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, name } = c.req.valid('json');
  
  // Check if user exists
  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (existing) {
    throw conflict('User with this email already exists');
  }
  
  // Hash password (using Web Crypto API)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Create user
  const result = await c.env.DB.prepare(
    'INSERT INTO users (email, password_hash, name, roles) VALUES (?, ?, ?, ?) RETURNING id'
  ).bind(email, passwordHash, name, JSON.stringify(['user'])).first();
  
  if (!result) {
    throw new Error('Failed to create user');
  }
  
  const userId = result.id as string;
  
  // Generate JWT
  const token = await sign(
    { sub: userId, email, roles: ['user'] },
    c.env.JWT_SECRET
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
  
  // Verify password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  if (passwordHash !== user.password_hash) {
    throw unauthorized('Invalid credentials');
  }
  
  // Generate JWT
  const token = await sign(
    { sub: user.id, email: user.email, roles: JSON.parse(user.roles as string) },
    c.env.JWT_SECRET
  );
  
  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: JSON.parse(user.roles as string),
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