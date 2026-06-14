/**
 * MF-SH-03 — resolveCommand determinístico sin assistHint (Ollama down).
 */
import {
  COMMAND_PHRASE_SUITE,
  requiresExplicitConfirmation,
  resolveCommand,
} from '@epis2/command-registry';
import { describe, expect, it } from 'vitest';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('MF-SH-03 — resolveCommand sin assistHint', () => {
  it('resuelve frases clínicas sin depender de IA', () => {
    const sample = COMMAND_PHRASE_SUITE.filter((entry) => entry.intent !== 'open_dashboard_quality').slice(
      0,
      12,
    );

    for (const { phrase, intent } of sample) {
      const role = intent === 'search_patient' ? ('physician' as const) : ('physician' as const);
      const result = resolveCommand({
        text: phrase,
        role,
        ...(intent !== 'search_patient'
          ? {
              patientId: DEMO_PATIENT_ID,
              ...(requiresExplicitConfirmation(intent) ? { confirmed: true as const } : {}),
            }
          : {}),
      });
      expect(result.status, phrase).toBe('resolved');
      if (result.status === 'resolved') {
        expect(result.intent).toBe(intent);
      }
    }
  });

  it('no usa assistHint en la resolución', () => {
    const result = resolveCommand({
      text: 'evolucionar nota de hoy',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('create_evolution_draft');
    }
  });
});
