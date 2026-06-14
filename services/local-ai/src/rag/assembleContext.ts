import type { RetrievedChunk } from './types.js';

/** Ensambla contexto citado [n] en el orden del retrieval secuencial. */
export function assembleRagContext(chunks: readonly RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  return chunks.map((chunk) => `[${chunk.citationIndex}] ${chunk.chunkText}`).join('\n');
}
