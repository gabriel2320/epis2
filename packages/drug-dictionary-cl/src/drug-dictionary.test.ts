import { describe, expect, it } from 'vitest';
import {
  assertDrugDictionaryClInvariants,
  DRUG_DICTIONARY_CL,
  DRUG_DICTIONARY_CL_MIN_ENTRIES,
  getDrugById,
  searchDrugsEsCl,
} from './index.js';

describe('drug-dictionary-cl MF-LX-03', () => {
  it('cumple minimo 50 farmacos demo', () => {
    expect(DRUG_DICTIONARY_CL.length).toBeGreaterThanOrEqual(DRUG_DICTIONARY_CL_MIN_ENTRIES);
    expect(assertDrugDictionaryClInvariants()).toEqual([]);
  });

  it('busca por prefijo de principio activo', () => {
    const hits = searchDrugsEsCl('cef');
    expect(hits.length).toBeGreaterThanOrEqual(2);
    expect(hits.some((h) => h.entry.id === 'ceftriaxona')).toBe(true);
  });

  it('busca por abreviatura comun', () => {
    const hits = searchDrugsEsCl('aas');
    expect(hits[0]?.entry.id).toBe('aas');
  });

  it('expone ordenes frecuentes', () => {
    const drug = getDrugById('ceftriaxona');
    expect(drug?.usualOrders[0]).toMatch(/1 g EV/);
    expect(drug?.warnings).toContain('ver alergia a beta-lactamicos');
  });

  it('incluye medicamentos hospitalarios y ambulatorios', () => {
    expect(getDrugById('morfina')?.localUse).toContain('hospitalizado');
    expect(getDrugById('metformina')?.localUse).toContain('ambulatorio');
  });
});
