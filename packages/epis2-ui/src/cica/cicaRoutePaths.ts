/** Convierte ruta registry (`:param`) a path TanStack Router (`$param`). */
export function registryRouteToTanstackPath(registryRoute: string): string {
  return registryRoute.replace(/:([A-Za-z0-9_]+)/g, '$$$1');
}

/** Valida search `draftId` en formularios CICA. */
export function parseCicaDraftRouteSearch(
  search: Record<string, unknown>,
): { draftId?: string } {
  const parsed: { draftId?: string } = {};
  if (typeof search.draftId === 'string' && search.draftId) {
    parsed.draftId = search.draftId;
  }
  return parsed;
}

export const CICA_DRAFT_FORM_SCREEN_IDS = [
  'new-evolution',
  'new-prescription',
  'new-document',
  'new-epicrisis',
] as const;

export type CicaDraftFormScreenId = (typeof CICA_DRAFT_FORM_SCREEN_IDS)[number];
