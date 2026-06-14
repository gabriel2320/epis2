import { describe, expect, it } from 'vitest';
import {
  buildContextClinicalPrefill,
  mergePrefillOnlyEmpty,
  supportsContextClinicalPrefill,
} from './context-clinical-prefill.js';
import { DM2_LAB_CONTROL_PANEL } from './chronic-control-prefill.js';

const DEMO_SUMMARY = {
  activeProblems: 'Hipertensión esencial',
  recentEvents: 'Sin eventos agudos',
  relevantLabs: 'Creatinina 0.9 mg/dL',
  activeMedications: 'Losartán 50 mg/día',
  pendingItems: 'Control en 7 días',
};

const DM2_SUMMARY = {
  activeProblems: 'Diabetes mellitus tipo 2 (sintético)\nDislipidemia mixta (sintético)',
  recentEvents: 'Glicemia capilar 142 mg/dL (demo)',
  relevantLabs: 'HbA1c 7.4 % · LDL 118 mg/dL (sintético)',
  activeMedications: 'Metformina 850 mg c/12 h · Atorvastatina 20 mg/noche (demo)',
  pendingItems: 'Laboratorio control en 3 meses',
};

describe('context-clinical-prefill (CE-4 / CE-6)', () => {
  it('prefill evolución desde resumen activo', () => {
    expect(buildContextClinicalPrefill('evolution_note', DEMO_SUMMARY)).toEqual({
      subjective: 'Control ambulatorio hipertensión arterial.',
      objective: 'Creatinina 0.9 mg/dL\nSin eventos agudos',
      assessment: 'Hipertensión esencial',
      plan: 'Control en 7 días\nMedicación activa: Losartán 50 mg/día',
    });
  });

  it('prefill evolución control diabetes desde slot', () => {
    expect(
      buildContextClinicalPrefill('evolution_note', DM2_SUMMARY, {
        slots: { clinicalReasonHint: 'Control diabetes mellitus tipo 2' },
      }),
    ).toMatchObject({
      subjective: 'Control diabetes mellitus tipo 2.',
      assessment: expect.stringContaining('Diabetes'),
      plan: expect.stringContaining('HbA1c'),
    });
  });

  it('prefill receta crónica desde medicación activa (CE-6)', () => {
    expect(buildContextClinicalPrefill('prescription', DM2_SUMMARY)).toMatchObject({
      medication: 'Metformina',
      dose: '850 mg',
      frequency: 'c/12 h',
      duration: '90 días',
      route: 'oral',
    });
  });

  it('prefill laboratorio panel DM2', () => {
    expect(buildContextClinicalPrefill('lab_request', DM2_SUMMARY)).toMatchObject({
      labTests: DM2_LAB_CONTROL_PANEL,
      clinicalReason: 'Control diabetes mellitus tipo 2',
      priority: 'rutina',
    });
    expect(buildContextClinicalPrefill('lab_request', DM2_SUMMARY).scheduledDate).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
  });

  it('prefill certificado desde diagnóstico activo', () => {
    expect(buildContextClinicalPrefill('medical_certificate', DEMO_SUMMARY)).toMatchObject({
      diagnosisSummary: 'Hipertensión esencial',
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

  it('supportsContextClinicalPrefill incluye blueprints CE-6', () => {
    expect(supportsContextClinicalPrefill('evolution_note')).toBe(true);
    expect(supportsContextClinicalPrefill('prescription')).toBe(true);
    expect(supportsContextClinicalPrefill('lab_request')).toBe(true);
    expect(supportsContextClinicalPrefill('medical_certificate')).toBe(true);
    expect(supportsContextClinicalPrefill('patient_search')).toBe(false);
  });
});
