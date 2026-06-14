import { describe, expect, it, vi } from 'vitest';
import { RAG_EMBED_DIM } from '@epis2/contracts';
import { loadAiConfig } from './config.js';
import { runEmbedDocument } from './embedDocument.js';

const config = loadAiConfig({
  OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
  OLLAMA_EMBED_MODEL: 'nomic-embed-text',
});

describe('runEmbedDocument', () => {
  it('devuelve embedding 384d cuando Ollama responde', async () => {
    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/tags')) {
        return new Response(JSON.stringify({ models: [] }), { status: 200 });
      }
      if (url.endsWith('/api/embeddings')) {
        expect(init?.method).toBe('POST');
        const body = JSON.parse(String(init?.body)) as { model: string; prompt: string };
        expect(body.model).toBe('nomic-embed-text');
        expect(body.prompt).toContain('hemoglobina');
        return new Response(
          JSON.stringify({
            embedding: Array.from({ length: 768 }, (_, i) => (i % 11 === 0 ? 0.02 : 0.001)),
          }),
          { status: 200 },
        );
      }
      return new Response('not found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await runEmbedDocument(config, {
      text: 'hemoglobina glicosilada control demo',
    });

    expect(result.status).toBe('success');
    if (result.status === 'success') {
      expect(result.embedding).toHaveLength(RAG_EMBED_DIM);
      expect(result.provider).toBe('ollama');
      expect(result.model).toBe('nomic-embed-text');
    }

    vi.unstubAllGlobals();
  });

  it('degrada cuando Ollama no responde', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('connection refused');
      }),
    );

    const result = await runEmbedDocument(config, { text: 'demo' });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.provider).toBe('ollama');
    }

    vi.unstubAllGlobals();
  });
});
