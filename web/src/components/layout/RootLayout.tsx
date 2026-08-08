// ─────────────────────────────────────────────
// Root Layout with Outlet
// ─────────────────────────────────────────────
import { Outlet } from '@tanstack/react-router';
import { BatikBackdrop } from '../decor/BatikCorner';

export function RootLayout() {
  return (
    <>
      <BatikBackdrop />
      <Outlet />
    </>
  );
}