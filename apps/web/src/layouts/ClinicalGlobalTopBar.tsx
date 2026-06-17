import { copy } from '@epis2/design-system';
import { EpisButton, EpisTopAppBar } from '@epis2/epis2-ui';
import { Link, useRouterState } from '@tanstack/react-router';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { ClinicalAppBarUserMenu } from './ClinicalAppBarUserMenu.js';
import { ClinicalNavStrip } from './ClinicalNavStrip.js';
import { EpisModeSwitcher } from '../components/modes/EpisModeSwitcher.js';

type ClinicalGlobalTopBarProps = {
  active?: 'command' | 'clinical' | 'dashboard';
};

/** AppBar operativa — delega en ClinicalNavStrip cuando dual ficha está activa. */
export function ClinicalGlobalTopBar({ active: _active = 'clinical' }: ClinicalGlobalTopBarProps) {
  const dualChart = isDualChartModesEnabled();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (dualChart) {
    return <ClinicalNavStrip />;
  }

  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const searchActive = pathname === '/espacio/buscar-paciente';
  const patientActive =
    pathname === '/espacio/ficha' ||
    (pathname.startsWith('/espacio/') && !searchActive && pathname !== '/comando');

  const openPatient = () => {
    if (patient?.id) {
      void navigate({ to: '/espacio/ficha', search: { patientId: patient.id } });
      return;
    }
    void navigate({ to: '/espacio/ficha', search: { patientId: undefined } });
  };

  return (
    <EpisTopAppBar
      data-testid="epis2-global-top-bar"
      endActions={
        <>
          <EpisModeSwitcher compact />
          <EpisButton
            component={Link}
            to="/espacio/buscar-paciente"
            appearance={searchActive ? 'tonal' : 'text'}
            size="small"
            data-testid="epis2-nav-buscar"
          >
            {copy.layout.navSearch}
          </EpisButton>
          <EpisButton
            appearance={patientActive ? 'tonal' : 'text'}
            size="small"
            data-testid="epis2-nav-paciente"
            onClick={openPatient}
          >
            {copy.layout.navPatient}
          </EpisButton>
          <ClinicalAppBarUserMenu />
        </>
      }
    />
  );
}
