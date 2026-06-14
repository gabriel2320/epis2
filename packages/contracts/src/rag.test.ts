import { describe, expect, it } from 'vitest';
import {
  embedDocumentRequestSchema,
  embedDocumentResponseSchema,
  poolEmbeddingVector,
  RAG_EMBED_DIM,
} from './rag.js';

describe('rag embed contract', () => {
  it('valida request embedDocument', () => {
    const parsed = embedDocumentRequestSchema.safeParse({
      text: 'hemoglobina glicosilada control',
    });
    expect(parsed.success).toBe(true);
  });

  it('valida response success 384d', () => {
    const embedding = Array.from({ length: RAG_EMBED_DIM }, (_, i) => (i === 0 ? 1 : 0));
    const parsed = embedDocumentResponseSchema.safeParse({
      status: 'success',
      embedding,
      dim: 384,
      model: 'nomic-embed-text',
      provider: 'ollama',
      latencyMs: 12,
    });
    expect(parsed.success).toBe(true);
  });

  it('poolEmbeddingVector expande a 384d', () => {
    const legacy = Array.from({ length: 128 }, (_, i) => (i % 7 === 0 ? 0.1 : 0));
    const pooled = poolEmbeddingVector(legacy, RAG_EMBED_DIM);
    expect(pooled).toHaveLength(RAG_EMBED_DIM);
    const norm = Math.sqrt(pooled.reduce((s, n) => s + n * n, 0));
    expect(norm).toBeCloseTo(1, 5);
  });
});
