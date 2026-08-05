// ─────────────────────────────────────────────
// Route Tree - TanStack Router
// ─────────────────────────────────────────────
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from './components/layout/RootLayout';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { ServiceDetailPage } from './pages/marketplace/ServiceDetailPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceDetailManagePage } from './pages/services/ServiceDetailManagePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AuthGuard } from './components/auth/AuthGuard';

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
  beforeLoad: AuthGuard,
});

export const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: MarketplacePage,
  beforeLoad: AuthGuard,
});

export const marketplaceDetailRoute = createRoute({
  getParentRoute: () => marketplaceRoute,
  path: '/$serviceId',
  component: ServiceDetailPage,
  beforeLoad: AuthGuard,
});

export const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
  beforeLoad: AuthGuard,
});

export const serviceManageRoute = createRoute({
  getParentRoute: () => servicesRoute,
  path: '/$serviceId',
  component: ServiceDetailManagePage,
  beforeLoad: AuthGuard,
});

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
  beforeLoad: AuthGuard,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  marketplaceRoute.addChildren([marketplaceDetailRoute]),
  servicesRoute.addChildren([serviceManageRoute]),
  settingsRoute,
  loginRoute,
  registerRoute,
]);

declare module '@tanstack/react-router' {
  interface Register {
    routeTree: typeof routeTree;
  }
}