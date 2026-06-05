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
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(env);
}
