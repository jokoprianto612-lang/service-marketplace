// ─────────────────────────────────────────────
// Services Routes (User's deployed services)
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthUser } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { queueDeployment } from '../services/job-queue';

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

const updateSchema = z.object({
  config: z.record(z.any()).optional(),
});

export async function serviceRoutes(app: FastifyInstance) {
  const prisma = app.prisma as PrismaClient;

  // All routes require auth
  app.addHook('preHandler', authenticate);

  // GET /services - List user's services
  app.get('/', async (request, reply) => {
    const user = request.user as AuthUser;

    const services = await prisma.serviceInstance.findMany({
      where: { projectId: user.projectId! },
      include: {
        definition: { select: { name: true, icon: true, category: true } },
        deployments: { orderBy: { startedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = services.map((s: any) => ({
      id: s.id,
      definitionId: s.definitionId,
      definitionName: s.definition.name,
      definitionIcon: s.definition.icon,
      name: s.name,
      status: s.status,
      config: s.config,
      deploymentInfo: s.deploymentInfo,
      healthStatus: s.healthStatus,
      resources: s.resources,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      deployedAt: s.deployedAt,
      lastDeployment: s.deployments[0] || null,
    }));

    return reply.send({ success: true, data: formatted });
  });

  // POST /services - Deploy new service
  app.post('/', {
    schema: { body: deploySchema },
  }, async (request, reply) => {
    const user = request.user as AuthUser;
    const body = request.body as z.infer<typeof deploySchema>;

    // Verify service definition exists
    const definition = await prisma.serviceDefinition.findUnique({
      where: { id: body.definitionId },
    });

    if (!definition) {
      return reply.status(404).send({
        success: false,
        error: { code: 'DEFINITION_NOT_FOUND', message: 'Service definition not found', statusCode: 404 },
      });
    }

    // Check project quotas
    const quotas = await prisma.projectQuotas.findUnique({ where: { projectId: user.projectId! } });
    if (quotas) {
      const serviceCount = await prisma.serviceInstance.count({ where: { projectId: user.projectId! } });
      if (serviceCount >= quotas.maxServices) {
        return reply.status(403).send({
          success: false,
          error: { code: 'QUOTA_EXCEEDED', message: 'Maximum services reached for this project', statusCode: 403 },
        });
      }
    }

    // Create service instance
    const instance = await prisma.serviceInstance.create({
      data: {
        definitionId: body.definitionId,
        projectId: user.projectId!,
        name: body.name,
        status: 'DEPLOYING',
        config: body.config || definition.defaultConfig,
        deployedBy: user.id,
      },
    });

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        instanceId: instance.id,
        projectId: user.projectId!,
        userId: user.id,
        mode: body.mode.toUpperCase() as any,
        target: 'DOCKER',
        status: 'DEPLOYING',
        config: body.config || {},
      },
    });

    // Queue deployment job
    try {
      await queueDeployment(app, {
        instanceId: instance.id,
        definitionId: body.definitionId,
        projectId: user.projectId!,
        userId: user.id,
        mode: body.mode,
        config: body.config,
        deploymentId: deployment.id,
      });
    } catch (err) {
      await prisma.serviceInstance.update({
        where: { id: instance.id },
        data: { status: 'ERROR' },
      });
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: { status: 'ERROR', error: String(err) },
      });
      throw err;
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'DEPLOY',
        resourceType: 'ServiceInstance',
        resourceId: instance.id,
        metadata: { definitionId: body.definitionId, mode: body.mode },
      },
    });

    return reply.status(202).send({
      success: true,
      data: {
        instanceId: instance.id,
        deploymentId: deployment.id,
        status: 'deploying',
        estimatedDuration: 60000,
      },
    });
  });

  // GET /services/:id - Get service detail
  app.get('/:id', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
      include: {
        definition: true,
        deployments: { orderBy: { startedAt: 'desc' }, take: 5 },
        backups: { orderBy: { startedAt: 'desc' }, take: 5 },
      },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    return reply.send({ success: true, data: service });
  });

  // POST /services/:id/start
  app.post('/:id/start', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    // TODO: Queue start job via Docker
    await prisma.serviceInstance.update({
      where: { id },
      data: { status: 'RUNNING', deployedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'START',
        resourceType: 'ServiceInstance',
        resourceId: id,
      },
    });

    return reply.send({ success: true, message: 'Start initiated' });
  });

  // POST /services/:id/stop
  app.post('/:id/stop', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    await prisma.serviceInstance.update({
      where: { id },
      data: { status: 'STOPPED', stoppedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'STOP',
        resourceType: 'ServiceInstance',
        resourceId: id,
      },
    });

    return reply.send({ success: true, message: 'Stop initiated' });
  });

  // POST /services/:id/restart
  app.post('/:id/restart', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    await prisma.serviceInstance.update({
      where: { id },
      data: { status: 'DEPLOYING' },
    });

    // TODO: Queue restart job

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'RESTART',
        resourceType: 'ServiceInstance',
        resourceId: id,
      },
    });

    return reply.send({ success: true, message: 'Restart initiated' });
  });

  // POST /services/:id/scale
  app.post('/:id/scale', { schema: { body: scaleSchema } }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };
    const { replicas } = request.body as z.infer<typeof scaleSchema>;

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    // TODO: Queue scale job via Docker

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'SCALE',
        resourceType: 'ServiceInstance',
        resourceId: id,
        metadata: { replicas },
      },
    });

    return reply.send({ success: true, message: `Scaling to ${replicas} replicas` });
  });

  // PUT /services/:id - Update service config
  app.put('/:id', { schema: { body: updateSchema } }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };
    const { config } = request.body as z.infer<typeof updateSchema>;

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    const updated = await prisma.serviceInstance.update({
      where: { id },
      data: { config: { ...service.config, ...config } },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'UPDATE',
        resourceType: 'ServiceInstance',
        resourceId: id,
        metadata: { config },
      },
    });

    return reply.send({ success: true, data: updated });
  });

  // DELETE /services/:id - Delete service
  app.delete('/:id', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    await prisma.serviceInstance.update({
      where: { id },
      data: { status: 'DELETING' },
    });

    // TODO: Queue deletion job

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'DELETE',
        resourceType: 'ServiceInstance',
        resourceId: id,
      },
    });

    return reply.send({ success: true, message: 'Deletion initiated' });
  });

  // GET /services/:id/logs
  app.get('/:id/logs', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };
    const tail = parseInt((request.query as any).tail || '100');
    const container = (request.query as any).container;

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    const where: any = { instanceId: id };
    if (container) where.containerName = container;

    const logs = await prisma.serviceLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: tail,
    });

    return reply.send({
      success: true,
      data: { logs: logs.reverse() },
    });
  });

  // GET /services/:id/metrics
  app.get('/:id/metrics', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };
    const range = (request.query as any).range || '1h';

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    // TODO: Fetch from Prometheus
    return reply.send({
      success: true,
      data: {
        cpu: [],
        memory: [],
        network: { rx: [], tx: [] },
      },
    });
  });

  // POST /services/:id/backup - Create backup
  app.post('/:id/backup', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const service = await prisma.serviceInstance.findFirst({
      where: { id, projectId: user.projectId! },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found', statusCode: 404 },
      });
    }

    const backup = await prisma.backupJob.create({
      data: {
        instanceId: id,
        type: 'FULL',
        status: 'PENDING',
      },
    });

    // TODO: Queue backup job

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'BACKUP',
        resourceType: 'ServiceInstance',
        resourceId: id,
        metadata: { backupId: backup.id },
      },
    });

    return reply.status(202).send({
      success: true,
      data: { backupId: backup.id, status: 'pending' },
    });
  });
}