import { describe, expect, it } from 'vitest';
import { EPIS_DEFERRED_OR_REJECTED_INTENTS, EPIS_P8_TO_EPIS2_INTENT } from './epis-intent-map.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('EPIS P8 synonym map', () => {
  it('todos los intents MVP mapeados existen en el registry', () => {
    const intents = new Set(EPIS2_COMMAND_DEFINITIONS.map((d) => d.intent));
    for (const epis2 of Object.values(EPIS_P8_TO_EPIS2_INTENT)) {
      expect(intents.has(epis2)).toBe(true);
    }
  });

  it('frases EPIS deferidas no resuelven a formulario MVP', () => {
    for (const phrase of ['haz ingreso', 'contexto clinico del paciente']) {
      const result = resolveCommand({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
      });
      expect(result.status, phrase).not.toBe('resolved');
    }
    expect(EPIS_DEFERRED_OR_REJECTED_INTENTS.length).toBeGreaterThan(0);
  });

  it('ingreso hospitalario resuelve a tablero servicio', () => {
    const result = resolveCommand({
      text: 'ingreso hospitalario',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('admit_patient_hospital');
      expect(result.routePath).toBe('/epis2/dashboard');
    }
  });

  it('rx dispara aclaración EPIS', () => {
    const result = resolveCommand({
      text: 'rx',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('needs_clarification');
    if (result.status === 'needs_clarification') {
      expect(result.message).toContain('radiografía');
    }
  });

  it('pide hemograma resuelve laboratorio', () => {
    const result = resolveCommand({
      text: 'pide hemograma',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('request_laboratory');
    }
  });
});
