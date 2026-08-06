// ─────────────────────────────────────────────
// Auth Guard - Protects routes (beforeLoad handler)
// ─────────────────────────────────────────────
import { redirect } from '@tanstack/react-router';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// Read auth state directly from localStorage (Zustand persist key)
function getAuthState(): AuthState {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return { isAuthenticated: false, isLoading: false, accessToken: null, refreshToken: null };
    const parsed = JSON.parse(stored);
    return {
      isAuthenticated: !!parsed.state?.accessToken,
      isLoading: false,
      accessToken: parsed.state?.accessToken || null,
      refreshToken: parsed.state?.refreshToken || null,
    };
  } catch {
    return { isAuthenticated: false, isLoading: false, accessToken: null, refreshToken: null };
  }
}

export function AuthGuard() {
  const auth = getAuthState();

  // Note: We can't check isLoading here since we're not in React context
  // The component will handle loading state via useAuthStore

  if (!auth.isAuthenticated) {
    throw redirect({ to: '/login' });
  }
}