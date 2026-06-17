import { EpisAlert, Stack } from '@epis2/epis2-ui';
import { isCicaProductReady } from '../dev/cicaUiEnv.js';

/** Aviso visible en `/app/*` — CICA en reformulación, no es home productivo. */
export function CicaExperimentalBanner() {
  if (isCicaProductReady()) return null;

  return (
    <Stack sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5 }} data-testid="cica-experimental-banner">
      <EpisAlert severity="warning" variant="outlined">
        Interfaz CICA en reformulación (NO-GO). Use el flujo clínico en{' '}
        <strong>/espacio/buscar-paciente</strong> para operación demo. Active CICA solo para
        desarrollo con <code>VITE_ENABLE_CICA_UI=true</code>.
      </EpisAlert>
    </Stack>
  );
}
