// ─────────────────────────────────────────────
// Sidebar Navigation
// ─────────────────────────────────────────────
import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Store,
  Server,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'My Services', href: '/services', icon: Server },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-dark-950 border-r border-dark-800 transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn('flex h-16 items-center px-4 border-b border-dark-800', collapsed && 'justify-center')}>
          <Link
            to="/"
            className="flex items-center gap-2"
            style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', transition: 'opacity 150ms ease, width 150ms ease' }}
            aria-label="Service Marketplace"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 flex-shrink-0">
              <Store className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-base text-white whitespace-nowrap">Service Marketplace</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms ease' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-dark-100'
                )}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-4 border-t border-dark-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-dark-400 hover:bg-dark-800 hover:text-dark-100 transition-colors',
              collapsed && 'justify-center'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}