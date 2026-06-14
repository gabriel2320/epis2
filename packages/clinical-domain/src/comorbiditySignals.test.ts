import { describe, expect, it } from 'vitest';
import { detectClinicalComorbiditySignals } from './comorbiditySignals.js';

describe('detectClinicalComorbiditySignals', () => {
  it('detecta DM2 sin ERC ni insulina', () => {
    expect(
      detectClinicalComorbiditySignals({
        activeProblems: 'Diabetes mellitus tipo 2',
        activeMedications: 'Metformina 850 mg/día',
      }),
    ).toEqual({ hasDm2: true, hasCkd: false, onInsulin: false });
  });

  it('detecta ERC e insulina en el mismo paciente', () => {
    expect(
      detectClinicalComorbiditySignals({
        activeProblems: 'Diabetes mellitus tipo 2\nEnfermedad renal crónica estadio 3',
        activeMedications: 'Insulina glargina 20 UI/noche',
        relevantLabs: 'Creatinina 1.4 mg/dL',
      }),
    ).toEqual({ hasDm2: true, hasCkd: true, onInsulin: true });
  });

  it('no infiere DM2 en HTA aislada', () => {
    expect(
      detectClinicalComorbiditySignals({
        activeProblems: 'Hipertensión arterial esencial',
        activeMedications: 'Losartán 50 mg/día',
      }),
    ).toEqual({ hasDm2: false, hasCkd: false, onInsulin: false });
  });
});
