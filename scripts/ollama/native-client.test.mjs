/**
 * @vitest-environment node
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  getOllamaEnv,
  isModelInstalled,
  probeOllamaNative,
  ensureOllamaReady,
} from '../../scripts/ollama/native-client.mjs';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ollama native-client', () => {
  it('getOllamaEnv usa defaults', () => {
    const env = getOllamaEnv();
    expect(env.baseUrl).toContain('11434');
    expect(env.model).toBeTruthy();
  });

  it('isModelInstalled reconoce tags exactos', () => {
    expect(isModelInstalled(['qwen3:8b', 'llama3.2:latest'], 'qwen3:8b')).toBe(true);
    expect(isModelInstalled(['qwen2.5-coder:7b'], 'qwen2.5-coder:14b')).toBe(false);
    expect(isModelInstalled(['llama3.2:latest'], 'qwen3:8b')).toBe(false);
  });

  it('probeOllamaNative parsea tags', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ models: [{ name: 'qwen3:8b' }] }),
      }),
    );
    const probe = await probeOllamaNative('http://127.0.0.1:11434');
    expect(probe.ok).toBe(true);
    if (probe.ok) expect(probe.models).toContain('qwen3:8b');
  });

  it('ensureOllamaReady falla sin modelo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ models: [{ name: 'other:1' }] }),
      }),
    );
    const ready = await ensureOllamaReady({
      baseUrl: 'http://127.0.0.1:11434',
      model: 'qwen3:8b',
    });
    expect(ready.ready).toBe(false);
    if (!ready.ready) expect(ready.stage).toBe('model');
  });
});
