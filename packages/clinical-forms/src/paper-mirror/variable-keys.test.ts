import { describe, expect, it } from 'vitest';
import {
  PAPER_MIRROR_VARIABLE_KEYS,
  getPaperMirrorByVariableKey,
  getPaperMirrorForClassicField,
} from './variable-keys.js';

describe('paper-mirror variable-keys', () => {
  it('expone entradas alineadas con blueprints Chile', () => {
    expect(PAPER_MIRROR_VARIABLE_KEYS.length).toBeGreaterThanOrEqual(4);
    expect(getPaperMirrorForClassicField('patient_summary', 'activeProblems')).toMatchObject({
      variableKey: 'summary.active_problems',
      paperSectionId: 'cover',
    });
  });

  it('resuelve receta por variableKey', () => {
    expect(getPaperMirrorByVariableKey('rx.medication')).toMatchObject({
      classicBlueprintId: 'prescription',
      classicFieldId: 'medication',
    });
  });
});
