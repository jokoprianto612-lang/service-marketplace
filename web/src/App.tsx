// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { useAuthStore } from './hooks/useAuthStore';

function AppContent() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // Check auth on mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Don't render authenticated layout until auth check completes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas-50 dark:bg-canvas-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-50 dark:bg-canvas-950">
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

export function App() {
  return <AppContent />;
}