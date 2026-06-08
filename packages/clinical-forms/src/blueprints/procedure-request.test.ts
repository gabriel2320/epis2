import { describe, expect, it } from 'vitest';
import { initialFormValues, validateFormValues } from '../validate.js';
import { procedureRequestBlueprint } from './procedure-request.js';

describe('procedure_request blueprint', () => {
  it('valida campos obligatorios', () => {
    const invalid = validateFormValues(procedureRequestBlueprint, initialFormValues(procedureRequestBlueprint));
    expect(invalid.valid).toBe(false);

    const valid = validateFormValues(procedureRequestBlueprint, {
      ...initialFormValues(procedureRequestBlueprint),
      procedureType: 'endoscopia',
      procedureDescription: 'Colonoscopia diagnóstica (demo)',
      clinicalReason: 'Sospecha de sangrado digestivo bajo',
    });
    expect(valid.valid).toBe(true);
  });
});
