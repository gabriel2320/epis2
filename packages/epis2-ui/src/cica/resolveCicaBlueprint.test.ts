import { describe, expect, it } from 'vitest';
import {
  createTrivialCicaBlueprint,
  resolveTrivialCicaBlueprintFromRegistry,
} from './resolveCicaBlueprint.js';

describe('resolveCicaBlueprint', () => {
  it('createTrivialCicaBlueprint builds single-section layout', () => {
    const bp = createTrivialCicaBlueprint('patient-orders', 'orders');
    expect(bp).toEqual({
      screenId: 'patient-orders',
      hideActionBar: false,
      sections: [{ id: 'orders', span: 12 }],
    });
  });

  it('resolveTrivialCicaBlueprintFromRegistry reads registry metadata', () => {
    const bp = resolveTrivialCicaBlueprintFromRegistry('patient-timeline');
    expect(bp?.screenId).toBe('patient-timeline');
    expect(bp?.hideActionBar).toBe(true);
    expect(bp?.sections[0]?.id).toBe('timeline');
  });
});
