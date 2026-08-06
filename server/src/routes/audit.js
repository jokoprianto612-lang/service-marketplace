"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRoutes = auditRoutes;
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const listSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(50),
    action: zod_1.z.string().optional(),
    resourceType: zod_1.z.string().optional(),
    resourceId: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
async function auditRoutes(app) {
    const prisma = app.prisma;
    // All routes require auth
    app.addHook('preHandler', auth_1.authenticate);
    // GET /audit - List audit logs (admin/owner only)
    app.get('/', { preHandler: (0, auth_2.requireRole)(['OWNER', 'ADMIN']), schema: { querystring: listSchema } }, async (request, reply) => {
        const user = request.user;
        const { page, limit, action, resourceType, resourceId, userId, startDate, endDate } = request.query;
        const where = { projectId: user.projectId };
        if (action)
            where.action = action;
        if (resourceType)
            where.resourceType = resourceType;
        if (resourceId)
            where.resourceId = resourceId;
        if (userId)
            where.userId = userId;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate)
                where.timestamp.gte = new Date(startDate);
            if (endDate)
                where.timestamp.lte = new Date(endDate);
        }
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: { user: { select: { id: true, email: true, name: true } } },
                orderBy: { timestamp: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.auditLog.count({ where }),
        ]);
        return reply.send({
            success: true,
            data: logs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    });
    // GET /audit/:id - Get audit log detail
    app.get('/:id', { preHandler: (0, auth_2.requireRole)(['OWNER', 'ADMIN']) }, async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const log = await prisma.auditLog.findFirst({
            where: { id, projectId: user.projectId },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
        if (!log) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Audit log not found', statusCode: 404 },
            });
        }
        return reply.send({ success: true, data: log });
    });
    // GET /audit/stats/summary - Get audit stats
    app.get('/stats/summary', { preHandler: (0, auth_2.requireRole)(['OWNER', 'ADMIN']) }, async (request, reply) => {
        const user = request.user;
        const [total, byAction, byResource, recent] = await Promise.all([
            prisma.auditLog.count({ where: { projectId: user.projectId } }),
            prisma.auditLog.groupBy({ by: ['action'], where: { projectId: user.projectId }, _count: true }),
            prisma.auditLog.groupBy({ by: ['resourceType'], where: { projectId: user.projectId }, _count: true }),
            prisma.auditLog.findMany({
                where: { projectId: user.projectId },
                orderBy: { timestamp: 'desc' },
                take: 10,
                include: { user: { select: { id: true, email: true, name: true } } },
            }),
        ]);
        return reply.send({
            success: true,
            data: {
                total,
                byAction: byAction.map(a => ({ action: a.action, count: a._count })),
                byResource: byResource.map(r => ({ resourceType: r.resourceType, count: r._count })),
                recent,
            },
        });
    });
}
