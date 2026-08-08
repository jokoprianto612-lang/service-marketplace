// ─────────────────────────────────────────────
// Living Background - NVIDIA Build Style (CSS)
// ─────────────────────────────────────────────
export function LivingBackground() {
  return (
    <>
      {/* Mesh Gradients */}
      <div className="living-bg">
        <div className="living-mesh mesh-1" />
        <div className="living-mesh mesh-2" />
        <div className="living-mesh mesh-3" />
        <div className="living-mesh mesh-4" />
      </div>

      {/* Floating Orbs */}
      <div className="living-orbs">
        <div className="living-orb orb-1" />
        <div className="living-orb orb-2" />
        <div className="living-orb orb-3" />
      </div>

      {/* Grid Drift */}
      <div className="living-grid" />
    </>
  );
}