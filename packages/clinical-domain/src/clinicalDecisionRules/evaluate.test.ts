import { describe, expect, it } from 'vitest';
import { evaluateDemoClinicalAlerts } from './evaluate.js';

describe('evaluateDemoClinicalAlerts', () => {
  it('fusiona CDS y CDR para ceftriaxona con alergia a penicilina', () => {
    const result = evaluateDemoClinicalAlerts(
      {
        allergies: [{ substance: 'Penicilina', severity: 'moderate' }],
        medications: [
          { name: 'Warfarina 5 mg', status: 'active' },
          { name: 'Ceftriaxona 1 g IV', status: 'active' },
        ],
      },
      {
        blueprintId: 'prescription',
        currentFields: { medication: 'Ceftriaxona 1 g IV' },
      },
    );
    expect(result.warnings.some((w) => w.ruleId.includes('beta-lactam'))).toBe(true);
    expect(
      result.warnings.some((w) => w.ruleId.includes('duplicate') || w.ruleId.includes('allergy')),
    ).toBe(true);
  });

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
      result.warnings.some(
        (w) => w.ruleId.includes('critical_lab') || w.ruleId.includes('discharge'),
      ),
    ).toBe(true);
  });
});
