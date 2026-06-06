import { defineConfig, devices } from '@playwright/test';
import { loadEnvFile } from './scripts/load-env.mjs';

loadEnvFile();

const WEB_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://127.0.0.1:5173';
const API_HEALTH_URL = process.env.PLAYWRIGHT_API_HEALTH_URL ?? 'http://127.0.0.1:3001/health';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
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
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -w @epis2/web',
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
