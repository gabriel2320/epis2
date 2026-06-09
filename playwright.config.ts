import { defineConfig, devices } from '@playwright/test';
import { loadEnvFile } from './scripts/load-env.mjs';

loadEnvFile();

const WEB_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://127.0.0.1:5173';
const API_HEALTH_URL = process.env.PLAYWRIGHT_API_HEALTH_URL ?? 'http://127.0.0.1:3001/health';
const isCi = Boolean(process.env.CI);

/** CI usa preview (bundle) — vite dev falla al resolver @mui/material/styles vía Node ESM en Linux. */
const WEB_SERVER_COMMAND = isCi
  ? 'npm run preview -w @epis2/web -- --host 127.0.0.1 --port 5173'
  : 'npm run dev -w @epis2/web';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: 1,
  reporter: isCi ? [['github'], ['list']] : [['list']],
  timeout: 60_000,
  use: {
    baseURL: WEB_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run dev -w @epis2/api',
      url: API_HEALTH_URL,
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
    {
      command: WEB_SERVER_COMMAND,
      url: WEB_URL,
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
  ],
});
