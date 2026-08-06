// ─────────────────────────────────────────────
// Health Routes
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export async function healthRoutes(app: FastifyInstance) {
  // GET /health - Basic health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // GET /health/ready - Readiness check (DB connectivity)
  app.get('/health/ready', async (request, reply) => {
    const prisma = request.server.prisma as PrismaClient;
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', timestamp: new Date().toISOString() };
    } catch (err) {
      reply.status(503);
      return { status: 'not ready', timestamp: new Date().toISOString(), error: String(err) };
    }
  });

  // GET /health/live - Liveness check
  app.get('/health/live', async () => ({
    status: 'alive',
    timestamp: new Date().toISOString(),
  }));
}