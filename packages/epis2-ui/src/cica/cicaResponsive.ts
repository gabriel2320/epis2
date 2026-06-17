import type { SxProps, Theme } from '@mui/material/styles';
import type { CicaLayoutProfile } from './cicaTokens.js';

/**
 * CICA responsive layout — breakpoints, max-width por perfil, padding shell, safe-area, grids.
 *
 * Manual QA (375px viewport — iPhone SE):
 * - Abrir /app/buscar-paciente, ficha paciente, modo papel.
 * - Verificar: sin scroll horizontal en document (document.documentElement.scrollWidth === clientWidth).
 * - Nav y chart tabs: scroll táctil horizontal oculto o wrap; identidad en columna.
 */
export const cicaBreakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type CicaBreakpoint = keyof typeof cicaBreakpoints;
export type CicaBreakpointKey = CicaBreakpoint;

/** Por debajo de este ancho los labels de nav se acortan (opcional). */
export const cicaNavLabelMinPx = 360;

const CICA_GRID_UNIT = 8;

/** Grilla responsiva CICA — 1 col móvil, 2 col tablet, 12 col desktop. */
export const cicaResponsiveGrid = {
  templateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(12, minmax(0, 1fr))',
  },
  gap: CICA_GRID_UNIT,
  minChildWidth: 280,
} as const;

/** Formularios clínicos CICA — campos cortos en 2 col tablet; prosa siempre 1 col. */
export const cicaFormGrid = {
  fieldColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
  },
  proseColumns: '1fr',
  gap: CICA_GRID_UNIT,
} as const;

/** Ancho máximo de contenido por perfil CICA (px). */
export const cicaMaxContentWidth: Record<CicaLayoutProfile, number> = {
  'patient-search': 1120,
  census: 1280,
  'classic-chart': 1280,
  'clinical-form': 1080,
  'letter-document': 920,
  'book-reader': 920,
  results: 1280,
  'paper-mode': 1440,
  orders: 1080,
  'admin-lite': 1280,
};

export const cicaDefaultMaxContentWidth = cicaMaxContentWidth['patient-search'];

/**
 * Padding horizontal del shell — unidades theme.spacing (8px base).
 * xs/sm: móvil · md: tablet · lg/xl: escritorio ancho.
 */
export const cicaShellPaddingX: Record<CicaBreakpointKey, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3,
};

export const cicaShellPaddingXSx = {
  xs: cicaShellPaddingX.xs,
  sm: cicaShellPaddingX.sm,
  md: cicaShellPaddingX.md,
  lg: cicaShellPaddingX.lg,
  xl: cicaShellPaddingX.xl,
} as const;

export const cicaSafeAreaInsetsSx: SxProps<Theme> = {
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingRight: 'env(safe-area-inset-right, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  paddingLeft: 'env(safe-area-inset-left, 0px)',
};

export const cicaSafeAreaBottomSx: SxProps<Theme> = {
  paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
};

export const cicaClinicalMaxWidthProfiles = [
  'patient-search',
  'classic-chart',
  'paper-mode',
] as const satisfies readonly CicaLayoutProfile[];

export type CicaClinicalMaxWidthProfile = (typeof cicaClinicalMaxWidthProfiles)[number];

export function cicaMaxWidthForProfile(profile: CicaLayoutProfile): number {
  return cicaMaxContentWidth[profile];
}

export function cicaIsClinicalMaxWidthProfile(
  profile: string,
): profile is CicaClinicalMaxWidthProfile {
  return (cicaClinicalMaxWidthProfiles as readonly string[]).includes(profile);
}

export function cicaResponsiveContainerSx(profile?: CicaLayoutProfile): SxProps<Theme> {
  return {
    width: '100%',
    maxWidth: profile ? cicaMaxContentWidth[profile] : '100%',
    mx: 'auto',
    px: cicaShellPaddingXSx,
    overflowX: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
  };
}

export const cicaHorizontalScrollSx: SxProps<Theme> = {
  overflowX: 'auto',
  flexWrap: 'nowrap',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  WebkitOverflowScrolling: 'touch',
};

/** Ancho máximo de la hoja simulada en modo papel CICA (px). */
export const cicaPaperSheetMaxWidth = 920;

/** Altura mínima adaptativa del canvas papel por breakpoint. */
export const cicaPaperCanvasMinHeight = {
  xs: 360,
  sm: 480,
  md: 640,
  lg: 720,
} as const;

/** Contenedor scroll del modo papel — perfil `paper-mode`. */
export function cicaPaperModeContentSx(): SxProps<Theme> {
  return {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: cicaMaxContentWidth['paper-mode'],
    mx: 'auto',
    px: cicaShellPaddingXSx,
    py: { xs: 2, sm: 2.5, md: 3 },
    boxSizing: 'border-box',
  };
}

/** Hoja clínica CICA — ancho completo menos padding en xs; max 920 centrada en md+. */
export function cicaPaperCanvasSx(): SxProps<Theme> {
  return {
    position: 'relative',
    width: '100%',
    maxWidth: { xs: '100%', md: cicaPaperSheetMaxWidth },
    minHeight: cicaPaperCanvasMinHeight,
    boxSizing: 'border-box',
    mx: { xs: 0, md: 'auto' },
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 2, sm: 2.5, md: 3 },
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    boxShadow: 1,
    '@media print': {
      boxShadow: 'none',
      border: 'none',
      mx: 0,
      my: 0,
      maxWidth: '100%',
      width: '100%',
      minHeight: 'auto',
      pageBreakInside: 'avoid',
    },
  };
}

/** Toolbar modo papel — columna en xs, fila en sm+; oculta al imprimir. */
export function cicaPaperModeToolbarSx(): SxProps<Theme> {
  return {
    flexShrink: 0,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
    gap: { xs: 1.5, sm: 1 },
    px: cicaShellPaddingXSx,
    py: 1,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper',
    minWidth: 0,
    '& > *': { minWidth: 0 },
    '@media print': {
      display: 'none',
    },
  };
}

export const CICA_BREAKPOINT_TABLE = [
  {
    key: 'xs',
    minPx: cicaBreakpoints.xs,
    maxPx: cicaBreakpoints.sm - 1,
    shellPadding: cicaShellPaddingX.xs,
  },
  {
    key: 'sm',
    minPx: cicaBreakpoints.sm,
    maxPx: cicaBreakpoints.md - 1,
    shellPadding: cicaShellPaddingX.sm,
  },
  {
    key: 'md',
    minPx: cicaBreakpoints.md,
    maxPx: cicaBreakpoints.lg - 1,
    shellPadding: cicaShellPaddingX.md,
  },
  {
    key: 'lg',
    minPx: cicaBreakpoints.lg,
    maxPx: cicaBreakpoints.xl - 1,
    shellPadding: cicaShellPaddingX.lg,
  },
  { key: 'xl', minPx: cicaBreakpoints.xl, maxPx: null, shellPadding: cicaShellPaddingX.xl },
] as const;
