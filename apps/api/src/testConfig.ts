import type { AppConfig } from './config.js';

/** Config mínima para tests de API (EPIS2). */
export const testApiConfig = {
  NODE_ENV: 'test',
  API_HOST: '127.0.0.1',
  API_PORT: 3001,
  SESSION_SECRET: 'test-secret-min-16-chars',
  SESSION_COOKIE_NAME: 'epis2_session',
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  LOCAL_AI_BASE_URL: 'http://127.0.0.1:3002',
  OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
  RLS_MODE: 'off',
  AUTH_MODE: 'demo',
  LOG_LEVEL: 'info',
} satisfies AppConfig;
