// ─────────────────────────────────────────────
// Shared Constants - Service Marketplace
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────

export const DEFAULT_PORT = 3000;
export const DEFAULT_WS_PORT = 3001;
export const DEFAULT_DOCKER_SOCKET = '/var/run/docker.sock';
export const DEFAULT_CATALOG_PATH = '/app/catalog';
export const DEFAULT_CATALOG_BRANCH = 'main';

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;

// ─────────────────────────────────────────────
// Timeouts (ms)
// ─────────────────────────────────────────────

export const DOCKER_API_TIMEOUT = 300000; // 5 minutes
export const DEPLOY_TIMEOUT = 600000; // 10 minutes
export const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
export const METRICS_COLLECTION_INTERVAL = 15000; // 15 seconds
export const LOG_STREAM_BUFFER_SIZE = 1000;
export const JWT_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY = '30d';
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// ─────────────────────────────────────────────
// Resource Limits
// ─────────────────────────────────────────────

export const MIN_MEMORY_MB = 128;
export const MIN_CPU_MILLICORES = 100;
export const MIN_DISK_MB = 1024;
export const DEFAULT_MEMORY_LIMIT = '512m';
export const DEFAULT_CPU_LIMIT = '0.5';

// ─────────────────────────────────────────────
// Service Categories & Metadata
// ─────────────────────────────────────────────

export const SERVICE_CATEGORIES = [
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖', color: '#8B5CF6' },
  { id: 'automation', name: 'Automation', icon: '⚡', color: '#F59E0B' },
  { id: 'databases', name: 'Databases', icon: '🗄️', color: '#3B82F6' },
  { id: 'monitoring', name: 'Monitoring', icon: '📊', color: '#10B981' },
  { id: 'storage', name: 'Storage', icon: '💾', color: '#6366F1' },
  { id: 'networking', name: 'Networking', icon: '🌐', color: '#EC4899' },
  { id: 'developer-tools', name: 'Developer Tools', icon: '🛠️', color: '#14B8A6' },
  { id: 'security', name: 'Security', icon: '🔒', color: '#EF4444' },
  { id: 'identity', name: 'Identity', icon: '👤', color: '#8B5CF6' },
  { id: 'ci-cd', name: 'CI/CD', icon: '🔄', color: '#F97316' },
  { id: 'messaging', name: 'Messaging', icon: '📨', color: '#06B6D4' },
  { id: 'search', name: 'Search', icon: '🔍', color: '#84CC16' },
] as const;

export const CATEGORY_ORDER = SERVICE_CATEGORIES.map(c => c.id);

// ─────────────────────────────────────────────
// Maturity Levels
// ─────────────────────────────────────────────

export const MATURITY_LEVELS = [
  { id: 'alpha', label: 'Alpha', color: '#EF4444', description: 'Early development, expect breaking changes' },
  { id: 'beta', label: 'Beta', color: '#F59E0B', description: 'Feature complete, testing in progress' },
  { id: 'stable', label: 'Stable', color: '#10B981', description: 'Production ready, well tested' },
] as const;

// ─────────────────────────────────────────────
// Pricing Models
// ─────────────────────────────────────────────

export const PRICING_MODELS = [
  { id: 'free', label: 'Free', color: '#10B981' },
  { id: 'freemium', label: 'Freemium', color: '#3B82F6' },
  { id: 'paid', label: 'Paid', color: '#8B5CF6' },
] as const;

// ─────────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────────

export const USER_ROLES = [
  { id: 'owner', label: 'Owner', permissions: ['*'], color: '#8B5CF6' },
  { id: 'admin', label: 'Admin', permissions: ['manage_project', 'manage_services', 'manage_members', 'view_logs', 'view_metrics'], color: '#3B82F6' },
  { id: 'developer', label: 'Developer', permissions: ['manage_services', 'view_logs', 'view_metrics'], color: '#10B981' },
  { id: 'viewer', label: 'Viewer', permissions: ['view_services', 'view_logs', 'view_metrics'], color: '#6B7280' },
] as const;

export const ROLE_HIERARCHY = ['owner', 'admin', 'developer', 'viewer'];

// ─────────────────────────────────────────────
// Deployment
// ─────────────────────────────────────────────

export const DEPLOYMENT_STRATEGIES = ['rolling', 'recreate'] as const;

export const HEALTH_CHECK_DEFAULTS = {
  interval: '30s',
  timeout: '10s',
  retries: 3,
  startPeriod: '10s',
} as const;

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────

