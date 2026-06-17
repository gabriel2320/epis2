import { copy } from '@epis2/design-system';
import {
  CicaAppShell,
  CicaScreenTransition,
  CicaSidebar,
  CicaThemeControls,
  buildCicaSidebarSections,
  cicaScreenTitle,
  findCicaScreenByRoutePrefix,
  isCicaSidebarHiddenRoute,
  parseCicaPatientId,
} from '@epis2/epis2-ui';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';

/** Layout exclusivo `/app/*` — CICA Clean Room, sidebar contextual. */
export function CicaAppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { patient } = useActivePatient();

  const patientId = parseCicaPatientId(pathname) ?? patient?.id;
  const screen = findCicaScreenByRoutePrefix(pathname);

  const sidebarSections = useMemo(
    () =>
      buildCicaSidebarSections({
        pathname,
        patientId,
        onNavigate: (to) => {
          void navigate({ to });
        },
      }),
    [pathname, patientId, navigate],
  );

  return (
    <CicaAppShell
      topBar={{
        title: screen ? cicaScreenTitle(screen) : 'EPIS2',
        demoLabel: copy.demoBadge,
        themeControls: <CicaThemeControls />,
      }}
      sidebar={<CicaSidebar sections={sidebarSections} />}
      hideSidebar={isCicaSidebarHiddenRoute(pathname)}
    >
      <CicaScreenTransition transitionKey={pathname}>
        <Outlet />
      </CicaScreenTransition>
    </CicaAppShell>
  );
}
