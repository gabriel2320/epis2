import { describe, expect, it } from 'vitest';
import {
  CLINICAL_PHRASE_SUITE_50,
  CLINICAL_PHRASE_SUITE_MIN_USEFUL_RATIO,
} from './clinical-phrase-suite-50.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { isUsefulCommandResolveResult } from './fallback.js';
import { requiresExplicitConfirmation } from './confirmation.js';
import { INTENT_SECURE_METADATA } from './intent-metadata.js';
import { resolveCommand } from './router.js';
import type { ClinicalIntent } from './types.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('clinical phrase suite 50 (CE-0)', () => {
  it('contiene al menos 50 frases', () => {
    expect(CLINICAL_PHRASE_SUITE_50.length).toBeGreaterThanOrEqual(50);
  });

  it('cada intent del registry tiene metadata segura', () => {
    const intents = new Set(EPIS2_COMMAND_DEFINITIONS.map((d) => d.intent));
    for (const intent of intents) {
      expect(INTENT_SECURE_METADATA[intent as ClinicalIntent]).toBeDefined();
    }
    for (const def of EPIS2_COMMAND_DEFINITIONS) {
      expect(def.family).toBeTruthy();
      expect(def.safetyLevel).toBeTruthy();
      expect(def.actionType).toBeTruthy();
      expect(def.description.length).toBeGreaterThan(5);
      expect(def.examples.length).toBeGreaterThan(0);
    }
  });

  it('≥90% de frases devuelven respuesta útil (cero silencios)', () => {
    let useful = 0;
    for (const { phrase, expectation } of CLINICAL_PHRASE_SUITE_50) {
      const input: Parameters<typeof resolveCommand>[0] = {
        text: phrase,
        role: 'physician',
      };
      if (expectation.kind !== 'needs_patient') {
        if (
          expectation.kind !== 'resolved' ||
          expectation.intent !== 'search_patient'
        ) {
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
          if (result.status === 'needs_confirmation') {
            expect(result.intent, phrase).toBe(expectation.intent);
          }
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
          expect(
            result.candidates.length,
            `${phrase} debe sugerir candidatos`,
          ).toBeGreaterThanOrEqual(expectation.minCandidates ?? 3);
        }
      }
    }

    const ratio = useful / CLINICAL_PHRASE_SUITE_50.length;
    expect(ratio).toBeGreaterThanOrEqual(CLINICAL_PHRASE_SUITE_MIN_USEFUL_RATIO);
  });

  it('fallback nunca devuelve candidatos vacíos', () => {
    const result = resolveCommand({
      text: 'comando totalmente desconocido xyz123',
      role: 'physician',
    });
    expect(result.status).toBe('needs_clarification');
    if (result.status === 'needs_clarification') {
      expect(result.candidates.length).toBeGreaterThanOrEqual(3);
      expect(result.message.length).toBeGreaterThan(10);
    }
  });
});
