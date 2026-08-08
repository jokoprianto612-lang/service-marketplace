// ─────────────────────────────────────────────
// Dashboard Page - NVIDIA Build Style (Green Theme)
// ─────────────────────────────────────────────
import {
  Server,
  Database,
  HardDrive,
  Activity,
  Search,
  BarChart3,
  Zap,
  Brain,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Sparkles,
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

const resourceMetrics = [
  { label: 'CPU Usage', key: 'dashboard.cpuUsage', value: '34%', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: Cpu },
  { label: 'Memory', key: 'dashboard.memory', value: '68%', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: MemoryStick },
  { label: 'Disk', key: 'dashboard.disk', value: '45%', color: 'bg-gradient-to-r from-amber-500 to-orange-500', icon: HardDrive },
  { label: 'Network', key: 'dashboard.network', value: '12%', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: Globe },
];

const quickActions = [
  { label: 'Deploy New Service', key: 'dashboard.deployNewService', icon: Server, primary: true },
  { label: 'Add Database', key: 'dashboard.addDatabase', icon: Database },
  { label: 'View Metrics', key: 'dashboard.viewMetrics', icon: Activity },
  { label: 'Manage Backups', key: 'dashboard.manageBackups', icon: HardDrive },
];

const featuredServices = [
  { name: 'n8n Workflow', desc: 'Extendable workflow automation', category: 'category.automation', serviceId: 'n8n-workflow', version: '1.42.0', status: 'running', stars: 42000 },
  { name: 'PostgreSQL', desc: 'Advanced open source relational database', category: 'category.databases', serviceId: 'postgresql', version: '16.0', status: 'running', stars: 12000 },
  { name: 'Redis', desc: 'In-memory data structure store', category: 'category.databases', serviceId: 'redis', version: '7.2', status: 'running', stars: 62000 },
  { name: 'Grafana + Prometheus', desc: 'Complete observability stack', category: 'category.monitoring', serviceId: 'grafana-prometheus', version: '11.0', status: 'running', stars: 25000 },
  { name: 'MinIO', desc: 'High-performance S3-compatible object storage', category: 'category.storage', serviceId: 'minio', version: '2024.01', status: 'stopped', stars: 38000 },
  { name: 'Hermes AI Agent', desc: 'Self-improving AI agent by Nous Research', category: 'category.ai-ml', serviceId: 'hermes-ai-agent', version: '1.0.0', status: 'running', stars: 8500 },
];

const categories = [
  { name: 'Automation', key: 'category.automation', serviceId: 'automation', count: 12, icon: Zap },
  { name: 'AI/ML', key: 'category.ai-ml', serviceId: 'ai-ml', count: 8, icon: Brain },
  { name: 'Databases', key: 'category.databases', serviceId: 'databases', count: 15, icon: Database },
  { name: 'Monitoring', key: 'category.monitoring', serviceId: 'monitoring', count: 10, icon: Activity },
  { name: 'Storage', key: 'category.storage', serviceId: 'storage', count: 8, icon: HardDrive },
  { name: 'Security', key: 'category.security', serviceId: 'security', count: 7, icon: Shield },
];

export function DashboardPage() {
  const { t } = useI18n();

  return (
    <div className="section animate-in relative z-10">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 animate-in">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-display-lg font-bold text-white mb-4 gradient-text-green">
              {t('dashboard.title')}
            </h1>
            <p className="text-body-lg text-canvas-400 mb-8">
              {t('dashboard.subtitle')}
            </p>
            {/* Hero Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-green-400" aria-hidden="true" />
              <input
                type="search"
                placeholder={t('marketplace.searchPlaceholder')}
                className="input pl-14 pr-12 py-4 text-lg rounded-xl"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary px-6 py-2.5 text-sm font-medium">
                {t('marketplace.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section - CSS-based */}
      <section className="mb-16 animate-in">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="card-glass-hover p-6 h-full min-h-[300px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-amber-500/10" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl animate-pulse" />
                  </div>
                  <div className="absolute inset-0 flex items-end justify-between p-6 pointer-events-none">
                    <div>
                      <span className="badge-info text-sm mb-2">{t('category.ai-ml')}</span>
                      <h3 className="text-heading-lg font-bold text-white mb-2">Hermes AI Agent</h3>
                      <p className="text-body-md text-canvas-300">Self-improving AI agent by Nous Research with skills & memory</p>
                    </div>
                    <div className="text-right">
                      <span className="badge-success text-sm">{t('marketplace.maturity.stable')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-glass-hover p-6 text-center">
              <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-heading-md font-semibold text-white mb-2">{t('dashboard.experienceTitle')}</h3>
              <p className="text-body-md text-canvas-400 mb-4">
                {t('dashboard.experienceDesc')}
              </p>
              <div className="flex items-center justify-center gap-4 text-caption text-canvas-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Green
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Emerald
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  Amber
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-white">{t('dashboard.categories')}</h2>
            <p className="text-body-md text-canvas-400 mt-1">{t('dashboard.categoriesSubtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${cat.serviceId}`}
              className={cn(
                'card-glass-hover p-6 text-center transition-all duration-300',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20 text-green-400 mx-auto mb-4">
                <cat.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-heading-sm font-semibold text-white mb-1">{t(cat.key)}</h3>
              <p className="text-caption text-canvas-400">{cat.count} {t('marketplace.servicesFound', { count: cat.count.toString() })}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services - Bento grid style */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-white">{t('dashboard.featuredServices')}</h2>
            <p className="text-body-md text-canvas-400 mt-1">{t('dashboard.featuredSubtitle')}</p>
          </div>
          <Link to="/marketplace" className="btn-ghost text-sm font-medium">
            {t('dashboard.viewAll')}
            <Search className="h-4 w-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="bento-grid">
          {featuredServices.map((service, index) => (
            <Link
              key={service.name}
              to={`/marketplace/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'card-glass-hover p-6 flex flex-col h-full transition-all duration-300',
                index >= 4 ? 'lg:col-span-2' : '',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20 mx-auto mb-4">
                <BrandIcon serviceId={service.serviceId} size={28} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-info text-xs">{t(service.category)}</span>
                <span className={cn('badge', service.status === 'running' ? 'badge-success' : 'badge-warning')}>
                  {t(service.status === 'running' ? 'marketplace.maturity.stable' : 'marketplace.maturity.beta')}
                </span>
              </div>
              <h3 className="text-heading-sm font-semibold text-white mb-2">{service.name}</h3>
              <p className="text-body-sm text-canvas-400 mb-4 line-clamp-2 flex-1">{service.desc}</p>
              <div className="flex items-center gap-3 text-caption text-canvas-400">
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
          <div className="card-glass p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md font-semibold text-white">{t('dashboard.resourceUsage')}</h2>
              <button className="btn-ghost text-sm font-medium" type="button">
                <BarChart3 className="h-4 w-4 mr-1" aria-hidden="true" />
                {t('common.view')}
              </button>
            </div>
            <div className="space-y-4">
              {resourceMetrics.map((resource) => (
                <div key={resource.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-body-sm">
                    <div className="flex items-center gap-2">
                      <resource.icon className="h-4 w-4 text-canvas-400" aria-hidden="true" />
                      <span className="text-canvas-300">{t(resource.key)}</span>
                    </div>
                    <span className="font-mono font-medium text-white">{resource.value}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700 ease-out', resource.color)}
                      style={{ width: resource.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass p-6">
            <h2 className="text-heading-md font-semibold text-white mb-6">{t('dashboard.quickActions')}</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  className={cn(
                    'btn w-full justify-start gap-3 transition-all duration-200',
                    action.primary
                      ? 'btn-primary'
                      : 'btn-secondary'
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                  {t(action.key)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Services */}
      <section className="animate-in">
        <div className="card-glass overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-heading-md font-semibold text-white">{t('dashboard.recentServices')}</h2>
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
              <tbody className="divide-y divide-white/5">
                {recentServices.map((service) => (
                  <tr key={service.name} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                          <BrandIcon serviceId={service.id} size={20} />
                        </div>
                        <span className="font-medium text-white">{service.name}</span>
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
                    <td className="px-6 py-4 text-body-sm text-canvas-400 font-mono">{service.cpu}</td>
                    <td className="px-6 py-4 text-body-sm text-canvas-400 font-mono">{service.memory}</td>
                    <td className="px-6 py-4 text-body-sm text-canvas-400 font-mono">{service.uptime}</td>
                    <td className="px-6 py-4">
                      <button className="btn-ghost p-2 hover:bg-white/5 transition-colors" aria-label={`Actions for ${service.name}`}>
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