// ─────────────────────────────────────────────
// Dashboard Page - Wee Wok The Tok
// Pattern: Marketplace / Directory
// Style: Vibrant & Block-based
// ─────────────────────────────────────────────
import {
  Server,
  Database,
  HardDrive,
  Activity,
  Search,
  BarChart3,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { cn } from '../../utils/cn';
import { BrandIcon } from '../../components/icons/BrandIcon';
import { useI18n } from '../../context/I18nContext';

const recentServices = [
  { name: 'n8n Workflow', status: 'running', cpu: '12%', memory: '256MB', uptime: '5d 12h', id: 'n8n-workflow' },
  { name: 'PostgreSQL', status: 'running', cpu: '5%', memory: '512MB', uptime: '5d 12h', id: 'postgresql' },
  { name: 'Redis', status: 'running', cpu: '2%', memory: '64MB', uptime: '5d 12h', id: 'redis' },
  { name: 'Grafana', status: 'running', cpu: '8%', memory: '128MB', uptime: '3d 4h', id: 'grafana-prometheus' },
  { name: 'MinIO', status: 'stopped', cpu: '0%', memory: '0MB', uptime: '-', id: 'minio' },
];

export function DashboardPage() {
  const { t } = useI18n();
  
  return (
    <div className="section animate-in">
      {/* Hero Section - Search focused per design system */}
      <section className="py-12 lg:py-16 animate-in">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-display-lg font-bold text-canvas-900 dark:text-canvas-50 mb-4">
              {t('dashboard.title')}
            </h1>
            <p className="text-body-lg text-canvas-500 dark:text-canvas-400 mb-8">
              {t('dashboard.subtitle')}
            </p>
            {/* Hero Search Bar - Primary CTA per design system */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-primary-400" aria-hidden="true" />
              <input
                type="search"
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
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">{t('dashboard.categories')}</h2>
            <p className="text-body-md text-canvas-500 dark:text-canvas-400 mt-1">{t('dashboard.categoriesSubtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {[
            { name: 'Automation', serviceId: 'automation', count: 12, i18nKey: 'category.automation' },
            { name: 'AI/ML', serviceId: 'ai-ml', count: 8, i18nKey: 'category.ai-ml' },
            { name: 'Databases', serviceId: 'databases', count: 15, i18nKey: 'category.databases' },
            { name: 'Monitoring', serviceId: 'monitoring', count: 10, i18nKey: 'category.monitoring' },
            { name: 'Storage', serviceId: 'storage', count: 8, i18nKey: 'category.storage' },
            { name: 'Security', serviceId: 'security', count: 7, i18nKey: 'category.security' },
          ].map((cat, index) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${cat.serviceId}`}
              className={cn(
                'card-elevated p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mx-auto mb-4">
                <BrandIcon serviceId={cat.serviceId} size={28} />
              </div>
              <h3 className="text-heading-sm font-semibold text-canvas-900 dark:text-canvas-50 mb-1">{t(cat.i18nKey)}</h3>
              <p className="text-caption text-canvas-500">{cat.count} {t('marketplace.servicesFound', { count: cat.count.toString() })}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services - Bento grid style */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">{t('dashboard.featuredServices')}</h2>
            <p className="text-body-md text-canvas-500 dark:text-canvas-400 mt-1">{t('dashboard.featuredSubtitle')}</p>
          </div>
          <Link to="/marketplace" className="btn-ghost text-sm font-medium">
            {t('dashboard.viewAll')}
            <Search className="h-4 w-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="bento-grid">
          {[
            { name: 'n8n Workflow', desc: 'Extendable workflow automation', category: 'category.automation', serviceId: 'n8n-workflow', version: '1.42.0', status: 'running', stars: 42000 },
            { name: 'PostgreSQL', desc: 'Advanced open source relational database', category: 'category.databases', serviceId: 'postgresql', version: '16.0', status: 'running', stars: 12000 },
            { name: 'Redis', desc: 'In-memory data structure store', category: 'category.databases', serviceId: 'redis', version: '7.2', status: 'running', stars: 62000 },
            { name: 'Grafana + Prometheus', desc: 'Complete observability stack', category: 'category.monitoring', serviceId: 'grafana-prometheus', version: '11.0', status: 'running', stars: 25000 },
            { name: 'MinIO', desc: 'High-performance S3-compatible object storage', category: 'category.storage', serviceId: 'minio', version: '2024.01', status: 'stopped', stars: 38000 },
            { name: 'Hermes AI Agent', desc: 'Self-improving AI agent by Nous Research', category: 'category.ai-ml', serviceId: 'hermes-ai-agent', version: '1.0.0', status: 'running', stars: 8500 },
          ].map((service, index) => (
            <Link
              key={service.name}
              to={`/marketplace/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'card-elevated p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                index >= 4 ? 'lg:col-span-2' : '',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4">
                <BrandIcon serviceId={service.serviceId} size={28} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-info text-xs">{t(service.category)}</span>
                <span className="badge badge-success text-xs">{service.status === 'running' ? t('marketplace.maturity.stable') : t('marketplace.maturity.beta')}</span>
              </div>
              <h3 className="text-heading-sm font-semibold text-canvas-900 dark:text-canvas-50 mb-2">{service.name}</h3>
              <p className="text-body-sm text-canvas-500 dark:text-canvas-400 mb-4 line-clamp-2 flex-1">{service.desc}</p>
              <div className="flex items-center gap-3 text-caption text-canvas-500">
                <span className="font-mono">{t('service.version', { version: service.version })}</span>
                <span>{t('service.stars', { stars: service.stars.toLocaleString() })}</span>
              </div>
              <button className="btn-primary w-full mt-4">{t('marketplace.deploy')}</button>
            </Link>
          ))}
        </div>
      </section>

      {/* System Resources & Quick Actions */}
      <section className="mb-16 animate-in">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card-elevated p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50">{t('dashboard.resourceUsage')}</h2>
              <button className="btn-ghost text-sm font-medium" type="button">
                <BarChart3 className="h-4 w-4 mr-1" aria-hidden="true" />
                {t('common.view')}
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'dashboard.cpuUsage', value: '34%', color: 'bg-primary-500' },
                { label: 'dashboard.memory', value: '68%', color: 'bg-success-500' },
                { label: 'dashboard.disk', value: '45%', color: 'bg-warning-500' },
                { label: 'dashboard.network', value: '12%', color: 'bg-primary-500' },
              ].map((resource) => (
                <div key={resource.label} className="space-y-1.5">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-canvas-500">{t(resource.label)}</span>
                    <span className="font-mono font-medium text-canvas-900">{resource.value}</span>
                  </div>
                  <div className="h-2 bg-canvas-200 dark:bg-canvas-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700 ease-out', resource.color)}
                      style={{ width: resource.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50 mb-6">{t('dashboard.quickActions')}</h2>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-start gap-3">
                <Server className="h-5 w-5" aria-hidden="true" />
                {t('dashboard.deployNewService')}
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <Database className="h-5 w-5" aria-hidden="true" />
                {t('dashboard.addDatabase')}
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <Activity className="h-5 w-5" aria-hidden="true" />
                {t('dashboard.viewMetrics')}
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <HardDrive className="h-5 w-5" aria-hidden="true" />
                {t('dashboard.manageBackups')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Services */}
      <section className="animate-in">
        <div className="card-elevated overflow-hidden">
          <div className="p-6 border-b border-canvas-200 dark:border-canvas-700 flex items-center justify-between">
            <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50">{t('dashboard.recentServices')}</h2>
            <Link to="/services" className="btn-ghost text-sm font-medium">
              {t('dashboard.viewAll')}
              <Search className="h-4 w-4 ml-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>{t('common.service')}</th>
                  <th>{t('common.status')}</th>
                  <th>CPU</th>
                  <th>{t('common.memory')}</th>
                  <th>{t('common.uptime')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-200 dark:divide-canvas-700">
                {recentServices.map((service) => (
                  <tr key={service.name} className="hover:bg-canvas-100 dark:hover:bg-canvas-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                          <BrandIcon serviceId={service.id} size={20} />
                        </div>
                        <span className="font-medium text-canvas-900 dark:text-canvas-50">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'badge',
                        service.status === 'running' ? 'badge-success' : 'badge-neutral'
                      )}>
                        {service.status === 'running' ? t('deployments.status.running') : t('deployments.status.stopped')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-canvas-500 font-mono">{service.cpu}</td>
                    <td className="px-6 py-4 text-body-sm text-canvas-500 font-mono">{service.memory}</td>
                    <td className="px-6 py-4 text-body-sm text-canvas-500 font-mono">{service.uptime}</td>
                    <td className="px-6 py-4">
                      <button className="btn-ghost p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30" aria-label={`Actions for ${service.name}`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}