// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { useAuthStore } from './hooks/useAuthStore';

export function App({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Check auth on mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-dark-950 dark:bg-dark-950">
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
      {children}
    </div>
  );
}