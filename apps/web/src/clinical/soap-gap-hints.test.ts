import { describe, expect, it } from 'vitest';
import { computeSoapGapHints } from './soap-gap-hints.js';

describe('computeSoapGapHints', () => {
  it('detecta huecos en evolución', () => {
    const hints = computeSoapGapHints('evolution_note', {
      subjective: '',
      objective: 'ok',
      assessment: 'ok',
      plan: '',
      encounterDate: '2026-06-01',
    });
    expect(hints.map((h) => h.fieldId)).toEqual(['subjective', 'plan']);
  });

  it('no aplica a otros blueprints', () => {
    expect(computeSoapGapHints('prescription', {})).toEqual([]);
  });
});
