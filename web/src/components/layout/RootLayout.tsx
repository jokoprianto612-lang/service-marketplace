// ─────────────────────────────────────────────
// Root Layout with Outlet
// ─────────────────────────────────────────────
import { Outlet } from '@tanstack/react-router';
import { LivingBackground } from '../decor/LivingBackground';

export function RootLayout() {
  return (
    <>
      <LivingBackground />
      <Outlet />
    </>
  );
}