import type { SxProps, Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { epis2BarLayout } from './breakpoints.js';
import { epis2M3IslandPadding } from './m3-layout-tokens.js';
import { epis2Shape } from './shape.js';

/** Fondo de aplicación — canvas neutro (background.default). */
export const epis2CanvasSx: SystemStyleObject<Theme> = {
  minHeight: '100vh',
  bgcolor: 'background.default',
  backgroundImage: 'none',
};

/** Contenedor isla — separación tonal sin elevación ni borde visible. */
export const epis2IslandSx: SystemStyleObject<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: epis2Shape.island,
  border: 'none',
  boxShadow: 'none',
  width: '100%',
};

/** Padding interior de isla (grid 8dp: 24–32px). */
export const epis2IslandPaddingSx: SystemStyleObject<Theme> = epis2M3IslandPadding;

/** Margen exterior de isla respecto al canvas — encuadre con aire. */
export const epis2IslandMarginSx: SystemStyleObject<Theme> = {
  mx: 'auto',
  my: { xs: 3, sm: 4, md: 5 },
  px: { xs: 3, sm: 4, md: 5 },
  pb: { xs: 4, sm: 5 },
  maxWidth: epis2BarLayout.maxWidth.expanded,
};

/** Isla de contenido cuando el shell ya aplica margen exterior (ClinicalShellLayout). */
export const epis2ShellContentIslandSx: SystemStyleObject<Theme> = {
  ...epis2IslandSx,
  ...epis2IslandPaddingSx,
};

/** Composición estándar para páginas clínicas y comando. */
export function epis2PageIslandSx(extra?: SystemStyleObject<Theme>): SxProps<Theme> {
  return {
    ...epis2IslandSx,
    ...epis2IslandPaddingSx,
    ...epis2IslandMarginSx,
    ...(extra ?? {}),
  };
}

/** Barra de búsqueda / comando — píldora monocromática plana. */
export const epis2PillBarSx: SystemStyleObject<Theme> = {
  borderRadius: epis2Shape.pill,
  bgcolor: 'action.hover',
  border: 'none',
  boxShadow: 'none',
};
