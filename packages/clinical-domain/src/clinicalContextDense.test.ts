import { describe, expect, it } from 'vitest';
import {
  buildClinicalContextDense,
  formatRelativeClinicalAgeEs,
  selectContextDenseLabHighlights,
} from './clinicalContextDense.js';

describe('clinicalContextDense (MF-DI-01)', () => {
  it('formatRelativeClinicalAgeEs — meses y días', () => {
    const now = new Date('2026-06-14T12:00:00Z');
    expect(formatRelativeClinicalAgeEs('2026-06-14T10:00:00Z', now)).toBe('hoy');
    expect(formatRelativeClinicalAgeEs('2026-06-13T10:00:00Z', now)).toBe('hace 1 día');
    expect(formatRelativeClinicalAgeEs('2026-01-14T10:00:00Z', now)).toBe('hace 5 meses');
  });

  it('prioriza HbA1c en highlights', () => {
    const now = new Date('2026-06-14T12:00:00Z');
    const highlights = selectContextDenseLabHighlights(
      [
        {
          label: 'Creatinina',
          valueText: '0.9 mg/dL',
          observedAt: '2026-05-01T10:00:00Z',
        },
        {
          label: 'HbA1c',
          valueText: '7.8 %',
          observedAt: '2026-01-10T10:00:00Z',
        },
      ],
      2,
      now,
    );
    expect(highlights[0]?.label).toBe('HbA1c');
    expect(highlights[0]?.relativeAgeEs).toBe('hace 5 meses');
  });

  it('buildClinicalContextDense — problemas activos y meds', () => {
    const dense = buildClinicalContextDense({
      problems: [
        { description: 'HTA', status: 'active' },
        { description: 'DM2', status: 'active' },
      ],
      medications: [
        { name: 'Metformina', doseText: '850 mg c/12 h', status: 'active' },
        { name: 'Losartán', doseText: '50 mg/día', status: 'active' },
      ],
      observations: [
        { label: 'HbA1c', valueText: '7.4 %', observedAt: '2026-03-01T10:00:00Z' },
      ],
      ultimoEncuentroAt: '2026-02-10T10:00:00Z',
      openEncounterId: 'enc-1',
      careSettingLabel: 'Consulta ambulatoria',
      now: new Date('2026-06-14T12:00:00Z'),
    });

    expect(dense.activeProblems).toEqual(['HTA', 'DM2']);
    expect(dense.medicationSummary).toContain('Metformina');
    expect(dense.lastEncounterRelativeEs).toBe('hace 4 meses');
    expect(dense.episodeOpen).toBe(true);
    expect(dense.labHighlights[0]?.relativeAgeEs).toBe('hace 3 meses');
  });
});
