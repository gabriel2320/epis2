import { getDemoCaseByCode } from './demoCases.js';
import { demoEmbedText384 } from './demoRagEmbeddings.js';

export const DEMO_005_DOCUMENT_ID = 'e0000001-0000-4000-8000-000000000005';

const DEMO_005_CHUNK_TEXTS = [
  'Nota alergia penicilina reacción cutánea documentada antecedente demo',
  'Reacción cutánea leve tras betalactámicos evitar penicilina demo',
  'INR en rango anticoagulación warfarina control demo',
  'Fibrilación auricular polifarmacia revisión interacciones demo',
] as const;

const demo005 = getDemoCaseByCode('DEMO-005');
if (!demo005) {
  throw new Error('DEMO-005 fixture missing from demoCases');
}
const DEMO_005_PATIENT_ID = demo005.patientId;

export type DemoRagChunkFixture = {
  documentId: string;
  patientId: string;
  chunkIndex: number;
  chunkText: string;
  embedding: number[];
  /** MF-IM-08: documento aprobado con asistencia IA — excluir de RAG assist. */
  aiastTagged?: boolean;
};

export const DEMO_005_AIAST_DOCUMENT_ID = 'e0000001-0000-4000-8000-00000000aast';

/** Chunks indexables DEMO-005 para gate RAG incremental (MF-IM-03). */
export const DEMO_005_RAG_CHUNKS: DemoRagChunkFixture[] = DEMO_005_CHUNK_TEXTS.map(
  (chunkText, chunkIndex) => ({
    documentId: DEMO_005_DOCUMENT_ID,
    patientId: DEMO_005_PATIENT_ID,
    chunkIndex,
    chunkText,
    embedding: demoEmbedText384(chunkText),
  }),
);

export const DEMO_005_ALLERGY_QUERY = 'alergia penicilina reacción cutánea';

export const DEMO_005_QUERY_EMBEDDING = demoEmbedText384(DEMO_005_ALLERGY_QUERY);

export function getDemo005RagChunks(): readonly DemoRagChunkFixture[] {
  return DEMO_005_RAG_CHUNKS;
}

/** Chunk trampa MF-IM-08: alta similitud con query alergia pero marcado AIAST. */
export function getDemo005AiastAllergyChunk(): DemoRagChunkFixture & { aiastTagged: true } {
  const chunkText =
    'Alergia penicilina reacción cutánea documentada antecedente alergia penicilina demo aprobado IA';
  return {
    documentId: DEMO_005_AIAST_DOCUMENT_ID,
    patientId: DEMO_005_PATIENT_ID,
    chunkIndex: 99,
    chunkText,
    embedding: demoEmbedText384(chunkText),
    aiastTagged: true,
  };
}
