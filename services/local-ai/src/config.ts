import { z } from 'zod';

const inferenceModeSchema = z.enum(['ollama', 'openai', 'router']);
const dataTierSchema = z.enum(['L0_synthetic', 'L1_deidentified', 'L2_phi']);

const envSchema = z.object({
  AI_HOST: z.string().default('0.0.0.0'),
  AI_PORT: z.coerce.number().int().positive().default(3002),
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
  OLLAMA_MODEL: z.string().default('qwen3:8b'),
  /** ADR-005: ollama | openai | router (local first + cloud fallback) */
  AI_INFERENCE_MODE: inferenceModeSchema.default('router'),
  AI_CLOUD_ENABLED: z
    .enum(['true', 'false', '1', '0'])
    .default('false')
    .transform((v) => v === 'true' || v === '1'),
  AI_DEFAULT_DATA_TIER: dataTierSchema.default('L0_synthetic'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  /** Opcional — si está definida, /assist/* exige header x-local-ai-key (auditoría A1). */
  LOCAL_AI_API_KEY: z.string().min(16).optional(),
});

export type AiConfig = z.infer<typeof envSchema>;

export function loadAiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  return envSchema.parse(env);
}
