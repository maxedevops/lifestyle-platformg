import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows you to use '~/hooks' instead of '../../hooks'
      '~': path.resolve(__dirname, './app'),
      // Explicitly mapping the workspaces for the build tool
      '@lifestyle/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
      '@lifestyle/crypto-lib': path.resolve(__dirname, '../../packages/crypto-lib/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Ensures that Vite doesn't ignore files outside of apps/web
    commonjsOptions: {
      include: [/packages/, /node_modules/],
    },
  },
});