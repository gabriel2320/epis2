import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateOllamaJson, pingOllama } from './ollama.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pingOllama', () => {
  it('devuelve boolean sin lanzar', async () => {
    const result = await pingOllama('http://127.0.0.1:11434');
    expect(typeof result).toBe('boolean');
  });

  it('ignora thinking-only y no lo devuelve como contenido clinico', async () => {
    const thinkingJson = JSON.stringify({
      suggestedFields: { subjective: 'no debe salir' },
      safetyNotes: [],
      requiresHumanReview: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: 'qwen3:8b',
            message: { thinking: thinkingJson },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ model: 'qwen3:8b', thinking: thinkingJson }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateOllamaJson('http://127.0.0.1:11434', 'prompt', 'qwen3:8b', 1000);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('thinking ignorado');
      expect(result.reason).not.toContain('subjective');
    }
  });
});
