import { describe, expect, it } from 'vitest';
import {
  evaluateAllergyMedicationConflict,
  evaluateClinicalDecisionRules,
  evaluateCriticalLabWithoutAck,
  evaluateDischargeWithOpenCriticalOrders,
  evaluateDuplicateMedicationOrder,
  evaluateHighRiskMedWithoutDoubleCheck,
  type CdrContext,
} from './clinical-decision-rules.js';

function baseContext(overrides: Partial<CdrContext> = {}): CdrContext {
  return {
    actionId: 'medication_administration',
    mode: 'sign',
    formData: {},
    allergies: [],
    medicationOrders: [],
    medicalOrders: [],
    labResults: [],
    criticalLabAlerts: [],
    marDoubleChecks: [],
    ...overrides,
  };
}

describe('clinical-decision-rules', () => {
  it('allergy_medication_conflict bloquea MAR', () => {
    const check = evaluateAllergyMedicationConflict(
      baseContext({
        formData: { drug_name: 'Penicilina 1g' },
        allergies: ['Penicilina'],
      }),
    );
    expect(check?.ruleId).toBe('allergy_medication_conflict');
    expect(check?.severity).toBe('block');
  });

  it('critical_lab_without_ack bloquea alta', () => {
    const check = evaluateCriticalLabWithoutAck(
      baseContext({
        actionId: 'discharge_summary',
        criticalLabAlerts: [{ id: 'lr-1', testName: 'Troponina' }],
      }),
    );
    expect(check?.ruleId).toBe('critical_lab_without_ack');
    expect(check?.severity).toBe('block');
  });

  it('discharge_with_open_critical_orders bloquea firma de alta', () => {
    const check = evaluateDischargeWithOpenCriticalOrders(
      baseContext({
        actionId: 'discharge_summary',
        mode: 'sign',
        medicalOrders: [{ summary: 'Insulina SC c/8h', status: 'active' }],
      }),
    );
    expect(check?.ruleId).toBe('discharge_with_open_critical_orders');
  });

  it('duplicate_medication_order bloquea nueva orden', () => {
    const check = evaluateDuplicateMedicationOrder(
      baseContext({
        actionId: 'medical_order',
        formData: { summary: 'Furosemida 40 mg IV' },
        medicationOrders: [{ drugName: 'Furosemida 40 mg', status: 'active' }],
      }),
    );
    expect(check?.ruleId).toBe('duplicate_medication_order');
  });

  it('high_risk_med_without_double_check exige verificación', () => {
    const check = evaluateHighRiskMedWithoutDoubleCheck(
      baseContext({
        formData: { drug_name: 'Insulina regular', medication_order_id: 'mo-1' },
        marDoubleChecks: [],
      }),
    );
    expect(check?.ruleId).toBe('high_risk_med_without_double_check');
  });

  it('evaluateClinicalDecisionRules es determinístico', () => {
    const ctx = baseContext({
      formData: { drug_name: 'Insulina', medication_order_id: 'mo-1' },
      allergies: ['Insulina'],
      criticalLabAlerts: [{ id: 'a1', testName: 'K+' }],
    });
    const first = evaluateClinicalDecisionRules(ctx);
    const second = evaluateClinicalDecisionRules(ctx);
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(0);
  });
});
