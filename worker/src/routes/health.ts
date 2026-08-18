// ─────────────────────────────────────────────
// Health Routes (minimal info only)
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import type { Env } from '../types';

export const healthRoutes = new Hono<{ Bindings: Env }>();

healthRoutes.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

healthRoutes.get('/ready', async (c) => {
  try {
    await c.env.JOBS_KV.get('health-check');
    await c.env.DB.prepare('SELECT 1').first();
    return c.json({ status: 'ready' });
  } catch {
    return c.json({ status: 'not ready' }, 503);
  }
});
