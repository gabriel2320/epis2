/** Blueprints con panel de contexto clínico (LAYOUT-01+). */
export const CLINICAL_CONTEXT_BLUEPRINT_IDS = ['evolution_note', 'discharge_summary'] as const;

export type ClinicalContextBlueprintId = (typeof CLINICAL_CONTEXT_BLUEPRINT_IDS)[number];

export function blueprintSupportsClinicalContext(
  blueprintId: string,
): blueprintId is ClinicalContextBlueprintId {
  return (CLINICAL_CONTEXT_BLUEPRINT_IDS as readonly string[]).includes(blueprintId);
}
