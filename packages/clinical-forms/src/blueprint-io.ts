import { validateBlueprintLayout } from './layout.js';
import type { ClinicalFormBlueprint } from './types.js';

export const BLUEPRINT_EXPORT_SCHEMA_VERSION = 1 as const;

export type BlueprintExportDocument = {
  schemaVersion: typeof BLUEPRINT_EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  blueprint: ClinicalFormBlueprint;
};

export type BlueprintImportResult =
  | { ok: true; document: BlueprintExportDocument }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateBlueprintShape(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return ['blueprint debe ser un objeto'];
  }

  const requiredStrings = ['blueprintId', 'label', 'purpose', 'routePath', 'outputKind'] as const;
  for (const key of requiredStrings) {
    if (typeof value[key] !== 'string' || !String(value[key]).trim()) {
      errors.push(`blueprint.${key} requerido`);
    }
  }

  if (!Array.isArray(value.intentIds) || value.intentIds.length === 0) {
    errors.push('blueprint.intentIds debe ser un array no vacío');
  }
  if (!Array.isArray(value.allowedRoles) || value.allowedRoles.length === 0) {
    errors.push('blueprint.allowedRoles debe ser un array no vacío');
  }
  if (typeof value.requiresPatient !== 'boolean') {
    errors.push('blueprint.requiresPatient debe ser boolean');
  }
  if (typeof value.requiresEncounter !== 'boolean') {
    errors.push('blueprint.requiresEncounter debe ser boolean');
  }
  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    errors.push('blueprint.sections debe ser un array no vacío');
  }
  if (!Array.isArray(value.fields) || value.fields.length === 0) {
    errors.push('blueprint.fields debe ser un array no vacío');
  }
  if (!Array.isArray(value.validations)) {
    errors.push('blueprint.validations debe ser un array');
  }
  if (value.aiAssistMode !== 'NONE') {
    errors.push('blueprint.aiAssistMode debe ser NONE en EPIS2');
  }
  if (typeof value.approvalRequired !== 'boolean') {
    errors.push('blueprint.approvalRequired debe ser boolean');
  }

  if (errors.length === 0) {
    errors.push(...validateBlueprintLayout(value as ClinicalFormBlueprint));
  }

  return errors;
}

/** Serializa un blueprint a JSON canónico para import/export (MF-156). */
export function serializeBlueprintToJson(blueprint: ClinicalFormBlueprint, pretty = true): string {
  const document: BlueprintExportDocument = {
    schemaVersion: BLUEPRINT_EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    blueprint,
  };
  return JSON.stringify(document, null, pretty ? 2 : undefined);
}

/** Parsea JSON importado y valida estructura + layout M3. */
export function parseBlueprintImport(raw: string): BlueprintImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ['JSON inválido'] };
  }

  if (!isRecord(parsed)) {
    return { ok: false, errors: ['Documento raíz debe ser un objeto'] };
  }

  const blueprint = isRecord(parsed.blueprint) ? parsed.blueprint : parsed;
  const errors = validateBlueprintShape(blueprint);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const document: BlueprintExportDocument = {
    schemaVersion: BLUEPRINT_EXPORT_SCHEMA_VERSION,
    exportedAt:
      typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
    blueprint: blueprint as ClinicalFormBlueprint,
  };

  return { ok: true, document };
}

/** Nombre de archivo sugerido para exportación. */
export function blueprintExportFilename(blueprintId: string): string {
  return `epis2-blueprint-${blueprintId}.json`;
}
