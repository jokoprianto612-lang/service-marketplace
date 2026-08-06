// ─────────────────────────────────────────────
// Audit Log Routes
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthUser } from '../middleware/auth';
import { requireRole } from '../middleware/auth';

const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  action: z.string().optional(),
  resourceType: z.string().optional(),
  resourceId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function auditRoutes(app: FastifyInstance) {
  const prisma = app.prisma as PrismaClient;

  // All routes require auth
  app.addHook('preHandler', authenticate);

  // GET /audit - List audit logs (admin/owner only)
  app.get('/', { preHandler: requireRole(['OWNER', 'ADMIN']), schema: { querystring: listSchema } }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { page, limit, action, resourceType, resourceId, userId, startDate, endDate } = request.query as z.infer<typeof listSchema>;

    const where: any = { projectId: user.projectId! };
    if (action) where.action = action;
    if (resourceType) where.resourceType = resourceType;
    if (resourceId) where.resourceId = resourceId;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
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
  app.get('/:id', { preHandler: requireRole(['OWNER', 'ADMIN']) }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { id } = request.params as { id: string };

    const log = await prisma.auditLog.findFirst({
      where: { id, projectId: user.projectId! },
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
  app.get('/stats/summary', { preHandler: requireRole(['OWNER', 'ADMIN']) }, async (request, reply) => {
    const user = request.user as AuthUser;

    const [total, byAction, byResource, recent] = await Promise.all([
      prisma.auditLog.count({ where: { projectId: user.projectId! } }),
      prisma.auditLog.groupBy({ by: ['action'], where: { projectId: user.projectId! }, _count: true }),
      prisma.auditLog.groupBy({ by: ['resourceType'], where: { projectId: user.projectId! }, _count: true }),
      prisma.auditLog.findMany({
        where: { projectId: user.projectId! },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
    ]);

    return reply.send({
      success: true,
      data: {
        total,
        byAction: byAction.map((a: { action: string; _count: number }) => ({ action: a.action, count: a._count })),
        byResource: byResource.map((r: { resourceType: string; _count: number }) => ({ resourceType: r.resourceType, count: r._count })),
        recent,
      },
    });
  });
}