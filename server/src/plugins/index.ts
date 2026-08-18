// ─────────────────────────────────────────────
// Fastify Plugins Registration
// ─────────────────────────────────────────────
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { config } from '../config';

// Parse a comma-separated allowlist string into an array of origins.
function parseAllowlist(raw: string): string[] {
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export async function registerPlugins(app: FastifyInstance) {
  // Security headers (strict in production)
  await app.register(helmet, {
    contentSecurityPolicy: config.NODE_ENV === 'production'
      ? {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", config.APP_URL, config.FRONTEND_URL],
          frameAncestors: ["'none'"],
        }
      : false,
    strictTransportSecurity: config.NODE_ENV === 'production'
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });

  // CORS — strict allowlist
  const allowlist = parseAllowlist(config.FRONTEND_URL);
  if (config.NODE_ENV === 'production' && allowlist.length === 0) {
    throw new Error('FRONTEND_URL must be set as a comma-separated allowlist in production');
  }
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow same-origin / no-origin (curl, server-to-server).
      if (!origin) return cb(null, true);
      if (allowlist.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Sensible defaults
  await app.register(sensible);

  // Rate limiting — global ceiling
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
  });

  // JWT
  await app.register(jwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRES_IN },
    verify: { maxAge: config.JWT_EXPIRES_IN },
  });

  // Multipart (file uploads) — bounded
  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });

  // Swagger/OpenAPI — disabled in production
  if (config.NODE_ENV !== 'production') {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Service Marketplace API',
          description: 'API for managing self-hosted services',
          version: '1.0.0',
        },
        servers: [
          { url: `${config.APP_URL}/api/v1`, description: 'Production' },
          { url: `http://localhost:${config.PORT}/api/v1`, description: 'Development' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });

    await app.register(swaggerUI, {
      routePrefix: '/docs',
      uiConfig: { docExpansion: 'list', deepLinking: true },
    });
  }
}
