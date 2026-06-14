import { describe, expect, it, vi } from 'vitest';
import { loadAiConfig } from './config.js';
import { recordInferenceTrace, shutdownLangfuse } from './langfuseTrace.js';

describe('langfuseTrace', () => {
  it('no-op cuando LANGFUSE_ENABLED=false', async () => {
    const config = loadAiConfig({
      LANGFUSE_ENABLED: 'false',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    await expect(
      recordInferenceTrace({
        config,
        prompt: 'demo prompt',
        requestContext: { source: 'unit-test' },
        dataTier: 'L0_synthetic',
        latencyMs: 12,
        result: {
          ok: true,
          text: '{"ok":true}',
          model: 'test',
          provider: 'ollama',
        },
      }),
    ).resolves.toBeUndefined();
  });

  it('no lanza si faltan keys con LANGFUSE_ENABLED=true', async () => {
    const config = loadAiConfig({
      LANGFUSE_ENABLED: 'true',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    await expect(
      recordInferenceTrace({
        config,
        prompt: 'demo prompt',
        requestContext: undefined,
        dataTier: 'L2_phi',
        latencyMs: 5,
        result: {
          ok: false,
          reason: 'Ollama no disponible',
          provider: 'ollama',
        },
      }),
    ).resolves.toBeUndefined();
  });

  it('shutdownLangfuse es idempotente', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(shutdownLangfuse()).resolves.toBeUndefined();
    await expect(shutdownLangfuse()).resolves.toBeUndefined();
  });
});
