// ─────────────────────────────────────────────
// Header Component - NVIDIA Build Style
// ─────────────────────────────────────────────
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Bell, Sun, Moon, MoonStars, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTheme } from '../../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../../context/I18nContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-white/10 backdrop-blur-2xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-canvas-400 hover:bg-white/5 hover:text-canvas-100 transition-colors"
          aria-label={t('nav.menu') || 'Toggle menu'}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Page title - hidden on mobile */}
        <div className="hidden lg:block flex-1">
          <h1 className="text-heading-sm font-semibold text-white truncate">
            {t('nav.title') || 'Service Marketplace'}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-canvas-400 hover:bg-white/5 hover:text-white transition-colors" aria-label={t('header.notifications')}>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
              3
            </span>
          </button>

          {/* Theme toggle - Elegant NVIDIA style with moon/sun */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg text-canvas-400 hover:bg-white/5 hover:text-white transition-all duration-200"
            aria-label={theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* User menu */}
          <div ref={userMenuRef} className="hidden lg:block items-center gap-2">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="relative p-2 rounded-lg text-canvas-400 hover:bg-white/5 hover:text-white transition-colors" aria-label={t('header.profile')}>
              <User className="h-5 w-5" aria-hidden="true" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white/90 backdrop-blur-2xl shadow-lg p-4 border border-white/10">
                <span className="font-medium text-canvas-600 mb-2">{t('header.user')}: {user?.name || 'User'}</span>
                <button onClick={handleLogout} className="w-full py-2 px-4 text-left text-canvas-600 hover:bg-red-50/50 rounded-md mb-2">
                  {t('header.signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}