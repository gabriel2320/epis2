import type { AiAssistDraftRequest } from '@epis2/contracts';

/** Campos por blueprint — patrón registry EPIDOS AI Gateway (solo borradores MVP). */
export const ASSIST_BLUEPRINT_FIELDS: Record<string, readonly string[]> = {
  evolution_note: ['subjective', 'objective', 'assessment', 'plan'],
  discharge_summary: [
    'diagnoses',
    'dischargeDate',
    'hospitalizationSummary',
    'evolution',
    'dischargeMedications',
    'instructions',
    'followUpPlan',
  ],
  prescription: [
    'medication',
    'dose',
    'quantity',
    'route',
    'frequency',
    'duration',
    'patientInstructions',
    'clinicalNotes',
  ],
  lab_request: ['labTests', 'clinicalReason', 'priority'],
  imaging_request: ['modality', 'studyDescription', 'clinicalIndication', 'priority'],
  procedure_request: ['procedureType', 'procedureDescription', 'clinicalReason', 'priority'],
  nursing_note: [
    'bloodPressure',
    'heartRate',
    'oxygenSaturation',
    'temperature',
    'careProvided',
    'patientResponse',
    'observations',
  ],
  medication_administration: [
    'medication',
    'dose',
    'route',
    'scheduledTime',
    'administeredAt',
    'doubleCheckConfirmed',
    'administrationNotes',
  ],
  admission_note: ['admissionReason', 'clinicalSummary', 'initialPlan', 'targetBedId'],
  allergy_entry: ['substance', 'severity', 'reactionNotes'],
  clinical_problem_entry: ['description', 'status'],
  pharmacy_validation: [
    'medicationReviewed',
    'prescribedDose',
    'intervention',
    'recommendation',
    'communicationToPrescriber',
  ],
  medication_reconciliation: [
    'homeMedications',
    'inpatientMedications',
    'discrepancies',
    'resolutionPlan',
    'communicationNotes',
  ],
  transfer_note: ['transferReason', 'clinicalSummary', 'handoffPlan', 'targetBedId'],
  outpatient_visit: [
    'chiefComplaint',
    'history',
    'physicalExamGeneral',
    'physicalExamSegment',
    'assessment',
    'plan',
    'generalIndications',
  ],
  referral_report: ['referralContext', 'specialistAssessment', 'recommendations', 'followUpPlan'],
};

export type AssistBlueprintSpec = {
  id: string;
  description: string;
  fieldIds: readonly string[];
};

export function listAssistBlueprints(): AssistBlueprintSpec[] {
  return Object.entries(ASSIST_BLUEPRINT_FIELDS).map(([id, fieldIds]) => ({
    id,
    description: `Borrador ${id.replace(/_/g, ' ')} (asistencia local)`,
    fieldIds,
  }));
}

export function getAssistBlueprintFields(
  blueprintId: AiAssistDraftRequest['blueprintId'],
): readonly string[] | undefined {
  return ASSIST_BLUEPRINT_FIELDS[blueprintId];
}
