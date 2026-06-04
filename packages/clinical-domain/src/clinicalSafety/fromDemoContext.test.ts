import { describe, expect, it } from 'vitest';
import { evaluateClinicalSafety } from './evaluate.js';
import { buildClinicalSafetyInputFromSummary } from './fromDemoContext.js';

describe('buildClinicalSafetyInputFromSummary', () => {
  it('dispara alerta beta-lactámica desde resumen demo', () => {
    const input = buildClinicalSafetyInputFromSummary(
      {
        clinicalAlerts: 'Alergia a penicilina (demo sintético)',
        activeMedications: 'Ceftriaxona 1 g IV (demo)',
        relevantLabs: 'Creatinina 0.9 mg/dL (demo)',
      },
      { sex: 'F' },
    );
    const result = evaluateClinicalSafety(input);
    expect(result.warnings.some((w) => w.ruleId === 'beta-lactam-cross-reactivity')).toBe(true);
  });
});
