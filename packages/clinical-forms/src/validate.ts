import type { ClinicalFormBlueprint, FormValidationResult } from './types.js';

export function initialFormValues(
  blueprint: ClinicalFormBlueprint,
  seed?: Record<string, string>,
): Record<string, string> {
  const values: Record<string, string> = { ...seed };
  for (const f of blueprint.fields) {
    if (values[f.id] === undefined) {
      values[f.id] = f.type === 'checkbox' ? 'false' : '';
    }
  }
  return values;
}

export function validateFormValues(
  blueprint: ClinicalFormBlueprint,
  values: Record<string, string>,
): FormValidationResult {
  const errors: FormValidationResult['errors'] = [];

  for (const field of blueprint.fields) {
    if (field.required || blueprint.validations.some((v) => v.fieldId === field.id)) {
      const raw = values[field.id]?.trim() ?? '';
      if (!raw || raw === 'false') {
        const rule = blueprint.validations.find((v) => v.fieldId === field.id);
        errors.push({
          fieldId: field.id,
          message: rule?.message ?? `${field.label} es obligatorio`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export const BLUEPRINT_DRAFT_TYPES: Record<string, string> = {
  evolution_note: 'evolution_note',
  discharge_summary: 'discharge_summary',
  prescription: 'prescription',
  lab_request: 'lab_request',
};
