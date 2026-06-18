import {
  findCicaScreenById,
  type CicaScreenBlueprint,
  type CicaScreenId,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';

export type BuildCicaBlueprintActionsContext = {
  patientId: string;
  go: (screenId: CicaScreenId, params: { patientId: string }) => void;
  goLegacy?: (path: string, search?: Record<string, string>) => void;
};

/** Resuelve acciones declarativas del blueprint en acciones de layout clínico. */
export function buildCicaBlueprintActions(
  blueprint: CicaScreenBlueprint,
  ctx: BuildCicaBlueprintActionsContext,
): ClinicalLayoutAction[] {
  if (!blueprint.actions?.length) return [];

  return blueprint.actions.map((action) => {
    const labelScreenId = action.useRegistryPrimary
      ? blueprint.screenId
      : (action.targetScreenId ?? blueprint.screenId);
    const registryScreen = findCicaScreenById(labelScreenId);
    const label =
      action.label ??
      (action.useRegistryPrimary ? registryScreen?.primaryAction : undefined) ??
      action.id;

    const onClick = () => {
      if (action.legacyPath) {
        ctx.goLegacy?.(action.legacyPath, action.legacySearch);
        return;
      }
      if (action.targetScreenId) {
        ctx.go(action.targetScreenId, { patientId: ctx.patientId });
      }
    };

    return {
      id: action.id,
      label,
      kind: action.kind,
      onClick,
      ...(action.testId ? { testId: action.testId } : {}),
    };
  });
}
