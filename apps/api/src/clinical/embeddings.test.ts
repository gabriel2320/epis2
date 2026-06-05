import { describe, expect, it } from 'vitest';
import { chunkText, demoEmbedText, DEMO_EMBED_DIM } from './embeddings.js';

describe('demoEmbedText', () => {
  it('produce vector normalizado de dimensión fija', () => {
    const v = demoEmbedText('laboratorio creatinina hemoglobina');
    expect(v).toHaveLength(DEMO_EMBED_DIM);
    const norm = Math.sqrt(v.reduce((s, n) => s + n * n, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it('tokens similares generan mayor similitud coseno', () => {
    const a = demoEmbedText('hemoglobina glicosilada diabetes');
    const b = demoEmbedText('hba1c diabetes control');
    const c = demoEmbedText('radiografia torax');
    const sim = (x: number[], y: number[]) =>
      x.reduce((s, v, i) => s + v * (y[i] ?? 0), 0);
    expect(sim(a, b)).toBeGreaterThan(sim(a, c));
  });
});

describe('chunkText', () => {
  it('divide texto largo en fragmentos', () => {
    const chunks = chunkText('a'.repeat(1000), 400);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join('')).toHaveLength(1000);
  });
});
