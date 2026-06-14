import { describe, expect, it } from 'vitest';
import {
  DEMO_005_ALLERGY_QUERY,
  DEMO_005_QUERY_EMBEDDING,
  getDemo005AiastAllergyChunk,
  getDemo005RagChunks,
} from '@epis2/test-fixtures';
import {
  EPIS2_AIAST_CONTEXT_TAG,
  buildAntiFeedbackLoopPolicy,
  filterAssistEligibleCandidates,
} from './assistContextPolicy.js';
import { runSequentialRagRetrieval } from './sequentialRetrieval.js';
import { scoreChunkCandidate } from './similarity.js';

describe('assistContextPolicy (MF-IM-08)', () => {
  it('expone tag AIAST', () => {
    expect(EPIS2_AIAST_CONTEXT_TAG).toBe('AIAST');
  });

  it('filtra chunks aiastTagged del pool assist', () => {
    const aiast = getDemo005AiastAllergyChunk();
    const normal = getDemo005RagChunks()[0]!;
    const filtered = filterAssistEligibleCandidates([normal, aiast]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]!.documentId).toBe(normal.documentId);
  });

  it('excluye chunk AIAST aunque supere el score de alergia', () => {
    const aiast = getDemo005AiastAllergyChunk();
    const baseCandidates = getDemo005RagChunks();
    const withTrap = [...baseCandidates, aiast];

    const trapScore = scoreChunkCandidate(DEMO_005_QUERY_EMBEDDING, aiast);
    const topNormalScore = Math.max(
      ...baseCandidates.map((candidate) =>
        scoreChunkCandidate(DEMO_005_QUERY_EMBEDDING, candidate),
      ),
    );
    expect(trapScore).toBeGreaterThan(topNormalScore);

    const eligible = filterAssistEligibleCandidates(withTrap);
    const result = runSequentialRagRetrieval({
      query: DEMO_005_ALLERGY_QUERY,
      queryEmbedding: DEMO_005_QUERY_EMBEDDING,
      candidates: eligible,
      topK: 3,
    });

    expect(result.chunks.every((chunk) => chunk.documentId !== aiast.documentId)).toBe(true);
  });

  it('buildAntiFeedbackLoopPolicy menciona AIAST', () => {
    expect(buildAntiFeedbackLoopPolicy()).toMatch(/AIAST/i);
  });
});
