import { copy } from '@epis2/design-system';

/** Etiquetas es-ES para claves de `clinicalContext.summaryFields`. */
export const PATIENT_SUMMARY_FIELD_LABELS: Record<string, string> = {
  activeProblems: copy.activePatient.summaryActiveProblems,
  recentEvents: copy.activePatient.summaryRecentEvents,
  relevantLabs: copy.activePatient.summaryLabs,
  activeMedications: copy.activePatient.summaryMedications,
  pendingItems: copy.activePatient.summaryPending,
  clinicalAlerts: copy.activePatient.summaryAlerts,
};

export function patientSummaryFieldLabel(key: string): string {
  return PATIENT_SUMMARY_FIELD_LABELS[key] ?? key;
}
