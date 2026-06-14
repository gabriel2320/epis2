import { describe, expect, it } from 'vitest';
import { validateGeneratedFormAdminFields } from './validateGeneratedFormAdmin.js';

describe('validateGeneratedFormAdminFields (MF-DI-09)', () => {
  it('valida RUT en búsqueda de paciente', () => {
    const errors = validateGeneratedFormAdminFields('patient_search', {
      identifier: '12.345.678-0',
    });
    expect(errors.some((e) => e.fieldId === 'identifier')).toBe(true);
  });

  it('acepta identificador no RUT', () => {
    expect(
      validateGeneratedFormAdminFields('patient_search', { identifier: 'DEMO-001' }),
    ).toHaveLength(0);
  });
});
