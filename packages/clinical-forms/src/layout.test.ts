import { describe, expect, it } from 'vitest';
import { nursingNoteBlueprint } from './blueprints/nursing-note.js';
import { evolutionNoteBlueprint } from './blueprints/evolution-note.js';
import { EPIS2_FORM_BLUEPRINTS } from './registry.js';
import {
  EPIS2_M3_FORM_COLUMNS,
  clampColumnSpan,
  resolveFieldColumnSpan,
  validateBlueprintLayout,
} from './layout.js';

describe('clinical form layout', () => {
  it('columnSpan acota entre 1 y 12', () => {
    expect(clampColumnSpan(0)).toBe(1);
    expect(clampColumnSpan(4)).toBe(4);
    expect(clampColumnSpan(99)).toBe(12);
  });

  it('sin columnSpan usa ancho completo', () => {
    const subjective = evolutionNoteBlueprint.fields.find((f) => f.id === 'subjective')!;
    expect(resolveFieldColumnSpan(subjective)).toBe(EPIS2_M3_FORM_COLUMNS);
  });

  it('signos vitales ocupan 3 columnas cada uno', () => {
    const bp = nursingNoteBlueprint.fields.find((f) => f.id === 'bloodPressure')!;
    expect(bp.columnSpan).toBe(3);
    expect(resolveFieldColumnSpan(bp)).toBe(3);
  });

  it('todos los blueprints registrados pasan validación de layout', () => {
    const errors = EPIS2_FORM_BLUEPRINTS.flatMap((bp) => validateBlueprintLayout(bp));
    expect(errors).toEqual([]);
  });
});
