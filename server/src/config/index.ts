// ─────────────────────────────────────────────
// Server Configuration
// ─────────────────────────────────────────────
import { z } from 'zod';

const PLACEHOLDER_PREFIXES = ['changeme', 'change_me', 'your-secret', 'example', 'placeholder'];

function isPlaceholder(s: string): boolean {
  const lower = s.toLowerCase();
  return PLACEHOLDER_PREFIXES.some(p => lower.startsWith(p));
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Auth — strong secret required, no placeholder allowed
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .refine((v) => !isPlaceholder(v), { message: 'JWT_SECRET still has a placeholder value — replace it' }),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string()
    .min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters')
    .refine((v) => !isPlaceholder(v), { message: 'REFRESH_TOKEN_SECRET still has a placeholder value — replace it' }),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // OAuth
  AUTH_GITHUB_CLIENT_ID: z.string().optional(),
  AUTH_GITHUB_CLIENT_SECRET: z.string().optional(),
  AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
  AUTH_OIDC_ISSUER: z.string().url().optional(),
  AUTH_OIDC_CLIENT_ID: z.string().optional(),
  AUTH_OIDC_CLIENT_SECRET: z.string().optional(),

  // Docker
  DOCKER_HOST: z.string().default('unix:///var/run/docker.sock'),
  DOCKER_TLS_VERIFY: z.coerce.boolean().default(false),

  // Catalog
  CATALOG_PATH: z.string().default('/app/catalog'),
  CATALOG_GIT_REPO: z.string().url().optional(),
  CATALOG_GIT_BRANCH: z.string().regex(/^[a-zA-Z0-9._/-]+$/).default('main'),
  CATALOG_GIT_TOKEN: z.string().optional(),

  // Monitoring
  PROMETHEUS_URL: z.string().url().optional(),
  GRAFANA_URL: z.string().url().optional(),

  // App URLs — must be set explicitly, no placeholder allowed in prod
  APP_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),

  // Feature flags
  ENABLE_KUBERNETES: z.coerce.boolean().default(false),
  ENABLE_MULTI_NODE: z.coerce.boolean().default(false),
  ENABLE_GITOPS: z.coerce.boolean().default(true),
  ENABLE_MARKETPLACE_RATINGS: z.coerce.boolean().default(false),
});

export type Config = z.infer<typeof envSchema>;

let configCache: Config | null = null;

export function getConfig(): Config {
  if (configCache) return configCache;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  // Extra hard guard: in production, FRONTEND_URL must not be a localhost.
  if (result.data.NODE_ENV === 'production') {
    if (result.data.FRONTEND_URL.includes('localhost') || result.data.FRONTEND_URL.includes('127.0.0.1')) {
      console.error('❌ FRONTEND_URL cannot be localhost in production');
      process.exit(1);
    }
    if (result.data.APP_URL.includes('localhost') || result.data.APP_URL.includes('127.0.0.1')) {
      console.error('❌ APP_URL cannot be localhost in production');
      process.exit(1);
    }
  }

  configCache = result.data;
  return configCache;
}

export const config = getConfig();
