import { describe, expect, it } from 'vitest';
import { GOLDEN_CICA_INTENTS } from './clinical-action-manifest.js';
import {
  AI_ESCALATION_LEXICON_CONFIDENCE,
  assertAiEscalationInvariants,
  resolveAiEscalation,
  shouldEscalateLexiconConfidence,
} from './ai-escalation.js';

describe('ai-escalation MF-LX-06', () => {
  it('cumple invariantes IA-last del manifest', () => {
    expect(assertAiEscalationInvariants()).toEqual([]);
  });

  it('no escala lexicon con confidence alta', () => {
    expect(
      resolveAiEscalation({
        lexiconConfidence: AI_ESCALATION_LEXICON_CONFIDENCE + 0.1,
        intentId: 'create_evolution_draft',
      }),
    ).toEqual({ escalate: false, reason: 'none' });
  });

  it('escala lexicon con confidence baja', () => {
    expect(shouldEscalateLexiconConfidence(0.2)).toBe(true);
    expect(resolveAiEscalation({ lexiconConfidence: 0.2 })).toEqual({
      escalate: true,
      reason: 'lexicon_low_confidence',
      confidence: 0.2,
    });
  });

  it('escala command needs_clarification antes que LLM directo', () => {
    expect(
      resolveAiEscalation({
        commandResult: { status: 'needs_clarification' },
        lexiconConfidence: 0.72,
      }),
    ).toEqual({
      escalate: true,
      reason: 'command_needs_clarification',
      confidence: 0.72,
    });
  });

  it('flujo dorado CICA resuelve sin escalacion IA', () => {
    for (const intent of GOLDEN_CICA_INTENTS) {
      const decision = resolveAiEscalation({
        lexiconConfidence: 0.9,
        intentId: intent,
        commandResult: { status: 'resolved' },
      });
      expect(decision.escalate, intent).toBe(false);
    }
  });
});
