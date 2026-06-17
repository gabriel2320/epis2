import { copy } from '@epis2/design-system';
import {
  CicaAppShell,
  CicaScreenTransition,
  CicaThemeControls,
  buildDefaultCicaNavItems,
  cicaScreenTitle,
  findCicaScreenByRoutePrefix,
  isCicaPaperRoute,
  parseCicaPatientId,
} from '@epis2/epis2-ui';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useActivePatient } from '../clinical/ActivePatientContext.js';

/** Layout exclusivo `/app/*` — CICA Clean Room, sin legacy shell. */
export function CicaAppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { patient } = useActivePatient();

  const patientId = parseCicaPatientId(pathname) ?? patient?.id;
  const screen = findCicaScreenByRoutePrefix(pathname);

  const navItems = buildDefaultCicaNavItems({
    pathname,
    patientId,
    onNavigate: (to) => {
      void navigate({ to });
    },
  });

  return (
    <CicaAppShell
      topBar={{
        title: screen ? cicaScreenTitle(screen) : 'EPIS2',
        demoLabel: copy.demoBadge,
        themeControls: <CicaThemeControls />,
      }}
      nav={{
        items: navItems,
        moreItems: [
          {
            id: 'appearance',
            label: 'Apariencia',
            onClick: () => void navigate({ to: '/preferencias-apariencia' }),
            testId: 'cica-nav-more-appearance',
          },
          {
            id: 'legacy-search',
            label: copy.clinicalNav.commandLegacy,
            onClick: () => void navigate({ to: '/espacio/buscar-paciente' }),
            testId: 'cica-nav-more-legacy',
          },
        ],
      }}
      hideNav={isCicaPaperRoute(pathname)}
    >
      <CicaScreenTransition transitionKey={pathname}>
        <Outlet />
      </CicaScreenTransition>
    </CicaAppShell>
  );
}
