// ─────────────────────────────────────────────
// Marketplace Page
// ─────────────────────────────────────────────
import { Link, useSearch } from '@tanstack/react-router';
import { Search, Box, Database, Activity, HardDrive, Globe, Shield, User, Terminal, GitBranch, Search as SearchIcon, Layers, Zap, Brain } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const categories = [
  { id: 'all', name: 'All', icon: Box },
  { id: 'automation', name: 'Automation', icon: Zap },
  { id: 'ai-ml', name: 'AI/ML', icon: Brain },
  { id: 'databases', name: 'Databases', icon: Database },
  { id: 'monitoring', name: 'Monitoring', icon: Activity },
  { id: 'storage', name: 'Storage', icon: HardDrive },
  { id: 'networking', name: 'Networking', icon: Globe },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'identity', name: 'Identity', icon: User },
  { id: 'developer-tools', name: 'Dev Tools', icon: Terminal },
  { id: 'ci-cd', name: 'CI/CD', icon: GitBranch },
  { id: 'search', name: 'Search', icon: SearchIcon },
];

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
  {
    id: 'minio',
    name: 'MinIO',
    description: 'High-performance S3-compatible object storage',
    category: 'storage',
    icon: '💾',
    version: '2024.01',
    maturity: 'stable',
    pricing: 'free',
    tags: ['s3', 'object-storage', 'distributed'],
    stars: 38000,
  },
  {
    id: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    description: 'Reverse proxy with SSL management UI',
    category: 'networking',
    icon: '🌐',
    version: '2.10',
    maturity: 'stable',
    pricing: 'free',
    tags: ['reverse-proxy', 'ssl', 'letsencrypt'],
    stars: 18000,
  },
  {
    id: 'authentik',
    name: 'Authentik',
    description: 'Open source identity provider with OIDC/SAML',
    category: 'identity',
    icon: '👤',
    version: '2024.01',
    maturity: 'stable',
    pricing: 'free',
    tags: ['oidc', 'saml', 'sso', 'ldap'],
    stars: 11000,
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    description: 'Bitwarden-compatible password manager',
    category: 'security',
    icon: '🔒',
    version: '1.32',
    maturity: 'stable',
    pricing: 'free',
    tags: ['password-manager', 'bitwarden', 'e2e-encryption'],
    stars: 30000,
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Docker management UI for containers and stacks',
    category: 'developer-tools',
    icon: '🐳',
    version: '2.21',
    maturity: 'stable',
    pricing: 'free',
    tags: ['docker', 'management', 'ui'],
    stars: 28000,
  },
];

export function MarketplacePage() {
  const search = useSearch({ from: '/marketplace', select: (s) => s });
  const [query, setQuery] = useState(search?.q || '');
  const [selectedCategory, setSelectedCategory] = useState(search?.category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredServices = services.filter((service) => {
    const matchesQuery = service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase()) ||
      service.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate with search params
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-dark-400 mt-1">Discover and deploy services instantly</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Layers className="h-4 w-4" />
            Stacks
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="input pl-12"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-auto min-w-[180px] appearance-none bg-dark-800"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="flex border border-dark-600 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white')}
              >
                <div className="grid grid-cols-2 gap-1 h-5 w-5">
                  <div className="bg-dark-600 rounded" />
                  <div className="bg-dark-600 rounded" />
                  <div className="bg-dark-600 rounded" />
                  <div className="bg-dark-600 rounded" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white')}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Services Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'space-y-3'
      )}>
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} mode={viewMode} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="card p-12 text-center">
          <Search className="h-12 w-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
          <p className="text-dark-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service, mode }: { service: typeof services[0]; mode: 'grid' | 'list' }) {
  const maturityColors: Record<string, string> = {
    stable: 'badge-success',
    beta: 'badge-warning',
    alpha: 'badge-error',
  };

  const pricingColors: Record<string, string> = {
    free: 'badge-success',
    freemium: 'badge-info',
    paid: 'badge-warning',
  };

  if (mode === 'list') {
    return (
      <Link
        to={`/marketplace/${service.id}`}
        className="card-hover flex items-center gap-4 p-4 group"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-dark-800 text-2xl shrink-0">
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white truncate">{service.name}</h3>
            <span className={cn('badge', maturityColors[service.maturity])}>
              {service.maturity}
            </span>
            <span className={cn('badge', pricingColors[service.pricing])}>
              {service.pricing}
            </span>
          </div>
          <p className="text-sm text-dark-400 mt-1 truncate">{service.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-dark-500">
            <span>v{service.version}</span>
            <span>⭐ {service.stars.toLocaleString()}</span>
          </div>
        </div>
        <button className="btn-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          Deploy
        </button>
      </Link>
    );
  }

  return (
    <Link to={`/marketplace/${service.id}`} className="card-hover flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-800 text-2xl">
            {service.icon}
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('badge', maturityColors[service.maturity])}>
              {service.maturity}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-dark-400 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-neutral">{tag}</span>
          ))}
          {service.tags.length > 3 && (
            <span className="badge badge-neutral">+{service.tags.length - 3}</span>
          )}
        </div>
      </div>
      <div className="border-t border-dark-700 p-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <span>v{service.version}</span>
            <span className="text-dark-600">·</span>
            <span>⭐ {service.stars.toLocaleString()}</span>
          </div>
          <span className={cn('badge', pricingColors[service.pricing])}>
            {service.pricing === 'free' ? 'Free' : service.pricing}
          </span>
        </div>
        <button className="btn-primary w-full mt-3">Deploy</button>
      </div>
    </Link>
  );
}