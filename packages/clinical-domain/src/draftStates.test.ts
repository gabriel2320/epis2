import { describe, expect, it } from 'vitest';
import {
  assertPatchDraftStatus,
  canPatchDraftStatus,
  sanitizeAiSuggestedFields,
} from './draftStates.js';

describe('draftStates', () => {
  it('no permite transición a approved por PATCH', () => {
    expect(canPatchDraftStatus('ready_for_review', 'approved')).toBe(false);
    expect(() => assertPatchDraftStatus('draft', 'approved')).toThrow();
  });

  it('permite enviar a revisión desde borrador', () => {
    expect(canPatchDraftStatus('draft', 'ready_for_review')).toBe(true);
  });

  it('ignora campos de aprobación sugeridos por IA', () => {
    const clean = sanitizeAiSuggestedFields({
      subjective: 'texto',
      status: 'approved',
      approve: 'true',
    });
    expect(clean).toEqual({ subjective: 'texto' });
  });
});
