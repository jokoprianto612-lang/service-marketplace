"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogRoutes = catalogRoutes;
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const searchSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    maturity: zod_1.z.enum(['alpha', 'beta', 'stable']).optional(),
    pricing: zod_1.z.enum(['free', 'freemium', 'paid']).optional(),
    tags: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
const syncSchema = zod_1.z.object({
    repoUrl: zod_1.z.string().url().optional(),
    branch: zod_1.z.string().optional(),
    token: zod_1.z.string().optional(),
});
async function catalogRoutes(app) {
    const prisma = app.prisma;
    // GET /catalog - List services with filters
    app.get('/', {
        preHandler: auth_1.optionalAuth,
        schema: { querystring: searchSchema },
    }, async (request, reply) => {
        const { q, category, maturity, pricing, tags, page, limit } = request.query;
        const where = { isActive: true };
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { tags: { hasSome: q.split(' ').filter(Boolean) } },
            ];
        }
        if (category)
            where.category = category.toUpperCase();
        if (maturity)
            where.maturity = maturity.toUpperCase();
        if (pricing)
            where.pricing = pricing.toUpperCase();
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
    app.get('/categories', { preHandler: auth_1.optionalAuth }, async (request, reply) => {
        const categories = await prisma.serviceDefinition.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { category: true },
        });
        const categoryIcons = {
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
        const formatted = categories.map(c => ({
            id: c.category.toLowerCase(),
            name: c.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            icon: categoryIcons[c.category] || '📦',
            count: c._count.category,
        }));
        return reply.send({ success: true, data: formatted });
    });
    // GET /catalog/:id - Get service detail
    app.get('/:id', { preHandler: auth_1.optionalAuth }, async (request, reply) => {
        const { id } = request.params;
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
        preHandler: [auth_1.authenticate, (0, auth_2.requireRole)(['ADMIN', 'OWNER'])],
        schema: { body: syncSchema },
    }, async (request, reply) => {
        const { repoUrl, branch, token } = request.body;
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
        preHandler: [auth_1.authenticate, (0, auth_2.requireRole)(['ADMIN', 'OWNER'])],
    }, async (request, reply) => {
        // TODO: Implement with proper validation
        return reply.status(501).send({
            success: false,
            error: { code: 'NOT_IMPLEMENTED', message: 'Create service not implemented yet', statusCode: 501 },
        });
    });
    // PUT /catalog/:id - Update service definition (admin only)
    app.put('/:id', {
        preHandler: [auth_1.authenticate, (0, auth_2.requireRole)(['ADMIN', 'OWNER'])],
    }, async (request, reply) => {
        return reply.status(501).send({
            success: false,
            error: { code: 'NOT_IMPLEMENTED', message: 'Update service not implemented yet', statusCode: 501 },
        });
    });
    // DELETE /catalog/:id - Delete service definition (admin only)
    app.delete('/:id', {
        preHandler: [auth_1.authenticate, (0, auth_2.requireRole)(['ADMIN', 'OWNER'])],
    }, async (request, reply) => {
        return reply.status(501).send({
            success: false,
            error: { code: 'NOT_IMPLEMENTED', message: 'Delete service not implemented yet', statusCode: 501 },
        });
    });
}
