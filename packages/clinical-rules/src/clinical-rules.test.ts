import { describe, expect, it } from 'vitest';
import {
  assertClinicalRulesInvariants,
  CLINICAL_RULES_DEMO,
  evaluateClinicalRules,
} from './index.js';

describe('clinical-rules MF-LX-05', () => {
  it('registro demo cumple invariantes', () => {
    expect(CLINICAL_RULES_DEMO.length).toBeGreaterThanOrEqual(5);
    expect(assertClinicalRulesInvariants()).toEqual([]);
  });

  it('bloquea receta sin dosis', () => {
    const result = evaluateClinicalRules({
      draftType: 'prescription',
      medications: [{ name: 'paracetamol', dose: '' }],
    });
    expect(result.blocking).toBe(true);
    expect(result.hits.some((h) => h.ruleId === 'prescription_missing_dose')).toBe(true);
  });

  it('alerta alergia penicilina + amoxicilina', () => {
    const result = evaluateClinicalRules({
      draftType: 'prescription',
      patient: { allergies: ['penicilina'] },
      medications: [{ name: 'amoxicilina 500 mg', dose: '500 mg' }],
    });
    expect(result.hasCritical).toBe(true);
    expect(result.hits.some((h) => h.ruleId === 'allergy_beta_lactam_prescription')).toBe(true);
  });

  it('alerta potasio critico no reconocido', () => {
    const result = evaluateClinicalRules({
      blueprintId: 'evolution_note',
      patient: { criticalLabs: [{ id: 'potasio', value: 6.4, acknowledged: false }] },
      form: { assessment: ' estable', plan: 'control' },
    });
    expect(result.hits.some((h) => h.ruleId === 'critical_potassium_unacknowledged')).toBe(true);
  });

  it('bloquea epicrisis sin diagnostico de alta', () => {
    const result = evaluateClinicalRules({
      draftType: 'discharge_summary',
      form: { dischargeDiagnosis: '' },
    });
    expect(result.blocking).toBe(true);
  });

  it('advierte evolucion sin analisis/plan', () => {
    const result = evaluateClinicalRules({
      draftType: 'evolution_note',
      form: { assessment: '', plan: 'seguir manejo' },
    });
    expect(result.hits.some((h) => h.ruleId === 'evolution_missing_analysis_plan')).toBe(true);
    expect(result.blocking).toBe(false);
  });
});
