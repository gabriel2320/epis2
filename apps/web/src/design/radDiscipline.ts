/**
 * MF-RAD-M3 — superficies y disciplina de productividad.
 * Mapeo MD3 (uiDensityRules) ↔ RAD (Form/Grid/Document/Workspace/Command).
 */

export type EpisRadSurface = 'command' | 'workspace' | 'form' | 'grid' | 'document';

export type EpisRadMigrationStatus = 'done' | 'partial' | 'pending';

export type EpisRadScreenAudit = {
  id: string;
  route: string;
  surface: EpisRadSurface;
  primaryTask: string;
  scaffold:
    | 'EpisAppScaffold'
    | 'EpisClinicalWorkspaceShell'
    | 'EpisRadScreenShell'
    | 'EpisClassicMd3Shell'
    | 'EpisDashboardMd3Shell';
  actionBar: 'none' | 'single' | 'required';
  preferGridOverCards: boolean;
  keyboardNav: boolean;
  migration: EpisRadMigrationStatus;
  /** Alias explícito para modo diseño. */
  migrationStatus?: EpisRadMigrationStatus;
  md3Pattern?: string;
  iconBudget?: number;
  actionBudget?: number;
  scrollPolicy?: 'single' | 'embedded' | 'section' | 'main-pane-only' | 'main-grid-only';
  mode?: 'classic' | 'modern' | 'command-center' | 'dashboard';
  notes?: string;
};

/** Acciones globales — una sola ActionBar (disciplina VB toolbar). */
export const EPIS_RAD_GLOBAL_ACTIONS = [
  'save',
  'saveDraft',
  'sign',
  'approve',
  'print',
  'audit',
  'cancel',
] as const;

/** Acciones secundarias — menú contextual, no toolbar. */
export const EPIS_RAD_CONTEXT_ACTIONS = [
  'export',
  'send',
  'duplicate',
  'archive',
  'assign',
  'derive',
] as const;

/** TabIndex base por región del scaffold. */
export const EPIS_RAD_TABINDEX = {
  commandBar: 100,
  mainContent: 200,
  formFields: 300,
  actionBar: 900,
} as const;

export function radSurfaceForPath(pathname: string): EpisRadSurface {
  if (pathname === '/comando' || pathname.startsWith('/comando')) return 'command';
  if (pathname.includes('/borrador/') || pathname.includes('/imprimir')) return 'document';
  if (
    pathname.includes('/resultados') ||
    pathname.includes('/buscar-paciente') ||
    pathname.startsWith('/epis2/dashboard')
  ) {
    return 'grid';
  }
  if (
    pathname.includes('/evolucion') ||
    pathname.includes('/ingreso') ||
    pathname.includes('/epicrisis') ||
    pathname.includes('/enfermeria') ||
    pathname.includes('/farmacia') ||
    pathname.includes('/receta') ||
    pathname.includes('/conciliacion') ||
    pathname.includes('/ambulatorio') ||
    pathname.includes('/certificado') ||
    pathname.includes('/alergia') ||
    pathname.includes('/problema') ||
    pathname.includes('/traslado') ||
    pathname.includes('/mar') ||
    pathname.includes('/laboratorio')
  ) {
    return 'form';
  }
  if (pathname.includes('/ficha') || pathname.includes('/resumen')) return 'workspace';
  return 'workspace';
}

export function nextRadTabIndex(region: keyof typeof EPIS_RAD_TABINDEX, offset = 0): number {
  return EPIS_RAD_TABINDEX[region] + offset;
}
