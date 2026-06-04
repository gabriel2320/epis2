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
import { CommandCenterPage } from '../pages/CommandCenterPage.js';
import { DashboardModePage } from '../pages/DashboardModePage.js';
import { DraftReviewPage } from '../pages/DraftReviewPage.js';
import { GeneratedClinicalFormPage } from '../pages/GeneratedClinicalFormPage.js';
import { PatientWorkspacePage } from '../pages/PatientWorkspacePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';

async function requireSession() {
  const session = await loadSessionForRouter();
  if (!session) {
    throw redirect({ to: '/login' });
  }
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: async () => {
    const session = await loadSessionForRouter();
    if (session) {
      throw redirect({ to: '/comando' });
    }
  },
});

/** Home canónica = Centro de Comando (sin dashboard). */
const commandCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/comando',
  component: CommandCenterPage,
  beforeLoad: requireSession,
});

const dashboardModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/epis2/dashboard',
  validateSearch: (search: Record<string, unknown>) => ({
    tab:
      search.tab === 'patient' || search.tab === 'service' || search.tab === 'work'
        ? search.tab
        : 'work',
    patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
  }),
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
  validateSearch: (search: Record<string, unknown>) => ({
    patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
  }),
  component: PatientWorkspacePage,
});

const validatePatientSearch = (search: Record<string, unknown>) => ({
  patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
});

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

const prescriptionFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/receta',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/receta'),
});

const labFormRoute = createRoute({
  getParentRoute: () => clinicalLayoutRoute,
  path: '/espacio/laboratorio',
  validateSearch: validatePatientSearch,
  component: clinicalFormPage('/espacio/laboratorio'),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async () => {
    const session = await loadSessionForRouter();
    if (session) {
      throw redirect({ to: '/comando' });
    }
    throw redirect({ to: '/login' });
  },
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  commandCenterRoute,
  dashboardModeRoute,
  clinicalLayoutRoute.addChildren([
    draftReviewRoute,
    patientWorkspaceRoute,
    patientSearchFormRoute,
    patientSummaryFormRoute,
    evolutionFormRoute,
    dischargeFormRoute,
    prescriptionFormRoute,
    labFormRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

export const EPIS2_COMMAND_CENTER_HOME = '/comando' as const;

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
