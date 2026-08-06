// ─────────────────────────────────────────────
// Deployments Routes
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

export const deploymentRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

deploymentRoutes.use('*', requireAuth);

// GET /deployments
deploymentRoutes.get('/', async (c) => {
  const user = c.get('user');
  
  // TODO: Fetch from D1
  return c.json({
    success: true,
    data: [
      {
        id: 'deploy_1',
        instanceId: 'svc_1',
        projectId: 'proj_1',
        userId: user.id,
        mode: 'quick',
        target: 'docker',
        status: 'completed',
        config: {},
        startedAt: '2026-01-15T10:00:00Z',
        completedAt: '2026-01-15T10:02:00Z',
        duration: 120000,
      },
    ],
  });
});

// GET /deployments/:id
deploymentRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // TODO: Fetch from D1
  return c.json({
    success: true,
    data: {
      id,
      instanceId: 'svc_1',
      status: 'completed',
      logs: 'Pulling image...\nStarting container...\nHealth check passed\n',
      startedAt: '2026-01-15T10:00:00Z',
      completedAt: '2026-01-15T10:02:00Z',
    },
  });
});

// POST /deployments/:id/cancel
deploymentRoutes.post('/:id/cancel', async (c) => {
  const id = c.req.param('id');
  
  // TODO: Cancel deployment job
  return c.json({ success: true, message: 'Deployment cancelled' });
});