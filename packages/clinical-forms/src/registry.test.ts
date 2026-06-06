import { describe, expect, it } from 'vitest';
import { EPIS2_FORM_BLUEPRINTS, assertRegistryInvariants } from './registry.js';
import { validateFormValues } from './validate.js';
import { evolutionNoteBlueprint } from './blueprints/evolution-note.js';

describe('EPIS2_FORM_BLUEPRINTS', () => {
  it('expone blueprints clínicos registrados sin duplicados', () => {
    expect(EPIS2_FORM_BLUEPRINTS.length).toBeGreaterThanOrEqual(14);
    expect(assertRegistryInvariants()).toEqual([]);
  });

  it('sin blueprintId ni routePath duplicados; intents ⊆ registry', () => {
    expect(assertRegistryInvariants()).toEqual([]);
  });

  it('cada blueprint usa aiAssistMode NONE (sin IA)', () => {
    for (const bp of EPIS2_FORM_BLUEPRINTS) {
      expect(bp.aiAssistMode).toBe('NONE');
    }
  });

  it('validación manual de evolución sin llamadas externas', () => {
    const invalid = validateFormValues(evolutionNoteBlueprint, {
      encounterDate: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    });
    expect(invalid.valid).toBe(false);

    const valid = validateFormValues(evolutionNoteBlueprint, {
      encounterDate: '2026-06-04',
      subjective: 'Paciente refiere mejoría (demo)',
      objective: 'Hemodinámicamente estable',
      assessment: 'Evolución favorable',
      plan: 'Continuar tratamiento',
    });
    expect(valid.valid).toBe(true);
  });
});
