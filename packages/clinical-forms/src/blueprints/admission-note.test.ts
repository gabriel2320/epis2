import { describe, expect, it } from 'vitest';
import { getBlueprintById, getBlueprintByRoutePath } from '../registry.js';
import { validateFormValues } from '../validate.js';
import { admissionNoteBlueprint } from './admission-note.js';

describe('admissionNoteBlueprint', () => {
  it('registrado por id y ruta /espacio/ingreso', () => {
    expect(getBlueprintById('admission_note')).toBe(admissionNoteBlueprint);
    expect(getBlueprintByRoutePath('/espacio/ingreso')).toBe(admissionNoteBlueprint);
  });

  it('valida campos obligatorios de ingreso', () => {
    const invalid = validateFormValues(admissionNoteBlueprint, {
      admissionReason: '',
      clinicalSummary: '',
      initialPlan: '',
      targetBedId: '',
    });
    expect(invalid.valid).toBe(false);

    const valid = validateFormValues(admissionNoteBlueprint, {
      admissionReason: 'Dolor abdominal',
      clinicalSummary: 'Paciente estable',
      initialPlan: 'Observación',
      targetBedId: 'f0000002-0000-4000-8000-000000000003|102A — disponible',
    });
    expect(valid.valid).toBe(true);
  });
});
