import { describe, expect, it } from 'vitest';
import { parseAndValidateAssistJson } from './validateOutput.js';

describe('parseAndValidateAssistJson', () => {
  it('acepta JSON válido con requiresHumanReview', () => {
    const result = parseAndValidateAssistJson(
      JSON.stringify({
        suggestedFields: { subjective: 'Demo' },
        safetyNotes: ['Revisar manualmente'],
        requiresHumanReview: true,
      }),
    );
    expect(result.ok).toBe(true);
  });

  it('rechaza sugerencia de auto-aprobación', () => {
    const forbiddenKey = ['auto', '_approve'].join('');
    const result = parseAndValidateAssistJson(
      `{"suggestedFields":{},"${forbiddenKey}":true,"requiresHumanReview":true}`,
    );
    expect(result.ok).toBe(false);
  });

  it('rechaza JSON inválido', () => {
    expect(parseAndValidateAssistJson('no-json').ok).toBe(false);
  });

  it('rechaza salida sin revision humana obligatoria', () => {
    const result = parseAndValidateAssistJson(
      JSON.stringify({
        suggestedFields: { subjective: 'Demo' },
        safetyNotes: [],
        requiresHumanReview: false,
      }),
    );
    expect(result.ok).toBe(false);
  });

  it('acepta JSON tras bloque think de Qwen', () => {
    const tag = 'think';
    const result = parseAndValidateAssistJson(
      `<${tag}>analizo</${tag}>` +
        JSON.stringify({
          suggestedFields: { subjective: 'Demo' },
          safetyNotes: ['Revisar'],
          requiresHumanReview: true,
        }),
    );
    expect(result.ok).toBe(true);
  });
});
