// ─────────────────────────────────────────────
// Batik Solo Ornament — Wee Wok The Tok
// Authentic Surakarta (Solo) motifs rendered as SVG:
//   • Parang Barong  — diagonal "sword" S-curve, the keraton motif
//   • Truntum        — small stars, symbol of rekindled love
//   • Kawung         — interlocking aren-palm ellipses
// Placed at the top-left and bottom-right corners of the app shell.
// Uses `currentColor` so it inherits light/dark palette.
// ─────────────────────────────────────────────
import { cn } from '../../utils/cn';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface BatikCornerProps {
  corner: Corner;
  /** Ornament size in px (square). */
  size?: number;
  className?: string;
}

const cornerPosition: Record<Corner, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0 -scale-x-100',
  'bottom-left': 'bottom-0 left-0 -scale-y-100',
  'bottom-right': 'bottom-0 right-0 rotate-180',
};

export function BatikCorner({ corner, size = 320, className }: BatikCornerProps) {
  // Unique pattern ids per corner — duplicate ids break SVG <defs> resolution.
  const uid = corner.replace(/-/g, '');

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-0 select-none',
        'text-batik-sogan/70 dark:text-batik-kuning/25',
        'animate-batik-drift motion-reduce:animate-none',
        cornerPosition[corner],
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          {/* Parang Barong — diagonal sweeping "sword" strokes */}
          <pattern
            id={`parang-${uid}`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <path
              d="M0 40 C 14 40, 20 22, 34 22 C 48 22, 54 40, 68 40 L 68 52 C 54 52, 48 34, 34 34 C 20 34, 14 52, 0 52 Z"
              fill="currentColor"
              fillOpacity="0.55"
            />
            <circle cx="18" cy="66" r="3" fill="currentColor" fillOpacity="0.45" />
            <circle cx="34" cy="72" r="2" fill="currentColor" fillOpacity="0.35" />
            <circle cx="50" cy="66" r="3" fill="currentColor" fillOpacity="0.45" />
            <path d="M0 12 C 16 12, 22 0, 36 0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" />
            <path d="M44 80 C 58 80, 64 68, 80 68" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" />
          </pattern>

          {/* Truntum — tiny eight-point stars */}
          <pattern id={`truntum-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <g fill="currentColor">
              <path d="M20 8 L22 17 L31 20 L22 23 L20 32 L18 23 L9 20 L18 17 Z" fillOpacity="0.5" />
              <circle cx="20" cy="20" r="1.6" fillOpacity="0.7" />
              <circle cx="4" cy="4" r="1.2" fillOpacity="0.35" />
              <circle cx="36" cy="36" r="1.2" fillOpacity="0.35" />
              <circle cx="36" cy="4" r="1.2" fillOpacity="0.35" />
              <circle cx="4" cy="36" r="1.2" fillOpacity="0.35" />
            </g>
          </pattern>

          {/* Kawung — interlocking aren-palm ellipses */}
          <pattern id={`kawung-${uid}`} width="56" height="56" patternUnits="userSpaceOnUse">
            <g stroke="currentColor" fill="none" strokeWidth="1.6" strokeOpacity="0.45">
              <ellipse cx="14" cy="28" rx="12" ry="9" />
              <ellipse cx="42" cy="28" rx="12" ry="9" />
              <ellipse cx="28" cy="14" rx="9" ry="12" />
              <ellipse cx="28" cy="42" rx="9" ry="12" />
            </g>
            <circle cx="28" cy="28" r="2" fill="currentColor" fillOpacity="0.5" />
          </pattern>

          <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`mask-${uid}`}>
            <rect width="320" height="320" fill={`url(#fade-${uid})`} />
          </mask>
        </defs>

        <g mask={`url(#mask-${uid})`}>
          <rect width="320" height="320" fill={`url(#parang-${uid})`} />
          <rect width="320" height="320" fill={`url(#truntum-${uid})`} opacity="0.5" />
          <rect width="150" height="150" fill={`url(#kawung-${uid})`} opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Batik ornaments for the whole app shell: Solo motif in the
 * top-left and bottom-right corners, as specified for this app.
 */
export function BatikBackdrop() {
  return (
    <>
      <BatikCorner corner="top-left" size={340} />
      <BatikCorner corner="bottom-right" size={340} />
    </>
  );
}
