import { z } from 'zod';
import type { ClinicalFormBlueprint } from './types.js';

/** Esquema Zod derivado del blueprint — misma semántica que validateFormValues. */
export function buildBlueprintFormSchema(blueprint: ClinicalFormBlueprint) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of blueprint.fields) {
    const rule = blueprint.validations.find((v) => v.fieldId === field.id);
    const required = Boolean(field.required || rule);
    const message = rule?.message ?? `${field.label} es obligatorio`;

    if (field.type === 'checkbox') {
      shape[field.id] = required
        ? z.enum(['true', 'false']).refine((v) => v === 'true', { message })
        : z.enum(['true', 'false']);
      continue;
    }

    let base: z.ZodTypeAny = z.string();
    if (required) {
      base = z.string().min(1, message);
    } else {
      base = z.string().optional().or(z.literal(''));
    }
    shape[field.id] = base;
  }

  return z.object(shape);
}

export function mapBlueprintZodErrors(
  error: z.ZodError,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
}
