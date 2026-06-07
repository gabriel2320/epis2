import type { CommandSlots } from '@epis2/command-registry';

const IMAGING_MODALITY_BY_STUDY: ReadonlyArray<{ pattern: RegExp; modality: string }> = [
  { pattern: /\b(tac|tomografia|tc)\b/, modality: 'TC' },
  { pattern: /\b(rmn|resonancia)\b/, modality: 'RM' },
  { pattern: /\b(rx|radiografia|placa)\b/, modality: 'RX' },
  { pattern: /\b(ecografia|ultrasonido|us)\b/, modality: 'US' },
];

function mapUrgencyToLabPriority(urgency?: CommandSlots['urgencyHint']): string | undefined {
  if (!urgency) return undefined;
  return urgency === 'routine' ? 'rutina' : 'urgente';
}

function mapUrgencyToReferral(urgency?: CommandSlots['urgencyHint']): string | undefined {
  if (!urgency) return undefined;
  if (urgency === 'routine') return 'rutina';
  if (urgency === 'urgent') return 'preferente';
  return 'urgente';
}

function inferImagingModality(studyHint?: string): string | undefined {
  if (!studyHint) return undefined;
  const normalized = studyHint.toLowerCase();
  for (const entry of IMAGING_MODALITY_BY_STUDY) {
    if (entry.pattern.test(normalized)) return entry.modality;
  }
  return undefined;
}

function composeImagingStudyDescription(slots: CommandSlots): string | undefined {
  const parts = [slots.studyHint, slots.bodySiteHint].filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.join(' — ');
}

function composeClinicalIndication(slots: CommandSlots): string | undefined {
  const parts: string[] = [];
  if (slots.bodySiteHint) parts.push(`Región: ${slots.bodySiteHint}`);
  if (slots.clinicalReasonHint) parts.push(`Motivo: ${slots.clinicalReasonHint}`);
  if (parts.length === 0) return undefined;
  return parts.join('. ');
}

/**
 * CE-3b/CE-4: mapeo determinístico CommandSlots → campos de blueprint (borrador editable).
 * No sustituye revisión humana ni IA de formulario.
 */
export function buildCommandSlotPrefill(
  blueprintId: string,
  slots: CommandSlots,
): Record<string, string> {
  const prefill: Record<string, string> = {};

  switch (blueprintId) {
    case 'patient_search':
      if (slots.patientHint) prefill.patientName = slots.patientHint;
      break;
    case 'prescription':
      if (slots.medicationHint) prefill.medication = slots.medicationHint;
      break;
    case 'lab_request':
      if (slots.studyHint) prefill.labTests = slots.studyHint;
      if (slots.clinicalReasonHint) prefill.clinicalReason = slots.clinicalReasonHint;
      if (slots.urgencyHint) {
        const priority = mapUrgencyToLabPriority(slots.urgencyHint);
        if (priority) prefill.priority = priority;
      }
      break;
    case 'referral':
      if (slots.specialtyHint) prefill.specialty = slots.specialtyHint;
      if (slots.clinicalReasonHint) prefill.clinicalSummary = slots.clinicalReasonHint;
      if (slots.urgencyHint) {
        const urgency = mapUrgencyToReferral(slots.urgencyHint);
        if (urgency) prefill.urgency = urgency;
      }
      break;
    case 'imaging_request': {
      const studyDescription = composeImagingStudyDescription(slots);
      if (studyDescription) prefill.studyDescription = studyDescription;
      const modality = inferImagingModality(slots.studyHint);
      if (modality) prefill.modality = modality;
      const indication = composeClinicalIndication(slots);
      if (indication) prefill.clinicalIndication = indication;
      if (slots.urgencyHint) {
        const priority = mapUrgencyToLabPriority(slots.urgencyHint);
        if (priority) prefill.priority = priority;
      }
      break;
    }
    case 'evolution_note':
      if (slots.noteHint) prefill.subjective = slots.noteHint;
      if (slots.clinicalReasonHint && !slots.noteHint) {
        prefill.subjective = slots.clinicalReasonHint;
      }
      break;
    case 'discharge_summary':
      if (slots.clinicalReasonHint) prefill.instructions = slots.clinicalReasonHint;
      break;
    default:
      break;
  }

  return prefill;
}

export function hasCommandSlotPrefill(slots: CommandSlots): boolean {
  return Object.values(slots).some((value) => Boolean(value));
}
