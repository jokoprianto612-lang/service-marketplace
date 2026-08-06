// ─────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────
import {
  Server,
  Database,
  HardDrive,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const stats = [
  { name: 'Total Services', value: '12', icon: Server, color: 'text-primary-400', bg: 'bg-primary-500/10', change: '+2 this month' },
  { name: 'Running', value: '10', icon: CheckCircle, color: 'text-success-400', bg: 'bg-success-500/10', change: '83% uptime' },
  { name: 'Stopped', value: '2', icon: XCircle, color: 'text-warning-400', bg: 'bg-warning-500/10', change: 'Pending deploy' },
  { name: 'Errors', value: '0', icon: AlertTriangle, color: 'text-error-400', bg: 'bg-error-500/10', change: 'All healthy' },
];

const recentServices = [
  { name: 'n8n Workflow', status: 'running', cpu: '12%', memory: '256MB', uptime: '5d 12h' },
  { name: 'PostgreSQL', status: 'running', cpu: '5%', memory: '512MB', uptime: '5d 12h' },
  { name: 'Redis', status: 'running', cpu: '2%', memory: '64MB', uptime: '5d 12h' },
  { name: 'Grafana', status: 'running', cpu: '8%', memory: '128MB', uptime: '3d 4h' },
  { name: 'MinIO', status: 'stopped', cpu: '0%', memory: '0MB', uptime: '-' },
];

const resourceUsage = [
  { label: 'CPU Usage', value: '34%', color: 'bg-primary-500', max: 100 },
  { label: 'Memory', value: '68%', color: 'bg-success-500', max: 100 },
  { label: 'Disk', value: '45%', color: 'bg-warning-500', max: 100 },
  { label: 'Network', value: '12%', color: 'bg-primary-500', max: 100 },
];

export function DashboardPage() {
  return (
    <div className="section animate-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-display-sm font-bold text-white">Dashboard</h1>
          <p className="section-subtitle">Overview of your services and system health</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            View Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.name} className={cn('stat-card', `stagger-${index + 1}`)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm font-medium text-dark-400">{stat.name}</p>
                <p className="text-display-md font-bold text-white mt-1">{stat.value}</p>
                <p className="text-caption text-dark-500 mt-1">{stat.change}</p>
              </div>
              <div className={cn('p-3 rounded-lg', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Resources & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-elevated p-6 lg:col-span-2">
          <h2 className="text-heading-md font-semibold text-white mb-6">Resource Usage</h2>
          <div className="space-y-4">
            {resourceUsage.map((resource) => (
              <div key={resource.label} className="space-y-1.5">
                <div className="flex justify-between text-body-sm">
                  <span className="text-dark-300">{resource.label}</span>
                  <span className="font-mono font-medium text-white">{resource.value}</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
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
          <h2 className="text-heading-md font-semibold text-white mb-6">Quick Actions</h2>
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

      {/* Recent Services */}
      <div className="card-elevated">
        <div className="p-6 border-b border-dark-800">
          <h2 className="text-heading-md font-semibold text-white">Recent Services</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
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
            <tbody className="divide-y divide-dark-800">
              {recentServices.map((service) => (
                <tr key={service.name} className="hover:bg-dark-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-800">
                        <Server className="h-5 w-5 text-dark-400" aria-hidden="true" />
                      </div>
                      <span className="font-medium text-white">{service.name}</span>
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
                  <td className="px-6 py-4 text-body-sm text-dark-300 font-mono">{service.cpu}</td>
                  <td className="px-6 py-4 text-body-sm text-dark-300 font-mono">{service.memory}</td>
                  <td className="px-6 py-4 text-body-sm text-dark-300 font-mono">{service.uptime}</td>
                  <td className="px-6 py-4">
                    <button className="btn-ghost p-2" aria-label={`Actions for ${service.name}`}>
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
    </div>
  );
}