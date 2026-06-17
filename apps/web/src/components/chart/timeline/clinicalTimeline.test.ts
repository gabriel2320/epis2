import { describe, expect, it } from 'vitest';
import { filterAndGroupClinicalTimeline, filterClinicalTimeline } from './clinicalTimeline.js';

describe('clinicalTimeline (MF-DI-08 web)', () => {
  const events = [
    {
      id: '1',
      kind: 'observation' as const,
      at: '2026-06-11T08:00:00.000Z',
      title: 'Creatinina',
    },
    {
      id: '2',
      kind: 'note' as const,
      at: '2026-06-10T08:00:00.000Z',
      title: 'Nota firmada',
      detail: 'evolution_note',
    },
    {
      id: '3',
      kind: 'document' as const,
      at: '2026-06-09T08:00:00.000Z',
      title: 'Informe pie',
      detail: 'other',
    },
  ];

  it('expone filtros clínicos', () => {
    expect(filterClinicalTimeline(events, 'labs')).toHaveLength(1);
    expect(filterClinicalTimeline(events, 'evolutions')).toHaveLength(1);
    expect(filterClinicalTimeline(events, 'documents')).toHaveLength(1);
  });

  it('agrupa por periodo', () => {
    const now = new Date('2026-06-11T12:00:00.000Z');
    const grouped = filterAndGroupClinicalTimeline(events, 'all', now);
    expect(grouped.length).toBeGreaterThan(0);
    expect(grouped[0]?.label).toBe('Hoy');
  });
});
