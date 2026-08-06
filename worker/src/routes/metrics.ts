// ─────────────────────────────────────────────
// Metrics Routes
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

export const metricsRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>();

metricsRoutes.use('*', requireAuth);

// GET /metrics/system - System-wide metrics
metricsRoutes.get('/system', async (c) => {
  // TODO: Fetch from Prometheus/D1
  return c.json({
    success: true,
    data: {
      cpu: { current: 34, history: [] },
      memory: { current: 68, total: 16384, used: 11141, history: [] },
      disk: { current: 45, total: 500, used: 225, history: [] },
      network: { rx: 1024000, tx: 512000, history: { rx: [], tx: [] } },
      services: {
        total: 12,
        running: 10,
        stopped: 2,
        error: 0,
      },
    },
  });
});

// GET /metrics/service/:id - Service-specific metrics
metricsRoutes.get('/service/:id', async (c) => {
  const id = c.req.param('id');
  const range = c.req.query('range') || '1h';
  
  // TODO: Fetch from Prometheus
  return c.json({
    success: true,
    data: {
      instanceId: id,
      cpu: [],
      memory: [],
      network: { rx: [], tx: [] },
      disk: { read: [], write: [] },
    },
  });
});

// GET /metrics/prometheus - Prometheus scrape endpoint
metricsRoutes.get('/prometheus', async (c) => {
  // TODO: Generate Prometheus format metrics
  const metrics = `
# HELP svcmarket_services_total Total number of services
# TYPE svcmarket_services_total gauge
svcmarket_services_total{status="running"} 10
svcmarket_services_total{status="stopped"} 2
svcmarket_services_total{status="error"} 0

# HELP svcmarket_deployments_total Total deployments
# TYPE svcmarket_deployments_total counter
svcmarket_deployments_total{status="success"} 45
svcmarket_deployments_total{status="failed"} 3

# HELP svcmarket_api_requests_total API requests
# TYPE svcmarket_api_requests_total counter
svcmarket_api_requests_total{method="GET",endpoint="/catalog"} 1234
`.trim();

  return c.text(metrics, 200, {
    'Content-Type': 'text/plain; version=0.0.4',
  });
});