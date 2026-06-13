import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16).default('epis2-dev-session-secret-change-me'),
  SESSION_COOKIE_NAME: z.string().default('epis2_session'),
  WEB_ORIGIN: z.string().url().default('http://127.0.0.1:5173'),
  LOCAL_AI_BASE_URL: z.string().url().default('http://127.0.0.1:3002'),
  /** Opcional — debe coincidir con LOCAL_AI_API_KEY del servicio local-ai. */
  LOCAL_AI_API_KEY: z.string().min(16).optional(),
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
  LANGUAGETOOL_BASE_URL: z.string().url().optional(),
  RLS_MODE: z.enum(['off', 'enforce']).default('off'),
  AUTH_MODE: z.enum(['demo', 'hybrid']).default('demo'),
  SERVICE_API_KEY: z.string().min(32).optional(),
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

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const config = envSchema.parse(env);
  assertProductionRlsEnforced(config);
  return config;
}

/** Fail-closed: staging/producción exigen RLS_MODE=enforce (MF-155). */
export function assertProductionRlsEnforced(config: AppConfig): void {
  if (config.NODE_ENV === 'production' && config.RLS_MODE !== 'enforce') {
    throw new Error(
      'Fail-closed: NODE_ENV=production requiere RLS_MODE=enforce. Ver docs/ops/RLS_STAGING_RUNBOOK.md',
    );
  }
}
