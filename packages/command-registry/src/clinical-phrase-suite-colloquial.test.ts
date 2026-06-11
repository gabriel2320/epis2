import { describe, expect, it } from 'vitest';
import { requiresExplicitConfirmation } from './confirmation.js';
import {
  CLINICAL_PHRASE_SUITE_COLLOQUIAL,
  CLINICAL_PHRASE_SUITE_COLLOQUIAL_MIN_USEFUL_RATIO,
} from './clinical-phrase-suite-colloquial.js';
import { isUsefulCommandResolveResult } from './fallback.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('clinical phrase suite colloquial (MF-CM-07)', () => {
  it('contiene al menos 20 frases coloquiales', () => {
    expect(CLINICAL_PHRASE_SUITE_COLLOQUIAL.length).toBeGreaterThanOrEqual(20);
  });

  it('≥90% devuelven respuesta útil', () => {
    let useful = 0;
    for (const { phrase, expectation } of CLINICAL_PHRASE_SUITE_COLLOQUIAL) {
      const input: Parameters<typeof resolveCommand>[0] = {
        text: phrase,
        role: 'physician',
      };
      if (expectation.kind !== 'needs_patient') {
        if (expectation.kind !== 'resolved' || expectation.intent !== 'search_patient') {
          input.patientId = DEMO_PATIENT_ID;
        }
      }

      const result = resolveCommand(input);
      if (isUsefulCommandResolveResult(result)) useful += 1;

      if (expectation.kind === 'resolved') {
        if (
          expectation.intent &&
          requiresExplicitConfirmation(expectation.intent) &&
          !input.confirmed
        ) {
          expect(result.status, phrase).toBe('needs_confirmation');
        } else {
          expect(result.status, phrase).toBe('resolved');
          if (result.status === 'resolved') {
            expect(result.intent, phrase).toBe(expectation.intent);
          }
        }
      }
      if (expectation.kind === 'needs_patient') {
        expect(result.status, phrase).toBe('needs_patient');
        if (result.status === 'needs_patient') {
          expect(result.intent, phrase).toBe(expectation.intent);
        }
      }
      if (expectation.kind === 'needs_clarification') {
        expect(result.status, phrase).toBe('needs_clarification');
        if (result.status === 'needs_clarification') {
          expect(result.candidates.length, phrase).toBeGreaterThanOrEqual(
            expectation.minCandidates ?? 3,
          );
        }
      }
    }

    const ratio = useful / CLINICAL_PHRASE_SUITE_COLLOQUIAL.length;
    expect(ratio).toBeGreaterThanOrEqual(CLINICAL_PHRASE_SUITE_COLLOQUIAL_MIN_USEFUL_RATIO);
  });
});
