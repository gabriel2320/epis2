import { describe, expect, it } from 'vitest';
import {
  assertLabDictionaryInvariants,
  assessLabValue,
  getLabById,
  LAB_DICTIONARY,
  parseLabToken,
  searchLabsEsCl,
} from './index.js';

describe('lab-dictionary MF-LX-04', () => {
  it('cumple minimo e invariantes', () => {
    expect(LAB_DICTIONARY.length).toBeGreaterThanOrEqual(20);
    expect(assertLabDictionaryInvariants()).toEqual([]);
  });

  it('busca potasio por sinonimo K', () => {
    const hits = searchLabsEsCl('k');
    expect(hits.some((h) => h.entry.id === 'potasio')).toBe(true);
  });

  it('detecta potasio critico alto', () => {
    const assessment = assessLabValue('potasio', 6.4);
    expect(assessment?.flag).toBe('critical_high');
    expect(assessment?.message).toMatch(/cr[ií]tico alto/i);
  });

  it('detecta hemoglobina critica baja', () => {
    const assessment = assessLabValue('hemoglobina', 6.5);
    expect(assessment?.flag).toBe('critical_low');
  });

  it('parsea token libre K 6.4', () => {
    const parsed = parseLabToken('K 6.4');
    expect(parsed.id).toBe('potasio');
    expect(parsed.value).toBe(6.4);
  });

  it('expone PCR con umbral critico', () => {
    const pcr = getLabById('pcr');
    expect(pcr?.criticalHigh).toBeDefined();
    expect(assessLabValue('pcr', 250)?.flag).toBe('critical_high');
  });
});
