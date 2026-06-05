import { describe, expect, it } from 'vitest';
import {
  evaluateAllergyMedicationConflict,
  evaluateClinicalDecisionRules,
  evaluateCriticalLabWithoutAck,
  evaluateDischargeWithOpenCriticalOrders,
  evaluateDuplicateMedicationOrder,
  evaluateHighRiskMedWithoutDoubleCheck,
  evaluateMedicationReconciliationGap,
  evaluatePrescriptionAllergyConflict,
} from './rules.js';
import type { CdrContext } from './types.js';

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

describe('clinicalDecisionRules (EPIONE CDR)', () => {
  it('allergy_medication_conflict en MAR', () => {
    const check = evaluateAllergyMedicationConflict(
      baseContext({
        formData: { drug_name: 'Penicilina 1g' },
        allergies: ['Penicilina'],
      }),
    );
    expect(check?.ruleId).toBe('allergy_medication_conflict');
  });

  it('critical_lab_without_ack en alta', () => {
    const check = evaluateCriticalLabWithoutAck(
      baseContext({
        actionId: 'discharge_summary',
        criticalLabAlerts: [{ id: 'lr-1', testName: 'Troponina' }],
      }),
    );
    expect(check?.ruleId).toBe('critical_lab_without_ack');
  });

  it('discharge_with_open_critical_orders', () => {
    const check = evaluateDischargeWithOpenCriticalOrders(
      baseContext({
        actionId: 'discharge_summary',
        mode: 'sign',
        medicalOrders: [{ summary: 'Insulina SC c/8h', status: 'active' }],
      }),
    );
    expect(check?.ruleId).toBe('discharge_with_open_critical_orders');
  });

  it('prescription_allergy_conflict en receta', () => {
    const check = evaluatePrescriptionAllergyConflict(
      baseContext({
        actionId: 'prescription',
        formData: { medication: 'Amoxicilina 500 mg' },
        allergies: ['Penicilina'],
      }),
    );
    expect(check?.id).toBe('cdr.prescription_allergy_conflict');
  });

  it('prescription_allergy_conflict con ceftriaxona y alergia penicilina', () => {
    const check = evaluatePrescriptionAllergyConflict(
      baseContext({
        actionId: 'prescription',
        formData: { medication: 'Ceftriaxona 1 g IV' },
        allergies: ['Penicilina'],
      }),
    );
    expect(check?.ruleId).toBe('allergy_medication_conflict');
  });

  it('duplicate_medication_order en prescripción', () => {
    const check = evaluateDuplicateMedicationOrder(
      baseContext({
        actionId: 'prescription',
        formData: { medication: 'Furosemida 40 mg IV' },
        medicationOrders: [{ drugName: 'Furosemida 40 mg', status: 'active' }],
      }),
    );
    expect(check?.ruleId).toBe('duplicate_medication_order');
  });

  it('medication_reconciliation_gap en validación farmacéutica', () => {
    const check = evaluateMedicationReconciliationGap(
      baseContext({
        actionId: 'pharmacy_validation',
        formData: { intervention: 'sin_intervencion' },
        medicationOrders: [
          { drugName: 'Warfarina', status: 'active' },
          { drugName: 'Aspirina', status: 'active' },
        ],
      }),
    );
    expect(check?.ruleId).toBe('medication_reconciliation_gap');
  });

  it('high_risk_med_without_double_check', () => {
    const check = evaluateHighRiskMedWithoutDoubleCheck(
      baseContext({
        formData: { drug_name: 'Insulina regular', medication_order_id: 'mo-1' },
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
    expect(evaluateClinicalDecisionRules(ctx)).toEqual(evaluateClinicalDecisionRules(ctx));
  });
});
