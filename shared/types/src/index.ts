// ─────────────────────────────────────────────
// Shared Types - Service Marketplace
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export enum ServiceCategory {
  AI_ML = 'ai-ml',
  AUTOMATION = 'automation',
  DATABASES = 'databases',
  MONITORING = 'monitoring',
  STORAGE = 'storage',
  NETWORKING = 'networking',
  DEVELOPER_TOOLS = 'developer-tools',
  SECURITY = 'security',
  IDENTITY = 'identity',
  CI_CD = 'ci-cd',
  MESSAGING = 'messaging',
  SEARCH = 'search',
  OTHER = 'other'
}

export enum ServiceStatus {
  DEPLOYING = 'deploying',
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  UPDATING = 'updating',
  SCALING = 'scaling',
  BACKING_UP = 'backing_up',
  RESTORING = 'restoring',
  DELETING = 'deleting'
}

export enum ServiceMaturity {
  ALPHA = 'alpha',
  BETA = 'beta',
  STABLE = 'stable'
}

export enum PricingModel {
  FREE = 'free',
  FREEMIUM = 'freemium',
  PAID = 'paid'
}

export enum DeploymentTarget {
  DOCKER = 'docker',
  DOCKER_SWARM = 'docker-swarm',
  KUBERNETES = 'kubernetes'
}

export enum DeploymentMode {
  QUICK = 'quick',
  CUSTOM = 'custom',
  STACK = 'stack'
}

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

export enum AuthProvider {
  EMAIL = 'email',
  GITHUB = 'github',
  GOOGLE = 'google',
  OIDC = 'oidc'
}

// ─────────────────────────────────────────────
// Core Interfaces
// ─────────────────────────────────────────────

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: ServiceCategory;
  icon: string;
  version: string;
  maintainer: string;
  repository: string;
  documentation: string;
  license: string;
  dockerCompose: string;
  defaultConfig: ServiceConfig;
  configSchema: JsonSchema;
  minMemory: number;
  minCpu: number;
  minDisk: number;
  requiresGpu: boolean;
  supportedArchitectures: string[];
  tags: string[];
  pricing: PricingModel;
  maturity: ServiceMaturity;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceConfig {
  envVars: Record<string, string>;
  volumes: VolumeConfig[];
  ports: PortConfig[];
  resources: ResourceLimits;
  healthCheck: HealthCheckConfig;
  dependsOn: string[];
  networks: string[];
  secrets: SecretConfig[];
}

export interface VolumeConfig {
  name: string;
  hostPath?: string;
  containerPath: string;
  readOnly?: boolean;
  type?: 'bind' | 'volume' | 'tmpfs';
}

export interface PortConfig {
  containerPort: number;
  hostPort?: number;
  protocol?: 'tcp' | 'udp';
  expose?: boolean;
}

export interface ResourceLimits {
  memory?: string;
  cpu?: string;
  gpu?: number;
}

export interface HealthCheckConfig {
  test: string[];
  interval?: string;
  timeout?: string;
  retries?: number;
  startPeriod?: string;
}

export interface SecretConfig {
  name: string;
  value?: string;
  generate?: boolean;
  length?: number;
}

export interface JsonSchema {
  type: 'object';
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface JsonSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
}

export interface ServiceInstance {
  id: string;
  definitionId: string;
  projectId: string;
  name: string;
  status: ServiceStatus;
  config: ServiceConfig;
  deployment: DeploymentInfo;
  healthCheck: HealthStatus;
  resources: ResourceUsage;
  createdAt: Date;
  updatedAt: Date;
  deployedBy: string;
}

export interface DeploymentInfo {
  target: DeploymentTarget;
  targetId?: string;
  composeProjectName: string;
  containers: ContainerInfo[];
  networks: NetworkInfo[];
  volumes: VolumeInfo[];
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: PortMapping[];
  mounts: MountInfo[];
  health: HealthStatus;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface PortMapping {
  containerPort: number;
  hostPort: number;
  protocol: string;
  hostIp: string;
}

export interface MountInfo {
  source: string;
  destination: string;
  mode: string;
  type: string;
}

export interface NetworkInfo {
  id: string;
  name: string;
  driver: string;
  scope: string;
}

export interface VolumeInfo {
  name: string;
  driver: string;
  mountpoint: string;
  scope: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'starting' | 'unknown';
  lastCheck: Date;
  output?: string;
}

export interface ResourceUsage {
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  memoryPercent: number;
  networkRx: number;
  networkTx: number;
  blockRead: number;
  blockWrite: number;
  pids: number;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Auth & User Types
// ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProvider;
  providerId?: string;
  roles: UserRole[];
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  members: ProjectMember[];
  quotas: ProjectQuotas;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  role: UserRole;
  joinedAt: Date;
}

export interface ProjectQuotas {
  maxServices: number;
  maxCpu: number;
  maxMemory: number;
  maxDisk: number;
}

export interface ProjectSettings {
  autoDeploy: boolean;
  notifications: NotificationSettings;
  backup: BackupSettings;
}

export interface NotificationSettings {
  email: boolean;
  webhook?: string;
  events: string[];
}

export interface BackupSettings {
  enabled: boolean;
  schedule: string;
  retentionDays: number;
  s3Endpoint?: string;
  s3Bucket?: string;
}

// ─────────────────────────────────────────────
// API Types
// ─────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────
// Deployment Types
// ─────────────────────────────────────────────

export interface DeployRequest {
  definitionId: string;
  projectId: string;
  name: string;
  mode: DeploymentMode;
  config?: Partial<ServiceConfig>;
  targetId?: string;
}

export interface DeployResponse {
  instanceId: string;
  status: ServiceStatus;
  estimatedDuration: number;
}

export interface ScaleRequest {
  instanceId: string;
  replicas: number;
}

export interface UpdateRequest {
  instanceId: string;
  imageTag?: string;
  config?: Partial<ServiceConfig>;
  strategy?: 'rolling' | 'recreate';
}

// ─────────────────────────────────────────────
// Log & Metrics Types
// ─────────────────────────────────────────────

export interface LogEntry {
  id: string;
  instanceId: string;
  containerId: string;
  containerName: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  metadata?: Record<string, any>;
}

export interface MetricPoint {
  timestamp: Date;
  value: number;
  labels?: Record<string, string>;
}

export interface ServiceMetrics {
  instanceId: string;
  cpu: MetricPoint[];
  memory: MetricPoint[];
  network: {
    rx: MetricPoint[];
    tx: MetricPoint[];
  };
  disk: {
    read: MetricPoint[];
    write: MetricPoint[];
  };
  custom?: Record<string, MetricPoint[]>;
}

// ─────────────────────────────────────────────
// Catalog Types
// ─────────────────────────────────────────────

export interface CatalogIndex {
  version: string;
  updatedAt: Date;
  services: ServiceDefinition[];
  categories: CategoryInfo[];
}

export interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
}

export interface SearchFilters {
  query?: string;
  category?: ServiceCategory;
  tags?: string[];
  maturity?: ServiceMaturity[];
  pricing?: PricingModel[];
  requiresGpu?: boolean;
  architecture?: string;
}

// ─────────────────────────────────────────────
// Backup Types
// ─────────────────────────────────────────────

export interface BackupJob {
  id: string;
  instanceId: string;
  type: 'full' | 'incremental' | 'config';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  size?: number;
  location?: string;
  error?: string;
}

export interface RestoreRequest {
  instanceId: string;
  backupId: string;
  targetInstanceId?: string;
}

// ─────────────────────────────────────────────
// Audit Types
// ─────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  userId: string;
  projectId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}