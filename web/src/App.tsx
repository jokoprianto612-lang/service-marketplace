// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { useAuthStore } from './hooks/useAuthStore';

export function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Check auth on mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-dark-950 dark:bg-dark-950">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1e293b', color: '#f1f5f9' },
          success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
        }}
      />
      {isAuthenticated && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      )}
      {!isAuthenticated && <Outlet />}
    </div>
  );
}