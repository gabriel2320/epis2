import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { EPIS2_FORM_BLUEPRINTS } from '@epis2/clinical-forms';
import { loadSessionForRouter } from '../auth/AuthContext.js';
import { ClinicalShellLayout } from '../layouts/ClinicalShellLayout.js';
import { CommandCenterPage } from '../pages/CommandCenterPage.js';
import { DraftReviewPage } from '../pages/DraftReviewPage.js';
import { GeneratedClinicalFormPage } from '../pages/GeneratedClinicalFormPage.js';
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

const clinicalFormRoutes = EPIS2_FORM_BLUEPRINTS.map((blueprint) =>
  createRoute({
    getParentRoute: () => clinicalLayoutRoute,
    path: blueprint.routePath,
    validateSearch: (search: Record<string, unknown>) => ({
      patientId: typeof search.patientId === 'string' ? search.patientId : undefined,
    }),
    component: () => <GeneratedClinicalFormPage blueprint={blueprint} />,
  }),
);

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
  clinicalLayoutRoute.addChildren([draftReviewRoute, ...clinicalFormRoutes]),
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
