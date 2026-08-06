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
        // Apple-like: Light-first, premium neutral palette
        // Canvas colors
        canvas: {
          50: '#fbfbfd',
          100: '#f5f5f7',
          200: '#eaeaed',
          300: '#d2d2d7',
          400: '#a1a1a6',
          500: '#86868b',
          600: '#6e6e73',
          700: '#57575c',
          800: '#424245',
          900: '#1d1d1f',
          950: '#0f0f10',
        },
        // System blue - Apple's primary accent
        accent: {
          50: '#e8f1fe',
          100: '#d1e3fd',
          200: '#a3c7fa',
          300: '#75aaf7',
          400: '#478df4',
          500: '#0071e3',  // Apple Blue
          600: '#0061c2',
          700: '#004fa0',
          800: '#003d7e',
          900: '#002d5c',
        },
        // Semantic colors - refined
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#30d158',  // Apple Green
          600: '#28c046',
          700: '#22a43e',
          800: '#1d8a35',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ff9f0a',  // Apple Orange
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff453a',  // Apple Red
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['SF Pro Display', 'SF Pro Text', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Apple's type scale
        'display-hero': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'mono-sm': ['0.8125rem', { lineHeight: '1.6', fontFamily: 'var(--font-mono)' }],
        'mono-md': ['0.875rem', { lineHeight: '1.6', fontFamily: 'var(--font-mono)' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'radius-sm': '6px',
        'radius-md': '10px',
        'radius-lg': '14px',
        'radius-xl': '18px',
        'radius-2xl': '28px',
        'radius-3xl': '40px',
      },
      boxShadow: {
        // Apple-style shadows: subtle, layered, never harsh
        'apple-xs': '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 1px 0 rgb(0 0 0 / 0.02)',
        'apple-sm': '0 2px 4px 0 rgb(0 0 0 / 0.04), 0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'apple-md': '0 4px 8px 0 rgb(0 0 0 / 0.05), 0 2px 4px 0 rgb(0 0 0 / 0.03)',
        'apple-lg': '0 8px 16px 0 rgb(0 0 0 / 0.06), 0 4px 8px 0 rgb(0 0 0 / 0.04)',
        'apple-xl': '0 16px 32px 0 rgb(0 0 0 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.05)',
        // Glassmorphism shadows
        'glass': '0 4px 30px rgb(0 0 0 / 0.08), 0 1px 0 rgb(255 255 255 / 0.1) inset',
        'glass-hover': '0 8px 32px rgb(0 0 0 / 0.1), 0 1px 0 rgb(255 255 255 / 0.15) inset',
      },
      animation: {
        'fade-in': 'fadeIn 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-down': 'slideDown 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'stagger-in': 'staggerIn 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring-in': 'springIn 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-soft': 'pulseSoft 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        springIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.1), transparent)',
        'apple-mesh': 'radial-gradient(ellipse at 50% 50%, rgb(0 113 227 / 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgb(48 176 248 / 0.08) 0%, transparent 40%)',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },
    },
  },
  plugins: [],
};