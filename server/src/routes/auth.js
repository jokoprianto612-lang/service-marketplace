"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const tokens_1 = require("../services/tokens");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(2).max(100),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
async function authRoutes(app) {
    const prisma = app.prisma;
    // POST /auth/login - Email/password login
    app.post('/login', {
        schema: { body: loginSchema },
    }, async (request, reply) => {
        const { email, password } = request.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return reply.status(401).send({
                success: false,
                error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', statusCode: 401 },
            });
        }
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid) {
            return reply.status(401).send({
                success: false,
                error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', statusCode: 401 },
            });
        }
        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Get user's first project (or create default)
        let project = await prisma.project.findFirst({
            where: { ownerId: user.id },
        });
        if (!project) {
            project = await prisma.project.create({
                data: {
                    name: 'Default Project',
                    slug: `project-${user.id.slice(0, 8)}`,
                    ownerId: user.id,
                },
            });
        }
        const authUser = {
            id: user.id,
            email: user.email,
            roles: user.roles,
            projectId: project.id,
        };
        const { accessToken, refreshToken } = (0, tokens_1.generateTokens)(app, authUser);
        // Store refresh token hash
        const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshTokenHash,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });
        return reply.send({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    roles: user.roles,
                },
                project: { id: project.id, name: project.name, slug: project.slug },
                accessToken,
                refreshToken,
            },
        });
    });
    // POST /auth/register - Register new user
    app.post('/register', {
        schema: { body: registerSchema },
    }, async (request, reply) => {
        const { email, password, name } = request.body;
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return reply.status(409).send({
                success: false,
                error: { code: 'EMAIL_EXISTS', message: 'Email already registered', statusCode: 409 },
            });
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        // Create user (first user becomes OWNER)
        const userCount = await prisma.user.count();
        const roles = userCount === 0 ? ['OWNER'] : ['VIEWER'];
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                roles,
                emailVerified: new Date(),
            },
        });
        // Create default project
        const project = await prisma.project.create({
            data: {
                name: 'My Project',
                slug: `project-${user.id.slice(0, 8)}`,
                ownerId: user.id,
            },
        });
        // Create project membership
        await prisma.projectMember.create({
            data: {
                userId: user.id,
                projectId: project.id,
                role: 'OWNER',
            },
        });
        // Create default quotas
        await prisma.projectQuotas.create({
            data: { projectId: project.id },
        });
        const authUser = {
            id: user.id,
            email: user.email,
            roles: user.roles,
            projectId: project.id,
        };
        const { accessToken, refreshToken } = (0, tokens_1.generateTokens)(app, authUser);
        const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshTokenHash,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        return reply.status(201).send({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    roles: user.roles,
                },
                project: { id: project.id, name: project.name, slug: project.slug },
                accessToken,
                refreshToken,
            },
        });
    });
    // POST /auth/refresh - Refresh access token
    app.post('/refresh', {
        schema: { body: refreshSchema },
    }, async (request, reply) => {
        const { refreshToken } = request.body;
        try {
            const decoded = app.jwt.verify(refreshToken);
            if (decoded.type !== 'refresh') {
                return reply.status(401).send({
                    success: false,
                    error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token', statusCode: 401 },
                });
            }
            // Check if session exists and is valid
            const sessions = await prisma.session.findMany({
                where: { userId: decoded.sub, expiresAt: { gt: new Date() } },
            });
            let validSession = false;
            for (const session of sessions) {
                const match = await bcryptjs_1.default.compare(refreshToken, session.token);
                if (match) {
                    validSession = true;
                    break;
                }
            }
            if (!validSession) {
                return reply.status(401).send({
                    success: false,
                    error: { code: 'INVALID_TOKEN', message: 'Refresh token revoked or expired', statusCode: 401 },
                });
            }
            // Get user
            const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
            if (!user) {
                return reply.status(401).send({
                    success: false,
                    error: { code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 401 },
                });
            }
            // Get user's project
            const project = await prisma.project.findFirst({
                where: { ownerId: user.id },
            });
            const authUser = {
                id: user.id,
                email: user.email,
                roles: user.roles,
                projectId: project?.id,
            };
            const { accessToken, refreshToken: newRefreshToken } = (0, tokens_1.generateTokens)(app, authUser);
            // Rotate refresh token
            const newRefreshTokenHash = await bcryptjs_1.default.hash(newRefreshToken, 10);
            await prisma.session.deleteMany({ where: { userId: user.id, token: { in: sessions.map(s => s.token) } } });
            await prisma.session.create({
                data: {
                    userId: user.id,
                    token: newRefreshTokenHash,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
            return reply.send({
                success: true,
                data: { accessToken, refreshToken: newRefreshToken },
            });
        }
        catch (err) {
            return reply.status(401).send({
                success: false,
                error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token', statusCode: 401 },
            });
        }
    });
    // POST /auth/logout - Revoke refresh token
    app.post('/logout', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const { refreshToken } = request.body;
        if (refreshToken) {
            const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
            await prisma.session.deleteMany({ where: { userId: request.user.id, token: refreshTokenHash } });
        }
        return reply.send({ success: true, message: 'Logged out successfully' });
    });
    // GET /auth/me - Get current user
    app.get('/me', { preHandler: auth_1.authenticate }, async (request, reply) => {
        const user = await prisma.user.findUnique({
            where: { id: request.user.id },
            select: { id: true, email: true, name: true, avatar: true, roles: true, createdAt: true },
        });
        if (!user) {
            return reply.status(404).send({
                success: false,
                error: { code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 404 },
            });
        }
        const project = await prisma.project.findFirst({
            where: { ownerId: user.id },
            select: { id: true, name: true, slug: true },
        });
        return reply.send({
            success: true,
            data: { user, project },
        });
    });
    // OAuth routes (placeholder - implement with specific providers)
    app.get('/github', async (request, reply) => {
        // Redirect to GitHub OAuth
        return reply.redirect('https://github.com/login/oauth/authorize?client_id=...');
    });
    app.get('/github/callback', async (request, reply) => {
        // Handle GitHub callback
        return reply.send({ success: true, message: 'GitHub OAuth not implemented yet' });
    });
    app.get('/google', async (request, reply) => {
        return reply.redirect('https://accounts.google.com/o/oauth2/v2/auth?client_id=...');
    });
    app.get('/google/callback', async (request, reply) => {
        return reply.send({ success: true, message: 'Google OAuth not implemented yet' });
    });
}
