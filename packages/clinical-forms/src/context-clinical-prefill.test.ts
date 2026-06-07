import { describe, expect, it } from 'vitest';
import {
  buildContextClinicalPrefill,
  mergePrefillOnlyEmpty,
  supportsContextClinicalPrefill,
} from './context-clinical-prefill.js';

const DEMO_SUMMARY = {
  activeProblems: 'Hipertensión esencial',
  recentEvents: 'Sin eventos agudos',
  relevantLabs: 'Creatinina 0.9 mg/dL',
  activeMedications: 'Losartán 50 mg/día',
  pendingItems: 'Control en 7 días',
};

describe('context-clinical-prefill (CE-4)', () => {
  it('prefill evolución desde resumen activo', () => {
    expect(buildContextClinicalPrefill('evolution_note', DEMO_SUMMARY)).toEqual({
      objective: 'Creatinina 0.9 mg/dL\nSin eventos agudos',
      assessment: 'Hipertensión esencial',
      plan: 'Control en 7 días\nMedicación activa: Losartán 50 mg/día',
    });
  });

  it('prefill epicrisis desde resumen activo', () => {
    expect(buildContextClinicalPrefill('discharge_summary', DEMO_SUMMARY)).toEqual({
      diagnoses: 'Hipertensión esencial',
      hospitalizationSummary: 'Sin eventos agudos\nCreatinina 0.9 mg/dL',
      dischargeMedications: 'Losartán 50 mg/día',
      instructions: 'Control en 7 días',
      followUpPlan: 'Control en 7 días',
    });
  });

  it('mergePrefillOnlyEmpty no pisa campos con texto', () => {
    expect(
      mergePrefillOnlyEmpty({ plan: 'Plan manual' }, { plan: 'Plan sugerido', assessment: 'HTA' }),
    ).toEqual({ plan: 'Plan manual', assessment: 'HTA' });
  });

  it('supportsContextClinicalPrefill limita blueprints', () => {
    expect(supportsContextClinicalPrefill('evolution_note')).toBe(true);
    expect(supportsContextClinicalPrefill('lab_request')).toBe(false);
  });
});
