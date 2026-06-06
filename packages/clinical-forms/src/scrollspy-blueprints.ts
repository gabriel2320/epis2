/** Blueprints con layout scrollspy Ola 2+ (consulta ambulatoria). */
export const SCROLLSPY_LAYOUT_BLUEPRINT_IDS = ['outpatient_visit'] as const;

export type ScrollspyLayoutBlueprintId = (typeof SCROLLSPY_LAYOUT_BLUEPRINT_IDS)[number];

export function blueprintUsesScrollspyLayout(
  blueprintId: string,
): blueprintId is ScrollspyLayoutBlueprintId {
  return (SCROLLSPY_LAYOUT_BLUEPRINT_IDS as readonly string[]).includes(blueprintId);
}

/** Secciones del índice scrollspy — ambulatorio incluye secciones colapsables. */
export function scrollspySectionLabels(
  blueprint: { sections: readonly { id: string; label: string; initialVisibility?: string }[] },
  blueprintId: string,
): { id: string; label: string }[] {
  const all = blueprint.sections.map((s) => ({ id: s.id, label: s.label }));
  if (blueprintUsesScrollspyLayout(blueprintId)) {
    return all;
  }
  return blueprint.sections
    .filter((s) => s.initialVisibility !== 'collapsed')
    .map((s) => ({ id: s.id, label: s.label }));
}
