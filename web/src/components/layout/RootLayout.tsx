// ─────────────────────────────────────────────
// Root Layout with Outlet
// ─────────────────────────────────────────────
import { Outlet } from '@tanstack/react-router';
import { CornerAccents } from '../decor/CornerAccent';

export function RootLayout() {
  return (
    <>
      <CornerAccents />
      <Outlet />
    </>
  );
}