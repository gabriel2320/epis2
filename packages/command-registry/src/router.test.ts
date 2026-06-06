import { describe, expect, it } from 'vitest';
import { AMBIGUOUS_PHRASES } from './definitions.js';
import { COMMAND_PHRASE_SUITE } from './phrase-suite.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('resolveCommand', () => {
  it('suite estática tiene al menos 100 frases', () => {
    expect(COMMAND_PHRASE_SUITE.length).toBeGreaterThanOrEqual(100);
  });

  it('cada frase de la suite resuelve al intent esperado (con paciente)', () => {
    for (const { phrase, intent } of COMMAND_PHRASE_SUITE) {
      const role =
        intent === 'open_dashboard_quality' ? ('auditor' as const) : ('physician' as const);
      const input =
        intent === 'search_patient'
          ? { text: phrase, role }
          : { text: phrase, role, patientId: DEMO_PATIENT_ID };
      const result = resolveCommand(input);
      expect(result.status, `frase: ${phrase}`).toBe('resolved');
      if (result.status === 'resolved') {
        expect(result.intent).toBe(intent);
      }
    }
  });

  it('frases ambiguas devuelven needs_clarification', () => {
    for (const phrase of AMBIGUOUS_PHRASES) {
      const result = resolveCommand({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
      });
      expect(result.status).toBe('needs_clarification');
    }
  });

  it('interconsulta e imagenología resuelven con paciente', () => {
    const ref = resolveCommand({
      text: 'solicitar interconsulta',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(ref.status).toBe('resolved');
    if (ref.status === 'resolved') expect(ref.intent).toBe('request_referral');

    const img = resolveCommand({
      text: 'pedir tac',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(img.status).toBe('resolved');
    if (img.status === 'resolved') expect(img.intent).toBe('request_imaging');
  });

  it('ambigüedad devuelve hasta 3 candidatos ordenados por score', () => {
    const result = resolveCommand({
      text: 'evolucion y epicrisis',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('needs_clarification');
    if (result.status === 'needs_clarification') {
      expect(result.candidates.length).toBeGreaterThan(1);
      expect(result.candidates.length).toBeLessThanOrEqual(3);
    }
  });

  it('rol sin command.execute queda forbidden', () => {
    const result = resolveCommand({
      text: 'buscar paciente',
      role: 'auditor',
    });
    expect(result.status).toBe('forbidden');
  });

  it('comando con paciente requerido sin contexto pide paciente', () => {
    const result = resolveCommand({
      text: 'resume al paciente',
      role: 'physician',
    });
    expect(result.status).toBe('needs_patient');
    if (result.status === 'needs_patient') {
      expect(result.intent).toBe('summarize_patient');
    }
  });

  it('entrada vacía devuelve empty', () => {
    expect(resolveCommand({ text: '   ', role: 'physician' }).status).toBe('empty');
  });

  it('bandeja de resultados abre espacio resultados', () => {
    const result = resolveCommand({
      text: 'bandeja de resultados',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('open_results_inbox');
      expect(result.routePath).toBe('/espacio/resultados');
    }
  });

  it('conciliacion medicamentosa abre formulario conciliacion', () => {
    const result = resolveCommand({
      text: 'conciliacion medicamentosa',
      role: 'pharmacist',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('reconcile_medications');
      expect(result.routePath).toBe('/espacio/conciliacion');
    }
  });

  it('abre el tablero resuelve Modo tablero', () => {
    const result = resolveCommand({
      text: 'abre el tablero',
      role: 'physician',
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('open_dashboard');
      expect(result.routePath).toBe('/epis2/dashboard');
    }
  });

  it('auditor con dashboard.read puede abrir tablero sin command.execute', () => {
    const result = resolveCommand({
      text: 'modo tablero',
      role: 'auditor',
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.routePath).toBe('/epis2/dashboard');
    }
  });
});
