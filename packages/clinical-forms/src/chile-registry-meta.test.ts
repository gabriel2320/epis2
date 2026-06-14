import { describe, expect, it } from 'vitest';
import { patientSearchBlueprint } from './blueprints/patient-search.js';
import { patientSummaryBlueprint } from './blueprints/patient-summary.js';
import { prescriptionBlueprint } from './blueprints/prescription.js';
import { validateChileBlueprintRegistryMeta } from './chile-registry-meta.js';

describe('MF-SH-04 — blueprints Chile registry meta', () => {
  it('patient_search expone variableKey RUT en allowlist', () => {
    const rutField = patientSearchBlueprint.fields.find((f) => f.id === 'identifier');
    expect(rutField?.variableKey).toBe('patient.rut');
    expect(validateChileBlueprintRegistryMeta(patientSearchBlueprint)).toEqual([]);
  });

  it('prescription SNRE y patient_summary sin errores de allowlist', () => {
    expect(validateChileBlueprintRegistryMeta(prescriptionBlueprint)).toEqual([]);
    expect(validateChileBlueprintRegistryMeta(patientSummaryBlueprint)).toEqual([]);
  });
});
