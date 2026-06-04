/**
 * Referencia de tests EPIS — adaptar a @epis2/clinical-domain cuando se integre.
 * Copiado desde packages/epis-clinical-safety/test/safety.test.ts (commit a3b0ffe EPIS).
 */
import { describe, expect, it } from 'vitest';
import { evaluateClinicalSafety } from '../proposed/evaluate.js';

describe('clinical safety demo (cuarentena)', () => {
  it('detecta reactividad cruzada beta-lactámicos', () => {
    const result = evaluateClinicalSafety({
      allergies: [{ substance: 'Penicilina', severity: 'moderate' }],
      medications: [{ name: 'Ceftriaxona', status: 'active' }],
    });
    expect(result.warnings.some((w) => w.ruleId === 'beta-lactam-cross-reactivity')).toBe(true);
  });
});
