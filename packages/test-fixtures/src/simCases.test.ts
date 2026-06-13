import { describe, expect, it } from 'vitest';
import { assertSimCasesInvariants, getSimCaseByCode, SIM_CLINICAL_CASES } from './simCases.js';
import { stableSimCaseUuids } from './simCaseIds.js';

describe('SIM_CLINICAL_CASES (MF-CASE-04/06/09)', () => {
  it('catálogo piloto con invariantes y UUIDs estables', () => {
    expect(SIM_CLINICAL_CASES.length).toBeGreaterThanOrEqual(10);
    expect(assertSimCasesInvariants()).toEqual([]);
  });

  it('resuelve piloto HTA por código', () => {
    const sim = getSimCaseByCode('SIM-HIPERTENSI-N-ac1e');
    expect(sim?.scenario).toContain('Hipertensión');
    expect(sim?.patientId).toBe(stableSimCaseUuids('SIM-HIPERTENSI-N-ac1e').patientId);
  });
});
