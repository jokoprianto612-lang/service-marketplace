// ─────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const stats = [
  { name: 'Total Services', value: '12', icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+2 this month' },
  { name: 'Running', value: '10', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', change: '83% uptime' },
  { name: 'Stopped', value: '2', icon: XCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', change: 'Pending deploy' },
  { name: 'Errors', value: '0', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', change: 'All healthy' },
];

const recentServices = [
  { name: 'n8n Workflow', status: 'running', cpu: '12%', memory: '256MB', uptime: '5d 12h' },
  { name: 'PostgreSQL', status: 'running', cpu: '5%', memory: '512MB', uptime: '5d 12h' },
  { name: 'Redis', status: 'running', cpu: '2%', memory: '64MB', uptime: '5d 12h' },
  { name: 'Grafana', status: 'running', cpu: '8%', memory: '128MB', uptime: '3d 4h' },
  { name: 'MinIO', status: 'stopped', cpu: '0%', memory: '0MB', uptime: '-' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1">Overview of your services and system health</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <TrendingUp className="h-4 w-4" />
            View Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-dark-400">{stat.name}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-dark-500 mt-1">{stat.change}</p>
              </div>
              <div className={cn('p-3 rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Resources */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Resource Usage</h2>
          <div className="space-y-4">
            {[
              { label: 'CPU Usage', value: '34%', color: 'bg-blue-500', max: 100 },
              { label: 'Memory', value: '68%', color: 'bg-green-500', max: 100 },
              { label: 'Disk', value: '45%', color: 'bg-yellow-500', max: 100 },
              { label: 'Network', value: '12%', color: 'bg-purple-500', max: 100 },
            ].map((resource) => (
              <div key={resource.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">{resource.label}</span>
                  <span className="font-medium text-white">{resource.value}</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className={cn('h-full rounded-full transition-all duration-500', resource.color)}
                    style={{ width: resource.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn-secondary w-full justify-start gap-3">
              <Server className="h-5 w-5" />
              Deploy New Service
            </button>
            <button className="btn-ghost w-full justify-start gap-3">
              <Database className="h-5 w-5" />
              Add Database
            </button>
            <button className="btn-ghost w-full justify-start gap-3">
              <Cpu className="h-5 w-5" />
              View Metrics
            </button>
            <button className="btn-ghost w-full justify-start gap-3">
              <HardDrive className="h-5 w-5" />
              Manage Backups
            </button>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="card">
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Recent Services</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">CPU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Memory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {recentServices.map((service) => (
                <tr key={service.name} className="hover:bg-dark-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-800">
                        <Server className="h-5 w-5 text-dark-400" />
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
                  <td className="px-6 py-4 text-dark-300">{service.cpu}</td>
                  <td className="px-6 py-4 text-dark-300">{service.memory}</td>
                  <td className="px-6 py-4 text-dark-300">{service.uptime}</td>
                  <td className="px-6 py-4">
                    <button className="btn-ghost p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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