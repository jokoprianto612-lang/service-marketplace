# Design System — Redesign (OkongzINC / NVIDIA Build Style)
Version: 1.0-redesign
Date: 2026-08-18
Status: Active

## Changes from MASTER.md
- Background: Deep black (#050b07) + NVIDIA green neon (#76B900) instead of purple (#7C3AED)
- Logo branding: OkongzINC (mechanical gorilla + 3D text) integrated in nav/hero
- Cards: Glassmorphism (`backdrop-filter: blur`) with subtle green glow on hover
- Typography: Plus Jakarta Sans (body) + JetBrains Mono (mono/headings) — kept same
- Buttons: `.btn-green` gradient (#76B900 → #5A8A00)
- Animation: Neural network particle canvas (HTML5 `<canvas>`) for living background

## Components Added
- `.glass-card`: glassmorphic card
- `.btn-green`: green CTA button
- `#neural-canvas`: background animation layer

## Security Note
- No CAPTCHA/CSRF added to this design file; anti-bot is handled in server code (`auth.ts`)

## Ponytail Note
- This is a visual layer add-on to existing design-system/master; not a full rewrite.
- Per-account rate limits and full bot mitigation not implemented here (see `SECURITY-AUDIT.md`).
