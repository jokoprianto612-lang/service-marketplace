// ─────────────────────────────────────────────
// Token Service
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import { config } from '../config';
import { AuthUser } from '../middleware/auth';

export function generateTokens(fastify: FastifyInstance, user: AuthUser) {
  const accessToken = fastify.jwt.sign(
    { sub: user.id, email: user.email, roles: user.roles, projectId: user.projectId },
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  const refreshToken = fastify.jwt.sign(
    { sub: user.id, type: 'refresh' },
    { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(fastify: FastifyInstance, token: string) {
  return fastify.jwt.verify(token);
}