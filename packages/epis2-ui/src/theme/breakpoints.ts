/** Breakpoints EPIS2 para diseño adaptativo M3 (M3-06). */
export const epis2Breakpoints = {
  compact: 0,
  medium: 768,
  expanded: 1280,
} as const;

export type Epis2BreakpointKey = keyof typeof epis2Breakpoints;

/** Media queries estándar EPIS2. */
export const epis2MediaQueries = {
  compactOnly: `(max-width: ${epis2Breakpoints.medium - 1}px)`,
  mediumUp: `(min-width: ${epis2Breakpoints.medium}px)`,
  expandedUp: `(min-width: ${epis2Breakpoints.expanded}px)`,
} as const;

/** Ancho y relleno de barras (Power Bar, top bar). */
export const epis2BarLayout = {
  maxWidth: { compact: 600, medium: 920, expanded: 1040 },
  paddingX: { xs: 3, sm: 4, md: 5 },
  paddingY: { xs: 3.5, sm: 4, md: 5 },
  toolbarPx: { xs: 3, sm: 4, md: 5 },
  inputMinHeight: 56,
  chipsToFieldGap: 4,
  /** Relleno horizontal del contenido clínico (formularios, alertas). */
  clinicalPaddingX: { xs: 0.5, sm: 1, md: 1.5 },
  clinicalPaddingY: { xs: 2, sm: 2.5 },
  clinicalFormMaxWidth: 640,
  fieldStackGap: 3,
} as const;
