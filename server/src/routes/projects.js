"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = projectRoutes;
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
    description: zod_1.z.string().optional(),
});
const updateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().optional(),
    settings: zod_1.z.record(zod_1.z.any()).optional(),
});
const inviteMemberSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['ADMIN', 'DEVELOPER', 'VIEWER']),
});
const updateMemberSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'DEVELOPER', 'VIEWER']),
});
const updateQuotasSchema = zod_1.z.object({
    maxServices: zod_1.z.number().min(1).max(500).optional(),
    maxCpu: zod_1.z.number().min(100).max(100000).optional(),
    maxMemory: zod_1.z.number().min(128).max(1024000).optional(),
    maxDisk: zod_1.z.number().min(1024).max(10485760).optional(),
});
async function projectRoutes(app) {
    const prisma = app.prisma;
    // All routes require auth
    app.addHook('preHandler', auth_1.authenticate);
    // GET /projects - List user's projects
    app.get('/', async (request, reply) => {
        const user = request.user;
        const memberships = await prisma.projectMember.findMany({
            where: { userId: user.id },
            include: {
                project: {
                    include: {
                        _count: { select: { services: true, members: true } },
                        quotas: true,
                    },
                },
            },
        });
        const projects = memberships.map(m => ({
            ...m.project,
            role: m.role,
            serviceCount: m.project._count.services,
            memberCount: m.project._count.members,
        }));
        return reply.send({ success: true, data: projects });
    });
    // POST /projects - Create new project
    app.post('/', { schema: { body: createProjectSchema } }, async (request, reply) => {
        const user = request.user;
        const body = request.body;
        // Check slug uniqueness
        const existing = await prisma.project.findUnique({ where: { slug: body.slug } });
        if (existing) {
            return reply.status(409).send({
                success: false,
                error: { code: 'SLUG_EXISTS', message: 'Project slug already taken', statusCode: 409 },
            });
        }
        const project = await prisma.project.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                ownerId: user.id,
            },
        });
        // Add creator as owner
        await prisma.projectMember.create({
            data: {
                userId: user.id,
                projectId: project.id,
                role: 'OWNER',
            },
        });
        // Create default quotas
        await prisma.projectQuotas.create({ data: { projectId: project.id } });
        // Create default settings
        await prisma.projectSettings.create({ data: { projectId: project.id } });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: project.id,
                action: 'CREATE',
                resourceType: 'Project',
                resourceId: project.id,
            },
        });
        return reply.status(201).send({ success: true, data: project });
    });
    // GET /projects/:id - Get project detail
    app.get('/:id', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
            include: {
                project: {
                    include: {
                        quotas: true,
                        settings: true,
                        members: { include: { user: { select: { id: true, email: true, name: true, avatar: true } } } },
                        _count: { select: { services: true, deployments: true } },
                    },
                },
            },
        });
        if (!membership) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Project not found', statusCode: 404 },
            });
        }
        return reply.send({
            success: true,
            data: { ...membership.project, role: membership.role },
        });
    });
    // PUT /projects/:id - Update project
    app.put('/:id', { schema: { body: updateProjectSchema } }, async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const body = request.body;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership || membership.role === 'VIEWER') {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions', statusCode: 403 },
            });
        }
        const project = await prisma.project.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                settings: body.settings,
            },
        });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: id,
                action: 'UPDATE',
                resourceType: 'Project',
                resourceId: id,
                metadata: body,
            },
        });
        return reply.send({ success: true, data: project });
    });
    // DELETE /projects/:id - Delete project (owner only)
    app.delete('/:id', { preHandler: (0, auth_2.requireRole)(['OWNER']) }, async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Project not found', statusCode: 404 },
            });
        }
        if (project.ownerId !== user.id) {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Only project owner can delete', statusCode: 403 },
            });
        }
        await prisma.project.delete({ where: { id } });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: id,
                action: 'DELETE',
                resourceType: 'Project',
                resourceId: id,
            },
        });
        return reply.send({ success: true, message: 'Project deleted' });
    });
    // GET /projects/:id/members - List project members
    app.get('/:id/members', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Project not found', statusCode: 404 },
            });
        }
        const members = await prisma.projectMember.findMany({
            where: { projectId: id },
            include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
        });
        return reply.send({ success: true, data: members });
    });
    // POST /projects/:id/members - Invite member
    app.post('/:id/members', { schema: { body: inviteMemberSchema } }, async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const body = request.body;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions', statusCode: 403 },
            });
        }
        const invitee = await prisma.user.findUnique({ where: { email: body.email } });
        if (!invitee) {
            return reply.status(404).send({
                success: false,
                error: { code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 404 },
            });
        }
        const existing = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: invitee.id, projectId: id } },
        });
        if (existing) {
            return reply.status(409).send({
                success: false,
                error: { code: 'ALREADY_MEMBER', message: 'User is already a member', statusCode: 409 },
            });
        }
        const member = await prisma.projectMember.create({
            data: {
                userId: invitee.id,
                projectId: id,
                role: body.role,
            },
            include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
        });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: id,
                action: 'INVITE',
                resourceType: 'ProjectMember',
                resourceId: member.id,
                metadata: { email: body.email, role: body.role },
            },
        });
        return reply.status(201).send({ success: true, data: member });
    });
    // PUT /projects/:id/members/:memberId - Update member role
    app.put('/:id/members/:memberId', { schema: { body: updateMemberSchema } }, async (request, reply) => {
        const user = request.user;
        const { id, memberId } = request.params;
        const body = request.body;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership || membership.role !== 'OWNER') {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Only owner can change roles', statusCode: 403 },
            });
        }
        const targetMember = await prisma.projectMember.findUnique({
            where: { id: memberId },
        });
        if (!targetMember || targetMember.projectId !== id) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Member not found', statusCode: 404 },
            });
        }
        if (targetMember.role === 'OWNER') {
            return reply.status(400).send({
                success: false,
                error: { code: 'INVALID_OPERATION', message: 'Cannot change owner role', statusCode: 400 },
            });
        }
        const updated = await prisma.projectMember.update({
            where: { id: memberId },
            data: { role: body.role },
            include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
        });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: id,
                action: 'UPDATE',
                resourceType: 'ProjectMember',
                resourceId: memberId,
                metadata: { role: body.role },
            },
        });
        return reply.send({ success: true, data: updated });
    });
    // DELETE /projects/:id/members/:memberId - Remove member
    app.delete('/:id/members/:memberId', async (request, reply) => {
        const user = request.user;
        const { id, memberId } = request.params;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions', statusCode: 403 },
            });
        }
        const targetMember = await prisma.projectMember.findUnique({ where: { id: memberId } });
        if (!targetMember || targetMember.projectId !== id) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Member not found', statusCode: 404 },
            });
        }
        if (targetMember.userId === user.id && membership.role === 'OWNER') {
            return reply.status(400).send({
                success: false,
                error: { code: 'INVALID_OPERATION', message: 'Owner cannot remove themselves', statusCode: 400 },
            });
        }
        await prisma.projectMember.delete({ where: { id: memberId } });
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                projectId: id,
                action: 'REVOKE',
                resourceType: 'ProjectMember',
                resourceId: memberId,
            },
        });
        return reply.send({ success: true, message: 'Member removed' });
    });
    // GET /projects/:id/quotas - Get project quotas
    app.get('/:id/quotas', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Project not found', statusCode: 404 },
            });
        }
        const quotas = await prisma.projectQuotas.findUnique({ where: { projectId: id } });
        const usage = {
            services: await prisma.serviceInstance.count({ where: { projectId: id } }),
        };
        return reply.send({ success: true, data: { ...quotas, usage } });
    });
    // PUT /projects/:id/quotas - Update project quotas (owner only)
    app.put('/:id/quotas', { preHandler: (0, auth_2.requireRole)(['OWNER']), schema: { body: updateQuotasSchema } }, async (request, reply) => {
        const { id } = request.params;
        const body = request.body;
        const quotas = await prisma.projectQuotas.upsert({
            where: { projectId: id },
            update: body,
            create: { projectId: id, ...body },
        });
        return reply.send({ success: true, data: quotas });
    });
    // GET /projects/:id/settings - Get project settings
    app.get('/:id/settings', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership) {
            return reply.status(404).send({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Project not found', statusCode: 404 },
            });
        }
        const settings = await prisma.projectSettings.findUnique({ where: { projectId: id } });
        return reply.send({ success: true, data: settings });
    });
    // PUT /projects/:id/settings - Update project settings
    app.put('/:id/settings', async (request, reply) => {
        const user = request.user;
        const { id } = request.params;
        const body = request.body;
        const membership = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });
        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return reply.status(403).send({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions', statusCode: 403 },
            });
        }
        const settings = await prisma.projectSettings.upsert({
            where: { projectId: id },
            update: body,
            create: { projectId: id, ...body },
        });
        return reply.send({ success: true, data: settings });
    });
}
