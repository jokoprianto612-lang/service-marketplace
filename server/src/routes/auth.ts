// ─────────────────────────────────────────────
// Auth Routes
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authenticate, optionalAuth, AuthUser } from '../middleware/auth';
import { generateTokens } from '../services/tokens';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  const prisma = app.prisma as PrismaClient;

  // ─── Bot / Brute-force guard for auth endpoints ───
  // ponytail: in-memory IP store; per-account locks if throughput matters
  const authRateStore = new Map<string, { count: number; resetAt: number }>();
  const AUTH_MAX = 5; // 5 attempts per minute per IP
  const AUTH_WINDOW_MS = 60 * 1000;

  function authRateCheck(request: FastifyRequest, reply: FastifyReply): boolean {
    const ip = (request.ip || 'unknown').toString();
    const key = `auth:${ip}`;
    const now = Date.now();
    let rec = authRateStore.get(key);
    if (!rec || now > rec.resetAt) {
      rec = { count: 0, resetAt: now + AUTH_WINDOW_MS };
      authRateStore.set(key, rec);
    }
    rec.count++;
    if (rec.count > AUTH_MAX) {
      reply.status(429).send({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many auth attempts, try again later', statusCode: 429 },
      });
      return false;
    }
    return true;
  }

  // Bot detection: basic User-Agent + hidden honeypot check
  function botCheck(request: FastifyRequest, reply: FastifyReply): boolean {
    const ua = (request.headers['user-agent'] || '').toString().toLowerCase();
    const suspicious = /curl|wget|python-requests|scrapy|bot|crawler|spider|headless/i;
    if (suspicious.test(ua) && !ua.includes('chrome') && !ua.includes('firefox') && !ua.includes('safari')) {
      reply.status(403).send({
        success: false,
        error: { code: 'BOT_DETECTED', message: 'Suspicious client detected', statusCode: 403 },
      });
      return false;
    }
    const body = request.body as any;
    if (body && body._honey !== undefined) {
      reply.status(403).send({
        success: false,
        error: { code: 'BOT_HONEYPOT', message: 'Bot trap triggered', statusCode: 403 },
      });
      return false;
    }
    return true;
  }

  // POST /auth/login - Email/password login
  app.post('/login', {
    schema: { body: loginSchema },
  }, async (request, reply) => {
    if (!authRateCheck(request, reply) || !botCheck(request, reply)) return;
    const { email, password } = request.body as z.infer<typeof loginSchema>;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', statusCode: 401 },
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
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

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      projectId: project.id,
    };

    const { accessToken, refreshToken } = generateTokens(app, authUser);

    // Store refresh token hash
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
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
    if (!authRateCheck(request, reply) || !botCheck(request, reply)) return;
    const { email, password, name } = request.body as z.infer<typeof registerSchema>;

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email already registered', statusCode: 409 },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user (first user becomes OWNER)
    const userCount = await prisma.user.count();
    const roles = userCount === 0 ? ['OWNER'] : ['VIEWER'];

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        roles,
        emailVerified: null, // ponytail: require verification before deploy/OWNER actions
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

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      projectId: project.id,
    };

    const { accessToken, refreshToken } = generateTokens(app, authUser);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
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
    const { refreshToken } = request.body as z.infer<typeof refreshSchema>;

    try {
      const decoded = app.jwt.verify(refreshToken) as { sub: string; type: string };
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
        const match = await bcrypt.compare(refreshToken, session.token);
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

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        roles: user.roles,
        projectId: project?.id,
      };

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(app, authUser);

      // Rotate refresh token
      const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
      await prisma.session.deleteMany({ where: { userId: user.id, token: { in: sessions.map((s: { token: string }) => s.token) } } });
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
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token', statusCode: 401 },
      });
    }
  });

  // POST /auth/logout - Revoke refresh token
  app.post('/logout', { preHandler: authenticate }, async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken?: string };
    if (refreshToken) {
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      await prisma.session.deleteMany({ where: { userId: request.user!.id, token: refreshTokenHash } });
    }
    return reply.send({ success: true, message: 'Logged out successfully' });
  });

  // GET /auth/me - Get current user
  app.get('/me', { preHandler: authenticate }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id },
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
}/usr/bin/bash: line 7: /c/Users/asusv/AppData/Local/hermes/cache/terminal/hermes-cwd-2df5e012d7dd.txt: Device or resource busy
