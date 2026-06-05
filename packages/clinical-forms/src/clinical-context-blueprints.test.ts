import { describe, expect, it } from 'vitest';
import {
  blueprintSupportsClinicalContext,
  defaultClinicalContextInsertField,
} from './clinical-context-blueprints.js';

describe('blueprintSupportsClinicalContext', () => {
  it('incluye evolución, epicrisis, receta e interconsulta', () => {
    expect(blueprintSupportsClinicalContext('evolution_note')).toBe(true);
    expect(blueprintSupportsClinicalContext('discharge_summary')).toBe(true);
    expect(blueprintSupportsClinicalContext('prescription')).toBe(true);
    expect(blueprintSupportsClinicalContext('referral')).toBe(true);
    expect(blueprintSupportsClinicalContext('lab_request')).toBe(false);
  });
});

describe('defaultClinicalContextInsertField', () => {
  it('mapea campo destino por blueprint', () => {
    expect(defaultClinicalContextInsertField('evolution_note')).toBe('plan');
    expect(defaultClinicalContextInsertField('discharge_summary')).toBe('followUpPlan');
    expect(defaultClinicalContextInsertField('prescription')).toBe('clinicalNotes');
    expect(defaultClinicalContextInsertField('referral')).toBe('clinicalSummary');
  });
});
