import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/load/**', 'node_modules/**'],
    globals: true,
    restoreMocks: true,
    testTimeout: 20000,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
