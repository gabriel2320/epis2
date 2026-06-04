import { describe, expect, it } from 'vitest';
import { evaluateClinicalSafety } from './evaluate.js';

describe('clinical safety demo (EPIS2)', () => {
  it('detecta reactividad cruzada beta-lactámicos', () => {
    const result = evaluateClinicalSafety({
      allergies: [{ substance: 'Penicilina', severity: 'moderate' }],
      medications: [{ name: 'Ceftriaxona', status: 'active' }],
    });
    expect(result.warnings.some((w) => w.ruleId === 'beta-lactam-cross-reactivity')).toBe(true);
    expect(result.readOnly).toBe(true);
  });

  it('detecta IECA en embarazo', () => {
    const result = evaluateClinicalSafety({
      allergies: [],
      medications: [{ name: 'Lisinopril', status: 'active' }],
      patient: { sex: 'F', activeProblems: ['Embarazo 12 sem'] },
    });
    expect(result.warnings.some((w) => w.ruleId === 'ace-inhibitor-pregnancy')).toBe(true);
  });

  it('sin alertas en contexto seguro', () => {
    const result = evaluateClinicalSafety({
      allergies: [],
      medications: [{ name: 'Paracetamol', status: 'active' }],
      labs: [{ name: 'Creatinina', value: '0.9', unit: 'mg/dL' }],
    });
    expect(result.warnings).toHaveLength(0);
  });
});
