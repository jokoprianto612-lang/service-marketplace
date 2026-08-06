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

export const registerRoutes = async (app: FastifyInstance): Promise<void> => {
  // Register API v1 routes with prefix
  await app.register(
    async (f: FastifyInstance): Promise<void> => {
      // Public routes
      f.register(authRoutes, { prefix: '/auth' });
      f.register(catalogRoutes, { prefix: '/catalog' });
      f.register(healthRoutes, { prefix: '/health' });

      // Protected routes (require auth)
      f.register(
        async (pf: FastifyInstance): Promise<void> => {
          pf.addHook('onRequest', async (request, reply) => {
            await f.authenticate(request, reply);
          });
          
          pf.register(projectRoutes, { prefix: '/projects' });
          pf.register(serviceRoutes, { prefix: '/services' });
          pf.register(deploymentRoutes, { prefix: '/deployments' });
          pf.register(backupRoutes, { prefix: '/backups' });
          pf.register(auditRoutes, { prefix: '/audit' });
        },
        { prefix: '/api/v1' }  // Apply prefix to all protected routes
      );
    }
  );
};