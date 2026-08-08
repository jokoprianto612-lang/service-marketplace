import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_TIMESTAMP = Date.now();
const BUILD_RANDOM = Math.random().toString(36).substring(2, 9);
const BUILD_ID = `build-${BUILD_TIMESTAMP}-${BUILD_RANDOM}`;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@svcmarket/shared-types': path.resolve(__dirname, '../shared/types/src'),
      '@svcmarket/shared-constants': path.resolve(__dirname, '../shared/constants/src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: `assets/index-[hash]-${BUILD_TIMESTAMP}.js`,
        chunkFileNames: `assets/[name]-[hash]-${BUILD_TIMESTAMP}.js`,
        assetFileNames: `assets/[name]-[hash]-${BUILD_TIMESTAMP}.[ext]`,
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-query', '@tanstack/react-router'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },
  define: {
    'import.meta.env.VITE_BUILD_TIMESTAMP': JSON.stringify(BUILD_TIMESTAMP),
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(BUILD_ID),
    'import.meta.env.VITE_FORCE_REBUILD': 'true',
    'import.meta.env.CF_PAGES_FORCE_REBUILD': 'true',
  },
});