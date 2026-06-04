import { z } from 'zod';

const envSchema = z.object({
  AI_HOST: z.string().default('0.0.0.0'),
  AI_PORT: z.coerce.number().int().positive().default(3002),
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
});

export type AiConfig = z.infer<typeof envSchema>;

export function loadAiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  return envSchema.parse(env);
}
