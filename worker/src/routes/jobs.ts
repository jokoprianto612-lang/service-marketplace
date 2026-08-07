// ─────────────────────────────────────────────
// Jobs Routes (Background job status)
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import type { Env } from '../types';

export const jobRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

jobRoutes.use('*', requireAuth);

// GET /jobs - List jobs for user's services
jobRoutes.get('/', async (c) => {
  const user = c.get('user');
  
  // TODO: Fetch from KV/D1
  return c.json({
    success: true,
    data: [
      {
        id: 'job_1',
        instanceId: 'svc_1',
        type: 'deploy',
        status: 'completed',
        progress: 100,
        startedAt: '2026-01-15T10:00:00Z',
        completedAt: '2026-01-15T10:02:00Z',
      },
      {
        id: 'job_2',
        instanceId: 'svc_1',
        type: 'backup',
        status: 'running',
        progress: 45,
        startedAt: '2026-01-16T02:00:00Z',
      },
    ],
  });
});

// GET /jobs/:id
jobRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // TODO: Fetch from KV
  return c.json({
    success: true,
    data: {
      id,
      instanceId: 'svc_1',
      type: 'deploy',
      status: 'completed',
      progress: 100,
      logs: [
        { timestamp: '2026-01-15T10:00:00Z', level: 'info', message: 'Starting deployment' },
        { timestamp: '2026-01-15T10:00:30Z', level: 'info', message: 'Pulling Docker images' },
        { timestamp: '2026-01-15T10:01:00Z', level: 'info', message: 'Starting containers' },
        { timestamp: '2026-01-15T10:01:30Z', level: 'info', message: 'Running health checks' },
        { timestamp: '2026-01-15T10:02:00Z', level: 'info', message: 'Deployment completed' },
      ],
      startedAt: '2026-01-15T10:00:00Z',
      completedAt: '2026-01-15T10:02:00Z',
    },
  });
});

// GET /jobs/:id/logs - Stream logs (SSE)
jobRoutes.get('/:id/logs', async (c) => {
  const id = c.req.param('id');
  
  // Return SSE stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial logs
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', jobId: id })}\n\n`));
      
      // Simulate log streaming
      const logs = [
        { timestamp: new Date().toISOString(), level: 'info', message: 'Container started' },
        { timestamp: new Date().toISOString(), level: 'info', message: 'Application listening on port 5678' },
      ];
      
      logs.forEach(log => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
      });
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});