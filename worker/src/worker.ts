// ─────────────────────────────────────────────
// Cloudflare Worker Entry Point - Hono
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { authRoutes } from './routes/auth';
import { catalogRoutes } from './routes/catalog';
import { serviceRoutes } from './routes/services';
import { projectRoutes } from './routes/projects';
import { deploymentRoutes } from './routes/deployments';
import { healthRoutes } from './routes/health';
import { jobRoutes } from './routes/jobs';
import { metricsRoutes } from './routes/metrics';

import { errorHandler } from './utils/errors';
import { rateLimiter } from './utils/rate-limiter';
import { authMiddleware } from './middleware/auth';
import { validateEnv } from './utils/env';
import type { Env, Variables } from './types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: (origin, c) => {
    const allowed = c.env.FRONTEND_URL;
    return origin === allowed ? origin : allowed;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use('/api/*', rateLimiter());

// Health check (no auth)
app.route('/api/v1', healthRoutes);

// Auth routes (public)
app.route('/api/v1/auth', authRoutes);

// Protected routes
app.use('/api/v1/*', authMiddleware);
app.route('/api/v1/catalog', catalogRoutes);
app.route('/api/v1/services', serviceRoutes);
app.route('/api/v1/projects', projectRoutes);
app.route('/api/v1/deployments', deploymentRoutes);
app.route('/api/v1/jobs', jobRoutes);
app.route('/api/v1/metrics', metricsRoutes);

// 404
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404));

// Error handler
app.onError(errorHandler);

// Cron trigger for background jobs
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    // Trigger job processing
    const { processPendingJobs } = await import('./services/job-processor');
    ctx.waitUntil(processPendingJobs(env));
  },
} satisfies ExportedHandler<Env>;