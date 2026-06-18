import { findCicaScreenById } from './EPIS_CICA_SCREEN_REGISTRY.js';
import type { CicaScreenBlueprint } from './cicaScreenBlueprint.js';
import type { CicaScreenId } from './cicaRoutes.js';

/** Layout MD3 grilla 12 de una sección — sin acciones ni slots. */
export function createTrivialCicaBlueprint(
  screenId: CicaScreenId,
  sectionId: string,
  options?: Pick<CicaScreenBlueprint, 'hideActionBar' | 'actions'>,
): CicaScreenBlueprint {
  return {
    screenId,
    hideActionBar: options?.hideActionBar ?? false,
    sections: [{ id: sectionId, span: 12 }],
    ...(options?.actions ? { actions: options.actions } : {}),
  };
}

/** Deriva blueprint trivial desde `blueprintSectionId` del registry (MF-PONY-04). */
export function resolveTrivialCicaBlueprintFromRegistry(
  screenId: CicaScreenId,
): CicaScreenBlueprint | undefined {
  const screen = findCicaScreenById(screenId);
  if (!screen?.blueprintSectionId) return undefined;
  return createTrivialCicaBlueprint(screenId, screen.blueprintSectionId, {
    ...(screen.blueprintHideActionBar ? { hideActionBar: true } : {}),
  });
}
