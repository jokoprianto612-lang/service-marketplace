/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Wee Wok The Tok — Remix Figma palette ──────────────
        // Primary: indigo "wedelan" (batik Solo indigo dye)
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Accent/CTA: "sogan" — the warm brown-gold of Solo batik
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Batik Solo authentic dye colors (ornaments, accents)
        batik: {
          sogan: '#8b5a2b',   // brown soga
          wedel: '#1f2a5a',   // indigo wedelan
          kelengan: '#2b2b2b',// near-black
          gading: '#f5e6c8',  // ivory / kain mori
          kuning: '#d4a017',  // gold highlight
        },
        // Canvas: true neutral scale (was incorrectly all-purple)
        canvas: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0b0b0e',
        },
        // Dark surfaces (was incorrectly all-purple)
        dark: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c0',
          400: '#8c8c98',
          500: '#6b6b78',
          600: '#52525e',
          700: '#3e3e48',
          800: '#26262e',
          900: '#17171c',
          950: '#0d0d11',
        },
        success: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d',
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        error: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
      },
      fontFamily: {
        // Remix Figma style: geometric grotesk display + clean UI body
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-hero': ['clamp(2.75rem, 7vw, 5rem)', { lineHeight: '1.04', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['clamp(1.875rem, 4vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.18', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['1.0625rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        'mono-sm': ['0.8125rem', { lineHeight: '1.6' }],
        'mono-md': ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: { '18': '4.5rem', '22': '5.5rem', '26': '6.5rem', '30': '7.5rem' },
      borderRadius: {
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
        'radius-xl': '20px',
        'radius-2xl': '28px',
        'radius-3xl': '36px',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(16 16 24 / 0.04), 0 4px 12px -2px rgb(16 16 24 / 0.06)',
        'card-hover': '0 4px 8px -2px rgb(16 16 24 / 0.08), 0 16px 32px -8px rgb(16 16 24 / 0.12)',
        'elevation-1': '0 1px 2px 0 rgb(16 16 24 / 0.05)',
        'elevation-2': '0 2px 6px -1px rgb(16 16 24 / 0.08), 0 1px 3px -1px rgb(16 16 24 / 0.06)',
        'elevation-3': '0 8px 20px -6px rgb(16 16 24 / 0.12), 0 3px 8px -4px rgb(16 16 24 / 0.08)',
        'elevation-4': '0 20px 40px -12px rgb(16 16 24 / 0.18), 0 8px 16px -8px rgb(16 16 24 / 0.1)',
        'glass': '0 4px 30px rgb(16 16 24 / 0.08), 0 1px 0 rgb(255 255 255 / 0.5) inset',
        'glass-hover': '0 8px 32px rgb(16 16 24 / 0.12), 0 1px 0 rgb(255 255 255 / 0.6) inset',
        'ring-primary': '0 0 0 3px rgb(99 102 241 / 0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-down': 'slideDown 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'stagger-in': 'staggerIn 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring-in': 'springIn 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-soft': 'pulseSoft 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'batik-drift': 'batikDrift 28s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        staggerIn: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        springIn: { '0%': { opacity: '0', transform: 'scale(0.9)' }, '50%': { transform: 'scale(1.02)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        batikDrift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(-8px,6px,0) rotate(1.5deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.12), transparent)',
        'mesh-remix': 'radial-gradient(at 12% 8%, rgb(99 102 241 / 0.14) 0px, transparent 55%), radial-gradient(at 88% 4%, rgb(245 158 11 / 0.12) 0px, transparent 50%), radial-gradient(at 76% 92%, rgb(139 90 43 / 0.10) 0px, transparent 55%)',
      },
      backdropBlur: { 'apple': '20px', 'apple-lg': '40px' },
    },
  },
  plugins: [],
};
