import { describe, expect, it } from 'vitest';
import {
  filterAndGroupClinicalTimeline,
  filterClinicalTimeline,
  groupClinicalTimelineByPeriod,
  matchesClinicalTimelineFilter,
} from './timelineClinical.js';

describe('timelineClinical (MF-DI-08)', () => {
  const now = new Date('2026-06-11T12:00:00.000Z');
  const events = [
    {
      id: '1',
      kind: 'observation' as const,
      at: '2026-06-11T08:00:00.000Z',
      title: 'HbA1c',
      detail: '7.2 %',
    },
    {
      id: '2',
      kind: 'note' as const,
      at: '2026-06-11T07:00:00.000Z',
      title: 'Evolución firmada',
      detail: 'evolution_note',
    },
    {
      id: '3',
      kind: 'encounter' as const,
      at: '2026-03-01T10:00:00.000Z',
      title: 'Hospitalización',
      detail: 'inpatient',
    },
    {
      id: '4',
      kind: 'draft' as const,
      at: '2026-06-10T10:00:00.000Z',
      title: 'Borrador evolución',
      detail: 'evolution_note · draft',
    },
    {
      id: '5',
      kind: 'document' as const,
      at: '2024-01-01T10:00:00.000Z',
      title: 'Informe',
      detail: 'pdf',
    },
  ];

  it('filtra laboratorio, firmados, hospitalizaciones y evoluciones', () => {
    expect(filterClinicalTimeline(events, 'labs')).toHaveLength(1);
    expect(filterClinicalTimeline(events, 'signed')).toHaveLength(1);
    expect(filterClinicalTimeline(events, 'hospitalizations')).toHaveLength(1);
    expect(filterClinicalTimeline(events, 'evolutions')).toHaveLength(2);
  });

  it('agrupa temporalmente (Hoy / hace 3 meses / hace 1 año)', () => {
    const groups = groupClinicalTimelineByPeriod(events, now);
    expect(groups[0]?.bucket).toBe('today');
    expect(groups[0]?.label).toBe('Hoy');
    expect(groups.some((g) => g.bucket === 'last3Months')).toBe(true);
    expect(groups.some((g) => g.bucket === 'older')).toBe(true);
  });

  it('combina filtro clínico + agrupación', () => {
    const grouped = filterAndGroupClinicalTimeline(events, 'evolutions', now);
    const flat = grouped.flatMap((g) => g.events);
    expect(flat.every((e) => matchesClinicalTimelineFilter(e, 'evolutions'))).toBe(true);
  });
});
