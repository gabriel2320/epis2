import { copy } from '@epis2/design-system';
import {
  EpisButton,
  EpisTopAppBar,
  PersonOutlineIcon,
  PersonSearchIcon,
  TerminalIcon,
} from '@epis2/epis2-ui';
import { Link, useRouterState } from '@tanstack/react-router';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { ClinicalAppBarAlertsAction } from './ClinicalAppBarAlertsAction.js';
import { ClinicalAppBarSettingsAction } from './ClinicalAppBarSettingsAction.js';
import { ClinicalAppBarUserMenu } from './ClinicalAppBarUserMenu.js';
import { ClinicalRoleCareContext } from './ClinicalRoleCareContext.js';
import { EpisModeSwitcher } from '../components/modes/EpisModeSwitcher.js';

type ClinicalGlobalTopBarProps = {
  active?: 'command' | 'clinical' | 'dashboard';
};

/** AppBar operativa — Buscar · Comando · Paciente · Alertas · Usuario (UX-A.3). */
export function ClinicalGlobalTopBar({ active = 'clinical' }: ClinicalGlobalTopBarProps) {
  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const searchActive = pathname === '/espacio/buscar-paciente';
  const commandActive = active === 'command' || pathname === '/comando';
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
          <ClinicalRoleCareContext />
          <EpisButton
            component={Link}
            to="/espacio/buscar-paciente"
            appearance={searchActive ? 'tonal' : 'text'}
            size="small"
            startIcon={<PersonSearchIcon />}
            data-testid="epis2-nav-buscar"
            sx={{
              minWidth: { xs: 40, md: 'auto' },
              px: { xs: 1, md: 1.5 },
              '& .epis-nav-label': { display: { xs: 'none', lg: 'inline' } },
            }}
          >
            <span className="epis-nav-label">{copy.layout.navSearch}</span>
          </EpisButton>
          <EpisButton
            component={Link}
            to="/comando"
            appearance={commandActive ? 'tonal' : 'text'}
            size="small"
            startIcon={<TerminalIcon />}
            data-testid="epis2-nav-comando"
            sx={{
              minWidth: { xs: 40, md: 'auto' },
              px: { xs: 1, md: 1.5 },
              '& .epis-nav-label': { display: { xs: 'none', lg: 'inline' } },
            }}
          >
            <span className="epis-nav-label">{copy.layout.commandShort}</span>
          </EpisButton>
          <EpisButton
            appearance={patientActive ? 'tonal' : 'text'}
            size="small"
            startIcon={<PersonOutlineIcon />}
            data-testid="epis2-nav-paciente"
            onClick={openPatient}
            sx={{
              minWidth: { xs: 40, md: 'auto' },
              px: { xs: 1, md: 1.5 },
              '& .epis-nav-label': { display: { xs: 'none', lg: 'inline' } },
            }}
          >
            <span className="epis-nav-label">{copy.layout.navPatient}</span>
          </EpisButton>
          <ClinicalAppBarSettingsAction />
          <ClinicalAppBarAlertsAction />
          <ClinicalAppBarUserMenu />
        </>
      }
    />
  );
}
