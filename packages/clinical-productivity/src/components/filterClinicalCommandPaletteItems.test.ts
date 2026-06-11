import { describe, expect, it } from 'vitest';
import {
  filterClinicalCommandPaletteItems,
  scoreClinicalCommandPaletteMatch,
} from './filterClinicalCommandPaletteItems.js';
import type { ClinicalCommandPaletteItem } from './ClinicalCommandPalette.js';

const sampleItems: ClinicalCommandPaletteItem[] = [
  {
    id: 'create_evolution_draft',
    label: 'Evolución médica',
    group: 'Documentación',
    keywords: 'Evolución médica evolucion nota médica',
    onSelect: () => {},
  },
  {
    id: 'summarize_patient',
    label: 'Resumir paciente',
    group: 'Asistencia',
    keywords: 'Resumir paciente resumen',
    onSelect: () => {},
  },
];

describe('filterClinicalCommandPaletteItems', () => {
  it('ordena por relevancia con tokens parciales', () => {
    const filtered = filterClinicalCommandPaletteItems(sampleItems, 'evol', 8);
    expect(filtered[0]?.id).toBe('create_evolution_draft');
  });

  it('excluye ítems sin coincidencia', () => {
    const filtered = filterClinicalCommandPaletteItems(sampleItems, 'farmacia', 8);
    expect(filtered).toHaveLength(0);
  });

  it('score 0 cuando falta un token', () => {
    expect(scoreClinicalCommandPaletteMatch('evol xyz', sampleItems[0]!)).toBe(0);
  });
});
