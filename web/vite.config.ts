import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_TIMESTAMP = Date.now();

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
    minify: 'terser',
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
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(`build-${BUILD_TIMESTAMP}`),
  },
});