import { describe, expect, it } from 'vitest';
import type { ClinicalAlert } from '@epis2/contracts';
import { mapClinicalAlertsToOrderSelectCards } from './mapClinicalAlertsToOrderSelectCards.js';

function alert(partial: ClinicalAlert): ClinicalAlert {
  return partial;
}

describe('mapClinicalAlertsToOrderSelectCards (MF-CU-03)', () => {
  it('filtra duplicidad, alergia e interacción al prescribir', () => {
    const cards = mapClinicalAlertsToOrderSelectCards([
      alert({
        ruleId: 'cdr.duplicate_medication_order',
        severity: 'critical',
        message: 'Orden duplicada: Ceftriaxona ya está activa.',
        detail: 'Duplicar incrementa riesgo de error.',
        source: 'cdr',
      }),
      alert({
        ruleId: 'cdr.prescription_allergy_conflict',
        severity: 'critical',
        message: 'Conflicto alergia–medicamento',
        detail: 'Ceftriaxona vs penicilina.',
        source: 'cdr',
      }),
      alert({
        ruleId: 'beta-lactam-cross-reactivity',
        severity: 'critical',
        message: 'Posible reacción cruzada beta-lactámico',
        detail: 'Revisar alternativa.',
        source: 'cds',
      }),
      alert({
        ruleId: 'fall-risk-documented',
        severity: 'warning',
        message: 'Riesgo de caídas documentado',
        detail: 'No aplica order-select.',
        source: 'cds',
      }),
    ]);

    expect(cards).toHaveLength(3);
    expect(cards[0]).toMatchObject({
      hook: 'order-select',
      variant: 'suggestion',
      ruleId: 'cdr.duplicate_medication_order',
    });
    expect(cards[1]).toMatchObject({
      hook: 'order-select',
      variant: 'warning',
      ruleId: 'cdr.prescription_allergy_conflict',
    });
    expect(cards[2]).toMatchObject({
      hook: 'order-select',
      variant: 'warning',
      ruleId: 'beta-lactam-cross-reactivity',
    });
  });

  it('deduplica por ruleId', () => {
    const cards = mapClinicalAlertsToOrderSelectCards([
      alert({
        ruleId: 'duplicate_medication_order',
        severity: 'critical',
        message: 'Primera',
        detail: 'A',
        source: 'cdr',
      }),
      alert({
        ruleId: 'duplicate_medication_order',
        severity: 'critical',
        message: 'Duplicada',
        detail: 'B',
        source: 'cdr',
      }),
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.label).toBe('Primera');
  });

  it('ignora alertas fuera de alcance order-select', () => {
    const cards = mapClinicalAlertsToOrderSelectCards([
      alert({
        ruleId: 'medication_reconciliation_gap',
        severity: 'warning',
        message: 'Conciliación pendiente',
        detail: 'Solo patient-view.',
        source: 'cdr',
      }),
    ]);

    expect(cards).toHaveLength(0);
  });
});
