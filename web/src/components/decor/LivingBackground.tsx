// ─────────────────────────────────────────────
// Living Background Component - NVIDIA Build Style
// ─────────────────────────────────────────────
export function LivingBackground() {
  return (
    <>
      {/* Base living background with mesh gradients */}
      <div className="living-bg" aria-hidden="true" />
      
      {/* Mesh gradient overlay */}
      <div className="mesh-gradient" aria-hidden="true" />
      
      {/* Floating orbs */}
      <div className="living-orb orb-1" aria-hidden="true" />
      <div className="living-orb orb-2" aria-hidden="true" />
      <div className="living-orb orb-3" aria-hidden="true" />
    </>
  );
}