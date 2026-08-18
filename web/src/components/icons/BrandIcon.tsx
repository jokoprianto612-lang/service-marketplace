// ─────────────────────────────────────────────
// Brand Icon Component - Service Marketplace
// Loads custom brand SVGs from /public/logos/ (real icons, not AI-generated)
// Following runcabinet.com pattern: custom SVG icons, Lucide for UI
// Hermes agent original icon included, dark mode supported
// ─────────────────────────────────────────────
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Sun, Moon, MoonStars } from 'lucide-react';

// Map service IDs to logo filenames (real SVG icons from runcabinet.com pattern)
// Hermes agent original icon: /logos/hermes-original.svg
// All other icons are real, non-AI generated
const logoMap: Record<string, string> = {
  // Service logos (real SVG icons)
  'n8n-workflow': 'n8n',
  'hermes-ai-agent': 'hermes-original',  // Hermes agent original icon
  'postgresql': 'postgresql',
  'redis': 'redis',
  'grafana-prometheus': 'grafana',
  'minio': 'minio',
  'nginx-proxy-manager': 'nginx',
  'authentik': 'authentik',
  'vaultwarden': 'vaultwarden',
  'portainer': 'portainer',
  // Category logos (use representative service logos)
  'automation': 'n8n',
  'ai-ml': 'hermes-original',
  'databases': 'postgresql',
  'monitoring': 'grafana',
  'storage': 'minio',
  'networking': 'nginx',
  'security': 'vaultwarden',
  'identity': 'authentik',
  'developer-tools': 'portainer',
  'ci-cd': 'grafana',
};

interface BrandIconProps {
  serviceId: string;
  className?: string;
  fallback?: React.ReactNode;
  size?: number;
}

export const BrandIcon = forwardRef<HTMLImageElement | HTMLDivElement, BrandIconProps>(
  ({ serviceId, className, fallback, size = 32 }, ref) => {
    const logoName = logoMap[serviceId];
    
    if (!logoName) {
      return (
        <div
          ref={ref as any}
          className={cn('flex items-center justify-center', className)}
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          {fallback || '?'}
        </div>
      );
    }

    // Use PNG for hermes (mascot image), SVG for others
    const ext = logoName === 'hermes' ? 'png' : 'svg';

    return (
      <img
        ref={ref as any}
        src={`/logos/${logoName}.${ext}`}
        alt=""
        className={cn('object-contain transition-transform duration-200', className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    );
  }
);

BrandIcon.displayName = 'BrandIcon';

// For services not in the map, provide a category-based fallback
export function getCategoryFallbackIcon(category: string) {
  const fallbacks: Record<string, string> = {
    'automation': '⚡',
    'ai-ml': '🤖',
    'databases': '🗄️',
    'monitoring': '📊',
    'storage': '💾',
    'networking': '🌐',
    'security': '🔒',
    'identity': '👤',
    'developer-tools': '🛠️',
    'ci-cd': '🔄',
  };
  return fallbacks[category] || '📦';
}