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
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
  RLS_MODE: z.enum(['off', 'enforce']).default('off'),
  AUTH_MODE: z.enum(['demo', 'hybrid']).default('demo'),
  SERVICE_API_KEY: z.string().min(32).optional(),
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
