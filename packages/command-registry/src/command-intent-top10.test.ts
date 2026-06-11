import { describe, expect, it } from 'vitest';
import { requiresExplicitConfirmation } from './confirmation.js';
import {
  COMMAND_INTENT_TOP10,
  COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO,
} from './command-intent-top10.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('command intent top-10 eval (MF-CM-07)', () => {
  it('cada intent top-10 tiene al menos una frase', () => {
    expect(COMMAND_INTENT_TOP10.length).toBe(10);
    for (const entry of COMMAND_INTENT_TOP10) {
      expect(entry.phrases.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('≥90% de frases top-10 resuelven al intent esperado', () => {
    let ok = 0;
    let total = 0;
    for (const { intent, phrases } of COMMAND_INTENT_TOP10) {
      for (const phrase of phrases) {
        total += 1;
        const input: Parameters<typeof resolveCommand>[0] = {
          text: phrase,
          role: 'physician',
        };
        if (intent !== 'search_patient') {
          input.patientId = DEMO_PATIENT_ID;
        }
        if (requiresExplicitConfirmation(intent)) {
          input.confirmed = true;
        }

        const result = resolveCommand(input);
        if (result.status === 'resolved' && result.intent === intent) {
          ok += 1;
        } else if (
          requiresExplicitConfirmation(intent) &&
          result.status === 'needs_confirmation' &&
          result.intent === intent
        ) {
          ok += 1;
        }
      }
    }
    expect(ok / total).toBeGreaterThanOrEqual(COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO);
  });
});
