import { describe, expect, it } from 'vitest';
import {
  mergePaperChartSection,
  parsePaperChartBody,
  parsePaperChartSectionPatch,
} from './schema.js';

describe('paperChartSectionSchema', () => {
  it('parsea cuerpo vacío con defaults', () => {
    const body = parsePaperChartBody({});
    expect(body.anamnesis).toBe('');
    expect(Object.keys(body)).toHaveLength(7);
  });

  it('merge por sección', () => {
    const next = mergePaperChartSection(parsePaperChartBody({}), 'anamnesis', 'Motivo consulta');
    expect(next.anamnesis).toBe('Motivo consulta');
  });

  it('valida patch de sección', () => {
    expect(parsePaperChartSectionPatch({ sectionId: 'soap', body: 'S/O/A/P' }).body).toBe('S/O/A/P');
  });
});
