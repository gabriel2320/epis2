import { z } from 'zod';

/** Default dev-only — staging/production must override via env (MF-CON-04). */
export const DEV_SESSION_SECRET_DEFAULT = 'epis2-dev-session-secret-change-me';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16).default(DEV_SESSION_SECRET_DEFAULT),
  SESSION_COOKIE_NAME: z.string().default('epis2_session'),
  WEB_ORIGIN: z.string().url().default('http://127.0.0.1:5173'),
  LOCAL_AI_BASE_URL: z.string().url().default('http://127.0.0.1:3002'),
  /** Opcional — debe coincidir con LOCAL_AI_API_KEY del servicio local-ai. */
  LOCAL_AI_API_KEY: z.string().min(16).optional(),
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
  LANGUAGETOOL_BASE_URL: z.string().url().optional(),
  RLS_MODE: z.enum(['off', 'enforce']).default('off'),
  AUTH_MODE: z.enum(['demo', 'hybrid', 'production']).default('demo'),
  SERVICE_API_KEY: z.string().min(32).optional(),
  /** Rate limit store — obligatorio en staging/production (MF-CON-07). */
  REDIS_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  // MF-NORM-203: OTel mínimo — off por defecto en dev; spans solo con flag explícito.
  OTEL_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().default('http://127.0.0.1:4318'),
  OTEL_SERVICE_NAME: z.string().min(1).default('epis2-api'),
});

export type AppConfig = z.infer<typeof envSchema>;

export function isDeployedEnv(nodeEnv: AppConfig['NODE_ENV']): boolean {
  return nodeEnv === 'staging' || nodeEnv === 'production';
}

/** Demo synthetic users — allowed only in dev/test with demo/hybrid (MF-CON-05). */
export function isDemoAuthEnabled(config: AppConfig): boolean {
  if (isDeployedEnv(config.NODE_ENV)) return false;
  if (config.AUTH_MODE === 'production') return false;
  return config.AUTH_MODE === 'demo' || config.AUTH_MODE === 'hybrid';
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const config = envSchema.parse(env);
  assertDeploymentGuards(config, env);
  return config;
}

/** Fail-closed deployment guards (MF-CON-04 / MF-155). */
export function assertDeploymentGuards(
  config: AppConfig,
  env: NodeJS.ProcessEnv = process.env,
): void {
  assertProductionRlsEnforced(config);
  if (config.NODE_ENV === 'production' && config.AUTH_MODE !== 'production') {
    throw new Error('Fail-closed: NODE_ENV=production requiere AUTH_MODE=production.');
  }
  if (isDeployedEnv(config.NODE_ENV)) {
    const explicitSecret = env.SESSION_SECRET?.trim();
    if (!explicitSecret || explicitSecret === DEV_SESSION_SECRET_DEFAULT) {
      throw new Error(
        'Fail-closed: staging/production requieren SESSION_SECRET explícito (no default dev).',
      );
    }
    const redisUrl = env.REDIS_URL?.trim();
    if (!redisUrl) {
      throw new Error('Fail-closed: staging/production requieren REDIS_URL (rate limit).');
    }
  }
}

/** @deprecated Use assertDeploymentGuards — kept for existing tests/imports. */
export function assertProductionRlsEnforced(config: AppConfig): void {
  if (isDeployedEnv(config.NODE_ENV) && config.RLS_MODE !== 'enforce') {
    throw new Error(
      'Fail-closed: staging/production requieren RLS_MODE=enforce. Ver docs/ops/RLS_STAGING_RUNBOOK.md',
    );
  }
}
