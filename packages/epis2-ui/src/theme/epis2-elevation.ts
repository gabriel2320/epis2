import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Elevación tonal M3 EPIS2 — sin sombras proyectadas pesadas (THEME-06).
 * @see docs/design/EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md §1
 */

/** Contenedor denso (grid, chart vacío, métricas). */
export const epis2TonalContainerSx: SxProps<Theme> = {
  boxShadow: 'none',
  border: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

/** Superficie elevada (modal, menú) — borde + fondo paper. */
export const epis2TonalOverlaySx: SxProps<Theme> = {
  boxShadow: 'none',
  border: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
};
