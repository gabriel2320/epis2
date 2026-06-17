/**
 * CICA Clean Room — tokens de layout estáticos (grilla 8px).
 *
 * Gate alineación 8px: `unit` es la base de la grilla CICA. Todo gap/padding
 * en shell, grids y formularios debe ser múltiplo de `unit` (8px).
 * Validado por `quality:cica-responsive-gate`.
 *
 * Para colores semánticos resueltos del tema activo (modo claro/oscuro + acento MTB),
 * usar `useCicaThemeTokens()` en componentes React.
 *
 * En `sx`, claves MUI como `divider`, `background.paper` y `background.default`
 * ya son theme-aware; `borderColor: 'divider'` no requiere hook.
 */
export const cicaTokens = {
  unit: 8,
  topBarHeight: 48,
  navHeight: 40,
  maxContentWidth: 1120,
  /** Alineado con `cicaShellPaddingXSx` en cicaResponsive.ts */
  shellPaddingX: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
  borderColor: 'divider',
  forbiddenLegacyImports: [
    'EpisAppScaffold',
    'EpisDashboardShell',
    'ClinicalShellLayout',
    'EpisModeSwitcher',
    'ChartEspacioCommandDock',
    'PatientListGrid',
  ] as const,
} as const;

export type CicaLayoutProfile =
  | 'patient-search'
  | 'census'
  | 'classic-chart'
  | 'clinical-form'
  | 'letter-document'
  | 'book-reader'
  | 'results'
  | 'paper-mode'
  | 'orders'
  | 'admin-lite';
