// ─────────────────────────────────────────────
// Dashboard Page - Service Marketplace
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

const recentServices = [
  { name: 'n8n Workflow', status: 'running', cpu: '12%', memory: '256MB', uptime: '5d 12h' },
  { name: 'PostgreSQL', status: 'running', cpu: '5%', memory: '512MB', uptime: '5d 12h' },
  { name: 'Redis', status: 'running', cpu: '2%', memory: '64MB', uptime: '5d 12h' },
  { name: 'Grafana', status: 'running', cpu: '8%', memory: '128MB', uptime: '3d 4h' },
  { name: 'MinIO', status: 'stopped', cpu: '0%', memory: '0MB', uptime: '-' },
];

export function DashboardPage() {
  return (
    <div className="section animate-in">
      {/* Hero Section - Search focused per design system */ }
      <section className="py-12 lg:py-16 animate-in">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-display-lg font-bold text-canvas-900 dark:text-canvas-50 mb-4">
              Service Marketplace
            </h1>
            <p className="text-body-lg text-canvas-500 dark:text-canvas-400 mb-8">
              Discover and deploy services instantly. Search, deploy, and manage your infrastructure.
            </p>
            {/* Hero Search Bar - Primary CTA per design system */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-primary-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search services, databases, tools..."
                className="input pl-14 pr-12 py-4 text-lg rounded-xl bg-white/80 dark:bg-canvas-800/80 border border-canvas-200 dark:border-canvas-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary px-6 py-2.5 text-sm font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Per Marketplace pattern */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">Categories</h2>
            <p className="text-body-md text-canvas-500 dark:text-canvas-400 mt-1">Explore services by category</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {[
            { name: 'Automation', icon: '⚡', count: 12 },
            { name: 'AI/ML', icon: '🤖', count: 8 },
            { name: 'Databases', icon: '🗄️', count: 15 },
            { name: 'Monitoring', icon: '📊', count: 10 },
            { name: 'Storage', icon: '💾', count: 8 },
            { name: 'Security', icon: '🔒', count: 7 },
          ].map((cat, index) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${cat.name.toLowerCase()}`}
              className={cn(
                'card-elevated p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                `stagger-${index + 1}`
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-heading-sm font-semibold text-canvas-900 dark:text-canvas-50 mb-1">{cat.name}</h3>
              <p className="text-caption text-canvas-500">{cat.count} services</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services - Bento grid style */}
      <section className="mb-16 animate-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-canvas-900 dark:text-canvas-50">Featured Services</h2>
            <p className="text-body-md text-canvas-500 dark:text-canvas-400 mt-1">Popular services deployed this week</p>
          </div>
          <Link to="/marketplace" className="btn-ghost text-sm font-medium">
            View All
            <Search className="h-4 w-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="bento-grid">
          {[
            { name: 'n8n Workflow', desc: 'Extendable workflow automation', category: 'Automation', icon: '⚡', version: '1.42.0', status: 'running', stars: 42000 },
            { name: 'PostgreSQL', desc: 'Advanced open source relational database', category: 'Databases', icon: '🗄️', version: '16.0', status: 'running', stars: 12000 },
            { name: 'Redis', desc: 'In-memory data structure store', category: 'Databases', icon: '🔴', version: '7.2', status: 'running', stars: 62000 },
            { name: 'Grafana + Prometheus', desc: 'Complete observability stack', category: 'Monitoring', icon: '📊', version: '11.0', status: 'running', stars: 25000 },
            { name: 'MinIO', desc: 'High-performance S3-compatible object storage', category: 'Storage', icon: '💾', version: '2024.01', status: 'stopped', stars: 38000 },
            { name: 'Hermes AI Agent', desc: 'Self-improving AI agent by Nous Research', category: 'AI/ML', icon: '🤖', version: '1.0.0', status: 'running', stars: 8500 },
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
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-3xl mb-4">
                {service.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-info text-xs">{service.category}</span>
                <span className="badge badge-success text-xs">{service.status}</span>
              </div>
              <h3 className="text-heading-sm font-semibold text-canvas-900 dark:text-canvas-50 mb-2">{service.name}</h3>
              <p className="text-body-sm text-canvas-500 dark:text-canvas-400 mb-4 line-clamp-2 flex-1">{service.desc}</p>
              <div className="flex items-center gap-3 text-caption text-canvas-500">
                <span className="font-mono">v{service.version}</span>
                <span>⭐ {service.stars.toLocaleString()}</span>
              </div>
              <button className="btn-primary w-full mt-4">Deploy</button>
            </Link>
          ))}
        </div>
      </section>

      {/* System Resources & Quick Actions */}
      <section className="mb-16 animate-in">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card-elevated p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50">Resource Usage</h2>
              <button className="btn-ghost text-sm font-medium" type="button">
                <BarChart3 className="h-4 w-4 mr-1" aria-hidden="true" />
                Details
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: '34%', color: 'bg-primary-500' },
                { label: 'Memory', value: '68%', color: 'bg-success-500' },
                { label: 'Disk', value: '45%', color: 'bg-warning-500' },
                { label: 'Network', value: '12%', color: 'bg-primary-500' },
              ].map((resource) => (
                <div key={resource.label} className="space-y-1.5">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-canvas-500">{resource.label}</span>
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
            <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50 mb-6">Quick Actions</h2>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-start gap-3">
                <Server className="h-5 w-5" aria-hidden="true" />
                Deploy New Service
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <Database className="h-5 w-5" aria-hidden="true" />
                Add Database
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <Activity className="h-5 w-5" aria-hidden="true" />
                View Metrics
              </button>
              <button className="btn-ghost w-full justify-start gap-3">
                <HardDrive className="h-5 w-5" aria-hidden="true" />
                Manage Backups
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Services */}
      <section className="animate-in">
        <div className="card-elevated overflow-hidden">
          <div className="p-6 border-b border-canvas-200 dark:border-canvas-700 flex items-center justify-between">
            <h2 className="text-heading-md font-semibold text-canvas-900 dark:text-canvas-50">Recent Services</h2>
            <Link to="/services" className="btn-ghost text-sm font-medium">
              View All
              <Search className="h-4 w-4 ml-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Status</th>
                  <th>CPU</th>
                  <th>Memory</th>
                  <th>Uptime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-200 dark:divide-canvas-700">
                {recentServices.map((service) => (
                  <tr key={service.name} className="hover:bg-canvas-100 dark:hover:bg-canvas-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                          <Server className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="font-medium text-canvas-900 dark:text-canvas-50">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'badge',
                        service.status === 'running' ? 'badge-success' : 'badge-neutral'
                      )}>
                        {service.status}
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