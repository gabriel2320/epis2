import { describe, expect, it } from 'vitest';
import { buildCommandSlotPrefill, hasCommandSlotPrefill } from './command-slot-prefill.js';

describe('buildCommandSlotPrefill (CE-3b)', () => {
  it('prefill receta desde medicationHint', () => {
    expect(buildCommandSlotPrefill('prescription', { medicationHint: 'amoxicilina' })).toEqual({
      medication: 'amoxicilina',
    });
  });

  it('prefill laboratorio desde studyHint y urgencia', () => {
    expect(
      buildCommandSlotPrefill('lab_request', {
        studyHint: 'hemograma',
        urgencyHint: 'urgent',
      }),
    ).toEqual({ labTests: 'hemograma', priority: 'urgente' });
  });

  it('prefill interconsulta desde specialtyHint', () => {
    expect(
      buildCommandSlotPrefill('referral', {
        specialtyHint: 'cardiologia',
        urgencyHint: 'stat',
      }),
    ).toEqual({ specialty: 'cardiologia', urgency: 'urgente' });
  });

  it('prefill imagenología infiere modalidad y región', () => {
    expect(
      buildCommandSlotPrefill('imaging_request', {
        studyHint: 'tac',
        bodySiteHint: 'torax',
        urgencyHint: 'routine',
      }),
    ).toEqual({
      studyDescription: 'tac — torax',
      modality: 'TC',
      clinicalIndication: 'Región: torax',
      priority: 'rutina',
    });
  });

  it('prefill laboratorio con motivo clínico (CE-4)', () => {
    expect(
      buildCommandSlotPrefill('lab_request', {
        studyHint: 'hemograma',
        clinicalReasonHint: 'fiebre persistente',
      }),
    ).toEqual({
      labTests: 'hemograma',
      clinicalReason: 'fiebre persistente',
    });
  });

  it('prefill evolución desde noteHint (CE-4)', () => {
    expect(
      buildCommandSlotPrefill('evolution_note', {
        noteHint: 'paciente estable',
      }),
    ).toEqual({ subjective: 'paciente estable' });
  });

  it('prefill evolución desde clinicalReasonHint con punto (CE-6)', () => {
    expect(
      buildCommandSlotPrefill('evolution_note', {
        clinicalReasonHint: 'Control diabetes mellitus tipo 2',
      }),
    ).toEqual({ subjective: 'Control diabetes mellitus tipo 2.' });
  });

  it('prefill búsqueda de paciente', () => {
    expect(buildCommandSlotPrefill('patient_search', { patientHint: 'juan perez' })).toEqual({
      patientName: 'juan perez',
    });
  });

  it('hasCommandSlotPrefill detecta slots útiles', () => {
    expect(hasCommandSlotPrefill({})).toBe(false);
    expect(hasCommandSlotPrefill({ studyHint: 'glucosa' })).toBe(true);
  });
});
