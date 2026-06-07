import { describe, expect, it } from 'vitest';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { INTENT_ROUTE_PATHS, WORKSPACE_QUICK_ROUTE_INTENTS } from './routes.js';
import { resolveCommandWithAutoConfirm } from './resolve-command-test.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('WORKSPACE_QUICK_ROUTE_INTENTS', () => {
  it('cada ruta de ficha tiene intent y routePath alineados', () => {
    for (const [route, intent] of Object.entries(WORKSPACE_QUICK_ROUTE_INTENTS)) {
      expect(INTENT_ROUTE_PATHS[intent]).toBe(route);
    }
  });

  it('cada intent mapeado existe en el registry', () => {
    const intents = new Set(EPIS2_COMMAND_DEFINITIONS.map((d) => d.intent));
    for (const intent of Object.values(WORKSPACE_QUICK_ROUTE_INTENTS)) {
      expect(intents.has(intent)).toBe(true);
    }
  });

  it('frases naturales UX-A resuelven a las rutas de ficha', () => {
    const samples: Array<{ phrase: string; route: string }> = [
      { phrase: 'crear evolucion', route: '/espacio/evolucion' },
      { phrase: 'solicitar tac', route: '/espacio/imagenologia' },
      { phrase: 'hacer interconsulta cardiologia', route: '/espacio/interconsulta' },
      { phrase: 'emitir receta', route: '/espacio/receta' },
      { phrase: 'preparar alta', route: '/espacio/epicrisis' },
      { phrase: 'abrir farmacia', route: '/espacio/farmacia' },
      { phrase: 'registrar alergia', route: '/espacio/alergia' },
      { phrase: 'registrar problema', route: '/espacio/problema' },
      { phrase: 'bandeja de resultados', route: '/espacio/resultados' },
    ];

    for (const { phrase, route } of samples) {
      const result = resolveCommandWithAutoConfirm({
        text: phrase,
        role: 'physician',
        patientId: DEMO_PATIENT_ID,
      });
      expect(result.status, phrase).toBe('resolved');
      if (result.status === 'resolved') {
        expect(result.routePath).toBe(route);
      }
    }
  });
});
