import { useNavigate } from '@tanstack/react-router';

/** Rutas de formularios clínicos (shell `/espacio/*`). */
export type ClinicalFormRoutePath =
  | '/espacio/buscar-paciente'
  | '/espacio/resumen'
  | '/espacio/evolucion'
  | '/espacio/epicrisis'
  | '/espacio/receta'
  | '/espacio/laboratorio'
  | '/espacio/interconsulta'
  | '/espacio/imagenologia'
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

export type ClinicalPatientSearch = { patientId?: string };

/** CE-3b/CE-4: slots del comando en query string al abrir formulario. */
export type ClinicalFormSearch = ClinicalPatientSearch & {
  patientHint?: string;
  medicationHint?: string;
  studyHint?: string;
  specialtyHint?: string;
  bodySiteHint?: string;
  urgencyHint?: 'routine' | 'urgent' | 'stat';
  clinicalReasonHint?: string;
  noteHint?: string;
};

const URGENCY_HINTS = new Set(['routine', 'urgent', 'stat']);

export function parseClinicalFormSearch(search: Record<string, unknown>): ClinicalFormSearch {
  const parsed: ClinicalFormSearch = {};
  if (typeof search.patientId === 'string' && search.patientId) {
    parsed.patientId = search.patientId;
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

export type DashboardSearch = { tab?: DashboardTab; patientId?: string };

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

export function parseDashboardSearch(search: Record<string, unknown>): DashboardSearch {
  const tabRaw = search.tab;
  const tab =
    typeof tabRaw === 'string' && DASHBOARD_TAB_SET.has(tabRaw)
      ? (tabRaw as DashboardTab)
      : 'work';
  return {
    tab,
    patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
  };
}

export type ForbiddenSearch = { detail?: string };

export type AdminTab = 'users' | 'catalogs' | 'audit' | 'ops' | 'forms';

export type AdminSearch = { tab?: AdminTab };

export type ClinicalNavigateTarget =
  | ClinicalFormRoutePath
  | '/espacio/ficha'
  | '/espacio/resultados'
  | '/espacio/borrador/$draftId'
  | '/espacio/admin'
  | '/epis2/dashboard'
  | '/comando'
  | '/preferencias-apariencia'
  | '/login'
  | '/sin-acceso';

export type ClinicalNavigateOptions =
  | { to: '/espacio/borrador/$draftId'; params: { draftId: string }; search?: ClinicalPatientSearch }
  | { to: '/epis2/dashboard'; search?: DashboardSearch; params?: never }
  | { to: '/espacio/admin'; search?: AdminSearch; params?: never }
  | { to: '/sin-acceso'; search?: ForbiddenSearch; params?: never }
  | {
      to: Exclude<
        ClinicalNavigateTarget,
        '/espacio/borrador/$draftId' | '/epis2/dashboard' | '/espacio/admin' | '/sin-acceso'
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
    void navigate(options as Parameters<typeof navigate>[0]);
  };
}
