// ─────────────────────────────────────────────
// Server Configuration
// ─────────────────────────────────────────────
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
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
  CATALOG_GIT_BRANCH: z.string().default('main'),
  CATALOG_GIT_TOKEN: z.string().optional(),

  // Monitoring
  PROMETHEUS_URL: z.string().url().optional(),
  GRAFANA_URL: z.string().url().optional(),

  // App URLs
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
  
  configCache = result.data;
  return configCache;
}

export const config = getConfig();