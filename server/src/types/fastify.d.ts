// ─────────────────────────────────────────────
// Fastify Type Extensions
// ─────────────────────────────────────────────
import 'fastify';
import { PrismaClient } from '@prisma/client';
import { AuthUser } from '../middleware/auth';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: AuthUser;
  }
}