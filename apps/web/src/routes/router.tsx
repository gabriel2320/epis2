import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { getBlueprintByRoutePath } from '@epis2/clinical-forms';
import { loadSessionForRouter } from '../auth/AuthContext.js';
import { ClinicalShellLayout } from '../layouts/ClinicalShellLayout.js';
import { lazy } from 'react';
import { EPIS2_CLINICAL_HOME } from './home.js';
import { DraftReviewPage } from '../pages/DraftReviewPage.js';
import { GeneratedClinicalFormPage } from '../pages/GeneratedClinicalFormPage.js';
import { PatientSearchScreen } from '../pages/PatientSearchScreen.js';
import { PatientWorkspacePage } from '../pages/PatientWorkspacePage.js';
import { ResultsInboxPage } from '../pages/ResultsInboxPage.js';
import { MedicalCertificatePrintPage } from '../pages/MedicalCertificatePrintPage.js';
import { DischargeSummaryPrintPage } from '../pages/DischargeSummaryPrintPage.js';
import { LabRequestPrintPage } from '../pages/LabRequestPrintPage.js';
import { ImagingRequestPrintPage } from '../pages/ImagingRequestPrintPage.js';
import { PrescriptionPrintPage } from '../pages/PrescriptionPrintPage.js';
import { PaperChartPrintPage } from '../pages/PaperChartPrintPage.js';
import { StandalonePaperChartPage } from '../pages/StandalonePaperChartPage.js';
import { PaperPlannerPrintPage } from '../pages/PaperPlannerPrintPage.js';
import { AdminConsolePage } from '../pages/AdminConsolePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { SessionExpiredPage } from '../pages/SessionExpiredPage.js';
import { ForbiddenPage } from '../pages/ForbiddenPage.js';
import { AppearancePreferencesPage } from '../pages/AppearancePreferencesPage.js';
import { isUiCatalogEnabled } from '../dev/uiCatalogEnv.js';
import { isVisualThemeCatalogEnabled } from '../dev/visualThemeCatalogEnv.js';
import { isSchedulerSpikeEnabled } from '../dev/schedulerSpikeEnv.js';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';
import { isCicaUiEnabled } from '../dev/cicaUiEnv.js';
import { CicaAppLayout } from '../cica/CicaAppLayout.js';
import { CicaPatientSearchPage } from '../cica/CicaPatientSearchPage.js';
import { CicaCensusPage } from '../cica/CicaCensusPage.js';
import { CicaPatientSummaryPage } from '../cica/CicaPatientSummaryPage.js';
import { CicaPatientEvolutionsPage } from '../cica/CicaPatientEvolutionsPage.js';
import { CicaPatientDocumentsPage } from '../cica/CicaPatientDocumentsPage.js';
import { CicaPatientOrdersPage } from '../cica/CicaPatientOrdersPage.js';
import { CicaPatientExamsPage } from '../cica/CicaPatientExamsPage.js';
import { CicaNewEvolutionPage } from '../cica/CicaNewEvolutionPage.js';
import { CicaNewEpicrisisPage } from '../cica/CicaNewEpicrisisPage.js';
import { CicaNewPrescriptionPage } from '../cica/CicaNewPrescriptionPage.js';
import { CicaNewDocumentPage } from '../cica/CicaNewDocumentPage.js';
import { CicaPaperDayPage } from '../cica/CicaPaperDayPage.js';
import { EPIS2_LEGACY_CLINICAL_HOME } from './home.js';
import {
  parseDashboardSearch,
  parseClinicalFormSearch,
  parseCommandSearch,
  parseClinicalPatientSearch,
} from './clinicalNavigate.js';
import { parsePaperStandaloneSearch } from './paperStandaloneSearch.js';
import { EpisAppProviders } from '../AppProviders.js';

const LazyUiCatalogPage = lazy(() =>
  import('../pages/dev/UiCatalogPage.js').then((m) => ({ default: m.UiCatalogPage })),
);

const LazyVisualThemeCatalogPage = lazy(() =>
  import('../pages/dev/VisualThemeCatalogPage.js').then((m) => ({
    default: m.VisualThemeCatalogPage,
  })),
);

const DashboardModePage = lazy(() =>
  import('../pages/DashboardModePage.js').then((m) => ({ default: m.DashboardModePage })),
);

const LazySchedulerSpikePage = lazy(() =>
  import('../pages/dev/SchedulerSpikePage.js').then((m) => ({ default: m.SchedulerSpikePage })),
);

