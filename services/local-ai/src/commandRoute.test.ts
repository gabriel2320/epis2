import { describe, expect, it } from 'vitest';
import { buildCommandRoutePrompt } from './commandRoutePrompt.js';
import { parseAndValidateCommandRouteJson } from './validateCommandRouteOutput.js';

describe('command route assist (CE-3 local-ai)', () => {
  it('prompt incluye catálogo y frase', () => {
    const prompt = buildCommandRoutePrompt({
      text: 'dejarlo listo para irse',
      role: 'physician',
      hasPatient: true,
      allowedIntents: [
        {
          intent: 'prepare_discharge_draft',
          labelEs: 'Preparar alta',
          description: 'Epicrisis y egreso',
        },
      ],
      deterministicCandidates: [{ intent: 'summarize_patient', score: 62 }],
    });
    expect(prompt).toContain('prepare_discharge_draft');
    expect(prompt).toContain('dejarlo listo para irse');
    expect(prompt).toContain('summarize_patient');
  });

  it('parseAndValidateCommandRouteJson acepta JSON válido', () => {
    const parsed = parseAndValidateCommandRouteJson(
      JSON.stringify({
        intent: 'prepare_discharge_draft',
        confidence: 0.82,
        missingContext: ['patient'],
        reason: 'Usuario quiere preparar el alta',
        suggestedCandidates: ['prepare_discharge_draft', 'summarize_patient'],
      }),
    );
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.intent).toBe('prepare_discharge_draft');
    }
  });

  it('parseAndValidateCommandRouteJson rechaza JSON sin intent ni candidatos', () => {
    const parsed = parseAndValidateCommandRouteJson(
      JSON.stringify({
        confidence: 0.5,
        missingContext: [],
        reason: 'ambiguo',
        suggestedCandidates: [],
      }),
    );
    expect(parsed.ok).toBe(false);
  });

  it('parseAndValidateCommandRouteJson tolera markdown y think', () => {
    const tag = 'think';
    const parsed = parseAndValidateCommandRouteJson(
      '```json\n' +
        `<${tag}>ok</${tag}>` +
        JSON.stringify({
          intent: 'prepare_discharge_draft',
          confidence: 0.82,
          missingContext: [],
          reason: 'Alta',
          suggestedCandidates: ['prepare_discharge_draft'],
        }) +
        '\n```',
    );
    expect(parsed.ok).toBe(true);
  });
});
