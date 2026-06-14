import { describe, expect, it } from 'vitest';
import {
  DEMO_005_ALLERGY_QUERY,
  DEMO_005_QUERY_EMBEDDING,
  getDemo005AiastAllergyChunk,
  getDemo005RagChunks,
} from '@epis2/test-fixtures';
import { resolveAssistDocumentCitations, DEMO_005_PATIENT_ID } from './assistCitations.js';
import { filterAssistEligibleCandidates } from './assistContextPolicy.js';
import { assertSuggestedFieldsGrounded } from './noHallucinationGuard.js';
import { runSequentialRagRetrieval } from './sequentialRetrieval.js';

describe('assistCitations (MF-IM-04)', () => {
  it('resuelve citas document_id + chunk_index para DEMO-005', () => {
    const bundle = resolveAssistDocumentCitations(DEMO_005_PATIENT_ID, DEMO_005_ALLERGY_QUERY);
    expect(bundle).not.toBeNull();
    expect(bundle!.citations.length).toBeGreaterThanOrEqual(1);
    expect(
      bundle!.citations.every(
        (c) =>
          typeof c.documentId === 'string' &&
          c.documentId.length > 0 &&
          Number.isInteger(c.chunkIndex) &&
          c.chunkIndex >= 0,
      ),
    ).toBe(true);
    expect(bundle!.contextText).toMatch(/^\[1\]/);
  });

  it('no devuelve citas para paciente sin índice demo', () => {
    expect(
      resolveAssistDocumentCitations('a0000001-0000-4000-8000-000000000001', 'alergia'),
    ).toBeNull();
  });

  it('eval no-hallucination: términos anclados en chunks citados', () => {
    const retrieval = runSequentialRagRetrieval({
      query: DEMO_005_ALLERGY_QUERY,
      queryEmbedding: DEMO_005_QUERY_EMBEDDING,
      candidates: getDemo005RagChunks().map((c) => ({
        documentId: c.documentId,
        patientId: c.patientId,
        chunkIndex: c.chunkIndex,
        chunkText: c.chunkText,
        embedding: c.embedding,
      })),
      topK: 3,
    });

    const grounded = assertSuggestedFieldsGrounded(
      { allergyNote: 'Antecedente alergia penicilina reacción cutánea documentada' },
      retrieval.chunks,
    );
    expect(grounded.ok).toBe(true);

    const hallucinated = assertSuggestedFieldsGrounded(
      { allergyNote: 'Paciente tolera amoxicilina sin restricciones' },
      retrieval.chunks,
    );
    expect(hallucinated.ok).toBe(false);
  });

  it('MF-IM-08: chunk AIAST no aparece en citas assist aunque supere score', () => {
    const aiast = getDemo005AiastAllergyChunk();
    const candidates = filterAssistEligibleCandidates([
      ...getDemo005RagChunks(),
      aiast,
    ]);

    const retrieval = runSequentialRagRetrieval({
      query: DEMO_005_ALLERGY_QUERY,
      queryEmbedding: DEMO_005_QUERY_EMBEDDING,
      candidates,
      topK: 3,
    });
    expect(retrieval.chunks.some((chunk) => chunk.documentId === aiast.documentId)).toBe(false);

    const bundle = resolveAssistDocumentCitations(DEMO_005_PATIENT_ID, DEMO_005_ALLERGY_QUERY);
    expect(bundle).not.toBeNull();
    expect(bundle!.citations.every((citation) => citation.documentId !== aiast.documentId)).toBe(
      true,
    );
  });
});
