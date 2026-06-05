/** Severidad CDR EPIONE — en EPIS2 se expone solo como advisory (read-only). */
export type CdrSeverity = 'block' | 'warn';

export const CDR_RULE_IDS = [
  'allergy_medication_conflict',
  'critical_lab_without_ack',
  'discharge_with_open_critical_orders',
  'duplicate_medication_order',
  'high_risk_med_without_double_check',
  'medication_reconciliation_gap',
] as const;

export type CdrRuleId = (typeof CDR_RULE_IDS)[number];

export interface CdrMedicationOrder {
  id?: string;
  drugName: string;
  status: string;
}

export interface CdrMedicalOrder {
  summary: string;
  status: string;
  type?: string;
}

export interface CdrLabResult {
  id?: string;
  testName: string;
  interpretation?: 'normal' | 'abnormal' | 'critical';
  reviewedAt?: string;
}

export interface CdrCriticalLabAlert {
  id: string;
  testName: string;
}

export interface CdrDoubleCheck {
  medicationOrderId: string;
}

export interface CdrContext {
  actionId: string;
  mode: 'commit' | 'sign';
  formData: Record<string, unknown>;
  allergies: string[];
  medicationOrders: CdrMedicationOrder[];
  medicalOrders: CdrMedicalOrder[];
  labResults: CdrLabResult[];
  criticalLabAlerts: CdrCriticalLabAlert[];
  marDoubleChecks?: CdrDoubleCheck[];
}

export interface CdrCheckResult {
  ruleId: CdrRuleId;
  id: string;
  severity: CdrSeverity;
  message: string;
  clinicalRationale: string;
  field?: string;
}
