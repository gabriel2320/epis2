import { describe, expect, it } from 'vitest';
import {
  assertDeploymentGuards,
  assertProductionRlsEnforced,
  DEV_SESSION_SECRET_DEFAULT,
  isDemoAuthEnabled,
  loadConfig,
  type AppConfig,
} from './config.js';

const baseConfig = (): AppConfig => ({
  NODE_ENV: 'development',
  API_HOST: '0.0.0.0',
  API_PORT: 3001,
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  LOCAL_AI_BASE_URL: 'http://127.0.0.1:3002',
  OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
  SESSION_SECRET: DEV_SESSION_SECRET_DEFAULT,
  SESSION_COOKIE_NAME: 'epis2_session',
  RLS_MODE: 'off',
  AUTH_MODE: 'demo',
  LOG_LEVEL: 'info',
  OTEL_ENABLED: false,
  OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:4318',
  OTEL_SERVICE_NAME: 'epis2-api',
});

describe('assertProductionRlsEnforced', () => {
  it('permite development con RLS_MODE=off', () => {
    expect(() => assertProductionRlsEnforced(baseConfig())).not.toThrow();
  });

  it('rechaza staging sin RLS_MODE=enforce', () => {
    expect(() =>
      assertProductionRlsEnforced({ ...baseConfig(), NODE_ENV: 'staging', RLS_MODE: 'off' }),
    ).toThrow(/RLS_MODE=enforce/);
  });

  it('rechaza production sin RLS_MODE=enforce', () => {
    expect(() =>
      assertProductionRlsEnforced({ ...baseConfig(), NODE_ENV: 'production', RLS_MODE: 'off' }),
    ).toThrow(/RLS_MODE=enforce/);
  });
});

describe('assertDeploymentGuards', () => {
  it('rechaza production sin AUTH_MODE=production', () => {
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'production',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'demo',
          SESSION_SECRET: 'production-session-value-min-32-chars',
        },
        { SESSION_SECRET: 'production-session-value-min-32-chars' },
      ),
    ).toThrow(/AUTH_MODE=production/);
  });

  it('rechaza staging con SESSION_SECRET default dev', () => {
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'production',
        },
        {},
      ),
    ).toThrow(/SESSION_SECRET/);
  });

  it('acepta staging con RLS enforce y secret explícito', () => {
    const explicitSessionToken = 'staging-session-value-min-32-chars';
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'hybrid',
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
          SERVICE_API_KEY: 'staging-service-api-key-min-32-chars-long',
        },
        {
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
          SERVICE_API_KEY: 'staging-service-api-key-min-32-chars-long',
        },
      ),
    ).not.toThrow();
  });

  it('rechaza staging sin REDIS_URL (MF-CON-07)', () => {
    const explicitSessionToken = 'staging-session-value-min-32-chars';
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'production',
          SESSION_SECRET: explicitSessionToken,
        },
        { SESSION_SECRET: explicitSessionToken },
      ),
    ).toThrow(/REDIS_URL/);
  });

  it('rechaza staging con AUTH_MODE=demo (RH-07)', () => {
    const explicitSessionToken = 'staging-session-value-min-32-chars';
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'demo',
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
        },
        {
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
        },
      ),
    ).toThrow(/AUTH_MODE=demo/);
  });

  it('rechaza staging hybrid sin SERVICE_API_KEY (RH-07)', () => {
    const explicitSessionToken = 'staging-session-value-min-32-chars';
    expect(() =>
      assertDeploymentGuards(
        {
          ...baseConfig(),
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'hybrid',
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
        },
        {
          SESSION_SECRET: explicitSessionToken,
          REDIS_URL: 'redis://127.0.0.1:6379',
        },
      ),
    ).toThrow(/SERVICE_API_KEY/);
  });
});

describe('isDemoAuthEnabled', () => {
  it('permite demo en development', () => {
    expect(isDemoAuthEnabled(baseConfig())).toBe(true);
  });

  it('bloquea demo en staging', () => {
    expect(isDemoAuthEnabled({ ...baseConfig(), NODE_ENV: 'staging', RLS_MODE: 'enforce' })).toBe(
      false,
    );
  });

  it('bloquea demo en production auth mode en dev node', () => {
    expect(isDemoAuthEnabled({ ...baseConfig(), AUTH_MODE: 'production' })).toBe(false);
  });
});

describe('loadConfig', () => {
  it('aplica fail-closed en production sin RLS', () => {
    expect(() =>
      loadConfig({
        NODE_ENV: 'production',
        SESSION_SECRET: 'production-session-value-min-32-chars-long',
        RLS_MODE: 'off',
        AUTH_MODE: 'production',
      }),
    ).toThrow(/RLS_MODE=enforce/);
  });
});
