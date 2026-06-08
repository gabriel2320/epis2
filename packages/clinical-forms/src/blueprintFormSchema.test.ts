import { describe, expect, it } from 'vitest';
import { getBlueprintById } from './registry.js';
import { buildBlueprintFormSchema, mapBlueprintZodErrors } from './blueprintFormSchema.js';
import { validateFormValues } from './validate.js';

describe('buildBlueprintFormSchema', () => {
  it('rechaza ingreso sin motivo — alineado con validateFormValues', () => {
    const blueprint = getBlueprintById('admission_note');
    expect(blueprint).toBeDefined();
    const schema = buildBlueprintFormSchema(blueprint!);
    const empty = Object.fromEntries(blueprint!.fields.map((f) => [f.id, '']));
    const legacy = validateFormValues(blueprint!, empty);
    const parsed = schema.safeParse(empty);
    expect(parsed.success).toBe(false);
    expect(legacy.valid).toBe(false);
    if (!parsed.success) {
      const map = mapBlueprintZodErrors(parsed.error);
      expect(Object.keys(map).length).toBeGreaterThan(0);
    }
  });

  it('acepta ingreso demo completo', () => {
    const blueprint = getBlueprintById('admission_note');
    expect(blueprint).toBeDefined();
    const schema = buildBlueprintFormSchema(blueprint!);
    const values = {
      admissionReason: 'Dolor torácico',
      clinicalSummary: 'Estable',
      initialPlan: 'Monitoreo',
      targetBedId: 'f0000002-0000-4000-8000-000000000003|102A — disponible',
    };
    expect(schema.safeParse(values).success).toBe(true);
    expect(validateFormValues(blueprint!, values).valid).toBe(true);
  });
});
