import { describe, expect, it } from 'vitest';
import { registryRouteToTanstackPath } from './cicaRoutePaths.js';

describe('registryRouteToTanstackPath', () => {
  it('convierte params registry a TanStack', () => {
    expect(registryRouteToTanstackPath('/app/buscar')).toBe('/app/buscar');
    expect(registryRouteToTanstackPath('/app/pacientes/:patientId/resumen')).toBe(
      '/app/pacientes/$patientId/resumen',
    );
    expect(registryRouteToTanstackPath('/app/pacientes/:patientId/papel/dia/:date')).toBe(
      '/app/pacientes/$patientId/papel/dia/$date',
    );
  });
});
