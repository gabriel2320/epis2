import type { ClinicalFormBlueprint, FormField } from './types.js';

/** Columnas del grid M3 en escritorio — docs/design/EPIS2_M3_SYMMETRY_AND_FRAMING.md */
export const EPIS2_M3_FORM_COLUMNS = 12;

/** Span efectivo de un campo (1–12). Textarea/checkbox siempre ancho completo salvo span explícito 12. */
export function resolveFieldColumnSpan(field: FormField): number {
  if (field.columnSpan !== undefined) {
    return clampColumnSpan(field.columnSpan);
  }
  return EPIS2_M3_FORM_COLUMNS;
}

export function clampColumnSpan(span: number): number {
  return Math.min(Math.max(Math.round(span), 1), EPIS2_M3_FORM_COLUMNS);
}

/** Valida columnSpan por campo y reglas de prosa clínica. */
export function validateBlueprintLayout(blueprint: ClinicalFormBlueprint): string[] {
  const errors: string[] = [];

  for (const field of blueprint.fields) {
    if (field.columnSpan === undefined) continue;

    if (!Number.isInteger(field.columnSpan)) {
      errors.push(`${blueprint.blueprintId}.${field.id}: columnSpan debe ser entero`);
      continue;
    }

    if (field.columnSpan < 1 || field.columnSpan > EPIS2_M3_FORM_COLUMNS) {
      errors.push(
        `${blueprint.blueprintId}.${field.id}: columnSpan debe estar entre 1 y ${EPIS2_M3_FORM_COLUMNS}`,
      );
    }

    if (field.type === 'textarea' && field.columnSpan !== EPIS2_M3_FORM_COLUMNS) {
      errors.push(`${blueprint.blueprintId}.${field.id}: textarea debe ocupar 12 columnas`);
    }
  }

  return errors;
}
