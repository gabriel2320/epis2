import { defineConfig } from 'vitest/config';
import { loadEnvFile } from './scripts/load-env.mjs';

loadEnvFile();

export default defineConfig({
  test: {
    globalSetup: ['./vitest.global-setup.ts'],
    setupFiles: ['./vitest.setup.ts'],
    globals: false,
    environment: 'node',
    include: ['**/*.{test,spec}.{ts,tsx,mjs}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
});
