import { describe, expect, it } from 'vitest';
import {
  formatAllergyLine,
  formatMedicationLine,
  partitionMedicationZones,
  selectLabHighlights,
} from './clinicalSummaryData.js';

describe('clinicalSummaryData', () => {
  it('particiona medicación en activa, PRN y suspendida', () => {
    const zones = partitionMedicationZones([
      { id: '1', name: 'Warfarina', doseText: '5 mg', route: 'VO', status: 'active' },
      { id: '2', name: 'Morfina', doseText: '2 mg', route: 'IV', status: 'PRN' },
      { id: '3', name: 'AAS', status: 'discontinued' },
    ]);
    expect(zones.active).toHaveLength(1);
    expect(zones.prn).toHaveLength(1);
    expect(zones.suspended).toHaveLength(1);
    expect(formatMedicationLine(zones.active[0]!)).toContain('Warfarina');
  });

  it('formatea alergias con severidad', () => {
    expect(
      formatAllergyLine({
        id: 'a1',
        substance: 'Penicilina',
        severity: 'severe',
        status: 'active',
      }),
    ).toContain('Penicilina');
  });

  it('ordena labs por fecha descendente', () => {
    const labs = selectLabHighlights([
      {
        id: 'o1',
        label: 'Hb',
        valueText: '10.2 g/dL',
        observedAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'o2',
        label: 'Creatinina',
        valueText: '1.8 mg/dL',
        observedAt: '2026-06-01T10:00:00.000Z',
      },
    ]);
    expect(labs[0]?.label).toBe('Creatinina');
  });
});
