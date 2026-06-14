import { describe, expect, it } from 'vitest';
import type { ClinicalAlert } from '@epis2/contracts';
import { mapClinicalAlertsToPatientViewCards } from './mapClinicalAlertsToPatientViewCards.js';

function alert(partial: ClinicalAlert): ClinicalAlert {
  return partial;
}

describe('mapClinicalAlertsToPatientViewCards (MF-CU-02)', () => {
  it('mapea critical→warning y allergy warning→suggestion', () => {
    const cards = mapClinicalAlertsToPatientViewCards([
      alert({
        ruleId: 'beta-lactam-cross-reactivity',
        severity: 'critical',
        message: 'Reacción cruzada beta-lactámico',
        detail: 'Ceftriaxona con alergia a penicilina.',
        source: 'cds',
      }),
      alert({
        ruleId: 'medication_reconciliation_gap',
        severity: 'warning',
        message: 'Brecha de conciliación medicamentosa',
        detail: 'Revisar medicación activa.',
        source: 'cdr',
      }),
    ]);

    expect(cards).toHaveLength(2);
    expect(cards[0]).toMatchObject({
      hook: 'patient-view',
      variant: 'warning',
      ruleId: 'beta-lactam-cross-reactivity',
      label: 'Reacción cruzada beta-lactámico',
      source: 'cds',
    });
    expect(cards[1]).toMatchObject({
      hook: 'patient-view',
      variant: 'suggestion',
      ruleId: 'medication_reconciliation_gap',
      source: 'cdr',
    });
  });

  it('mapea advisory warning→info', () => {
    const cards = mapClinicalAlertsToPatientViewCards([
      alert({
        ruleId: 'fall-risk-documented',
        severity: 'warning',
        message: 'Riesgo de caídas documentado',
        detail: 'Evaluar entorno y ayudas.',
        source: 'cds',
      }),
    ]);

    expect(cards[0]?.variant).toBe('info');
    expect(cards[0]?.hook).toBe('patient-view');
  });

  it('deduplica por ruleId', () => {
    const cards = mapClinicalAlertsToPatientViewCards([
      alert({
        ruleId: 'beta-lactam-cross-reactivity',
        severity: 'critical',
        message: 'Primera',
        detail: 'A',
        source: 'cds',
      }),
      alert({
        ruleId: 'beta-lactam-cross-reactivity',
        severity: 'critical',
        message: 'Duplicada',
        detail: 'B',
        source: 'cds',
      }),
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.label).toBe('Primera');
  });
});
