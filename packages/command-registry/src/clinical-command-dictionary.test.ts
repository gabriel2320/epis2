import { describe, expect, it } from 'vitest';
import {
  CLINICAL_COMMAND_DICTIONARY,
  filterClinicalCommandAutocomplete,
  getDictionaryEntriesByCategory,
} from './clinical-command-dictionary.js';

describe('clinical-command-dictionary', () => {
  it('incluye entradas por intent del registry', () => {
    expect(CLINICAL_COMMAND_DICTIONARY.length).toBeGreaterThan(20);
  });

  it('autocompleta diagnóstico', () => {
    const hits = filterClinicalCommandAutocomplete('diagnos', { limit: 5 });
    expect(hits.some((h) => /diagnóstico|diagnostico|problema/i.test(h))).toBe(true);
  });

  it('filtra por categoría laboratorio', () => {
    const labs = getDictionaryEntriesByCategory('laboratorio');
    expect(labs.length).toBeGreaterThan(0);
    expect(labs.every((e) => e.category === 'laboratorio')).toBe(true);
  });

  it('prioriza frases de laboratorio con peso institucional (MF-DI-03)', () => {
    const hits = filterClinicalCommandAutocomplete('lab', { limit: 5 });
    expect(hits.some((h) => /laboratorio|hemograma|panel/i.test(h))).toBe(true);
  });
});
