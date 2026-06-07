const SUMMARY_FIELD_KEYS = [
  'activeProblems',
  'recentEvents',
  'relevantLabs',
  'activeMedications',
  'pendingItems',
  'clinicalAlerts',
] as const;

function joinSummaryParts(parts: Array<string | undefined>): string | undefined {
  const lines = parts.map((part) => part?.trim()).filter(Boolean) as string[];
  if (lines.length === 0) return undefined;
  return lines.join('\n');
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
 * CE-4: prefill desde resumen longitudinal demo (contexto activo del paciente).
 * Solo borrador editable; requiere revisión humana.
 */
export function buildContextClinicalPrefill(
  blueprintId: string,
  summaryFields: Record<string, string>,
): Record<string, string> {
  const summary: Record<string, string> = {};
  for (const key of SUMMARY_FIELD_KEYS) {
    const value = summaryFields[key]?.trim();
    if (value) summary[key] = value;
  }
  if (Object.keys(summary).length === 0) return {};

  const prefill: Record<string, string> = {};

  switch (blueprintId) {
    case 'evolution_note': {
      const objective = joinSummaryParts([summary.relevantLabs, summary.recentEvents]);
      if (objective) prefill.objective = objective;
      if (summary.activeProblems) prefill.assessment = summary.activeProblems;
      const plan = joinSummaryParts([
        summary.pendingItems,
        summary.activeMedications ? `Medicación activa: ${summary.activeMedications}` : undefined,
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
    default:
      break;
  }

  return prefill;
}

export function supportsContextClinicalPrefill(blueprintId: string): boolean {
  return blueprintId === 'evolution_note' || blueprintId === 'discharge_summary';
}
