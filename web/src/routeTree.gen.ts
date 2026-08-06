// ─────────────────────────────────────────────
// Route Tree - TanStack Router
// ─────────────────────────────────────────────
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { RootLayout } from './components/layout/RootLayout';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

export const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: MarketplacePage,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  marketplaceRoute,
]);

declare module '@tanstack/react-router' {
  interface Register {
    routeTree: typeof routeTree;
  }
}