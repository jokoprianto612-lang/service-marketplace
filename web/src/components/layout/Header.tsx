// ─────────────────────────────────────────────
// Header Component
// ─────────────────────────────────────────────
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Bell, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../hooks/useAuthStore';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
    <header className="sticky top-0 z-30 h-16 bg-dark-900/80 border-b border-dark-700 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-dark-100"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title - hidden on mobile */}
        <div className="hidden lg:block flex-1">
          <h1 className="text-lg font-semibold text-white truncate">
            Service Marketplace
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-dark-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-dark-100 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-dark-800 transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="hidden lg:block text-sm font-medium text-dark-100">
                {user?.name || 'User'}
              </span>
              <ChevronDown className="hidden lg:block h-4 w-4 text-dark-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-dark-900 border border-dark-700 shadow-lg animate-in focus:outline-none">
                <div className="px-4 py-3 border-b border-dark-700">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:bg-dark-800 hover:text-white"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-800 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}