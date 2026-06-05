import { describe, expect, it } from 'vitest';
import { blueprintSupportsClinicalContext } from './clinical-context-blueprints.js';

describe('blueprintSupportsClinicalContext', () => {
  it('incluye evolución y epicrisis', () => {
    expect(blueprintSupportsClinicalContext('evolution_note')).toBe(true);
    expect(blueprintSupportsClinicalContext('discharge_summary')).toBe(true);
    expect(blueprintSupportsClinicalContext('prescription')).toBe(false);
  });
});
