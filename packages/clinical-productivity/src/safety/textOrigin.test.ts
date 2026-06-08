import { describe, expect, it } from 'vitest';
import { mayAutoSign, originRequiresReview } from './textOrigin.js';

describe('textOrigin', () => {
  it('marca IA y pegado como revisión obligatoria', () => {
    expect(originRequiresReview('ai_suggestion')).toBe(true);
    expect(originRequiresReview('manual')).toBe(false);
    expect(mayAutoSign({ kind: 'paste', label: 'x', at: '', requiresHumanReview: true })).toBe(false);
  });
});
