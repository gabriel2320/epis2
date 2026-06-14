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
import { PatientWorkspacePage } from '../pages/PatientWorkspacePage.js';
import { ResultsInboxPage } from '../pages/ResultsInboxPage.js';
import { MedicalCertificatePrintPage } from '../pages/MedicalCertificatePrintPage.js';
import { DischargeSummaryPrintPage } from '../pages/DischargeSummaryPrintPage.js';
import { LabRequestPrintPage } from '../pages/LabRequestPrintPage.js';
import { ImagingRequestPrintPage } from '../pages/ImagingRequestPrintPage.js';
import { PrescriptionPrintPage } from '../pages/PrescriptionPrintPage.js';
import { PaperChartPrintPage } from '../pages/PaperChartPrintPage.js';
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
import {
  parseDashboardSearch,
  parseClinicalFormSearch,
  parseCommandSearch,
  parseClinicalPatientSearch,
} from './clinicalNavigate.js';
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

const draftReviewRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/borrador/$draftId',
  component: DraftReviewPage,
});

const patientWorkspaceRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ficha',
  validateSearch: (search: Record<string, unknown>) => parseClinicalPatientSearch(search),
  component: PatientWorkspacePage,
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
  component: clinicalFormPage('/espacio/buscar-paciente'),
});

const patientSummaryFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/resumen',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/resumen'),
});

const evolutionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/evolucion',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/evolucion'),
});

const dischargeFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/epicrisis',
  validateSearch: validatePatientSearch,
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
  component: clinicalFormPage('/espacio/interconsulta'),
});

const imagingFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/imagenologia',
  validateSearch: validatePatientSearch,
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
  component: clinicalFormPage('/espacio/procedimiento'),
});

const nursingFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/enfermeria',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/enfermeria'),
});

const marFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/mar',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/mar'),
});

const pharmacyFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/farmacia',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/farmacia'),
});

const admissionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ingreso',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/ingreso'),
});

const allergyFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/alergia',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/alergia'),
});

const problemFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/problema',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/problema'),
});

const reconciliationFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/conciliacion',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/conciliacion'),
});

const transferFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/traslado',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/traslado'),
});

const outpatientFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/ambulatorio',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/ambulatorio'),
});

const medicalCertificateFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/certificado',
  validateSearch: validatePatientSearch,
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
  component: clinicalFormPage('/espacio/informe-interconsulta'),
});

const resultsInboxRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/resultados',
  validateSearch: validatePatientSearch,
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
  clinicalLayoutRoute.addChildren([
    draftReviewRoute,
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
