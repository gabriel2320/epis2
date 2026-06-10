import { describe, expect, it } from 'vitest';
import { assertProductionRlsEnforced, loadConfig } from './config.js';

describe('assertProductionRlsEnforced', () => {
  it('permite development con RLS_MODE=off', () => {
    expect(() =>
      assertProductionRlsEnforced({
        NODE_ENV: 'development',
        API_HOST: '0.0.0.0',
        API_PORT: 3001,
        WEB_ORIGIN: 'http://127.0.0.1:5173',
        LOCAL_AI_BASE_URL: 'http://127.0.0.1:3002',
        OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
        SESSION_SECRET: 'epis2-dev-session-secret-change-me',
        SESSION_COOKIE_NAME: 'epis2_session',
        RLS_MODE: 'off',
        AUTH_MODE: 'demo',
        LOG_LEVEL: 'info',
      }),
    ).not.toThrow();
  });

  it('rechaza production sin RLS_MODE=enforce', () => {
    expect(() =>
      assertProductionRlsEnforced({
        NODE_ENV: 'production',
        API_HOST: '0.0.0.0',
        API_PORT: 3001,
        WEB_ORIGIN: 'http://127.0.0.1:5173',
        LOCAL_AI_BASE_URL: 'http://127.0.0.1:3002',
        OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
        SESSION_SECRET: 'epis2-dev-session-secret-change-me',
        SESSION_COOKIE_NAME: 'epis2_session',
        RLS_MODE: 'off',
        AUTH_MODE: 'demo',
        LOG_LEVEL: 'info',
      }),
    ).toThrow(/RLS_MODE=enforce/);
  });

  it('loadConfig aplica fail-closed en production', () => {
    expect(() =>
      loadConfig({
        NODE_ENV: 'production',
        SESSION_SECRET: 'epis2-dev-session-secret-change-me',
        RLS_MODE: 'off',
      }),
    ).toThrow(/RLS_MODE=enforce/);
  });
});
