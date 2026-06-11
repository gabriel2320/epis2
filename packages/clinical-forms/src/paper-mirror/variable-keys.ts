import type { PaperChartSectionId } from '../paper-chart/schema.js';

export type PaperMirrorEntry = {
  variableKey: string;
  classicBlueprintId: string;
  classicFieldId: string;
  paperSectionId: PaperChartSectionId;
  paperSlot: string;
};

/** PROG-PAPER-MIRROR — misma variableKey en traditional y papel. */
export const PAPER_MIRROR_VARIABLE_KEYS: readonly PaperMirrorEntry[] = [
  {
    variableKey: 'summary.active_problems',
    classicBlueprintId: 'patient_summary',
    classicFieldId: 'activeProblems',
    paperSectionId: 'cover',
    paperSlot: 'problems',
  },
  {
    variableKey: 'summary.active_medications',
    classicBlueprintId: 'patient_summary',
    classicFieldId: 'activeMedications',
    paperSectionId: 'orders',
    paperSlot: 'medications',
  },
  {
    variableKey: 'summary.clinical_alerts',
    classicBlueprintId: 'patient_summary',
    classicFieldId: 'clinicalAlerts',
    paperSectionId: 'cover',
    paperSlot: 'alerts',
  },
  {
    variableKey: 'summary.relevant_labs',
    classicBlueprintId: 'patient_summary',
    classicFieldId: 'relevantLabs',
    paperSectionId: 'labs',
    paperSlot: 'results',
  },
  {
    variableKey: 'rx.medication',
    classicBlueprintId: 'prescription',
    classicFieldId: 'medication',
    paperSectionId: 'orders',
    paperSlot: 'medication',
  },
  {
    variableKey: 'rx.patient_instructions',
    classicBlueprintId: 'prescription',
    classicFieldId: 'patientInstructions',
    paperSectionId: 'orders',
    paperSlot: 'instructions',
  },
] as const;

export function getPaperMirrorByVariableKey(variableKey: string): PaperMirrorEntry | undefined {
  return PAPER_MIRROR_VARIABLE_KEYS.find((e) => e.variableKey === variableKey);
}

export function getPaperMirrorForClassicField(
  blueprintId: string,
  fieldId: string,
): PaperMirrorEntry | undefined {
  return PAPER_MIRROR_VARIABLE_KEYS.find(
    (e) => e.classicBlueprintId === blueprintId && e.classicFieldId === fieldId,
  );
}
