// ─────────────────────────────────────────────
// Catalog Routes
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/auth';

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  maturity: z.enum(['alpha', 'beta', 'stable']).optional(),
  pricing: z.enum(['free', 'freemium', 'paid']).optional(),
  tags: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const syncSchema = z.object({
  repoUrl: z.string().url().optional(),
  branch: z.string().optional(),
  token: z.string().optional(),
});

export async function catalogRoutes(app: FastifyInstance) {
  const prisma = app.prisma as PrismaClient;

  // GET /catalog - List services with filters
  app.get('/', {
    preHandler: optionalAuth,
    schema: { querystring: searchSchema },
  }, async (request, reply) => {
    const { q, category, maturity, pricing, tags, page, limit } = request.query as z.infer<typeof searchSchema>;

    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: q.split(' ').filter(Boolean) } },
      ];
    }

    if (category) where.category = category.toUpperCase();
    if (maturity) where.maturity = maturity.toUpperCase();
    if (pricing) where.pricing = pricing.toUpperCase();
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      where.tags = { hasSome: tagList };
    }

    const [services, total] = await Promise.all([
      prisma.serviceDefinition.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          icon: true,
          version: true,
          maturity: true,
          pricing: true,
          tags: true,
          stars: true,
          createdAt: true,
        },
      }),
      prisma.serviceDefinition.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: services,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // GET /catalog/categories - List categories with counts
  app.get('/categories', { preHandler: optionalAuth }, async (request, reply) => {
    const categories = await prisma.serviceDefinition.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });

    const categoryIcons: Record<string, string> = {
      AUTOMATION: '⚡',
      AI_ML: '🤖',
      DATABASES: '🗄️',
      MONITORING: '📊',
      STORAGE: '💾',
      NETWORKING: '🌐',
      SECURITY: '🔒',
      IDENTITY: '👤',
      DEVELOPER_TOOLS: '🛠️',
      CI_CD: '🔄',
      SEARCH: '🔍',
      MESSAGING: '💬',
      OTHER: '📦',
    };

    const formatted = categories.map((c: { category: string; _count: { category: number } }) => ({
      id: c.category.toLowerCase(),
      name: c.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      icon: categoryIcons[c.category] || '📦',
      count: c._count.category,
    }));

    return reply.send({ success: true, data: formatted });
  });

  // GET /catalog/:id - Get service detail
  app.get('/:id', { preHandler: optionalAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const service = await prisma.serviceDefinition.findUnique({
      where: { slug: id },
    });

    if (!service) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: `Service ${id} not found`, statusCode: 404 },
      });
    }

    return reply.send({ success: true, data: service });
  });

  // POST /catalog/sync - Sync catalog from Git (admin only)
  app.post('/sync', {
    preHandler: [authenticate, requireRole(['ADMIN', 'OWNER'])],
    schema: { body: syncSchema },
  }, async (request, reply) => {
    const { repoUrl, branch, token } = request.body as z.infer<typeof syncSchema>;

    // TODO: Implement Git sync
    // For now, return mock response
    return reply.send({
      success: true,
      message: 'Catalog sync initiated',
      data: { synced: 0, updated: 0, errors: [] },
    });
  });

  // POST /catalog - Create service definition (admin only)
  app.post('/', {
    preHandler: [authenticate, requireRole(['ADMIN', 'OWNER'])],
  }, async (request, reply) => {
    // TODO: Implement with proper validation
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create service not implemented yet', statusCode: 501 },
    });
  });

  // PUT /catalog/:id - Update service definition (admin only)
  app.put('/:id', {
    preHandler: [authenticate, requireRole(['ADMIN', 'OWNER'])],
  }, async (request, reply) => {
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Update service not implemented yet', statusCode: 501 },
    });
  });

  // DELETE /catalog/:id - Delete service definition (admin only)
  app.delete('/:id', {
    preHandler: [authenticate, requireRole(['ADMIN', 'OWNER'])],
  }, async (request, reply) => {
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Delete service not implemented yet', statusCode: 501 },
    });
  });
}