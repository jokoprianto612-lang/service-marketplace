// ─────────────────────────────────────────────
// Route Tree - TanStack Router
// ─────────────────────────────────────────────
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { App } from './App';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

export const rootRoute = createRootRoute({
  component: App,
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