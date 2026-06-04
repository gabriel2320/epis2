/**
 * Journey clínico dorado — gate de producto.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 *
 * Esqueleto: habilitar implementación en EPIS2-08 … EPIS2-11.
 */
import { describe, expect, it } from 'vitest';

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
] as const;

describe('Golden Clinical Journey', () => {
  describe.skip('E2E completo (EPIS2-11)', () => {
    it('1. login → sesión y Centro de Comando', async () => {
      expect(JOURNEY_STEPS[0]).toBe('login');
    });

    it('2. buscar paciente DEMO/SINTÉTICO', async () => {
      expect(JOURNEY_STEPS[2]).toBe('buscar-paciente-sintetico');
    });

    it('3. comando evolución → página blueprint', async () => {
      const { getBlueprintById, assertRegistryInvariants } = await import(
        '@epis2/clinical-forms'
      );
      expect(assertRegistryInvariants()).toEqual([]);
      expect(getBlueprintById('evolution_note')?.routePath).toBe('/espacio/evolucion');
    });

    it('4. guardar borrador sin promover a nota final', async () => {
      expect(JOURNEY_STEPS[5]).toBe('guardar-borrador');
    });

    it('5. aprobación humana auditada', async () => {
      expect(JOURNEY_STEPS[6]).toBe('aprobacion-humana');
    });

    it('6. volver al Centro de Comando', async () => {
      expect(JOURNEY_STEPS[8]).toBe('volver-command-center');
    });
  });

  it('especificación: define los 9 pasos del journey dorado', () => {
    expect(JOURNEY_STEPS).toHaveLength(9);
    expect(JOURNEY_STEPS[1]).toBe('command-center');
  });
});