async function requireSession() {
  const session = await loadSessionForRouter();
  if (!session) {
    throw redirect({ to: '/login' });
  }
}

/**
 * PR6 — legacy `/espacio/*` → CICA `/app/*` cuando VITE_ENABLE_CICA_UI≠false.
 * Sin redirect si CICA desactivado. draftId se preserva en search cuando aplica.
 *
 * Mapa de redirects:
 * - /espacio/buscar-paciente → /app/buscar
 * - /espacio/ficha?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/resumen?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/evolucion?patientId= → /app/pacientes/$patientId/evoluciones/nueva
 * - /espacio/receta?patientId= → /app/pacientes/$patientId/indicaciones/nueva
 * - /espacio/certificado?patientId= → /app/pacientes/$patientId/documentos/nuevo
 * - /espacio/resultados?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/laboratorio?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/imagenologia?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/interconsulta?patientId= → /app/pacientes/$patientId/documentos
 * - /espacio/procedimiento?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/enfermeria?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/alergia?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/problema?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/ingreso?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/ambulatorio?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/farmacia?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/mar?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/conciliacion?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/traslado?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/informe-interconsulta?patientId= → /app/pacientes/$patientId/documentos
 * - /espacio/epicrisis — sin redirect (pantalla CICA pendiente)
 */
function redirectLegacyPatientSearchToCicaIfEnabled() {
  if (isCicaUiEnabled()) {
    throw redirect({ to: '/app/buscar' });
  }
}

function redirectLegacyFichaToCicaIfEnabled(search: Record<string, unknown>) {
  if (!isCicaUiEnabled()) return;
  const { patientId } = parseClinicalPatientSearch(search);
  if (patientId) {
    throw redirect({
      to: '/app/pacientes/$patientId/resumen',
      params: { patientId },
    });
  }
  throw redirect({ to: '/app/buscar' });
}

function redirectLegacyEvolutionToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/evoluciones/nueva');
}

type CicaPatientRedirectTarget =
  | '/app/pacientes/$patientId/resumen'
  | '/app/pacientes/$patientId/indicaciones'
  | '/app/pacientes/$patientId/documentos'
  | '/app/pacientes/$patientId/examenes';

type CicaClinicalFormRedirectTarget =
  | '/app/pacientes/$patientId/evoluciones/nueva'
  | '/app/pacientes/$patientId/indicaciones/nueva'
  | '/app/pacientes/$patientId/documentos/nuevo'
  | '/app/pacientes/$patientId/epicrisis/nueva';

/** PR6 — formularios legacy con patientId (+ draftId opcional) → formulario CICA. */
function redirectLegacyClinicalFormToCicaIfEnabled(
  search: Record<string, unknown>,
  to: CicaClinicalFormRedirectTarget,
) {
  if (!isCicaUiEnabled()) return;
  const parsed = parseClinicalFormSearch(search);
  if (parsed.patientId) {
    throw redirect({
      to,
      params: { patientId: parsed.patientId },
      ...(parsed.draftId ? { search: { draftId: parsed.draftId } } : {}),
    });
  }
  throw redirect({ to: '/app/buscar' });
}

/** PR6 — formularios legacy con patientId (+ draftId opcional) → sección CICA equivalente (lista). */
function redirectLegacyFormToCicaPatientIfEnabled(
  search: Record<string, unknown>,
  to: CicaPatientRedirectTarget,
) {
  if (!isCicaUiEnabled()) return;
  const parsed = parseClinicalFormSearch(search);
  if (parsed.patientId) {
    throw redirect({
      to,
      params: { patientId: parsed.patientId },
      ...(parsed.draftId ? { search: { draftId: parsed.draftId } } : {}),
    });
  }
  throw redirect({ to: '/app/buscar' });
}

function redirectLegacyPrescriptionToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/indicaciones/nueva');
}

function redirectLegacyCertificateToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/documentos/nuevo');
}

function redirectLegacyEpicrisisToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/epicrisis/nueva');
}

const rootRoute = createRootRoute({
  component: () => (
    <EpisAppProviders>
      <Outlet />
    </EpisAppProviders>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: async () => {
    const session = await loadSessionForRouter();
    if (session) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
  },
});

const sessionExpiredRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sesion-expirada',
  component: SessionExpiredPage,
  beforeLoad: async () => {
    const session = await loadSessionForRouter();
    if (session) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
  },
});

const forbiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sin-acceso',
  validateSearch: (search: Record<string, unknown>) => ({
    detail: typeof search.detail === 'string' ? search.detail : undefined,
  }),
  component: ForbiddenRoutePage,
  beforeLoad: requireSession,
});

function ForbiddenRoutePage() {
  const { detail } = forbiddenRoute.useSearch();
  return <ForbiddenPage detail={detail} />;
}

const appearancePreferencesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/preferencias-apariencia',
  component: AppearancePreferencesPage,
  beforeLoad: requireSession,
});

/** Compat — /comando redirige a censo o ficha (barra transversal, no pantalla home). */
const commandCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/comando',
  validateSearch: (search: Record<string, unknown>) => parseCommandSearch(search),
  beforeLoad: async ({ search }) => {
    await requireSession();
    const parsed = parseCommandSearch(search);
    if (parsed.intent === 'selectPatient' && parsed.patientId) {
      if (isCicaUiEnabled()) {
        throw redirect({
          to: '/app/pacientes/$patientId/resumen',
          params: { patientId: parsed.patientId },
        });
      }
      throw redirect({
        to: '/espacio/ficha',
        search: { patientId: parsed.patientId, chartMode: 'traditional' },
      });
    }
    if (parsed.context === 'dashboard' || parsed.tab) {
      throw redirect({
        to: '/epis2/dashboard',
        search: parseDashboardSearch(search),
      });
    }
    throw redirect({ to: EPIS2_CLINICAL_HOME });
  },
  component: () => null,
});

const dashboardModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/epis2/dashboard',
  validateSearch: (search: Record<string, unknown>) => parseDashboardSearch(search),
  component: DashboardModePage,
  beforeLoad: requireSession,
});

const clinicalLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'clinical-shell',
  beforeLoad: requireSession,
  component: ClinicalShellLayout,
});

/** CICA Clean Room — raíz visual /app/* (sin legacy shell). */
const cicaLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'cica-shell',
  beforeLoad: async () => {
    await requireSession();
    if (!isCicaUiEnabled()) {
      throw redirect({ to: EPIS2_LEGACY_CLINICAL_HOME });
    }
  },
  component: CicaAppLayout,
});

const cicaSearchRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/buscar',
  component: CicaPatientSearchPage,
});

const cicaCensusRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/censo',
  component: CicaCensusPage,
});

const cicaPatientSummaryRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/resumen',
  component: CicaPatientSummaryPage,
});

const cicaPatientEvolutionsRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/evoluciones',
  component: CicaPatientEvolutionsPage,
});

const cicaNewEvolutionRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/evoluciones/nueva',
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { draftId?: string } = {};
    if (typeof search.draftId === 'string' && search.draftId) {
      parsed.draftId = search.draftId;
    }
    return parsed;
  },
  component: CicaNewEvolutionPage,
});

const cicaNewPrescriptionRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/indicaciones/nueva',
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { draftId?: string } = {};
    if (typeof search.draftId === 'string' && search.draftId) {
      parsed.draftId = search.draftId;
    }
    return parsed;
  },
  component: CicaNewPrescriptionPage,
});

const cicaPatientOrdersRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/indicaciones',
  component: CicaPatientOrdersPage,
});

const cicaPatientExamsRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/examenes',
  component: CicaPatientExamsPage,
});

const cicaPatientDocumentsRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/documentos',
  component: CicaPatientDocumentsPage,
});

const cicaNewDocumentRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/documentos/nuevo',
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { draftId?: string } = {};
    if (typeof search.draftId === 'string' && search.draftId) {
      parsed.draftId = search.draftId;
    }
    return parsed;
  },
  component: CicaNewDocumentPage,
});

const cicaNewEpicrisisRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/epicrisis/nueva',
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { draftId?: string } = {};
    if (typeof search.draftId === 'string' && search.draftId) {
      parsed.draftId = search.draftId;
    }
    return parsed;
  },
  component: CicaNewEpicrisisPage,
});

const cicaPaperDayRoute = createRoute({
  getParentRoute: () => cicaLayoutRoute,
  path: '/app/pacientes/$patientId/papel/dia/$date',
  component: CicaPaperDayPage,
});

const draftReviewRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/borrador/$draftId',
  component: DraftReviewPage,
});

const patientWorkspaceRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ficha',
  validateSearch: (search: Record<string, unknown>) => parseClinicalPatientSearch(search),
  beforeLoad: ({ search }) => {
    redirectLegacyFichaToCicaIfEnabled(search);
  },
  component: PatientWorkspacePage,
});

