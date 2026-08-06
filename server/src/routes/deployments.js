"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploymentRoutes = deploymentRoutes;
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const listSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    status: zod_1.z.string().optional(),
    instanceId: zod_1.z.string().optional(),
});
async function deploymentRoutes(app) {
    const prisma = app.prisma;
    app.addHook('preHandler', auth_1.authenticate);
    // GET /deployments - List deployments
    app.get('/', { schema: { querystring: listSchema } }, async (request, reply) => {
        const user = request.user;
        const { page, limit, status, instanceId } = request.query;
        const where = { projectId: user.projectId };
        if (status)
            where.status = status.toUpperCase();
        if (instanceId)
            where.instanceId = instanceId;
        const [deployments, total] = await Promise.all([
            prisma.deployment.findMany({
                where,
                include: {
                    instance: { select: { id: true, name: true, definitionId: true } },
                    user: { select: { id: true, email: true, name: true } },
                },
                orderBy: { startedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.deployment.count({ where }),
        ]);
        return reply.send({
            success: true,
            data: deployments,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    });
    // GET /deployments/:id - Get deployment detail
    app.get('/:id', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const deployment = await prisma.deployment.findFirst({
            where: { id, projectId: user.projectId },
            include: {
                instance: { include: { definition: true } },
                user: { select: { id: true, email: true, name: true } },
            },
        });
        if (!deployment) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Deployment not found', statusCode: 404 },
            });
        }
        return reply.send({ success: true, data: deployment });
    });
    // GET /deployments/:id/logs - Get deployment logs
    app.get('/:id/logs', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const tail = parseInt(request.query.tail || '500');
        const deployment = await prisma.deployment.findFirst({
            where: { id, projectId: user.projectId },
        });
        if (!deployment) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Deployment not found', statusCode: 404 },
            });
        }
        // Logs are stored in deployment.logs field
        const logs = deployment.logs?.split('\n').slice(-tail) || [];
        return reply.send({ success: true, data: { logs } });
    });
    // POST /deployments/:id/retry - Retry failed deployment
    app.post('/:id/retry', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const deployment = await prisma.deployment.findFirst({
            where: { id, projectId: user.projectId },
            include: { instance: true },
        });
        if (!deployment) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Deployment not found', statusCode: 404 },
            });
        }
        if (deployment.status !== 'ERROR' && deployment.status !== 'FAILED') {
            return reply.status(400).send({
                success: false,
                error: { code: 'INVALID_STATE', message: 'Can only retry failed deployments', statusCode: 400 },
            });
        }
        // Create new deployment record
        const newDeployment = await prisma.deployment.create({
            data: {
                instanceId: deployment.instanceId,
                projectId: user.projectId,
                userId: user.id,
                mode: deployment.mode,
                target: deployment.target,
                targetId: deployment.targetId,
                status: 'DEPLOYING',
                config: deployment.config,
            },
        });
        // Update instance status
        await prisma.serviceInstance.update({
            where: { id: deployment.instanceId },
            data: { status: 'DEPLOYING' },
        });
        // TODO: Queue deployment job
        return reply.status(202).send({
            success: true,
            data: { deploymentId: newDeployment.id, status: 'deploying' },
        });
    });
    // DELETE /deployments/:id - Cancel deployment (if pending)
    app.delete('/:id', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const deployment = await prisma.deployment.findFirst({
            where: { id, projectId: user.projectId },
        });
        if (!deployment) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Deployment not found', statusCode: 404 },
            });
        }
        if (!['DEPLOYING', 'PENDING'].includes(deployment.status)) {
            return reply.status(400).send({
                success: false,
                error: { code: 'INVALID_STATE', message: 'Cannot cancel completed deployment', statusCode: 400 },
            });
        }
        await prisma.deployment.update({
            where: { id },
            data: { status: 'ERROR', error: 'Cancelled by user', completedAt: new Date() },
        });
        return reply.send({ success: true, message: 'Deployment cancelled' });
    });
}
