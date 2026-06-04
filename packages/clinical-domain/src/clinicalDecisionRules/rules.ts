/**
 * Clinical Decision Rules (CDR) — concepto EPIONE, modo advisory en EPIS2.
 * No bloquean guardado; alimentan safetyNotes de asistencia IA.
 */

import type { CdrCheckResult, CdrContext } from './types.js';

export const HIGH_RISK_DRUG_PATTERNS = [
  'insulina',
  'heparina',
  'warfarina',
  'potasio',
  'morfina',
  'fentanilo',
  'adrenalina',
  'noradrenalina',
] as const;

const CRITICAL_ORDER_PATTERNS = ['vasoactiv', 'transfusion', 'heparina', 'insulina'];

function trimField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractDrugName(formData: Record<string, unknown>): string {
  return (
    trimField(formData.drug_name) ||
    trimField(formData.medication) ||
    trimField(formData.drugName) ||
    trimField(formData.summary)
  );
}

function normalizeDrug(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

function matchesAllergy(drugName: string, allergies: string[]): string | null {
  const drug = normalizeDrug(drugName);
  for (const allergy of allergies) {
    const token = normalizeDrug(allergy);
    if (!token) continue;
    if (drug.includes(token) || token.includes(drug)) return allergy;
  }
  return null;
}

function isHighRiskDrug(drugName: string): boolean {
  const drug = normalizeDrug(drugName);
  return HIGH_RISK_DRUG_PATTERNS.some((pattern) => drug.includes(pattern));
}

function isMarAction(actionId: string): boolean {
  return actionId === 'medication_administration' || actionId === 'mar_administer';
}

function isOrderAction(actionId: string): boolean {
  return actionId === 'medical_order' || actionId === 'prescription';
}

function isDischargeAction(actionId: string): boolean {
  return actionId === 'discharge_summary';
}

function isBlockedMedicationStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized === 'hold' || normalized === 'discontinued' || normalized === 'cancelled';
}

export function evaluateAllergyMedicationConflict(ctx: CdrContext): CdrCheckResult | null {
  const drugName = extractDrugName(ctx.formData);
  if (!drugName) return null;
  if (!isMarAction(ctx.actionId)) return null;

  const allergy = matchesAllergy(drugName, ctx.allergies);
  if (!allergy) return null;

  return {
    ruleId: 'allergy_medication_conflict',
    id: 'cdr.allergy_medication_conflict',
    severity: 'block',
    message: `Conflicto alergia–medicamento: ${drugName} coincide con alergia (${allergy}).`,
    clinicalRationale:
      'Administrar o prescribir un fármaco relacionado con alergia documentada puede provocar reacción adversa grave.',
    field: 'medication',
  };
}

export function evaluateCriticalLabWithoutAck(ctx: CdrContext): CdrCheckResult | null {
  if (ctx.criticalLabAlerts.length === 0) return null;

  const blockingActions = new Set([
    'discharge_summary',
    'patient_transfer',
    'transfer',
    'bed_release',
  ]);
  if (!blockingActions.has(ctx.actionId)) return null;

  const pending = ctx.criticalLabAlerts.map((a) => a.testName).join(', ');
  return {
    ruleId: 'critical_lab_without_ack',
    id: 'cdr.critical_lab_without_ack',
    severity: 'block',
    message: `Resultado crítico sin acuse: ${pending}.`,
    clinicalRationale:
      'No se debe continuar el flujo clínico hasta acusar recibo y documentar acción sobre resultados críticos.',
  };
}

export function evaluateDischargeWithOpenCriticalOrders(ctx: CdrContext): CdrCheckResult | null {
  if (!isDischargeAction(ctx.actionId) || ctx.mode !== 'sign') return null;

  const openCritical = ctx.medicalOrders.filter((order) => {
    if (order.status === 'completed' || order.status === 'cancelled') return false;
    const summary = order.summary.toLowerCase();
    return CRITICAL_ORDER_PATTERNS.some((pattern) => summary.includes(pattern));
  });

  if (openCritical.length === 0) return null;

  return {
    ruleId: 'discharge_with_open_critical_orders',
    id: 'cdr.discharge_with_open_critical_orders',
    severity: 'block',
    message: 'Alta bloqueada: existen órdenes críticas activas pendientes.',
    clinicalRationale:
      'El alta hospitalaria no debe firmarse mientras permanezcan órdenes de alto impacto sin resolver.',
    field: 'discharge_plan',
  };
}

export function evaluateDuplicateMedicationOrder(ctx: CdrContext): CdrCheckResult | null {
  if (!isOrderAction(ctx.actionId)) return null;

  const drugName = extractDrugName(ctx.formData);
  if (!drugName) return null;

  const normalized = normalizeDrug(drugName);
  const duplicate = ctx.medicationOrders.find((order) => {
    if (isBlockedMedicationStatus(order.status)) return false;
    const activeDrug = normalizeDrug(order.drugName);
    return activeDrug.includes(normalized) || normalized.includes(activeDrug);
  });

  if (!duplicate) return null;

  return {
    ruleId: 'duplicate_medication_order',
    id: 'cdr.duplicate_medication_order',
    severity: 'block',
    message: `Orden duplicada: ${duplicate.drugName} ya está activa.`,
    clinicalRationale:
      'Duplicar la misma medicación activa incrementa riesgo de error de dosificación y eventos adversos.',
    field: 'summary',
  };
}

export function evaluateHighRiskMedWithoutDoubleCheck(ctx: CdrContext): CdrCheckResult | null {
  if (!isMarAction(ctx.actionId)) return null;

  const drugName = extractDrugName(ctx.formData);
  const orderId = trimField(ctx.formData.medication_order_id);
  if (!drugName || !isHighRiskDrug(drugName)) return null;

  const hasDoubleCheck =
    orderId && (ctx.marDoubleChecks ?? []).some((check) => check.medicationOrderId === orderId);

  if (hasDoubleCheck) return null;

  return {
    ruleId: 'high_risk_med_without_double_check',
    id: 'cdr.high_risk_med_without_double_check',
    severity: 'block',
    message: `Doble chequeo obligatorio para medicamento de alto riesgo: ${drugName}.`,
    clinicalRationale:
      'Medicamentos de alto riesgo requieren verificación independiente antes de administración.',
    field: 'medication_order_id',
  };
}

export function evaluateClinicalDecisionRules(ctx: CdrContext): CdrCheckResult[] {
  const checks = [
    evaluateAllergyMedicationConflict(ctx),
    evaluateCriticalLabWithoutAck(ctx),
    evaluateDischargeWithOpenCriticalOrders(ctx),
    evaluateDuplicateMedicationOrder(ctx),
    evaluateHighRiskMedWithoutDoubleCheck(ctx),
  ];
  return checks.filter((check): check is CdrCheckResult => check !== null);
}
