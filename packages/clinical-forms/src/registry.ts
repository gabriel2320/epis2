import { EPIS2_COMMAND_DEFINITIONS } from '@epis2/command-registry';
import {
  dischargeSummaryBlueprint,
  evolutionNoteBlueprint,
  labRequestBlueprint,
  patientSearchBlueprint,
  patientSummaryBlueprint,
  prescriptionBlueprint,
} from './blueprints/index.js';
import type { ClinicalFormBlueprint } from './types.js';

/** Registry único de formularios clínicos MVP (6 blueprints). */
export const EPIS2_FORM_BLUEPRINTS: readonly ClinicalFormBlueprint[] = [
  patientSearchBlueprint,
  patientSummaryBlueprint,
  evolutionNoteBlueprint,
  dischargeSummaryBlueprint,
  prescriptionBlueprint,
  labRequestBlueprint,
];

const byId = new Map(EPIS2_FORM_BLUEPRINTS.map((b) => [b.blueprintId, b]));
const byRoute = new Map(EPIS2_FORM_BLUEPRINTS.map((b) => [b.routePath, b]));

export function getBlueprintById(blueprintId: string): ClinicalFormBlueprint | undefined {
  return byId.get(blueprintId);
}

export function getBlueprintByRoutePath(routePath: string): ClinicalFormBlueprint | undefined {
  return byRoute.get(routePath);
}

export function assertRegistryInvariants(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const routes = new Set<string>();
  const registryIntents = new Set(EPIS2_COMMAND_DEFINITIONS.map((d) => d.intent));

  for (const bp of EPIS2_FORM_BLUEPRINTS) {
    if (ids.has(bp.blueprintId)) {
      errors.push(`blueprintId duplicado: ${bp.blueprintId}`);
    }
    ids.add(bp.blueprintId);

    if (routes.has(bp.routePath)) {
      errors.push(`routePath duplicado: ${bp.routePath}`);
    }
    routes.add(bp.routePath);

    for (const intentId of bp.intentIds) {
      if (!registryIntents.has(intentId)) {
        errors.push(`${bp.blueprintId}: intent ${intentId} no está en command-registry`);
      }
    }
  }

  for (const def of EPIS2_COMMAND_DEFINITIONS) {
    if (def.routePath.startsWith('/epis2/dashboard')) {
      continue;
    }
    const linked = EPIS2_FORM_BLUEPRINTS.some((b) => b.intentIds.includes(def.intent));
    if (!linked) {
      errors.push(`intent ${def.intent} sin blueprint asociado`);
    }
  }

  return errors;
}
