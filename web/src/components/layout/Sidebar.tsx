// ─────────────────────────────────────────────
// Sidebar Navigation - NVIDIA Build Style
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
import { useI18n } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
  { name: 'nav.dashboard', href: '/', icon: LayoutDashboard },
  { name: 'nav.marketplace', href: '/marketplace', icon: Store },
  { name: 'nav.deployments', href: '/services', icon: Server },
  { name: 'nav.settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] glass border-r border-white/10 transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn('flex h-14 items-center px-4 border-b border-white/10', collapsed && 'justify-center')}>
          <Link
            to="/"
            className="flex items-center gap-2"
            style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', transition: 'opacity 150ms ease, width 150ms ease' }}
            aria-label={t('app.name')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20 flex-shrink-0 border border-primary-500/30">
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-primary-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-primary-400" aria-hidden="true" />
              )}
            </div>
            <span className="font-semibold text-base text-white whitespace-nowrap">{t('app.name')}</span>
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
                  'flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-primary-50/20 hover:text-primary-400 transition-colors',
                  isActive && 'bg-primary-500/10 text-primary-400'
                )}
                aria-current="page"
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium text-sm text-canvas-400 whitespace-nowrap">{t(item.name)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle at bottom of sidebar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center rounded-lg px-3 py-2 text-sm text-canvas-400 hover:bg-primary-500/20 transition-colors"
            aria-label={theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 mr-2" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 mr-2" aria-hidden="true" />
            )}
            {theme === 'dark' ? t('settings.light') : t('settings.dark')}
          </button>
        </div>

        {/* Collapse toggle */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-canvas-400 hover:bg-white/5 hover:text-white transition-colors',
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
                <span>{t('common.collapse')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
