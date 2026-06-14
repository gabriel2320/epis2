import { RAG_EMBED_DIM } from '@epis2/contracts';
import { describe, expect, it } from 'vitest';
import { getDemoCaseByCode } from './demoCases.js';
import {
  DEMO_005_ALLERGY_QUERY,
  DEMO_005_DOCUMENT_ID,
  DEMO_005_RAG_CHUNKS,
  getDemo005RagChunks,
} from './demoRagChunks.js';

describe('MF-IM-03 — fixture demo-005 RAG chunks', () => {
  it('expone al menos 3 chunks para DEMO-005', () => {
    expect(DEMO_005_RAG_CHUNKS.length).toBeGreaterThanOrEqual(3);
  });

  it('todos los chunks pertenecen al paciente DEMO-005', () => {
    const demo005 = getDemoCaseByCode('DEMO-005');
    expect(demo005).toBeDefined();
    for (const chunk of getDemo005RagChunks()) {
      expect(chunk.patientId).toBe(demo005!.patientId);
      expect(chunk.documentId).toBe(DEMO_005_DOCUMENT_ID);
      expect(chunk.embedding).toHaveLength(RAG_EMBED_DIM);
    }
  });

  it('incluye fragmentos de alergia penicilina', () => {
    const allergyChunks = DEMO_005_RAG_CHUNKS.filter(
      (chunk) => chunk.chunkText.includes('penicilina') || chunk.chunkText.includes('alergia'),
    );
    expect(allergyChunks.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_005_ALLERGY_QUERY.toLowerCase()).toContain('alergia');
  });
});
