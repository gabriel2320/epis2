import { assembleRagContext } from './assembleContext.js';
import { scoreChunkCandidate } from './similarity.js';
import type {
  RagChunkCandidate,
  RetrievedChunk,
  SequentialRetrievalResult,
} from './types.js';

type RemainingCandidate = RagChunkCandidate & { sourceIndex: number };

export type SequentialRetrievalOptions = {
  topK?: number;
  minScore?: number;
};

/**
 * Retrieval incremental: cada paso elige un chunk antes de evaluar el siguiente top-K.
 * El scoring recorre candidatos en un único bucle (sin batch paralelo).
 */
export function retrieveChunksSequential(
  queryEmbedding: readonly number[],
  candidates: readonly RagChunkCandidate[],
  options: SequentialRetrievalOptions = {},
): RetrievedChunk[] {
  const topK = options.topK ?? 3;
  const minScore = options.minScore ?? 0;
  const remaining: RemainingCandidate[] = candidates.map((candidate, sourceIndex) => ({
    ...candidate,
    sourceIndex,
  }));
  const retrieved: RetrievedChunk[] = [];

  for (let step = 0; step < topK && remaining.length > 0; step += 1) {
    let bestIdx = -1;
    let bestScore = -Infinity;
    let bestSourceIndex = Number.POSITIVE_INFINITY;

    for (let i = 0; i < remaining.length; i += 1) {
      const candidate = remaining[i]!;
      const score = scoreChunkCandidate(queryEmbedding, candidate);
      if (
        score > bestScore ||
        (score === bestScore && candidate.sourceIndex < bestSourceIndex)
      ) {
        bestScore = score;
        bestIdx = i;
        bestSourceIndex = candidate.sourceIndex;
      }
    }

    if (bestIdx < 0 || bestScore < minScore) break;

    const chosen = remaining.splice(bestIdx, 1)[0]!;
    retrieved.push({
      documentId: chosen.documentId,
      patientId: chosen.patientId,
      chunkIndex: chosen.chunkIndex,
      chunkText: chosen.chunkText,
      score: bestScore,
      citationIndex: retrieved.length + 1,
      stepIndex: step,
    });
  }

  return retrieved;
}

export function runSequentialRagRetrieval(input: {
  query: string;
  queryEmbedding: readonly number[];
  candidates: readonly RagChunkCandidate[];
  topK?: number;
  minScore?: number;
}): SequentialRetrievalResult {
  const options: SequentialRetrievalOptions = {};
  if (input.topK !== undefined) options.topK = input.topK;
  if (input.minScore !== undefined) options.minScore = input.minScore;

  const chunks = retrieveChunksSequential(input.queryEmbedding, input.candidates, options);

  return {
    mode: 'sequential',
    query: input.query,
    chunks,
    contextText: assembleRagContext(chunks),
  };
}
