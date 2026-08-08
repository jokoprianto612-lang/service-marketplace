// ─────────────────────────────────────────────
// Header Component - NVIDIA Build Style
// ─────────────────────────────────────────────
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Bell, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTheme } from '../../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../../context/I18nContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
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
            {t('nav.title') || 'Wee Wok The Tok'}
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

          {/* Theme toggle - Elegant NVIDIA style */}
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
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20">
                <User className="h-5 w-5 text-primary-400" aria-hidden="true" />
              </div>
              <span className="hidden lg:block text-sm font-medium text-white">
                {user?.name || t('header.user') || 'User'}
              </span>
              <ChevronDown className="hidden lg:block h-4 w-4 text-canvas-400" aria-hidden="true" />
            </button>

            {userMenuOpen && (
              <div className="dropdown">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name || t('header.user') || 'User'}</p>
                  <p className="text-xs text-canvas-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  className="dropdown-item"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  {t('nav.settings') || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item text-error-400 hover:text-error-300"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {t('header.signOut') || 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}