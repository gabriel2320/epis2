import { describe, expect, it } from 'vitest';
import { blueprintUsesClinicalProse } from './clinical-prose-blueprints.js';

describe('blueprintUsesClinicalProse', () => {
  it('incluye evolución y epicrisis', () => {
    expect(blueprintUsesClinicalProse('evolution_note')).toBe(true);
    expect(blueprintUsesClinicalProse('discharge_summary')).toBe(true);
    expect(blueprintUsesClinicalProse('outpatient_visit')).toBe(true);
    expect(blueprintUsesClinicalProse('prescription')).toBe(false);
  });
});
