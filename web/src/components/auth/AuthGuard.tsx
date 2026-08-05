// ─────────────────────────────────────────────
// Auth Guard - Protects routes
// ─────────────────────────────────────────────
import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../../hooks/useAuthStore';

export function AuthGuard() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  if (isLoading) {
    return null; // Let the route load, component will handle loading state
  }

  if (!isAuthenticated) {
    throw redirect({ to: '/login' });
  }
}