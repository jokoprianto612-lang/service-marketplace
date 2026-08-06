// ─────────────────────────────────────────────
// Catalog Routes
// ─────────────────────────────────────────────
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { notFound } from '../utils/errors';

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  maturity: z.enum(['alpha', 'beta', 'stable']).optional(),
  pricing: z.enum(['free', 'freemium', 'paid']).optional(),
  tags: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const catalogRoutes = new Hono<{ Bindings: Env }>();

// GET /catalog - List services with filters
catalogRoutes.get('/', zValidator('query', searchSchema), async (c) => {
  const { q, category, maturity, pricing, tags, page, limit } = c.req.valid('query');
  
  // For now, return static catalog (later from KV/D1)
  const services = [
    {
      id: 'n8n-workflow',
      name: 'n8n Workflow Automation',
      description: 'Extendable workflow automation tool with 400+ integrations',
      category: 'automation',
      icon: '⚡',
      version: '1.42.0',
      maturity: 'stable',
      pricing: 'free',
      tags: ['workflow', 'integration', 'nocode'],
      stars: 42000,
    },
    {
      id: 'hermes-ai-agent',
      name: 'Hermes AI Agent',
      description: 'Self-improving AI agent by Nous Research with skills & memory',
      category: 'ai-ml',
      icon: '🤖',
      version: '1.0.0',
      maturity: 'beta',
      pricing: 'free',
      tags: ['ai', 'agent', 'llm', 'mcp'],
      stars: 8500,
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: 'Advanced open source relational database',
      category: 'databases',
      icon: '🗄️',
      version: '16.0',
      maturity: 'stable',
      pricing: 'free',
      tags: ['sql', 'relational', 'acid'],
      stars: 12000,
    },
    {
      id: 'redis',
      name: 'Redis',
      description: 'In-memory data structure store, cache, and message broker',
      category: 'databases',
      icon: '🔴',
      version: '7.2',
      maturity: 'stable',
      pricing: 'free',
      tags: ['cache', 'pubsub', 'queue'],
      stars: 62000,
    },
    {
      id: 'grafana-prometheus',
      name: 'Grafana + Prometheus',
      description: 'Complete observability stack with dashboards',
      category: 'monitoring',
      icon: '📊',
      version: '11.0',
      maturity: 'stable',
      pricing: 'free',
      tags: ['metrics', 'dashboards', 'alerting'],
      stars: 25000,
    },
  ];

  // Apply filters
  let filtered = services;
  
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  if (category) filtered = filtered.filter(s => s.category === category);
  if (maturity) filtered = filtered.filter(s => s.maturity === maturity);
  if (pricing) filtered = filtered.filter(s => s.pricing === pricing);
  if (tags) {
    const tagList = tags.split(',').map(t => t.trim().toLowerCase());
    filtered = filtered.filter(s => tagList.some(t => s.tags.map(t2 => t2.toLowerCase()).includes(t)));
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return c.json({
    success: true,
    data: paginated,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
});

// GET /catalog/categories - List categories
catalogRoutes.get('/categories', async (c) => {
  const categories = [
    { id: 'automation', name: 'Automation', icon: '⚡', count: 3 },
    { id: 'ai-ml', name: 'AI/ML', icon: '🤖', count: 2 },
    { id: 'databases', name: 'Databases', icon: '🗄️', count: 5 },
    { id: 'monitoring', name: 'Monitoring', icon: '📊', count: 4 },
    { id: 'storage', name: 'Storage', icon: '💾', count: 3 },
    { id: 'networking', name: 'Networking', icon: '🌐', count: 3 },
    { id: 'security', name: 'Security', icon: '🔒', count: 3 },
    { id: 'identity', name: 'Identity', icon: '👤', count: 2 },
    { id: 'developer-tools', name: 'Developer Tools', icon: '🛠️', count: 4 },
    { id: 'ci-cd', name: 'CI/CD', icon: '🔄', count: 2 },
  ];

  return c.json({ success: true, data: categories });
});

// GET /catalog/:id - Get service detail
catalogRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // Mock detail - in production, fetch from KV/D1
  const serviceDetails: Record<string, any> = {
    'n8n-workflow': {
      id: 'n8n-workflow',
      name: 'n8n Workflow Automation',
      description: 'Extendable workflow automation tool with 400+ integrations',
      longDescription: '# n8n Workflow Automation\n\n[n8n](https://n8n.io/) is a fair-code workflow automation tool...',
      category: 'automation',
      icon: '⚡',
      version: '1.42.0',
      maintainer: 'n8n-io',
      repository: 'https://github.com/n8n-io/n8n',
      documentation: 'https://docs.n8n.io/',
      license: 'Apache-2.0',
      dockerCompose: 'version: "3.8"\n\nservices:\n  n8n:\n    image: docker.n8n.io/n8nio/n8n:latest\n    ...',
      defaultConfig: {
        envVars: {
          USERNAME: 'admin',
          PASSWORD: '{{GENERATE_PASSWORD:16}}',
          POSTGRES_DB: 'n8n',
          POSTGRES_USER: 'n8n',
          POSTGRES_PASSWORD: '{{GENERATE_PASSWORD:32}}',
        },
      },
      configSchema: {
        type: 'object',
        properties: {
          USERNAME: { type: 'string', title: 'Admin Username', default: 'admin' },
          PASSWORD: { type: 'string', title: 'Admin Password', format: 'password' },
        },
      },
      minMemory: 512,
      minCpu: 500,
      minDisk: 2048,
      requiresGpu: false,
      supportedArchitectures: ['amd64', 'arm64'],
      tags: ['automation', 'workflow', 'integration', 'nocode'],
      pricing: 'free',
      maturity: 'stable',
    },
  };

  const service = serviceDetails[id];
  
  if (!service) {
    throw notFound(`Service ${id} not found`);
  }

  return c.json({ success: true, data: service });
});

// POST /catalog/sync - Sync catalog from Git (admin only)
catalogRoutes.post('/sync', async (c) => {
  // TODO: Implement Git sync
  return c.json({ 
    success: true, 
    message: 'Catalog sync initiated',
    data: { synced: 0, updated: 0, errors: [] }
  });
});