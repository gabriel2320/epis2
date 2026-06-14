import { describe, expect, it, vi } from 'vitest';
import {
  DEMO_005_ALLERGY_QUERY,
  DEMO_005_QUERY_EMBEDDING,
  DEMO_005_RAG_CHUNKS,
} from '@epis2/test-fixtures';
import { assembleRagContext } from './assembleContext.js';
import {
  retrieveChunksSequential,
  runSequentialRagRetrieval,
} from './sequentialRetrieval.js';
import * as similarity from './similarity.js';
import { scoreChunkCandidate } from './similarity.js';

describe('retrieveChunksSequential', () => {
  it('recupera top-3 chunks demo-005 para consulta de alergia', () => {
    const result = runSequentialRagRetrieval({
      query: DEMO_005_ALLERGY_QUERY,
      queryEmbedding: DEMO_005_QUERY_EMBEDDING,
      candidates: DEMO_005_RAG_CHUNKS,
      topK: 3,
    });

    expect(result.mode).toBe('sequential');
    expect(result.chunks).toHaveLength(3);
    expect(result.chunks[0]!.stepIndex).toBe(0);
    expect(result.chunks[1]!.stepIndex).toBe(1);
    expect(result.chunks[2]!.stepIndex).toBe(2);
    expect(result.chunks[0]!.citationIndex).toBe(1);
    expect(result.chunks[0]!.chunkText.toLowerCase()).toMatch(/alergia|penicilina/);
    expect(result.chunks[1]!.chunkText.toLowerCase()).toMatch(/reacción|betalact/);
    expect(result.contextText).toContain('[1]');
    expect(result.contextText).toContain('[2]');
    expect(result.contextText).toContain('[3]');
  });

  it('prioriza fragmentos de alergia sobre INR/FA en demo-005', () => {
    const chunks = retrieveChunksSequential(DEMO_005_QUERY_EMBEDDING, DEMO_005_RAG_CHUNKS, {
      topK: 2,
    });
    expect(chunks).toHaveLength(2);
    const topTwoText = chunks.map((chunk) => chunk.chunkText.toLowerCase()).join(' ');
    expect(topTwoText).toMatch(/alergia|penicilina|reacción|betalact/);
    expect(topTwoText).not.toMatch(/^\s*inr/);
  });

  it('ensambla contexto citado en orden secuencial', () => {
    const chunks = retrieveChunksSequential(DEMO_005_QUERY_EMBEDDING, DEMO_005_RAG_CHUNKS, {
      topK: 2,
    });
    const context = assembleRagContext(chunks);
    expect(context.startsWith('[1]')).toBe(true);
    expect(context).toContain('\n[2]');
  });

  it('evalúa candidatos en pasos secuenciales (sin batch paralelo)', () => {
    const scoreSpy = vi.spyOn(similarity, 'scoreChunkCandidate');
    retrieveChunksSequential(DEMO_005_QUERY_EMBEDDING, DEMO_005_RAG_CHUNKS, { topK: 3 });

    expect(scoreSpy.mock.calls.length).toBeGreaterThan(0);
    const firstStepCalls = DEMO_005_RAG_CHUNKS.length;
    expect(scoreSpy.mock.calls.length).toBeGreaterThanOrEqual(firstStepCalls);

    scoreSpy.mockRestore();
  });

  it('respeta minScore y no rellena topK con ruido', () => {
    const chunks = retrieveChunksSequential([0], DEMO_005_RAG_CHUNKS, {
      topK: 3,
      minScore: 0.99,
    });
    expect(chunks).toHaveLength(0);
  });
});

describe('scoreChunkCandidate', () => {
  it('asigna mayor score a texto más cercano semánticamente (demo)', () => {
    const allergyChunk = DEMO_005_RAG_CHUNKS[0]!;
    const inrChunk = DEMO_005_RAG_CHUNKS[2]!;
    const allergyScore = scoreChunkCandidate(DEMO_005_QUERY_EMBEDDING, allergyChunk);
    const inrScore = scoreChunkCandidate(DEMO_005_QUERY_EMBEDDING, inrChunk);
    expect(allergyScore).toBeGreaterThan(inrScore);
  });
});
