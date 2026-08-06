// ─────────────────────────────────────────────
// Health Routes
// ─────────────────────────────────────────────
import { Hono } from 'hono';

export const healthRoutes = new Hono<{ Bindings: Env }>();

healthRoutes.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: c.env.NODE_ENV,
  });
});

healthRoutes.get('/ready', async (c) => {
  try {
    // Check KV
    await c.env.JOBS_KV.get('health-check');
    
    // Check D1
    await c.env.DB.prepare('SELECT 1').first();
    
    return c.json({ status: 'ready' });
  } catch (err) {
    return c.json({ status: 'not ready', error: String(err) }, 503);
  }
});