// ─────────────────────────────────────────────
// Marketplace Page - Service Marketplace
// Pattern: Marketplace / Directory
// Style: Vibrant & Block-based
// ─────────────────────────────────────────────
import { Link, useSearch } from '@tanstack/react-router';
import { Search, Box, Database, Activity, HardDrive, Globe, Shield, User, Terminal, GitBranch, Search as SearchIcon, Zap, Brain } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { BrandIcon, getCategoryFallbackIcon } from '../../components/icons/BrandIcon';
import { useI18n } from '../../context/I18nContext';

const categories = [
  { id: 'all', name: 'All', i18nKey: 'common.all', icon: Box },
  { id: 'automation', name: 'Automation', i18nKey: 'category.automation', icon: Zap },
  { id: 'ai-ml', name: 'AI/ML', i18nKey: 'category.ai-ml', icon: Brain },
  { id: 'databases', name: 'Databases', i18nKey: 'category.databases', icon: Database },
  { id: 'monitoring', name: 'Monitoring', i18nKey: 'category.monitoring', icon: Activity },
  { id: 'storage', name: 'Storage', i18nKey: 'category.storage', icon: HardDrive },
  { id: 'networking', name: 'Networking', i18nKey: 'category.networking', icon: Globe },
  { id: 'security', name: 'Security', i18nKey: 'category.security', icon: Shield },
  { id: 'identity', name: 'Identity', i18nKey: 'category.identity', icon: User },
  { id: 'developer-tools', name: 'Dev Tools', i18nKey: 'category.developer-tools', icon: Terminal },
  { id: 'ci-cd', name: 'CI/CD', i18nKey: 'category.ci-cd', icon: GitBranch },
  { id: 'search', name: 'Search', i18nKey: 'category.search', icon: SearchIcon },
];

const services = [
  {
    id: 'n8n-workflow',
    name: 'n8n Workflow Automation',
    description: 'Extendable workflow automation tool with 400+ integrations',
    category: 'automation',
    i18nCategoryKey: 'category.automation',
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
    i18nCategoryKey: 'category.ai-ml',
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
    i18nCategoryKey: 'category.databases',
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
    i18nCategoryKey: 'category.databases',
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
    i18nCategoryKey: 'category.monitoring',
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
    i18nCategoryKey: 'category.storage',
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
    i18nCategoryKey: 'category.networking',
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
    i18nCategoryKey: 'category.identity',
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
    i18nCategoryKey: 'category.security',
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
    i18nCategoryKey: 'category.developer-tools',
    version: '2.21',
    maturity: 'stable',
    pricing: 'free',
    tags: ['docker', 'management', 'ui'],
    stars: 28000,
  },
];

