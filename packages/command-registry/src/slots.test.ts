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
});
