import { describe, expect, it } from 'vitest';
import { EPIS2_CICA_HOME, EPIS2_CLINICAL_HOME, EPIS2_COMMAND_CENTER_HOME } from './home.js';

describe('router home', () => {
  it('define censo como home clínica (CICA default)', () => {
    expect(EPIS2_CLINICAL_HOME).toBe(EPIS2_CICA_HOME);
    expect(EPIS2_CLINICAL_HOME).toBe('/app/buscar');
  });

  it('mantiene /comando como ruta compat de redirect', () => {
    expect(EPIS2_COMMAND_CENTER_HOME).toBe('/comando');
  });
});
