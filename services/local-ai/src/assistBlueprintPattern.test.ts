import { describe, expect, it } from 'vitest';
import {
  assertAssistBlueprintPattern,
  ASSIST_ENABLED_BLUEPRINT_IDS,
  listAssistPatternGaps,
} from './assistBlueprintPattern.js';

describe('assistBlueprintPattern', () => {
  it('todos los blueprints assist tienen schemas y prompts', () => {
    expect(listAssistPatternGaps()).toEqual([]);
    for (const id of ASSIST_ENABLED_BLUEPRINT_IDS) {
      expect(assertAssistBlueprintPattern(id).ok).toBe(true);
    }
  });

  it('detecta blueprint sin catálogo', () => {
    const result = assertAssistBlueprintPattern('nonexistent_blueprint');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing.length).toBeGreaterThan(0);
    }
  });
});
