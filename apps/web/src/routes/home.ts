/** Home clínica — censo/búsqueda (PROG-FICHA-FIRST). */
import { isCicaUiEnabled } from '../dev/cicaUiEnv.js';

export const EPIS2_LEGACY_CLINICAL_HOME = '/espacio/buscar-paciente' as const;
export const EPIS2_CICA_HOME = '/app/buscar' as const;

export function resolveClinicalHome(): typeof EPIS2_LEGACY_CLINICAL_HOME | typeof EPIS2_CICA_HOME {
  return isCicaUiEnabled() ? EPIS2_CICA_HOME : EPIS2_LEGACY_CLINICAL_HOME;
}

/** Home clínica activa — CICA `/app/buscar` con producto GO; legacy si CICA desactivado. */
export const EPIS2_CLINICAL_HOME = resolveClinicalHome();

/** Compat bookmarks — `/comando` redirige a {@link EPIS2_CLINICAL_HOME}. */
export const EPIS2_COMMAND_CENTER_HOME = '/comando' as const;
