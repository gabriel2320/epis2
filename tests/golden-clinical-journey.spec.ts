/**
 * Journey clínico dorado — contratos y UI (sin Postgres).
 * Flujo API completo: tests/golden-clinical-journey.api.spec.ts
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { describe, expect, it } from 'vitest';
import { resolveCommand } from '@epis2/command-registry';

const JOURNEY_STEPS = [
  'login',
  'command-center',
  'buscar-paciente-sintetico',
  'comando-evolucion',
  'pagina-evolucion',
  'guardar-borrador',
  'aprobacion-humana',
  'auditoria',
  'volver-command-center',
  'modo-tablero',
  'verificar-mi-trabajo',
] as const;

describe('Golden Clinical Journey', () => {
  describe('Capa comando y formularios (EPIS2-11)', () => {
    it('3. comando evolución resuelve ruta sin paciente → needs_patient', () => {
      const withoutPatient = resolveCommand({
        text: 'evolucionar nota de hoy',
        role: 'physician',
      });
      expect(withoutPatient.status).toBe('needs_patient');

      const withPatient = resolveCommand({
        text: 'evolucionar nota de hoy',
        role: 'physician',
        patientId: 'a0000001-0000-4000-8000-000000000001',
      });
      expect(withPatient.status).toBe('resolved');
      if (withPatient.status === 'resolved') {
        expect(withPatient.routePath).toBe('/espacio/evolucion');
      }
    });

    it('5. página evolución desde blueprint único', async () => {
      const { getBlueprintById, assertRegistryInvariants } = await import(
        '@epis2/clinical-forms'
      );
      expect(assertRegistryInvariants()).toEqual([]);
      const bp = getBlueprintById('evolution_note');
      expect(bp?.routePath).toBe('/espacio/evolucion');
      expect(bp?.outputKind).toBe('CLINICAL_NOTE_DRAFT');
    });

    it('9. home del producto es Centro de Comando', async () => {
      const { EPIS2_COMMAND_CENTER_HOME } = await import('../apps/web/src/routes/router.js');
      expect(EPIS2_COMMAND_CENTER_HOME).toBe('/comando');
      expect(JOURNEY_STEPS[8]).toBe('volver-command-center');
    });

    it('10. comando abre Modo tablero (EPIS2-12)', () => {
      const result = resolveCommand({
        text: 'abre el tablero',
        role: 'physician',
      });
      expect(result.status).toBe('resolved');
      if (result.status === 'resolved') {
        expect(result.routePath).toBe('/epis2/dashboard');
      }
      expect(JOURNEY_STEPS[9]).toBe('modo-tablero');
    });
  });

  it('especificación: define los 11 pasos del journey dorado', () => {
    expect(JOURNEY_STEPS).toHaveLength(11);
    expect(JOURNEY_STEPS[1]).toBe('command-center');
  });

  it('5 casos demo sintéticos listos (EPIS2-09)', async () => {
    const { DEMO_CLINICAL_CASES, SYNTHETIC_LABEL, assertDemoCasesInvariants } = await import(
      '@epis2/test-fixtures'
    );
    expect(DEMO_CLINICAL_CASES).toHaveLength(5);
    expect(assertDemoCasesInvariants()).toEqual([]);
    expect(SYNTHETIC_LABEL).toBe('DEMO/SINTÉTICO');
    expect(JOURNEY_STEPS[2]).toBe('buscar-paciente-sintetico');
  });
});