/** MF-AEST-03 — modo papel exclusivo (no embebido en ficha clásica). */
const standalonePaperChartRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ficha/papel',
  validateSearch: (search: Record<string, unknown>) => parsePaperStandaloneSearch(search),
  component: StandalonePaperChartPage,
});

const paperChartPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ficha/imprimir',
  validateSearch: (search: Record<string, unknown>) => parseClinicalPatientSearch(search),
  component: PaperChartPrintPage,
});

const paperPlannerPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ficha/agenda/imprimir',
  validateSearch: (search: Record<string, unknown>) => parseClinicalPatientSearch(search),
  component: PaperPlannerPrintPage,
});

const validatePatientSearch = parseClinicalFormSearch;

function clinicalFormPage(path: Parameters<typeof getBlueprintByRoutePath>[0]) {
  const blueprint = getBlueprintByRoutePath(path)!;
  return () => <GeneratedClinicalFormPage blueprint={blueprint} />;
}

const patientSearchFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/buscar-paciente',
  validateSearch: validatePatientSearch,
  beforeLoad: () => {
    redirectLegacyPatientSearchToCicaIfEnabled();
  },
  component: PatientSearchScreen,
});

const patientSummaryFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/resumen',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/resumen'),
});

const evolutionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/evolucion',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyEvolutionToCicaIfEnabled(search);
  },
  component: clinicalFormPage('/espacio/evolucion'),
});

/** Legacy epicrisis → formulario CICA cuando VITE_ENABLE_CICA_UI. */
const dischargeFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/epicrisis',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyEpicrisisToCicaIfEnabled(search);
  },
  component: clinicalFormPage('/espacio/epicrisis'),
});

const dischargeSummaryPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/epicrisis/imprimir',
  validateSearch: validatePatientSearch,
  component: DischargeSummaryPrintPage,
});

const prescriptionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/receta',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyPrescriptionToCicaIfEnabled(search);
  },
  component: clinicalFormPage('/espacio/receta'),
});

const prescriptionPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/receta/imprimir',
  validateSearch: validatePatientSearch,
  component: PrescriptionPrintPage,
});

const labFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/laboratorio',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/examenes');
  },
  component: clinicalFormPage('/espacio/laboratorio'),
});

const labRequestPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/laboratorio/imprimir',
  validateSearch: validatePatientSearch,
  component: LabRequestPrintPage,
});

const referralFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/interconsulta',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/documentos');
  },
  component: clinicalFormPage('/espacio/interconsulta'),
});

const imagingFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/imagenologia',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/examenes');
  },
  component: clinicalFormPage('/espacio/imagenologia'),
});

const imagingRequestPrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/imagenologia/imprimir',
  validateSearch: validatePatientSearch,
  component: ImagingRequestPrintPage,
});

const procedureFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/procedimiento',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/indicaciones');
  },
  component: clinicalFormPage('/espacio/procedimiento'),
});

const nursingFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/enfermeria',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/indicaciones');
  },
  component: clinicalFormPage('/espacio/enfermeria'),
});

const marFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/mar',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/indicaciones');
  },
  component: clinicalFormPage('/espacio/mar'),
});

const pharmacyFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/farmacia',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/indicaciones');
  },
  component: clinicalFormPage('/espacio/farmacia'),
});

const admissionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ingreso',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/ingreso'),
});

const allergyFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/alergia',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/alergia'),
});

const problemFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/problema',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/problema'),
});

const reconciliationFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/conciliacion',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/indicaciones');
  },
  component: clinicalFormPage('/espacio/conciliacion'),
});

const transferFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/traslado',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/traslado'),
});

const outpatientFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ambulatorio',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/resumen');
  },
  component: clinicalFormPage('/espacio/ambulatorio'),
});

const medicalCertificateFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/certificado',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyCertificateToCicaIfEnabled(search);
  },
  component: clinicalFormPage('/espacio/certificado'),
});

const medicalCertificatePrintRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/certificado/imprimir',
  validateSearch: validatePatientSearch,
  component: MedicalCertificatePrintPage,
});

const referralReportFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/informe-interconsulta',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/documentos');
  },
  component: clinicalFormPage('/espacio/informe-interconsulta'),
});

const resultsInboxRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/resultados',
  validateSearch: validatePatientSearch,
  beforeLoad: ({ search }) => {
    redirectLegacyFormToCicaPatientIfEnabled(search, '/app/pacientes/$patientId/examenes');
  },
  component: ResultsInboxPage,
});

const adminConsoleRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/admin',
  validateSearch: (search: Record<string, unknown>) => {
    const tab = search.tab;
    const validTab: 'users' | 'catalogs' | 'audit' | 'ops' | 'forms' =
      tab === 'catalogs' || tab === 'audit' || tab === 'ops' || tab === 'forms' ? tab : 'users';
    return { tab: validTab };
  },
  component: function AdminConsoleRoute() {
    const { tab } = adminConsoleRoute.useSearch();
    return <AdminConsolePage initialTab={tab} />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async () => {
    const session = await loadSessionForRouter();
    if (session) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
    throw redirect({ to: '/login' });
  },
});

/** Catálogo visual M3 (THEME-07 — solo dev o VITE_ENABLE_VISUAL_THEME_CATALOG=true). */
const visualThemeCatalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/desarrollo/catalogo-visual',
  component: LazyVisualThemeCatalogPage,
  beforeLoad: async () => {
    if (!isVisualThemeCatalogEnabled()) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
    await requireSession();
  },
});

/** Catálogo interno MUI (solo dev o VITE_ENABLE_UI_CATALOG=true). */
const uiCatalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dev/ui-catalog',
  component: LazyUiCatalogPage,
  beforeLoad: async () => {
    if (!isUiCatalogEnabled()) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
    await requireSession();
  },
});

const LazyDualChartModesPreviewPage = lazy(() =>
  import('../pages/dev/DualChartModesPreviewPage.js').then((m) => ({
    default: m.DualChartModesPreviewPage,
  })),
);

/** Preview dual ficha ADR-002 — dev o VITE_ENABLE_DUAL_CHART_MODES=true. */
const dualChartModesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dev/chart-modes',
  validateSearch: (search: Record<string, unknown>) => ({
    chartMode: typeof search.chartMode === 'string' ? search.chartMode : undefined,
  }),
  component: LazyDualChartModesPreviewPage,
  beforeLoad: async () => {
    if (!isDualChartModesEnabled()) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
    await requireSession();
  },
});

/** Spike Scheduler MUI-10 (LIC-007 EVALUATE): solo dev o VITE_ENABLE_SCHEDULER_SPIKE=true. */
const schedulerSpikeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dev/scheduler-spike',
  component: LazySchedulerSpikePage,
  beforeLoad: async () => {
    if (!isSchedulerSpikeEnabled()) {
      throw redirect({ to: EPIS2_CLINICAL_HOME });
    }
    await requireSession();
  },
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  sessionExpiredRoute,
  forbiddenRoute,
  appearancePreferencesRoute,
  visualThemeCatalogRoute,
  uiCatalogRoute,
  dualChartModesRoute,
  schedulerSpikeRoute,
  commandCenterRoute,
  dashboardModeRoute,
  cicaLayoutRoute.addChildren([
    cicaSearchRoute,
    cicaCensusRoute,
    cicaPatientSummaryRoute,
    cicaPatientEvolutionsRoute,
    cicaNewEvolutionRoute,
    cicaPatientOrdersRoute,
    cicaNewPrescriptionRoute,
    cicaPatientExamsRoute,
    cicaPatientDocumentsRoute,
    cicaNewDocumentRoute,
    cicaNewEpicrisisRoute,
    cicaPaperDayRoute,
  ]),
  clinicalLayoutRoute.addChildren([
    draftReviewRoute,
    standalonePaperChartRoute,
    patientWorkspaceRoute,
    paperChartPrintRoute,
    paperPlannerPrintRoute,
    patientSearchFormRoute,
    patientSummaryFormRoute,
    evolutionFormRoute,
    dischargeFormRoute,
    prescriptionFormRoute,
    prescriptionPrintRoute,
    labFormRoute,
    labRequestPrintRoute,
    referralFormRoute,
    imagingFormRoute,
    imagingRequestPrintRoute,
    procedureFormRoute,
    nursingFormRoute,
    marFormRoute,
    pharmacyFormRoute,
    admissionFormRoute,
    allergyFormRoute,
    problemFormRoute,
    reconciliationFormRoute,
    transferFormRoute,
    outpatientFormRoute,
    medicalCertificateFormRoute,
    medicalCertificatePrintRoute,
    dischargeSummaryPrintRoute,
    referralReportFormRoute,
    resultsInboxRoute,
    adminConsoleRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

export { EPIS2_CLINICAL_HOME, EPIS2_COMMAND_CENTER_HOME } from './home.js';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
