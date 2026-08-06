// ─────────────────────────────────────────────
// Projects Routes
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth';
import { notFound } from '../utils/errors';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export const projectRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

projectRoutes.use('*', requireAuth);

// GET /projects
projectRoutes.get('/', async (c) => {
  const user = c.get('user');
  
  // TODO: Fetch from D1
  return c.json({
    success: true,
    data: [
      {
        id: 'proj_1',
        name: 'Production',
        slug: 'production',
        description: 'Production environment',
        ownerId: user.id,
        quotas: { maxServices: 50, maxCpu: 10000, maxMemory: 51200, maxDisk: 512000 },
        createdAt: '2026-01-15T10:00:00Z',
      },
    ],
  });
});

// POST /projects
projectRoutes.post('/', zValidator('json', createProjectSchema), async (c) => {
  const user = c.get('user');
  const body = c.req.valid('json');
  
  // TODO: Create in D1
  return c.json({
    success: true,
    data: {
      id: `proj_${Date.now()}`,
      ...body,
      ownerId: user.id,
      quotas: { maxServices: 50, maxCpu: 10000, maxMemory: 51200, maxDisk: 512000 },
      createdAt: new Date().toISOString(),
    },
  }, 201);
});

// GET /projects/:id
projectRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // TODO: Fetch from D1
  return c.json({
    success: true,
    data: {
      id,
      name: 'Production',
      slug: 'production',
      ownerId: 'user_1',
      quotas: { maxServices: 50, maxCpu: 10000, maxMemory: 51200, maxDisk: 512000 },
      createdAt: '2026-01-15T10:00:00Z',
    },
  });
});

// GET /projects/:id/members
projectRoutes.get('/:id/members', async (c) => {
  return c.json({ success: true, data: [] });
});

// POST /projects/:id/invite
projectRoutes.post('/:id/invite', async (c) => {
  return c.json({ success: true, message: 'Invitation sent' });
});