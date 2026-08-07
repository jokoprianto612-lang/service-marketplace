// ─────────────────────────────────────────────
// Services Routes (User's deployed services)
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth';
import { notFound, badRequest } from '../utils/errors';
import type { Env } from '../types';

const deploySchema = z.object({
  definitionId: z.string(),
  name: z.string().min(1).max(100),
  mode: z.enum(['quick', 'custom', 'stack']).default('quick'),
  config: z.record(z.any()).optional(),
  targetId: z.string().optional(),
});

const scaleSchema = z.object({
  replicas: z.number().min(0).max(10),
});

export const serviceRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

// All routes require auth
serviceRoutes.use('*', requireAuth);

// GET /services - List user's services
serviceRoutes.get('/', async (c) => {
  const user = c.get('user');
  
  // TODO: Fetch from D1
  const services = [
    {
      id: 'svc_1',
      definitionId: 'n8n-workflow',
      name: 'my-n8n',
      status: 'running',
      config: {},
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'svc_2',
      definitionId: 'postgresql',
      name: 'app-db',
      status: 'running',
      config: {},
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
  ];

  return c.json({ success: true, data: services });
});

// POST /services - Deploy new service
serviceRoutes.post('/', zValidator('json', deploySchema), async (c) => {
  const user = c.get('user');
  const body = c.req.valid('json');
  
  // TODO: Create service instance in D1, queue deployment job
  const instanceId = `svc_${Date.now()}`;
  
  // Queue deployment job
  const { queueDeployment } = await import('../services/job-queue');
  await queueDeployment(c.env, {
    instanceId,
    definitionId: body.definitionId,
    projectId: user.projectId || 'default',
    userId: user.id,
    mode: body.mode,
    config: body.config,
  });

  return c.json({
    success: true,
    data: {
      instanceId,
      status: 'deploying',
      estimatedDuration: 60000,
    },
  }, 202);
});

// GET /services/:id - Get service detail
serviceRoutes.get('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  // TODO: Fetch from D1
  const service = {
    id,
    definitionId: 'n8n-workflow',
    name: 'my-n8n',
    status: 'running',
    config: {},
    deployment: {
      target: 'docker',
      composeProjectName: 'svcmarket-my-n8n',
      containers: [],
    },
    healthCheck: { status: 'healthy', lastCheck: new Date().toISOString() },
    resources: {
      cpuPercent: 12.5,
      memoryUsage: 268435456,
      memoryLimit: 1073741824,
      memoryPercent: 25,
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    deployedBy: user.id,
  };

  return c.json({ success: true, data: service });
});

// POST /services/:id/start
serviceRoutes.post('/:id/start', async (c) => {
  const id = c.req.param('id');
  // TODO: Queue start job
  return c.json({ success: true, message: 'Start initiated' });
});

// POST /services/:id/stop
serviceRoutes.post('/:id/stop', async (c) => {
  const id = c.req.param('id');
  // TODO: Queue stop job
  return c.json({ success: true, message: 'Stop initiated' });
});

// POST /services/:id/restart
serviceRoutes.post('/:id/restart', async (c) => {
  const id = c.req.param('id');
  // TODO: Queue restart job
  return c.json({ success: true, message: 'Restart initiated' });
});

// POST /services/:id/scale
serviceRoutes.post('/:id/scale', zValidator('json', scaleSchema), async (c) => {
  const id = c.req.param('id');
  const { replicas } = c.req.valid('json');
  // TODO: Queue scale job
  return c.json({ success: true, message: `Scaling to ${replicas} replicas` });
});

// GET /services/:id/logs
serviceRoutes.get('/:id/logs', async (c) => {
  const id = c.req.param('id');
  const tail = parseInt(c.req.query('tail') || '100');
  
  // TODO: Fetch logs from KV/DB
  return c.json({
    success: true,
    data: {
      logs: [
        { timestamp: new Date().toISOString(), level: 'info', message: 'Service started', container: 'n8n' },
      ],
    },
  });
});

// GET /services/:id/metrics
serviceRoutes.get('/:id/metrics', async (c) => {
  const id = c.req.param('id');
  const range = c.req.query('range') || '1h';
  
  // TODO: Fetch metrics
  return c.json({
    success: true,
    data: {
      cpu: [],
      memory: [],
      network: { rx: [], tx: [] },
    },
  });
});