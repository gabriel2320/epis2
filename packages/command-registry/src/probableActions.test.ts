import { describe, expect, it } from 'vitest';
import { getProbablePatientActionChips, inferPatientCareSetting } from './probableActions.js';

const PHYSICIAN_PERMS = ['command.execute', 'draft.write', 'patient.read'] as const;

describe('probableActions (MF-DI-05)', () => {
  it('inferPatientCareSetting — ambulatorio vs hospitalizado vs urgencia', () => {
    expect(inferPatientCareSetting({ hospitalizado: true })).toBe('hospitalized');
    expect(inferPatientCareSetting({ scenarioLabel: 'Urgencia adulto' })).toBe('urgency');
    expect(inferPatientCareSetting({ scenarioLabel: 'Control ambulatorio DM2' })).toBe(
      'ambulatory',
    );
  });

  it('ambulatorio devuelve evolución y receta entre top acciones', () => {
    const chips = getProbablePatientActionChips({
      role: 'physician',
      permissions: PHYSICIAN_PERMS,
      careSetting: 'ambulatory',
    });
    expect(chips.length).toBeGreaterThanOrEqual(3);
    expect(chips.length).toBeLessThanOrEqual(5);
    expect(chips.some((c) => c.intent === 'create_evolution_draft')).toBe(true);
    expect(chips.some((c) => c.intent === 'prepare_prescription')).toBe(true);
  });

  it('DM2 personaliza frases de control', () => {
    const chips = getProbablePatientActionChips({
      role: 'physician',
      permissions: PHYSICIAN_PERMS,
      careSetting: 'ambulatory',
      chronicFocus: 'dm2',
    });
    expect(chips.find((c) => c.intent === 'create_evolution_draft')?.sampleEs).toBe(
      'control diabetes',
    );
    expect(chips.find((c) => c.intent === 'request_laboratory')?.sampleEs).toBe(
      'solicitar panel control dm2',
    );
  });

  it('alertas activas priorizan bandeja de resultados en hospitalizado', () => {
    const without = getProbablePatientActionChips({
      role: 'physician',
      permissions: PHYSICIAN_PERMS,
      careSetting: 'hospitalized',
    });
    const withAlerts = getProbablePatientActionChips({
      role: 'physician',
      permissions: PHYSICIAN_PERMS,
      careSetting: 'hospitalized',
      context: { workspace: 'patient_chart', activeAlertCount: 2 },
    });
    const inboxWithout = without.findIndex((c) => c.intent === 'open_results_inbox');
    const inboxWith = withAlerts.findIndex((c) => c.intent === 'open_results_inbox');
    expect(inboxWith).toBeGreaterThanOrEqual(0);
    expect(inboxWith).toBeLessThan(inboxWithout === -1 ? 999 : inboxWithout);
  });
});
