import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 5173,
    host: process.env.VITE_HOST || 'localhost',
    allowedHosts: ['craftyprep.demosrv.uk', 'localhost', '.demosrv.uk'],
    watch: {
      usePolling: true, // Required for Docker volume mounts
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.ts', '*.config.js'],
    },
  },
});
