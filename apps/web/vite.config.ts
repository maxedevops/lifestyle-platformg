import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    remix({
      // This tells Remix to build for Cloudflare Pages
      buildDirectory: "build",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@lifestyle/shared-types": path.resolve(__dirname, "../../packages/shared-types/src/index.ts"),
      "@lifestyle/crypto-lib": path.resolve(__dirname, "../../packages/crypto-lib/src/index.ts"),
    },
  },
  build: {
    // Remix handles the outDir, so we can usually remove the manual 'dist' setting
    commonjsOptions: {
      include: [/packages/, /node_modules/],
    },
  },
});

/*import { defineConfig } from 'vite';
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
*/