import { EpisAlert, Stack } from '@epis2/epis2-ui';
import { isCicaProductReady } from '../dev/cicaUiEnv.js';

/** Aviso visible solo si CICA se desactiva por estado de producto. */
export function CicaExperimentalBanner() {
  if (isCicaProductReady()) return null;

  return (
    <Stack sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5 }} data-testid="cica-experimental-banner">
      <EpisAlert severity="warning" variant="outlined">
        CICA esta desactivada en este entorno. Use el fallback legacy en{' '}
        <strong>/espacio/buscar-paciente</strong> solo para continuidad operativa.
      </EpisAlert>
    </Stack>
  );
}
