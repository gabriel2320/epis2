import { useNavigate } from '@tanstack/react-router';
import { parseChartModeSearch, type ChartModeSearch } from './chartModeSearch.js';

/** Rutas de formularios clínicos (shell `/espacio/*`). */
export type ClinicalFormRoutePath =
  | '/espacio/buscar-paciente'
  | '/espacio/resumen'
  | '/espacio/evolucion'
  | '/espacio/epicrisis'
  | '/espacio/epicrisis/imprimir'
  | '/espacio/receta'
  | '/espacio/receta/imprimir'
  | '/espacio/laboratorio'
  | '/espacio/laboratorio/imprimir'
  | '/espacio/interconsulta'
  | '/espacio/imagenologia'
  | '/espacio/imagenologia/imprimir'
  | '/espacio/procedimiento'
  | '/espacio/enfermeria'
  | '/espacio/mar'
  | '/espacio/farmacia'
  | '/espacio/conciliacion'
  | '/espacio/certificado'
  | '/espacio/certificado/imprimir'
  | '/espacio/ambulatorio'
  | '/espacio/alergia'
  | '/espacio/problema'
  | '/espacio/ingreso'
  | '/espacio/traslado'
  | '/espacio/informe-interconsulta';

export type ClinicalPatientSearch = ChartModeSearch & {
  patientId?: string | undefined;
  mode?: 'classic' | undefined;
  returnTo?: 'dashboard' | undefined;
};

export function parseClinicalPatientSearch(search: Record<string, unknown>): ClinicalPatientSearch {
  return {
    ...parseChartModeSearch(search),
    ...(typeof search.patientId === 'string' && search.patientId ? { patientId: search.patientId } : {}),
    ...(search.mode === 'classic' ? { mode: 'classic' as const } : {}),
    ...(search.returnTo === 'dashboard' ? { returnTo: 'dashboard' as const } : {}),
  };
}

/**
 * Legacy `?mode=classic` → ficha dual `chartMode=traditional` (MF-DUAL-CHART-07).
 * Usar al redirigir desde modos clásico/dashboard congelados.
 */
export function classicModeToDualChartSearch(
  patientId: string,
  extras: Omit<ClinicalPatientSearch, 'patientId' | 'chartMode' | 'mode'> = {},
): ClinicalPatientSearch {
  return {
    patientId,
    chartMode: 'traditional',
    ...extras,
  };
}

/** CE-3b/CE-4: slots del comando en query string al abrir formulario. */
export type ClinicalFormSearch = ClinicalPatientSearch & {
  draftId?: string | undefined;
  patientHint?: string | undefined;
  medicationHint?: string | undefined;
  studyHint?: string | undefined;
  specialtyHint?: string | undefined;
  bodySiteHint?: string | undefined;
  urgencyHint?: 'routine' | 'urgent' | 'stat' | undefined;
  clinicalReasonHint?: string | undefined;
  noteHint?: string | undefined;
};

const URGENCY_HINTS = new Set(['routine', 'urgent', 'stat']);

export function parseClinicalFormSearch(search: Record<string, unknown>): ClinicalFormSearch {
  const parsed: ClinicalFormSearch = {};
  if (typeof search.patientId === 'string' && search.patientId) {
    parsed.patientId = search.patientId;
  }
  if (typeof search.draftId === 'string' && search.draftId) {
    parsed.draftId = search.draftId;
  }
  if (typeof search.patientHint === 'string' && search.patientHint.trim()) {
    parsed.patientHint = search.patientHint.trim();
  }
  if (typeof search.medicationHint === 'string' && search.medicationHint.trim()) {
    parsed.medicationHint = search.medicationHint.trim();
  }
  if (typeof search.studyHint === 'string' && search.studyHint.trim()) {
    parsed.studyHint = search.studyHint.trim();
  }
  if (typeof search.specialtyHint === 'string' && search.specialtyHint.trim()) {
    parsed.specialtyHint = search.specialtyHint.trim();
  }
  if (typeof search.bodySiteHint === 'string' && search.bodySiteHint.trim()) {
    parsed.bodySiteHint = search.bodySiteHint.trim();
  }
  if (typeof search.clinicalReasonHint === 'string' && search.clinicalReasonHint.trim()) {
    parsed.clinicalReasonHint = search.clinicalReasonHint.trim();
  }
  if (typeof search.noteHint === 'string' && search.noteHint.trim()) {
    parsed.noteHint = search.noteHint.trim();
  }
  const urgencyRaw = search.urgencyHint;
  if (typeof urgencyRaw === 'string' && URGENCY_HINTS.has(urgencyRaw)) {
    parsed.urgencyHint = urgencyRaw as ClinicalFormSearch['urgencyHint'];
  }
  return parsed;
}

