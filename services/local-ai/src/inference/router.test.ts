import { describe, expect, it, vi } from 'vitest';
import { loadAiConfig } from '../config.js';
import * as ollamaProvider from './ollamaProvider.js';
import * as openaiProvider from './openaiProvider.js';
import { generateWithInferenceRouter } from './router.js';

describe('generateWithInferenceRouter', () => {
  it('devuelve unavailable si ningún proveedor responde', async () => {
    vi.spyOn(ollamaProvider, 'createOllamaProvider').mockReturnValue({
      id: 'ollama',
      ping: vi.fn().mockResolvedValue(false),
      generateStructuredJson: vi.fn(),
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'ollama',
      AI_CLOUD_ENABLED: 'false',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    const result = await generateWithInferenceRouter(config, 'prompt', { source: 'demo' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('Ollama');
    }
  });

  it('usa openai cuando ollama cae en modo router', async () => {
    vi.spyOn(ollamaProvider, 'createOllamaProvider').mockReturnValue({
      id: 'ollama',
      ping: vi.fn().mockResolvedValue(false),
      generateStructuredJson: vi.fn(),
    });
    vi.spyOn(openaiProvider, 'createOpenAiProvider').mockReturnValue({
      id: 'openai',
      ping: vi.fn().mockResolvedValue(true),
      generateStructuredJson: vi.fn().mockResolvedValue({
        ok: true,
        text: JSON.stringify({
          suggestedFields: { subjective: 'demo' },
          safetyNotes: [],
          requiresHumanReview: true,
        }),
        model: 'gpt-4o-mini',
        provider: 'openai',
      }),
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'router',
      AI_CLOUD_ENABLED: 'true',
      OPENAI_API_KEY: 'sk-test',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    const result = await generateWithInferenceRouter(config, 'prompt', { source: 'demo' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.provider).toBe('openai');
      expect(result.dataTier).toBe('L0_synthetic');
    }
  });
});
