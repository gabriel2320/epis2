import { describe, expect, it } from 'vitest';
import { buildAiProvenanceRecord } from './aiProvenance.js';

const baseRun = {
  id: '11111111-1111-4111-8111-111111111111',
  blueprintId: 'evolution_note',
  model: 'llama3.2:3b',
  promptHash: 'abc123',
};

describe('buildAiProvenanceRecord', () => {
  it('construye registro completo con citas documentales', () => {
    const documentId = '22222222-2222-4222-8222-222222222222';
    const record = buildAiProvenanceRecord(
      {
        ...baseRun,
        outputPayload: {
          suggestedFields: { subjective: 'Estable' },
          documentCitations: [{ documentId, chunkIndex: 0 }],
        },
      },
      { aiRunId: baseRun.id },
    );

    expect(record).toEqual({
      aiRunId: baseRun.id,
      blueprintId: 'evolution_note',
      model: 'llama3.2:3b',
      promptHash: 'abc123',
      documentCitations: [{ documentId, chunkIndex: 0 }],
    });
  });

  it('omite documentCitations cuando output_payload no las trae', () => {
    const record = buildAiProvenanceRecord(
      {
        ...baseRun,
        outputPayload: { suggestedFields: { subjective: 'Manual' } },
      },
      { aiRunId: baseRun.id },
    );

    expect(record).toEqual({
      aiRunId: baseRun.id,
      blueprintId: 'evolution_note',
      model: 'llama3.2:3b',
      promptHash: 'abc123',
    });
    expect(record?.documentCitations).toBeUndefined();
  });

  it('retorna null si aiRunId del contexto no coincide', () => {
    const record = buildAiProvenanceRecord(baseRun, {
      aiRunId: '33333333-3333-4333-8333-333333333333',
    });
    expect(record).toBeNull();
  });

  it('ignora citas malformadas en output_payload', () => {
    const record = buildAiProvenanceRecord(
      {
        ...baseRun,
        outputPayload: { documentCitations: [{ documentId: 'not-a-uuid', chunkIndex: -1 }] },
      },
      { aiRunId: baseRun.id },
    );

    expect(record?.documentCitations).toBeUndefined();
  });
});
