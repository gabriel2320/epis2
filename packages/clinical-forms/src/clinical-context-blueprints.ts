/** Blueprints con panel de contexto clínico (LAYOUT-01+). */
export const CLINICAL_CONTEXT_BLUEPRINT_IDS = [
  'evolution_note',
  'discharge_summary',
  'prescription',
  'referral',
] as const;

export type ClinicalContextBlueprintId = (typeof CLINICAL_CONTEXT_BLUEPRINT_IDS)[number];

const DEFAULT_INSERT_FIELD: Record<ClinicalContextBlueprintId, string> = {
  evolution_note: 'plan',
  discharge_summary: 'followUpPlan',
  prescription: 'clinicalNotes',
  referral: 'clinicalSummary',
};

export function blueprintSupportsClinicalContext(
  blueprintId: string,
): blueprintId is ClinicalContextBlueprintId {
  return (CLINICAL_CONTEXT_BLUEPRINT_IDS as readonly string[]).includes(blueprintId);
}

/** Campo textarea destino por defecto al insertar desde el panel de contexto. */
export function defaultClinicalContextInsertField(blueprintId: ClinicalContextBlueprintId): string {
  return DEFAULT_INSERT_FIELD[blueprintId];
}
