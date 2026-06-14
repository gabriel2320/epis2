import type { RagChunkCandidate } from './types.js';

/** Tag de contexto aprobado con asistencia IA — no usar como fuente RAG para nuevo assist. */
export const EPIS2_AIAST_CONTEXT_TAG = 'AIAST';

/** Excluye chunks AIAST del pool de retrieval assist (anti feedback-loop). */
export function filterAssistEligibleCandidates<T extends RagChunkCandidate>(
  candidates: readonly T[],
): T[] {
  return candidates.filter((candidate) => !candidate.aiastTagged);
}

/** Regla breve para el prompt clínico (MF-IM-08). */
export function buildAntiFeedbackLoopPolicy(): string {
  return `- ANTI-FEEDBACK: no cites ni infieras desde fragmentos marcados ${EPIS2_AIAST_CONTEXT_TAG} (borradores ya aprobados con asistencia IA).`;
}
