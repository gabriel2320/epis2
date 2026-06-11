import { describe, expect, it } from 'vitest';
import {
  applyPaperChartSectionPatch,
  mergePaperChartSection,
  parsePaperChartBody,
  parsePaperChartSectionPatch,
} from './schema.js';

describe('paperChartSectionSchema', () => {
  it('parsea cuerpo vacío con defaults', () => {
    const body = parsePaperChartBody({});
    expect(body.anamnesis.value).toBe('');
    expect(body.anamnesis.confirmed).toBe(true);
    expect(Object.keys(body)).toHaveLength(14);
  });

  it('merge por sección (humano)', () => {
    const next = mergePaperChartSection(parsePaperChartBody({}), 'anamnesis', 'Motivo consulta');
    expect(next.anamnesis.value).toBe('Motivo consulta');
    expect(next.anamnesis.source).toBe('human');
  });

  it('valida patch de sección con metadatos IA', () => {
    expect(
      parsePaperChartSectionPatch({ sectionId: 'soap', body: 'S/O/A/P', source: 'ai_draft' }).source,
    ).toBe('ai_draft');
  });

  it('apply patch ai_draft', () => {
    const base = parsePaperChartBody({});
    const next = applyPaperChartSectionPatch(base, {
      sectionId: 'soap',
      body: 'Borrador IA',
      source: 'ai_draft',
    });
    expect(next.soap.source).toBe('ai_draft');
    expect(next.soap.confirmed).toBe(false);
  });
});
