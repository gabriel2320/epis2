import { describe, expect, it } from 'vitest';
import { validateAdminPrevision, validateAdminRut } from './chileAdminValidators.js';

describe('chileAdminValidators (MF-DI-09)', () => {
  it('acepta RUT válido', () => {
    expect(validateAdminRut('12.345.678-5').valid).toBe(true);
  });

  it('rechaza RUT inválido', () => {
    expect(validateAdminRut('12.345.678-0').valid).toBe(false);
  });

  it('valida previsión conocida', () => {
    expect(validateAdminPrevision('FONASA tramo B').valid).toBe(true);
    expect(validateAdminPrevision('Privado').valid).toBe(false);
  });
});
