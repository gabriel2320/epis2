import { defineConfig } from 'vitest/config';
import { loadEnvFile } from './scripts/load-env.mjs';

loadEnvFile();

const hasIntegrationDb = Boolean(process.env.DATABASE_URL?.trim());
const integrationTimeout = hasIntegrationDb ? 30_000 : 5_000;

export default defineConfig({
  test: {
    // Una sola Postgres: evita carreras entre suites de integración.
    fileParallelism: hasIntegrationDb ? false : undefined,
    testTimeout: integrationTimeout,
    hookTimeout: integrationTimeout,
    globalSetup: ['./vitest.global-setup.ts'],
    setupFiles: ['./vitest.setup.ts'],
    globals: false,
    environment: 'node',
    include: ['**/*.{test,spec}.{ts,tsx,mjs}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', 'e2e/**'],
  },
});
