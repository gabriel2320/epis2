import type { SxProps, Theme } from '@mui/material/styles';
import { epis2M3TouchTargetMinPx } from '../theme/m3-layout-tokens.js';

/** Ancho fijo del Navigation Rail MD3 (80dp). */
export const EPIS2_NAV_RAIL_WIDTH_PX = 80;

/** Altura mínima Top App Bar paciente (Nivel 1). */
export const EPIS2_PATIENT_CONTEXT_BAR_MIN_PX = epis2M3TouchTargetMinPx;

export const epis2NavigationRailSx: SxProps<Theme> = {
  width: EPIS2_NAV_RAIL_WIDTH_PX,
  flexShrink: 0,
  borderRight: 1,
  borderColor: 'divider',
  // Región de navegación un nivel tonal sobre el contenido (escalera M3, sin sombras).
  bgcolor: (theme) => theme.epis2.surfaces.surfaceContainerLow,
  display: { xs: 'none', md: 'flex' },
  flexDirection: 'column',
  alignItems: 'center',
  py: 2,
  gap: 1,
  position: 'sticky',
  top: 0,
  alignSelf: 'flex-start',
  minHeight: '100vh',
  zIndex: (theme) => theme.zIndex.drawer,
};

export const epis2PatientContextBarSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderBottom: 1,
  borderColor: 'divider',
  px: { xs: 2, sm: 3 },
  py: 1.5,
  minHeight: EPIS2_PATIENT_CONTEXT_BAR_MIN_PX,
};

export const epis2PatientChartTabsSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderBottom: 1,
  borderColor: 'divider',
};

export const epis2ClinicalScrollspyNavSx: SxProps<Theme> = {
  display: { xs: 'none', lg: 'block' },
  width: 200,
  flexShrink: 0,
  position: 'sticky',
  top: 120,
  alignSelf: 'flex-start',
  maxHeight: 'calc(100vh - 140px)',
  overflow: 'auto',
  pr: 2,
};

export const epis2ClinicalActionDockSx: SxProps<Theme> = {
  position: 'fixed',
  bottom: { xs: 16, sm: 24 },
  right: { xs: 16, sm: 24 },
  zIndex: (theme) => theme.zIndex.speedDial,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 1,
};
