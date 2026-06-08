import { describe, expect, it } from 'vitest';
import { parseJsonFromOllamaText, stripOllamaResponseNoise } from './extractOllamaJson.js';

describe('extractOllamaJson', () => {
  it('elimina bloques think de Qwen', () => {
    const tag = 'think';
    const raw =
      'Analizo el caso.' +
      `<${tag}>razonamiento interno</${tag}>` +
      '{"suggestedFields":{"a":"1"},"requiresHumanReview":true}';
    const cleaned = stripOllamaResponseNoise(raw);
    expect(cleaned).not.toContain('razonamiento');
    const parsed = parseJsonFromOllamaText(raw);
    expect(parsed.ok).toBe(true);
  });

  it('parsea JSON en fence markdown', () => {
    const result = parseJsonFromOllamaText(
      'Respuesta:\n```json\n{"intent":"x","confidence":0.5,"missingContext":[],"reason":"ok","suggestedCandidates":["x"]}\n```',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.value as { intent: string }).intent).toBe('x');
    }
  });

  it('extrae primer objeto JSON con texto alrededor', () => {
    const result = parseJsonFromOllamaText(
      'Aquí va el plan {"activePhase":"C","nextMicrophase":"MF","objective":"x","allowedPaths":["apps/web"],"gatesToRun":["npm run check"],"subagentSequence":["gate-runner"],"requiresHumanReview":true} fin.',
    );
    expect(result.ok).toBe(true);
  });

  it('rechaza respuesta sin JSON', () => {
    expect(parseJsonFromOllamaText('solo texto').ok).toBe(false);
  });
});
