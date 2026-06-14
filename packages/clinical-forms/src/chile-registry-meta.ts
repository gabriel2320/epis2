import { isChileRegistryMetaKey } from '@epis2/clinical-domain';
import type { ClinicalFormBlueprint } from './types.js';

/** Blueprints Chile con metadata registry obligatoria (MF-SH-04). */
export const CHILE_REGISTRY_META_BLUEPRINT_IDS = [
  'patient_search',
  'patient_summary',
  'prescription',
] as const;

export type ChileRegistryMetaBlueprintId = (typeof CHILE_REGISTRY_META_BLUEPRINT_IDS)[number];

export function isChileRegistryMetaBlueprint(
  blueprintId: string,
): blueprintId is ChileRegistryMetaBlueprintId {
  return (CHILE_REGISTRY_META_BLUEPRINT_IDS as readonly string[]).includes(blueprintId);
}

/** Valida variableKey de campos contra allowlist CHILE (SNRE/RUT/resumen). */
export function validateChileBlueprintRegistryMeta(blueprint: ClinicalFormBlueprint): string[] {
  if (!isChileRegistryMetaBlueprint(blueprint.blueprintId)) return [];

  const errors: string[] = [];
  for (const field of blueprint.fields) {
    if (field.required && !field.variableKey?.trim()) {
      errors.push(`${blueprint.blueprintId}.${field.id}: campo requerido sin variableKey`);
    }
    const key = field.variableKey?.trim();
    if (key && !isChileRegistryMetaKey(key)) {
      errors.push(`${blueprint.blueprintId}.${field.id}: variableKey "${key}" fuera de allowlist CHILE`);
    }
  }
  return errors;
}
