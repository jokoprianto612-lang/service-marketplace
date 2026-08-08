// ─────────────────────────────────────────────
// Elegant Corner Accent - NVIDIA Build Style
// Subtle geometric corner accents instead of heavy batik
// ─────────────────────────────────────────────
import { cn } from '../../utils/cn';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerAccentProps {
  corner: Corner;
  size?: number;
  className?: string;
}

const cornerPosition: Record<Corner, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

export function CornerAccent({ corner, size = 120, className }: CornerAccentProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-0 select-none',
        'opacity-30 dark:opacity-20',
        'transition-opacity duration-500',
        cornerPosition[corner],
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          {/* Gradient for the geometric lines */}
          <linearGradient id="corner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
          </linearGradient>
          
          {/* Fade gradient for mask - defined BEFORE mask */}
          <linearGradient id="fade-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          
          {/* Mask using the fade gradient */}
          <mask id="corner-fade">
            <rect width="120" height="120" fill="url(#fade-gradient)" />
          </mask>
        </defs>
        
        {/* Apply mask to the entire content */}
        <g mask="url(#corner-fade)">
          {/* Subtle geometric lines - top-left style */}
          <g stroke="url(#corner-gradient)" strokeWidth="1.5" strokeLinecap="round">
            {/* Horizontal line */}
            <line x1="10" y1="10" x2="60" y2="10" />
            {/* Vertical line */}
            <line x1="10" y1="10" x2="10" y2="60" />
            {/* Inner accent lines */}
            <line x1="20" y1="20" x2="50" y2="20" strokeOpacity="0.4" />
            <line x1="20" y1="20" x2="20" y2="50" strokeOpacity="0.4" />
            {/* Corner bracket */}
            <path d="M10 30 L10 40 L20 40" fill="none" strokeOpacity="0.3" />
            <path d="M30 10 L40 10 L40 20" fill="none" strokeOpacity="0.3" />
          </g>
          
          {/* Subtle dots pattern */}
          <g fill="currentColor" opacity="0.25">
            <circle cx="70" cy="15" r="1.5" />
            <circle cx="15" cy="70" r="1.5" />
            <circle cx="55" cy="55" r="1" opacity="0.15" />
            <circle cx="85" cy="25" r="1" opacity="0.1" />
            <circle cx="25" cy="85" r="1" opacity="0.1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function CornerAccents() {
  return (
    <>
      <CornerAccent corner="top-left" size={140} />
      <CornerAccent corner="bottom-right" size={140} />
    </>
  );
}