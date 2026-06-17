import { describe, expect, it, vi } from 'vitest';

vi.mock('../dev/cicaUiEnv.js', () => ({
  isCicaUiEnabled: vi.fn(),
}));

import { isCicaUiEnabled } from '../dev/cicaUiEnv.js';
import {
  EPIS2_CICA_HOME,
  EPIS2_COMMAND_CENTER_HOME,
  EPIS2_LEGACY_CLINICAL_HOME,
  resolveClinicalHome,
} from './home.js';

describe('router home', () => {
  it('usa /app/buscar cuando CICA está activo', () => {
    vi.mocked(isCicaUiEnabled).mockReturnValue(true);
    expect(resolveClinicalHome()).toBe(EPIS2_CICA_HOME);
    expect(resolveClinicalHome()).toBe('/app/buscar');
  });

  it('usa legacy cuando CICA está desactivado', () => {
    vi.mocked(isCicaUiEnabled).mockReturnValue(false);
    expect(resolveClinicalHome()).toBe(EPIS2_LEGACY_CLINICAL_HOME);
  });

  it('mantiene /comando como ruta compat de redirect', () => {
    expect(EPIS2_COMMAND_CENTER_HOME).toBe('/comando');
  });
});
