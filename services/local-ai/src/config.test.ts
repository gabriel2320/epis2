import { describe, expect, it } from 'vitest';
import { loadAiConfig } from './config.js';

describe('local-ai config defaults', () => {
  it('usa Ollama/Qwen local-first con cloud off y L2_phi por defecto', () => {
    const config = loadAiConfig({});

    expect(config.OLLAMA_BASE_URL).toBe('http://127.0.0.1:11434');
    expect(config.OLLAMA_MODEL).toBe('qwen3:8b');
    expect(config.AI_INFERENCE_MODE).toBe('router');
    expect(config.AI_CLOUD_ENABLED).toBe(false);
    expect(config.AI_DEFAULT_DATA_TIER).toBe('L2_phi');
  });
});
