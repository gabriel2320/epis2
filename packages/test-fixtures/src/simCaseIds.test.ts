import { describe, expect, it } from 'vitest';
import { stableSimCaseUuids } from './simCaseIds.js';

describe('stableSimCaseUuids', () => {
  it('genera UUIDs deterministas en rango SIM', () => {
    const ids = stableSimCaseUuids('SIM-HIPERTENSI-N-ac1e');
    expect(ids.patientId).toMatch(/^a0000002-0000-4000-8000-[0-9a-f]{12}$/);
    expect(ids.encounterId).toMatch(/^b0000002-0000-4000-8000-[0-9a-f]{12}$/);
    expect(stableSimCaseUuids('SIM-HIPERTENSI-N-ac1e')).toEqual(ids);
  });
});
