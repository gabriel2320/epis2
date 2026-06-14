import { describe, expect, it } from 'vitest';
import { buildAiApp } from './app.js';
import { loadAiConfig } from './config.js';
import { LOCAL_AI_API_KEY_HEADER } from './localAiAuth.js';

const baseEnv = {
  AI_HOST: '127.0.0.1',
  AI_PORT: '3002',
  OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
  OLLAMA_MODEL: 'qwen3:8b',
  AI_INFERENCE_MODE: 'ollama',
  AI_CLOUD_ENABLED: 'false',
  AI_DEFAULT_DATA_TIER: 'L0_synthetic',
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
};

describe('local-ai auth (A1)', () => {
  it('sin LOCAL_AI_API_KEY deja /assist/* abierto (dev)', async () => {
    const app = await buildAiApp(loadAiConfig(baseEnv));
    const res = await app.inject({
      method: 'POST',
      url: '/assist/draft-suggestion',
      payload: { invalid: true },
    });
    expect(res.statusCode).toBe(400);
  });

  it('con LOCAL_AI_API_KEY exige header en /assist/*', async () => {
    const app = await buildAiApp(
      loadAiConfig({
        ...baseEnv,
        LOCAL_AI_API_KEY: 'epis2-local-ai-test-key-32',
      }),
    );
    const blocked = await app.inject({
      method: 'POST',
      url: '/assist/draft-suggestion',
      payload: {},
    });
    expect(blocked.statusCode).toBe(401);

    const allowed = await app.inject({
      method: 'POST',
      url: '/assist/draft-suggestion',
      headers: { [LOCAL_AI_API_KEY_HEADER]: 'epis2-local-ai-test-key-32' },
      payload: { invalid: true },
    });
    expect(allowed.statusCode).toBe(400);
  });

  it('/health sigue público con clave configurada', async () => {
    const app = await buildAiApp(
      loadAiConfig({
        ...baseEnv,
        LOCAL_AI_API_KEY: 'epis2-local-ai-test-key-32',
      }),
    );
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
  });
});
