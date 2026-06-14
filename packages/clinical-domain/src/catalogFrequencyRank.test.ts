import { describe, expect, it } from 'vitest';
import {
  INSTITUTIONAL_MEDICATION_WEIGHTS,
  bumpUsageCount,
  rankAutocompletePhrases,
  rankCatalogEntries,
} from './catalogFrequencyRank.js';

describe('catalogFrequencyRank (MF-DI-03)', () => {
  it('prioriza uso personal sobre coincidencia textual débil', () => {
    const items = [
      { entryCode: 'a', label: 'Amoxicilina 500 mg' },
      { entryCode: 'b', label: 'Losartán 50 mg' },
    ];
    const ranked = rankCatalogEntries({
      items,
      query: 'los',
      getKey: (item) => item.entryCode,
      getSearchText: (item) => item.label,
      personalUsage: { b: 5 },
      institutionalWeights: INSTITUTIONAL_MEDICATION_WEIGHTS,
      limit: 5,
    });
    expect(ranked[0]?.entryCode).toBe('b');
  });

  it('modo frecuentes sin query devuelve top institucional', () => {
    const items = [
      { entryCode: 'x', label: 'Vitamina D' },
      { entryCode: 'y', label: 'Metformina 850 mg' },
    ];
    const ranked = rankCatalogEntries({
      items,
      query: '',
      frequentOnly: true,
      getKey: (item) => item.entryCode,
      getSearchText: (item) => item.label,
      institutionalWeights: INSTITUTIONAL_MEDICATION_WEIGHTS,
      limit: 2,
    });
    expect(ranked[0]?.label).toMatch(/Metformina/i);
  });

  it('rankAutocompletePhrases aplica pesos de laboratorio', () => {
    const ranked = rankAutocompletePhrases(
      ['pedir hemograma', 'solicitar panel control dm2', 'orden imagen'],
      'hem',
      {
        institutionalWeights: { hemograma: 80, 'panel control dm2': 90 },
        limit: 3,
      },
    );
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0]).toMatch(/hemograma/i);
  });

  it('bumpUsageCount acumula por clave normalizada', () => {
    expect(bumpUsageCount({}, 'Losartán')).toEqual({ losartan: 1 });
    expect(bumpUsageCount({ losartan: 1 }, 'losartan')).toEqual({ losartan: 2 });
  });
});
