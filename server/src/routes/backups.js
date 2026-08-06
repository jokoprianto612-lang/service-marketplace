"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupRoutes = backupRoutes;
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const listSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    status: zod_1.z.string().optional(),
    instanceId: zod_1.z.string().optional(),
});
const createBackupSchema = zod_1.z.object({
    instanceId: zod_1.z.string(),
    type: zod_1.z.enum(['FULL', 'INCREMENTAL', 'CONFIG']).default('FULL'),
});
async function backupRoutes(app) {
    const prisma = app.prisma;
    app.addHook('preHandler', auth_1.authenticate);
    // GET /backups - List backups
    app.get('/', { schema: { querystring: listSchema } }, async (request, reply) => {
        const user = request.user;
        const { page, limit, status, instanceId } = request.query;
        const where = { instance: { projectId: user.projectId } };
        if (status)
            where.status = status.toUpperCase();
        if (instanceId)
            where.instanceId = instanceId;
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
        const user = request.user;
        const body = request.body;
        const instance = await prisma.serviceInstance.findFirst({
            where: { id: body.instanceId, projectId: user.projectId },
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
                projectId: user.projectId,
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
        const user = request.user;
        const { id } = request.params;
        const backup = await prisma.backupJob.findFirst({
            where: { id, instance: { projectId: user.projectId } },
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
        const user = request.user;
        const { id } = request.params;
        const backup = await prisma.backupJob.findFirst({
            where: { id, instance: { projectId: user.projectId } },
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
                projectId: user.projectId,
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
        const user = request.user;
        const { id } = request.params;
        const backup = await prisma.backupJob.findFirst({
            where: { id, instance: { projectId: user.projectId } },
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
