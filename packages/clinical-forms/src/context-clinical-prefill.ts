import type { CommandSlots } from '@epis2/command-registry';
import {
  detectChronicFocus,
  evolutionSubjectiveForControl,
  formatIsoDateLocal,
  labPanelForChronicFocus,
  parseFirstActiveMedicationLine,
} from './chronic-control-prefill.js';

const SUMMARY_FIELD_KEYS = [
  'activeProblems',
  'recentEvents',
  'relevantLabs',
  'activeMedications',
  'pendingItems',
  'clinicalAlerts',
] as const;

export type ContextClinicalPrefillOptions = {
  slots?: CommandSlots;
  referenceDate?: Date;
};

function joinSummaryParts(parts: Array<string | undefined>): string | undefined {
  const lines = parts.map((part) => part?.trim()).filter(Boolean) as string[];
  if (lines.length === 0) return undefined;
  return lines.join('\n');
}

function firstProblemLine(activeProblems: string): string {
  return activeProblems.split('\n')[0]?.trim() ?? activeProblems;
}

/** CE-4: rellena solo campos vacíos; no pisa texto ya escrito ni slots previos. */
export function mergePrefillOnlyEmpty(
  current: Record<string, string>,
  prefill: Record<string, string>,
): Record<string, string> {
  const next = { ...current };
  for (const [key, value] of Object.entries(prefill)) {
    if (!value.trim()) continue;
    const existing = next[key]?.trim() ?? '';
    if (!existing || existing === 'false') {
      next[key] = value;
    }
  }
  return next;
}

/**
 * CE-4 / CE-6 (MF-DI-04): prefill desde resumen + foco crónico determinístico.
 * Solo borrador editable; requiere revisión humana.
 */
export function buildContextClinicalPrefill(
  blueprintId: string,
  summaryFields: Record<string, string>,
  options?: ContextClinicalPrefillOptions,
): Record<string, string> {
  const summary: Record<string, string> = {};
  for (const key of SUMMARY_FIELD_KEYS) {
    const value = summaryFields[key]?.trim();
    if (value) summary[key] = value;
  }
  const slots = options?.slots;
  const hasSlots = slots && Object.values(slots).some(Boolean);
  if (Object.keys(summary).length === 0 && !hasSlots) return {};

  const prefill: Record<string, string> = {};
  const chronicFocus = detectChronicFocus(summary, {
    ...(slots?.clinicalReasonHint ? { clinicalReasonHint: slots.clinicalReasonHint } : {}),
    ...(slots?.studyHint ? { studyHint: slots.studyHint } : {}),
  });

  switch (blueprintId) {
    case 'evolution_note': {
      const subjective = evolutionSubjectiveForControl(chronicFocus, slots?.clinicalReasonHint);
      if (subjective) prefill.subjective = subjective;
      const objective = joinSummaryParts([summary.relevantLabs, summary.recentEvents]);
      if (objective) prefill.objective = objective;
      if (summary.activeProblems) prefill.assessment = summary.activeProblems;
      const plan = joinSummaryParts([
        summary.pendingItems,
        summary.activeMedications ? `Medicación activa: ${summary.activeMedications}` : undefined,
        chronicFocus === 'dm2' ? 'Solicitar HbA1c si último control > 3 meses.' : undefined,
      ]);
      if (plan) prefill.plan = plan;
      break;
    }
    case 'discharge_summary': {
      if (summary.activeProblems) prefill.diagnoses = summary.activeProblems;
      const hospitalizationSummary = joinSummaryParts([summary.recentEvents, summary.relevantLabs]);
      if (hospitalizationSummary) prefill.hospitalizationSummary = hospitalizationSummary;
      if (summary.activeMedications) prefill.dischargeMedications = summary.activeMedications;
      if (summary.pendingItems) {
        prefill.instructions = summary.pendingItems;
        prefill.followUpPlan = summary.pendingItems;
      }
      break;
    }
    case 'prescription': {
      const parsed = summary.activeMedications
        ? parseFirstActiveMedicationLine(summary.activeMedications)
        : null;
      if (parsed) {
        prefill.medication = parsed.name;
        if (parsed.dose) prefill.dose = parsed.dose;
        if (parsed.frequency) prefill.frequency = parsed.frequency;
      }
      if (summary.activeProblems) {
        prefill.clinicalNotes = firstProblemLine(summary.activeProblems);
      }
      prefill.duration = '90 días';
      prefill.quantity = '1';
      prefill.route = 'oral';
      prefill.patientInstructions = 'Tomar según indicación médica. Mantener control cronológico.';
      break;
    }
    case 'lab_request': {
      if (slots?.studyHint) {
        prefill.labTests = slots.studyHint;
      } else if (chronicFocus) {
        prefill.labTests = labPanelForChronicFocus(chronicFocus);
      } else if (summary.relevantLabs) {
        prefill.labTests = summary.relevantLabs
          .split('·')
          .map((part) => part.trim())
          .filter(Boolean)
          .join('\n');
      }
      const reason =
        slots?.clinicalReasonHint ??
        (chronicFocus === 'dm2'
          ? 'Control diabetes mellitus tipo 2'
          : chronicFocus === 'hta'
            ? 'Control hipertensión arterial'
            : undefined);
      if (reason) prefill.clinicalReason = reason;
      else if (summary.activeProblems) {
        prefill.clinicalReason = firstProblemLine(summary.activeProblems);
      }
      prefill.priority = 'rutina';
      prefill.scheduledDate = formatIsoDateLocal(options?.referenceDate);
      break;
    }
    case 'medical_certificate': {
      if (summary.activeProblems) {
        prefill.diagnosisSummary = firstProblemLine(summary.activeProblems);
      }
      prefill.validFrom = formatIsoDateLocal(options?.referenceDate);
      break;
    }
    default:
      break;
  }

  return prefill;
}

const CONTEXT_PREFILL_BLUEPRINTS = new Set([
  'evolution_note',
  'discharge_summary',
  'prescription',
  'lab_request',
  'medical_certificate',
]);

export function supportsContextClinicalPrefill(blueprintId: string): boolean {
  return CONTEXT_PREFILL_BLUEPRINTS.has(blueprintId);
}
