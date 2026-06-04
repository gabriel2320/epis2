import { describe, expect, it } from 'vitest';
import { evaluateDemoClinicalAlerts } from './evaluate.js';

describe('evaluateDemoClinicalAlerts', () => {
  it('fusiona CDS y CDR para receta duplicada', () => {
    const result = evaluateDemoClinicalAlerts(
      {
        allergies: [],
        medications: [{ name: 'Losartán 50 mg', status: 'active' }],
      },
      {
        blueprintId: 'prescription',
        currentFields: { medication: 'Losartán 50 mg' },
      },
    );
    expect(result.warnings.some((w) => w.ruleId.includes('duplicate'))).toBe(true);
  });

  it('CDR crítico en epicrisis con lab crítico', () => {
    const result = evaluateDemoClinicalAlerts(
      {
        allergies: [],
        medications: [{ name: 'Insulina', status: 'active' }],
        labs: [{ name: 'Troponina', value: '2.1', flag: 'critical' }],
      },
      { blueprintId: 'discharge_summary' },
    );
    expect(
      result.warnings.some((w) => w.ruleId.includes('critical_lab') || w.ruleId.includes('discharge')),
    ).toBe(true);
  });
});
