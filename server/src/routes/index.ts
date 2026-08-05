// ─────────────────────────────────────────────
// API Routes Registration
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { catalogRoutes } from './catalog';
import { serviceRoutes } from './services';
import { projectRoutes } from './projects';
import { deploymentRoutes } from './deployments';
import { backupRoutes } from './backups';
import { auditRoutes } from './audit';
import { healthRoutes } from './health';

export async function registerRoutes(app: FastifyInstance) {
  // API v1 prefix
  await app.register(async function (api) {
    api.prefix('/api/v1');

    // Public routes
    await api.register(authRoutes, { prefix: '/auth' });
    await api.register(catalogRoutes, { prefix: '/catalog' });
    await api.register(healthRoutes, { prefix: '/health' });

    // Protected routes (require auth)
    await api.register(async function (protectedApi) {
      protectedApi.addHook('onRequest', app.authenticate);
      
      await protectedApi.register(projectRoutes, { prefix: '/projects' });
      await protectedApi.register(serviceRoutes, { prefix: '/services' });
      await protectedApi.register(deploymentRoutes, { prefix: '/deployments' });
      await protectedApi.register(backupRoutes, { prefix: '/backups' });
      await protectedApi.register(auditRoutes, { prefix: '/audit' });
    });
  });
}