import { describe, expect, it } from 'vitest';
import {
  mapLabelValueRowsToDenseTabular,
  mapMarRowsToDenseTabular,
} from './clinicalDenseTabular.js';

describe('clinicalDenseTabular MF-TE-07', () => {
  it('mapea órdenes demo a filas densas', () => {
    const rows = mapLabelValueRowsToDenseTabular([{ label: 'Lab', value: 'HbA1c control (demo)' }]);
    expect(rows[0]?.item).toBe('Lab');
    expect(rows[0]?.status).toBe('Activa');
  });

  it('mapea MAR con zona en status', () => {
    const rows = mapMarRowsToDenseTabular([
      { label: 'Activa', value: 'Warfarina 5 mg · VO · día (demo)' },
    ]);
    expect(rows[0]?.status).toBe('Activa');
    expect(rows[0]?.item).toContain('Warfarina');
  });
});