export function MarketplacePage() {
  const { t } = useI18n();
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

  return (
    <div className="section animate-in">
      {/* Hero Section - Search focused per design system */}
      <section className="py-12 lg:py-16 animate-in">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-display-lg font-bold text-canvas-900 dark:text-canvas-50 mb-4">
              {t('marketplace.title')}
            </h1>
            <p className="text-body-lg text-canvas-500 dark:text-canvas-400 mb-8">
              {t('marketplace.subtitle')}
            </p>
            {/* Hero Search Bar - Primary CTA per design system */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-primary-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('marketplace.searchPlaceholder')}
                className="input pl-14 pr-12 py-4 text-lg rounded-xl bg-white/80 dark:bg-canvas-800/80 border border-canvas-200 dark:border-canvas-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary px-6 py-2.5 text-sm font-medium">
                {t('marketplace.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Per Marketplace pattern */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">{t('marketplace.categories')}</h2>
            <p className="text-body-md text-canvas-500 dark:text-canvas-400 mt-1">{t('marketplace.categoriesSubtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/marketplace' : `/marketplace?category=${cat.id}`}
              className={cn(
                'card-build-hover p-6 text-center',
                selectedCategory === cat.id ? 'ring-2 ring-primary-500' : '',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mx-auto mb-4">
                <cat.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-heading-sm font-semibold text-canvas-900 dark:text-canvas-50 mb-1">{t(cat.i18nKey)}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Services Grid/List */}
      <section className="animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">{t('marketplace.services')}</h2>
            <p className="text-canvas-500 dark:text-canvas-400 mt-1">
              {t('marketplace.servicesFound', { count: filteredServices.length.toString() })}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-auto min-w-[180px] appearance-none bg-canvas-100 dark:bg-canvas-800"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{t(cat.i18nKey)}</option>
              ))}
            </select>

            <div className="flex border border-canvas-200 dark:border-canvas-700 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn('p-3 transition-colors', viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-canvas-400 hover:text-canvas-600 dark:hover:text-canvas-300')}
                aria-label={t('marketplace.viewMode.grid')}
                aria-pressed={viewMode === 'grid'}
              >
                <div className="grid grid-cols-2 gap-1 h-5 w-5">
                  <div className="bg-canvas-300 dark:bg-canvas-600 rounded" />
                  <div className="bg-canvas-300 dark:bg-canvas-600 rounded" />
                  <div className="bg-canvas-300 dark:bg-canvas-600 rounded" />
                  <div className="bg-canvas-300 dark:bg-canvas-600 rounded" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn('p-3 transition-colors', viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-canvas-400 hover:text-canvas-600 dark:hover:text-canvas-300')}
                aria-label={t('marketplace.viewMode.list')}
                aria-pressed={viewMode === 'list'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid/List */}
        <div className={cn(
          viewMode === 'grid'
            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-4'
        )}>
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} mode={viewMode} index={index} t={t} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 animate-in">
            <Search className="h-16 w-16 text-canvas-300 dark:text-canvas-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-heading-md font-medium text-canvas-900 dark:text-canvas-50 mb-2">{t('marketplace.noServices')}</h3>
            <p className="text-canvas-500 dark:text-canvas-400">{t('marketplace.adjustFilters')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ServiceCard({ service, mode, index, t }: { service: typeof services[0]; mode: 'grid' | 'list'; index: number; t: (key: string, params?: Record<string, string>) => string }) {
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

  const iconSize = mode === 'list' ? 36 : 32;

  if (mode === 'list') {
    return (
      <Link
        to={`/marketplace/${service.id}`}
        className="card-build-hover flex items-center gap-5 p-5 group"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 shrink-0">
          <BrandIcon serviceId={service.id} size={iconSize} fallback={getCategoryFallbackIcon(service.category)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="font-semibold text-canvas-900 dark:text-canvas-50 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {service.name}
            </h3>
            <span className={cn('badge', maturityColors[service.maturity])}>
              {t(`marketplace.maturity.${service.maturity}`)}
            </span>
            <span className={cn('badge', pricingColors[service.pricing])}>
              {t(`marketplace.pricing.${service.pricing}`)}
            </span>
          </div>
          <p className="text-body-sm text-canvas-500 dark:text-canvas-400 mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-3 text-caption text-canvas-500">
            <span className="font-mono">{t('service.version', { version: service.version })}</span>
            <span>{t('service.stars', { stars: service.stars.toLocaleString() })}</span>
          </div>
        </div>
        <button className="btn-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {t('marketplace.deploy')}
        </button>
      </Link>
    );
  }

  return (
    <Link to={`/marketplace/${service.id}`} className="card-build-hover flex flex-col h-full" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <BrandIcon serviceId={service.id} size={iconSize} fallback={getCategoryFallbackIcon(service.category)} />
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('badge', maturityColors[service.maturity])}>
              {t(`marketplace.maturity.${service.maturity}`)}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-canvas-900 dark:text-canvas-50 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-body-sm text-canvas-500 dark:text-canvas-400 mb-4 line-clamp-2">{service.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-neutral">{tag}</span>
          ))}
          {service.tags.length > 3 && (
            <span className="badge badge-neutral">+{service.tags.length - 3}</span>
          )}
        </div>
      </div>
      <div className="border-t border-canvas-200 dark:border-canvas-700 p-6 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-canvas-500">
            <span className="font-mono">{t('service.version', { version: service.version })}</span>
            <span className="text-canvas-600">·</span>
            <span>{t('service.stars', { stars: service.stars.toLocaleString() })}</span>
          </div>
          <span className={cn('badge', pricingColors[service.pricing])}>
            {service.pricing === 'free' ? t('marketplace.pricing.free') : t(`marketplace.pricing.${service.pricing}`)}
          </span>
        </div>
        <button className="btn-primary w-full mt-4">{t('marketplace.deploy')}</button>
      </div>
    </Link>
  );
}