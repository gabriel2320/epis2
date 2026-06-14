import type { AiDocumentCitation } from '@epis2/contracts';
import {
  DEMO_005_ALLERGY_QUERY,
  DEMO_005_QUERY_EMBEDDING,
  getDemo005RagChunks,
} from '@epis2/test-fixtures';
import { filterAssistEligibleCandidates } from './assistContextPolicy.js';
import { runSequentialRagRetrieval } from './sequentialRetrieval.js';
import type { RagChunkCandidate } from './types.js';

/** Paciente sintético DEMO-005 — único catálogo RAG embebido en local-ai (demo). */
export const DEMO_005_PATIENT_ID = 'a0000001-0000-4000-8000-000000000005';

export type AssistDocumentCitationBundle = {
  citations: AiDocumentCitation[];
  contextText: string;
  retrievalQuery: string;
};

function toCandidates(): RagChunkCandidate[] {
  const raw: RagChunkCandidate[] = getDemo005RagChunks().map((chunk) => ({
    documentId: chunk.documentId,
    patientId: chunk.patientId,
    chunkIndex: chunk.chunkIndex,
    chunkText: chunk.chunkText,
    embedding: chunk.embedding,
    ...(chunk.aiastTagged ? { aiastTagged: true as const } : {}),
  }));
  return filterAssistEligibleCandidates(raw);
}

/** Resuelve citas documentales para assist cuando hay paciente demo indexado. */
export function resolveAssistDocumentCitations(
  patientId: string | undefined,
  retrievalQuery: string,
): AssistDocumentCitationBundle | null {
  if (!patientId || patientId !== DEMO_005_PATIENT_ID) return null;

  const query = retrievalQuery.trim() || DEMO_005_ALLERGY_QUERY;
  const result = runSequentialRagRetrieval({
    query,
    queryEmbedding: DEMO_005_QUERY_EMBEDDING,
    candidates: toCandidates(),
    topK: 3,
  });

  if (result.chunks.length === 0) return null;

  return {
    citations: result.chunks.map((chunk) => ({
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
    })),
    contextText: result.contextText,
    retrievalQuery: query,
  };
}
