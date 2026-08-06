"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.getConfig = getConfig;
// ─────────────────────────────────────────────
// Server Configuration
// ─────────────────────────────────────────────
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    LOG_LEVEL: zod_1.z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    // Database
    DATABASE_URL: zod_1.z.string().url(),
    // Redis
    REDIS_URL: zod_1.z.string().url(),
    // Auth
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(32),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('30d'),
    // OAuth
    AUTH_GITHUB_CLIENT_ID: zod_1.z.string().optional(),
    AUTH_GITHUB_CLIENT_SECRET: zod_1.z.string().optional(),
    AUTH_GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    AUTH_GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    AUTH_OIDC_ISSUER: zod_1.z.string().url().optional(),
    AUTH_OIDC_CLIENT_ID: zod_1.z.string().optional(),
    AUTH_OIDC_CLIENT_SECRET: zod_1.z.string().optional(),
    // Docker
    DOCKER_HOST: zod_1.z.string().default('unix:///var/run/docker.sock'),
    DOCKER_TLS_VERIFY: zod_1.z.coerce.boolean().default(false),
    // Catalog
    CATALOG_PATH: zod_1.z.string().default('/app/catalog'),
    CATALOG_GIT_REPO: zod_1.z.string().url().optional(),
    CATALOG_GIT_BRANCH: zod_1.z.string().default('main'),
    CATALOG_GIT_TOKEN: zod_1.z.string().optional(),
    // Monitoring
    PROMETHEUS_URL: zod_1.z.string().url().optional(),
    GRAFANA_URL: zod_1.z.string().url().optional(),
    // App URLs
    APP_URL: zod_1.z.string().url(),
    FRONTEND_URL: zod_1.z.string().url(),
    // Feature flags
    ENABLE_KUBERNETES: zod_1.z.coerce.boolean().default(false),
    ENABLE_MULTI_NODE: zod_1.z.coerce.boolean().default(false),
    ENABLE_GITOPS: zod_1.z.coerce.boolean().default(true),
    ENABLE_MARKETPLACE_RATINGS: zod_1.z.coerce.boolean().default(false),
});
let configCache = null;
function getConfig() {
    if (configCache)
        return configCache;
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        console.error(result.error.flatten().fieldErrors);
        process.exit(1);
    }
    configCache = result.data;
    return configCache;
}
exports.config = getConfig();
