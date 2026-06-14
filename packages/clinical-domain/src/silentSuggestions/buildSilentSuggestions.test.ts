import { describe, expect, it } from 'vitest';
import { buildSilentClinicalSuggestions } from './buildSilentSuggestions.js';

describe('buildSilentClinicalSuggestions (MF-DI-06)', () => {
  it('prioriza alertas CDS sobre pistas informativas', () => {
    const items = buildSilentClinicalSuggestions({
      alerts: [
        {
          ruleId: 'beta-lactam-cross-reactivity',
          severity: 'critical',
          message: 'Posible reacción cruzada beta-lactámico',
          detail: 'Revisar alternativa.',
        },
      ],
      allergies: [{ substance: 'Penicilina' }],
      summaryFields: { pendingItems: 'Control en 7 días' },
    });
    expect(items[0]?.id).toBe('alert-beta-lactam-cross-reactivity');
    expect(items.some((i) => i.id === 'allergy-documented')).toBe(true);
  });

  it('detecta examen pendiente y receta por renovar', () => {
    const lab = buildSilentClinicalSuggestions({
      summaryFields: { pendingItems: 'Laboratorio control en 3 meses' },
    });
    expect(lab.some((i) => i.id === 'pending-lab')).toBe(true);
    expect(lab.find((i) => i.id === 'pending-lab')?.commandSample).toBe('solicitar laboratorio');

    const rx = buildSilentClinicalSuggestions({
      summaryFields: { pendingItems: 'Receta crónica por vencer en 15 días' },
    });
    expect(rx.some((i) => i.id === 'prescription-renewal')).toBe(true);
  });

  it('marca gap de control HbA1c en DM2', () => {
    const items = buildSilentClinicalSuggestions({
      summaryFields: { activeProblems: 'Diabetes mellitus tipo 2' },
      observations: [
        { label: 'HbA1c', valueText: '7.8 %', observedAt: '2024-01-15T12:00:00.000Z' },
      ],
      now: new Date('2026-06-11T12:00:00.000Z'),
    });
    expect(items.some((i) => i.id === 'control-gap-hba1c')).toBe(true);
  });

  it('marca PA elevada desde resumen', () => {
    const items = buildSilentClinicalSuggestions({
      summaryFields: { relevantLabs: 'PA 152/96 mmHg (sintético)' },
    });
    expect(items.some((i) => i.id === 'elevated-bp')).toBe(true);
  });
});
