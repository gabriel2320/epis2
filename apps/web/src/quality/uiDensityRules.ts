/** Superficies clínicas MD3 (MF-UI) — ver MF-RAD-M3 para Form/Grid/Document/Workspace. */

export type EpisScreenKind = 'command' | 'workspace' | 'form' | 'document';

export const EPIS_SCREEN_KINDS: readonly EpisScreenKind[] = [
  'command',
  'workspace',
  'form',
  'document',
];

/** Presupuesto de iconos visibles por tipo de pantalla (MF-NORM-05: workspace 10). */
export const EPIS_ICON_BUDGET: Record<EpisScreenKind, number> = {
  command: 6,
  workspace: 10,
  form: 6,
  document: 0,
};

/** Acciones globales — máximo una instancia por pantalla (ActionBar única). */
export const EPIS_GLOBAL_CLINICAL_ACTIONS = [
  'save',
  'saveDraft',
  'sign',
  'approve',
  'print',
  'audit',
  'cancel',
  'export',
  'send',
  'createDocument',
] as const;

export type EpisGlobalClinicalAction = (typeof EPIS_GLOBAL_CLINICAL_ACTIONS)[number];

/** Acciones locales permitidas dentro de cards. */
export const EPIS_LOCAL_CARD_ACTIONS = [
  'view',
  'edit',
  'expand',
  'collapse',
  'select',
  'remove',
  'copyText',
] as const;

/** Máximo de sugerencias visibles en command bar contextual (MF-NORM-03). */
export const EPIS_COMMAND_BAR_MAX_SUGGESTIONS = 3;

/** Acciones globales visibles en barra clínica sin expandir (Guardar · Firmar · Imprimir). */
export const EPIS_CLINICAL_ACTION_BAR_MAX_PRIMARY = 3;

/** Peso tipográfico máximo por tarjeta/sección clínica (MF-NORM-05). */
export const EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT = 600;

/** Máximo de cards verticales antes de tabs/acordeón. */
export const EPIS_MAX_VERTICAL_CARDS = 6;

/** Máximo de acciones locales por card. */
export const EPIS_MAX_LOCAL_ACTIONS_PER_CARD = 2;

/** Rutas auditadas — clasificación MF-UI-SIMPLIFY. */
export const EPIS_SCREEN_REGISTRY: Record<
  string,
  {
    kind: EpisScreenKind;
    route: string;
    scaffold:
      | 'EpisAppScaffold'
      | 'EpisClinicalWorkspaceShell'
      | 'EpisClassicMd3Shell'
      | 'EpisDashboardMd3Shell';
  }
> = {
  command: {
    kind: 'command',
    route: '/comando',
    scaffold: 'EpisAppScaffold',
  },
  patientChart: {
    kind: 'workspace',
    route: '/espacio/ficha',
    scaffold: 'EpisClinicalWorkspaceShell',
  },
  patientChartClassic: {
    kind: 'workspace',
    route: '/espacio/ficha?mode=classic',
    scaffold: 'EpisClassicMd3Shell',
  },
  clinicalForm: {
    kind: 'form',
    route: '/espacio/evolucion',
    scaffold: 'EpisClinicalWorkspaceShell',
  },
  dashboardSecondary: {
    kind: 'workspace',
    route: '/epis2/dashboard',
    scaffold: 'EpisAppScaffold',
  },
  dashboardMd3: {
    kind: 'workspace',
    route: '/epis2/dashboard?mode=dashboard',
    scaffold: 'EpisDashboardMd3Shell',
  },
  draftReview: {
    kind: 'document',
    route: '/espacio/borrador',
    scaffold: 'EpisClinicalWorkspaceShell',
  },
};

/** Componentes canónicos del scaffold M3 — no duplicar. */
export const EPIS_M3_SCAFFOLD_COMPONENTS = [
  'EpisAppScaffold',
  'EpisTopAppBar',
  'EpisSideNavigation',
  'EpisCommandBar',
  'EpisMainContent',
  'EpisSupportingPane',
  'EpisClinicalActionBar',
  'EpisClinicalWorkspaceShell',
  'EpisSplitWorkspace',
  'EpisClassicMd3Shell',
  'EpisDashboardMd3Shell',
] as const;

/** Patrones de interacción MF-UI-SIMPLIFY. */
export const EPIS_INTERACTION_PATTERNS = [
  'EpisBulkActionMenu',
  'EpisDraggableList',
  'EpisCopyPasteTextTools',
  'EpisProgressiveMenu',
] as const;

export function iconBudgetForScreen(kind: EpisScreenKind): number {
  return EPIS_ICON_BUDGET[kind];
}

export function isGlobalClinicalAction(action: string): action is EpisGlobalClinicalAction {
  return (EPIS_GLOBAL_CLINICAL_ACTIONS as readonly string[]).includes(action);
}

export function screenKindForRoute(pathname: string): EpisScreenKind {
  if (pathname === '/comando' || pathname.startsWith('/comando')) return 'command';
  if (pathname.includes('/borrador/')) return 'document';
  if (
    pathname.includes('/evolucion') ||
    pathname.includes('/ingreso') ||
    pathname.includes('/epicrisis') ||
    pathname.includes('/enfermeria') ||
    pathname.includes('/farmacia') ||
    pathname.includes('/receta') ||
    pathname.includes('/conciliacion')
  ) {
    return 'form';
  }
  return 'workspace';
}
