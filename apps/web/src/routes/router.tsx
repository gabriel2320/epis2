import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { EPIS2_COMMAND_DEFINITIONS } from '@epis2/command-registry';
import { loadSessionForRouter } from '../auth/AuthContext.js';
import { ClinicalShellLayout } from '../layouts/ClinicalShellLayout.js';
import { CommandCenterPage } from '../pages/CommandCenterPage.js';
import { ClinicalWorkspacePage } from '../pages/ClinicalWorkspacePage.js';
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

const clinicalWorkspaceRoutes = EPIS2_COMMAND_DEFINITIONS.map((def) =>
  createRoute({
    getParentRoute: () => clinicalLayoutRoute,
    path: def.routePath,
    component: () => (
      <ClinicalWorkspacePage title={def.labelEs} intentLabel={def.labelEs} />
    ),
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
  clinicalLayoutRoute.addChildren(clinicalWorkspaceRoutes),
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
