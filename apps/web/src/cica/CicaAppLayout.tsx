import { copy } from '@epis2/design-system';
import {
  buildCicaPath,
  CicaAppShell,
  CicaScreenTransition,
  CicaSidebar,
  buildCicaSidebarSections,
  cicaScreenTitle,
  findCicaScreenByRoutePrefix,
  isCicaSidebarHiddenRoute,
  parseCicaPatientId,
} from '@epis2/epis2-ui';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { getDemoCaseByPatientId } from '../fixtures/devFixturesBridge.js';
import { buildCicaPatientPresentation } from './cicaPatientPresentation.js';

/** Layout exclusivo `/app/*` — CICA Clean Room, sidebar dual epis2g. Tema: CicaThemeControls + CicaSidebarThemePanel. */
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

  const patientContext = useMemo(() => {
    if (!patientId || !patient) return undefined;
    const demoCase = getDemoCaseByPatientId(patientId);
    const presentation = buildCicaPatientPresentation(patient.displayName, demoCase);
    const bedLabel = presentation.identity.serviceUnit ?? presentation.identity.bedLabel;
    return {
      displayName: patient.displayName,
      ...(bedLabel ? { bedLabel } : {}),
      onClosePatient: () => {
        void navigate({ to: buildCicaPath('census') });
      },
    };
  }, [patient, patientId, navigate]);

  return (
    <CicaAppShell
      topBar={{
        title: screen ? cicaScreenTitle(screen) : 'EPIS2',
        demoLabel: copy.demoBadge,
      }}
      sidebar={
        <CicaSidebar
          sections={sidebarSections}
          {...(patientContext ? { patientContext } : {})}
        />
      }
      hideSidebar={isCicaSidebarHiddenRoute(pathname)}
    >
      <CicaScreenTransition transitionKey={pathname}>
        <Outlet />
      </CicaScreenTransition>
    </CicaAppShell>
  );
}
