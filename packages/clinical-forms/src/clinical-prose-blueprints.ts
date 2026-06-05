/** Blueprints con campos de lectura prolongada (regla prosa 65ch). */
export const CLINICAL_PROSE_BLUEPRINT_IDS = ['evolution_note', 'discharge_summary'] as const;

export type ClinicalProseBlueprintId = (typeof CLINICAL_PROSE_BLUEPRINT_IDS)[number];

export function blueprintUsesClinicalProse(blueprintId: string): blueprintId is ClinicalProseBlueprintId {
  return (CLINICAL_PROSE_BLUEPRINT_IDS as readonly string[]).includes(blueprintId);
}
