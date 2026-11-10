/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // three.js is lazy-loaded in its own chunk; it is large by nature.
  build: { chunkSizeWarningLimit: 1200 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'scripts/lib/**/*.mjs'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/**/shaders/**'],
      thresholds: {
        lines: 70,
        'src/lib/**': { lines: 90 },
        'src/state/**': { lines: 90 },
        'scripts/lib/**': { lines: 90 },
      },
    },
  },
});
