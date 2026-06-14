/** Candidato indexado para retrieval RAG (MF-IM-03). */
export type RagChunkCandidate = {
  documentId: string;
  patientId: string;
  chunkIndex: number;
  chunkText: string;
  embedding: readonly number[];
  /** true = documento aprobado con asistencia IA (AIAST); excluir de RAG assist (MF-IM-08). */
  aiastTagged?: boolean;
};

/** Fragmento recuperado en un paso secuencial. */
export type RetrievedChunk = {
  documentId: string;
  patientId: string;
  chunkIndex: number;
  chunkText: string;
  score: number;
  citationIndex: number;
  stepIndex: number;
};

export type SequentialRetrievalResult = {
  mode: 'sequential';
  query: string;
  chunks: RetrievedChunk[];
  contextText: string;
};
