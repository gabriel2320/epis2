import { describe, expect, it } from 'vitest';
import { extractSlots } from './slots.js';

describe('extractSlots (CE-4)', () => {
  it('extrae motivo clínico tras por/motivo', () => {
    const slots = extractSlots('solicitar hemograma por fiebre persistente');
    expect(slots.studyHint).toBe('hemograma');
    expect(slots.clinicalReasonHint).toContain('fiebre');
  });

  it('extrae notaHint tras evolución:', () => {
    const slots = extractSlots('evolucion: paciente estable, continuar tratamiento');
    expect(slots.noteHint).toContain('paciente estable');
  });

  it('extrae medicamento y urgencia en receta', () => {
    const slots = extractSlots('receta de amoxicilina urgente');
    expect(slots.medicationHint).toBe('amoxicilina');
    expect(slots.urgencyHint).toBe('urgent');
  });

  it('extrae control diabetes como motivo clínico (CE-6)', () => {
    const slots = extractSlots('control diabetes');
    expect(slots.clinicalReasonHint).toBe('Control diabetes mellitus tipo 2');
  });

  it('extrae panel control dm2 para laboratorio', () => {
    const slots = extractSlots('solicitar panel control dm2');
    expect(slots.studyHint).toBe('panel control dm2');
    expect(slots.clinicalReasonHint).toBe('Control diabetes mellitus tipo 2');
  });
});