export type DashboardTab =
  | 'work'
  | 'patient'
  | 'service'
  | 'nursing'
  | 'pharmacy'
  | 'quality'
  | 'reception'
  | 'emergency'
  | 'icu'
  | 'or'
  | 'aps'
  | 'specialty';

export type DashboardSearch = {
  tab?: DashboardTab | undefined;
  patientId?: string | undefined;
  view?: 'classic' | undefined;
  mode?: 'dashboard' | undefined;
};

/** Tabs dashboard — fuente única para router, UI y UX-G04b. */
export const DASHBOARD_TABS: readonly DashboardTab[] = [
  'work',
  'patient',
  'service',
  'nursing',
  'pharmacy',
  'quality',
  'reception',
  'emergency',
  'icu',
  'or',
  'aps',
  'specialty',
] as const;

const DASHBOARD_TAB_SET = new Set<string>(DASHBOARD_TABS);

export { DASHBOARD_TAB_SET };

/** Search de `/comando` — intentos de modo y contexto de retorno. */
export type CommandSearch = {
  patientId?: string | undefined;
  intent?: 'selectPatient' | undefined;
  nextMode?: 'classic' | undefined;
  context?: 'classic' | 'dashboard' | undefined;
  error?: 'dashboardPermission' | undefined;
  tab?: DashboardTab | undefined;
};

export function parseCommandSearch(search: Record<string, unknown>): CommandSearch {
  const parsed: CommandSearch = {};
  if (typeof search.patientId === 'string' && search.patientId) {
    parsed.patientId = search.patientId;
  }
  if (search.intent === 'selectPatient') {
    parsed.intent = 'selectPatient';
  }
  if (search.nextMode === 'classic') {
    parsed.nextMode = 'classic';
  }
  if (search.context === 'classic' || search.context === 'dashboard') {
    parsed.context = search.context;
  }
  if (search.error === 'dashboardPermission') {
    parsed.error = 'dashboardPermission';
  }
  const tabRaw = search.tab;
  if (typeof tabRaw === 'string' && DASHBOARD_TAB_SET.has(tabRaw)) {
    parsed.tab = tabRaw as DashboardTab;
  }
  return parsed;
}

export function parseDashboardSearch(search: Record<string, unknown>): DashboardSearch {
  const tabRaw = search.tab;
  const tab =
    typeof tabRaw === 'string' && DASHBOARD_TAB_SET.has(tabRaw) ? (tabRaw as DashboardTab) : 'work';
  const mode = search.mode === 'dashboard' ? ('dashboard' as const) : undefined;
  return {
    tab,
    patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
    ...(search.view === 'classic' ? { view: 'classic' as const } : {}),
    ...(mode ? { mode } : {}),
  };
}

export type ForbiddenSearch = { detail?: string };

export type AdminTab = 'users' | 'catalogs' | 'audit' | 'ops' | 'forms';

export type AdminSearch = { tab?: AdminTab };

export type ClinicalNavigateTarget =
  | ClinicalFormRoutePath
  | '/espacio/ficha'
  | '/espacio/ficha/imprimir'
  | '/espacio/resultados'
  | '/espacio/borrador/$draftId'
  | '/espacio/admin'
  | '/epis2/dashboard'
  | '/comando'
  | '/preferencias-apariencia'
  | '/login'
  | '/sin-acceso';

export type ClinicalNavigateOptions =
  | {
      to: '/espacio/borrador/$draftId';
      params: { draftId: string };
      search?: ClinicalPatientSearch;
    }
  | { to: '/epis2/dashboard'; search?: DashboardSearch; params?: never }
  | { to: '/espacio/admin'; search?: AdminSearch; params?: never }
  | { to: '/sin-acceso'; search?: ForbiddenSearch; params?: never }
  | {
      to: '/comando';
      search?: CommandSearch;
      params?: never;
      replace?: boolean;
    }
  | {
      to: Exclude<
        ClinicalNavigateTarget,
        | '/espacio/borrador/$draftId'
        | '/epis2/dashboard'
        | '/espacio/admin'
        | '/sin-acceso'
        | '/comando'
      >;
      search?: ClinicalFormSearch;
      params?: never;
      replace?: boolean;
    };

export type ClinicalNavigateFn = (options: ClinicalNavigateOptions) => void;

/**
 * Navegación tipada al shell clínico. TanStack pierde literales cuando las rutas
 * se crean con `.map()` sobre blueprints; este wrapper centraliza el cast seguro.
 */
export function useClinicalNavigate() {
  const navigate = useNavigate();
  return (options: ClinicalNavigateOptions) => {
    void navigate(options as unknown as Parameters<typeof navigate>[0]);
  };
}
