import { describe, expect, it } from 'vitest';
import { EPIS2_CLINICAL_HOME, EPIS2_COMMAND_CENTER_HOME } from './home.js';

describe('router home', () => {
  it('define censo como home clínica (ficha-first)', () => {
    expect(EPIS2_CLINICAL_HOME).toBe('/espacio/buscar-paciente');
  });

  it('mantiene /comando como ruta compat de redirect', () => {
    expect(EPIS2_COMMAND_CENTER_HOME).toBe('/comando');
  });
});
