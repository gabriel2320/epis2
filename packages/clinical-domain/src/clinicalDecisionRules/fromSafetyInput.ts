import type { ClinicalSafetyInput } from '../clinicalSafety/types.js';
import type { CdrContext, CdrCriticalLabAlert, CdrMedicalOrder } from './types.js';

const CRITICAL_LAB_HINT = /critico|critical|troponina|k\+|potasio\s+elevado/i;
const CRITICAL_ORDER_FROM_MED = /insulina|heparina|vasoactiv|transfusion|warfarina/i;

export function mapBlueprintToCdrActionId(blueprintId: string | undefined): string {
  switch (blueprintId) {
    case 'discharge_summary':
      return 'discharge_summary';
    case 'prescription':
      return 'prescription';
    case 'lab_request':
      return 'lab_request';
    case 'pharmacy_validation':
      return 'pharmacy_validation';
    case 'medication_administration':
      return 'medication_administration';
    case 'nursing_note':
      return 'nursing_note';
    default:
      return 'clinical_draft';
  }
}

function extractCriticalLabAlerts(input: ClinicalSafetyInput): CdrCriticalLabAlert[] {
  const alerts: CdrCriticalLabAlert[] = [];
  for (const lab of input.labs ?? []) {
    const blob = `${lab.name} ${lab.value} ${lab.flag ?? ''}`;
    if (lab.flag === 'critical' || CRITICAL_LAB_HINT.test(blob)) {
      alerts.push({ id: `lab-${alerts.length + 1}`, testName: lab.name });
    }
  }
  return alerts;
}

function medicationOrdersFromInput(input: ClinicalSafetyInput) {
  return input.medications
    .filter((m) => (m.status ?? 'active').toLowerCase() === 'active')
    .map((m, index) => ({
      id: `mo-${index + 1}`,
      drugName: m.name,
      status: 'active',
    }));
}

function medicalOrdersFromInput(input: ClinicalSafetyInput): CdrMedicalOrder[] {
  return input.medications
    .filter((m) => CRITICAL_ORDER_FROM_MED.test(m.name))
    .map((m) => ({
      summary: m.name,
      status: (m.status ?? 'active').toLowerCase() === 'active' ? 'active' : (m.status ?? 'active'),
    }));
}

export function buildCdrContextFromSafetyInput(
  input: ClinicalSafetyInput,
  options?: {
    blueprintId?: string;
    currentFields?: Record<string, string>;
    mode?: 'commit' | 'sign';
  },
): CdrContext {
  const formData: Record<string, unknown> = {};
  if (options?.currentFields) {
    for (const [key, value] of Object.entries(options.currentFields)) {
      if (value.trim()) formData[key] = value.trim();
    }
  }

  const actionId = mapBlueprintToCdrActionId(options?.blueprintId);
  const mode = options?.mode ?? (options?.blueprintId === 'discharge_summary' ? 'sign' : 'commit');

  return {
    actionId,
    mode,
    formData,
    allergies: input.allergies.map((a) => a.substance),
    medicationOrders: medicationOrdersFromInput(input),
    medicalOrders: medicalOrdersFromInput(input),
    labResults: [],
    criticalLabAlerts: extractCriticalLabAlerts(input),
    marDoubleChecks: [],
  };
}