export const API_PREFIX = '/api/v1';
export const WS_PATH = '/ws';

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROVIDERS: '/auth/providers',
    CALLBACK: '/auth/callback/:provider',
  },
  // Projects
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: '/projects/:id',
    UPDATE: '/projects/:id',
    DELETE: '/projects/:id',
    MEMBERS: '/projects/:id/members',
    INVITE: '/projects/:id/invite',
    QUOTAS: '/projects/:id/quotas',
    SETTINGS: '/projects/:id/settings',
  },
  // Services (Catalog)
  CATALOG: {
    LIST: '/catalog',
    SEARCH: '/catalog/search',
    GET: '/catalog/:id',
    CATEGORIES: '/catalog/categories',
    SYNC: '/catalog/sync',
  },
  // Service Instances
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    GET: '/services/:id',
    UPDATE: '/services/:id',
    DELETE: '/services/:id',
    LOGS: '/services/:id/logs',
    METRICS: '/services/:id/metrics',
    ACTIONS: {
      START: '/services/:id/start',
      STOP: '/services/:id/stop',
      RESTART: '/services/:id/restart',
      SCALE: '/services/:id/scale',
      UPDATE: '/services/:id/update',
      BACKUP: '/services/:id/backup',
      RESTORE: '/services/:id/restore',
    },
  },
  // Deployments
  DEPLOYMENTS: {
    LIST: '/deployments',
    CREATE: '/deployments',
    GET: '/deployments/:id',
    CANCEL: '/deployments/:id/cancel',
  },
  // Backups
  BACKUPS: {
    LIST: '/backups',
    CREATE: '/backups',
    GET: '/backups/:id',
    DELETE: '/backups/:id',
    RESTORE: '/backups/:id/restore',
  },
  // Audit
  AUDIT: {
    LIST: '/audit',
    GET: '/audit/:id',
  },
  // Health & Metrics
  HEALTH: '/health',
  METRICS: '/metrics',
} as const;

// ─────────────────────────────────────────────
// WebSocket Events
// ─────────────────────────────────────────────

export const WS_EVENTS = {
  // Client -> Server
  SUBSCRIBE_LOGS: 'subscribe:logs',
  UNSUBSCRIBE_LOGS: 'unsubscribe:logs',
  SUBSCRIBE_METRICS: 'subscribe:metrics',
  UNSUBSCRIBE_METRICS: 'unsubscribe:metrics',
  SUBSCRIBE_DEPLOYMENT: 'subscribe:deployment',
  UNSUBSCRIBE_DEPLOYMENT: 'unsubscribe:deployment',
  // Server -> Client
  LOG_ENTRY: 'log:entry',
  METRICS_UPDATE: 'metrics:update',
  DEPLOYMENT_PROGRESS: 'deployment:progress',
  DEPLOYMENT_COMPLETE: 'deployment:complete',
  DEPLOYMENT_ERROR: 'deployment:error',
  SERVICE_STATUS_CHANGE: 'service:status_change',
  SERVICE_HEALTH_CHANGE: 'service:health_change',
} as const;

// ─────────────────────────────────────────────
// Error Codes
// ─────────────────────────────────────────────

export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_PROVIDER_ERROR: 'AUTH_PROVIDER_ERROR',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  
  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Deployment
  DEPLOYMENT_FAILED: 'DEPLOYMENT_FAILED',
  DEPLOYMENT_TIMEOUT: 'DEPLOYMENT_TIMEOUT',
  DEPLOYMENT_CANCELLED: 'DEPLOYMENT_CANCELLED',
  DEPLOYMENT_IN_PROGRESS: 'DEPLOYMENT_IN_PROGRESS',
  
  // Docker
  DOCKER_CONNECTION_FAILED: 'DOCKER_CONNECTION_FAILED',
  DOCKER_IMAGE_PULL_FAILED: 'DOCKER_IMAGE_PULL_FAILED',
  DOCKER_CONTAINER_START_FAILED: 'DOCKER_CONTAINER_START_FAILED',
  DOCKER_NETWORK_ERROR: 'DOCKER_NETWORK_ERROR',
  DOCKER_VOLUME_ERROR: 'DOCKER_VOLUME_ERROR',
  
  // Catalog
  CATALOG_SYNC_FAILED: 'CATALOG_SYNC_FAILED',
  CATALOG_INVALID_DEFINITION: 'CATALOG_INVALID_DEFINITION',
  CATALOG_SERVICE_NOT_FOUND: 'CATALOG_SERVICE_NOT_FOUND',
  
  // Backup
  BACKUP_FAILED: 'BACKUP_FAILED',
  BACKUP_NOT_FOUND: 'BACKUP_NOT_FOUND',
  RESTORE_FAILED: 'RESTORE_FAILED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

// ─────────────────────────────────────────────
// Regex Patterns
// ─────────────────────────────────────────────

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  DOCKER_IMAGE: /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)?(?::[\w.-]+)?$/,
  SEMVER: /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/,
} as const;

// ─────────────────────────────────────────────
// Feature Flags
// ─────────────────────────────────────────────

export const FEATURE_FLAGS = {
  KUBERNETES_SUPPORT: false,
  MULTI_NODE: false,
  GITOPS: true,
  MARKETPLACE_RATINGS: false,
  PLUGIN_SYSTEM: false,
  AIR_GAPPED: false,
  WHITE_LABEL: false,
} as const;

// ─────────────────────────────────────────────
// Version
// ─────────────────────────────────────────────

export const APP_VERSION = '1.0.0';
export const API_VERSION = 'v1';
export const CATALOG_SCHEMA_VERSION = '1.0';