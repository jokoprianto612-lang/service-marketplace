// ─────────────────────────────────────────────
// Server Entry Point - Service Marketplace API
// ─────────────────────────────────────────────
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { config } from './config';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';
import { setupSocketIO } from './socket';
import { startDeploymentWorker } from './services/job-queue';

const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function main() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport: config.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' }
      } : undefined
    },
    ajv: { customOptions: { removeAdditional: 'all', coerceTypes: 'array' } }
  });

  // Decorate Prisma client
  app.decorate('prisma', prisma);

  // Register plugins (cors, helmet, jwt, swagger, etc.)
  await registerPlugins(app);

  // Register API routes
  await registerRoutes(app);

  // Setup Socket.IO for real-time features
  setupSocketIO(app);

  // Start background job worker
  startDeploymentWorker(app);

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Metrics endpoint (Prometheus)
  app.get('/metrics', async (request, reply) => {
    // TODO: Implement Prometheus metrics
    reply.header('Content-Type', 'text/plain');
    return '# Metrics not implemented yet\n';
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.validation,
          statusCode: 400
        }
      });
    }

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      success: false,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        statusCode
      }
    });
  });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: 404
      }
    });
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down gracefully...`);
    
    // Close Prisma connection
    await prisma.$disconnect();
    
    // Close Fastify
    await app.close();
    
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 Server running on http://0.0.0.0:${config.PORT}`);
    app.log.info(`📚 API Docs: http://0.0.0.0:${config.PORT}/docs`);
    app.log.info(`🔌 WebSocket: ws://0.0.0.0:${config.PORT}/ws`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();