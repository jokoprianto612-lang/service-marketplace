// ─────────────────────────────────────────────
// Backups Routes
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthUser } from '../middleware/auth';

const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  instanceId: z.string().optional(),
});

const createBackupSchema = z.object({
  instanceId: z.string(),
  type: z.enum(['FULL', 'INCREMENTAL', 'CONFIG']).default('FULL'),
});

export async function backupRoutes(app: FastifyInstance) {
  const prisma = app.prisma as PrismaClient;

  app.addHook('preHandler', authenticate);

  // GET /backups - List backups
  app.get('/', { schema: { querystring: listSchema } }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { page, limit, status, instanceId } = request.query as z.infer<typeof listSchema>;

    const where: any = { instance: { projectId: user.projectId! } };
    if (status) where.status = status.toUpperCase();
    if (instanceId) where.instanceId = instanceId;

    const [backups, total] = await Promise.all([
      prisma.backupJob.findMany({
        where,
        include: { instance: { select: { id: true, name: true } } },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.backupJob.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: backups,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });

  // POST /backups - Create backup
  app.post('/', { schema: { body: createBackupSchema } }, async (request, reply) => {
    const user = request.user as AuthUser;
    const body = request.body as z.infer<typeof createBackupSchema>;

    const instance = await prisma.serviceInstance.findFirst({
      where: { id: body.instanceId, projectId: user.projectId! },
    });

    if (!instance) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service instance not found', statusCode: 404 },
      });
    }

    const backup = await prisma.backupJob.create({
      data: {
        instanceId: body.instanceId,
        type: body.type,
        status: 'PENDING',
      },
    });

    // TODO: Queue backup job

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'BACKUP',
        resourceType: 'BackupJob',
        resourceId: backup.id,
        metadata: { instanceId: body.instanceId, type: body.type },
      },
    });

    return reply.status(202).send({
      success: true,
      data: { backupId: backup.id, status: 'pending' },
    });
  });

  // GET /backups/:id - Get backup detail
  app.get('/:id', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const backup = await prisma.backupJob.findFirst({
      where: { id, instance: { projectId: user.projectId! } },
      include: { instance: { select: { id: true, name: true, definitionId: true } } },
    });

    if (!backup) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Backup not found', statusCode: 404 },
      });
    }

    return reply.send({ success: true, data: backup });
  });

  // POST /backups/:id/restore - Restore backup
  app.post('/:id/restore', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const backup = await prisma.backupJob.findFirst({
      where: { id, instance: { projectId: user.projectId! } },
    });

    if (!backup) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Backup not found', statusCode: 404 },
      });
    }

    if (backup.status !== 'COMPLETED') {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_STATE', message: 'Can only restore completed backups', statusCode: 400 },
      });
    }

    // Create restore job (as a backup job with type CONFIG or special marker)
    const restoreJob = await prisma.backupJob.create({
      data: {
        instanceId: backup.instanceId,
        type: 'CONFIG',
        status: 'PENDING',
      },
    });

    // TODO: Queue restore job

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        projectId: user.projectId!,
        action: 'RESTORE',
        resourceType: 'BackupJob',
        resourceId: backup.id,
        metadata: { restoreJobId: restoreJob.id },
      },
    });

    return reply.status(202).send({
      success: true,
      data: { restoreJobId: restoreJob.id, status: 'pending' },
    });
  });

  // DELETE /backups/:id - Delete backup
  app.delete('/:id', async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const backup = await prisma.backupJob.findFirst({
      where: { id, instance: { projectId: user.projectId! } },
    });

    if (!backup) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Backup not found', statusCode: 404 },
      });
    }

    // TODO: Delete backup files from storage

    await prisma.backupJob.delete({ where: { id } });

    return reply.send({ success: true, message: 'Backup deleted' });
  });
}