import { describe, expect, it } from 'vitest';
import { outpatientVisitBlueprint } from './blueprints/outpatient-visit.js';
import {
  blueprintUsesScrollspyLayout,
  scrollspySectionLabels,
} from './scrollspy-blueprints.js';

describe('scrollspy-blueprints', () => {
  it('marca consulta ambulatoria con layout scrollspy', () => {
    expect(blueprintUsesScrollspyLayout('outpatient_visit')).toBe(true);
    expect(blueprintUsesScrollspyLayout('evolution_note')).toBe(false);
  });

  it('incluye todas las secciones Ola 2 en el índice scrollspy', () => {
    const labels = scrollspySectionLabels(outpatientVisitBlueprint, 'outpatient_visit');
    expect(labels.map((s) => s.id)).toEqual([
      'anamnesis',
      'vitals',
      'physical-general',
      'physical-segment',
      'diagnosis',
      'plan',
      'closure',
    ]);
  });
});
