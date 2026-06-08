import { blueprintSupportsClinicalContext } from './clinical-context-blueprints.js';
import { EPIS2_FORM_BLUEPRINTS } from './registry.js';
import { blueprintUsesScrollspyLayout } from './scrollspy-blueprints.js';
import type { FormOutputKind } from './types.js';

/** Layout de pantalla generada — alineado con `GeneratedClinicalFormPage`. */
export type FormScreenLayoutKind =
  | 'search-grid'
  | 'read-only-summary'
  | 'scrollspy-shell'
  | 'two-pane-context'
  | 'standard-form';

export type FormScreenTreeNode = {
  blueprintId: string;
  label: string;
  routePath: string;
  layout: FormScreenLayoutKind;
  outputKind: FormOutputKind;
  requiresPatient: boolean;
  /** Canon: información no solicitada permanece oculta hasta comando/paciente. */
  commandFirst: boolean;
};

export function resolveFormScreenLayout(
  blueprintId: string,
  outputKind: FormOutputKind,
): FormScreenLayoutKind {
  if (blueprintId === 'patient_search') return 'search-grid';
  if (outputKind === 'READ_ONLY_SUMMARY') return 'read-only-summary';
  if (blueprintUsesScrollspyLayout(blueprintId)) return 'scrollspy-shell';
  if (blueprintSupportsClinicalContext(blueprintId)) return 'two-pane-context';
  return 'standard-form';
}

/** Árbol canónico formulario → ruta → layout (derivado del registry único). */
export const EPIS2_FORM_SCREEN_TREE: readonly FormScreenTreeNode[] = EPIS2_FORM_BLUEPRINTS.map(
  (bp) => ({
    blueprintId: bp.blueprintId,
    label: bp.label,
    routePath: bp.routePath,
    layout: resolveFormScreenLayout(bp.blueprintId, bp.outputKind),
    outputKind: bp.outputKind,
    requiresPatient: bp.requiresPatient,
    commandFirst: bp.blueprintId !== 'patient_search',
  }),
);

export function getFormScreenNode(blueprintId: string): FormScreenTreeNode | undefined {
  return EPIS2_FORM_SCREEN_TREE.find((n) => n.blueprintId === blueprintId);
}

export function assertFormScreenTreeInvariants(): string[] {
  const errors: string[] = [];
  if (EPIS2_FORM_SCREEN_TREE.length !== EPIS2_FORM_BLUEPRINTS.length) {
    errors.push('formScreenTree desincronizado con EPIS2_FORM_BLUEPRINTS');
  }
  const routes = new Set<string>();
  for (const node of EPIS2_FORM_SCREEN_TREE) {
    if (!node.routePath.startsWith('/espacio/')) {
      errors.push(`${node.blueprintId}: routePath debe estar bajo /espacio/`);
    }
    if (routes.has(node.routePath)) {
      errors.push(`routePath duplicado en árbol: ${node.routePath}`);
    }
    routes.add(node.routePath);
  }
  return errors;
}
