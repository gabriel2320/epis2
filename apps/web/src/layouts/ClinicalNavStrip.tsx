/**
 * FASE 1 PROG-AESTHETIC-RESET — navegación clínica mínima (CICA shell).
 * Censo · Buscar · Ficha · Papel · Más — sin modo tablero ni switcher deprecado.
 */
import { isClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  Box,
  EpisButton,
  EpisChip,
  EpisDemoBadgeChip,
  EpisM3Text,
  Menu,
  MenuItem,
  ScienceIcon,
  Stack,
} from '@epis2/epis2-ui';
import { Link, useRouterState } from '@tanstack/react-router';
import { useState, type MouseEvent } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { CICA_RETURN_ROUTES } from '../clinical/clinicalIntent.js';
import { WORKSPACE_CARE_SETTING } from '../navigation/clinicalRoleCareMatrix.js';
import { useClinicalWorkspace } from '../navigation/useClinicalWorkspace.js';
import { resolveWorkspaceCopyKey } from '../navigation/workspaceCopy.js';
import { EPIS2_CLINICAL_HOME } from '../routes/home.js';
import { PAPER_STANDALONE_ROUTE } from '../routes/paperStandaloneSearch.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useEpisSession } from '../session/EpisSessionContext.js';
import { ClinicalAppBarUserMenu } from './ClinicalAppBarUserMenu.js';

export type ClinicalNavStripProps = {
  testId?: string;
};

export function ClinicalNavStrip({ testId = 'epis2-clinical-nav-strip' }: ClinicalNavStripProps) {
  const { session } = useAuth();
  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const { openDashboardMode } = useEpisSession();
  const { activeWorkspace, definition } = useClinicalWorkspace();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const isCensus = pathname === EPIS2_CLINICAL_HOME;
  const isFicha = pathname === CICA_RETURN_ROUTES.patientChart;
  const isPaper = pathname.startsWith(PAPER_STANDALONE_ROUTE);
  const isClinicalForm = pathname.startsWith('/espacio/') && !isCensus && !isFicha && !isPaper;

  const role = session?.user.role ?? 'physician';
  const roleLabel = isClinicalRole(role) ? copy.roles[role] : role;
  const workspaceLabel = resolveWorkspaceCopyKey(definition.labelKey);
  const careKey = WORKSPACE_CARE_SETTING[activeWorkspace];
  const careLabel =
    careKey !== 'institutional' ? copy.careSettings[careKey] : copy.careSettings.institutional;

  const openMore = (event: MouseEvent<HTMLElement>) => {
    setMoreAnchor(event.currentTarget);
  };

  const closeMore = () => {
    setMoreAnchor(null);
  };

  const navButtonSx = {
    minWidth: { xs: 40, md: 'auto' },
    px: { xs: 1, md: 1.5 },
    '& .epis-clinical-nav-label': { display: { xs: 'none', sm: 'inline' } },
  };

  return (
    <Box
      component="header"
      data-testid={testId}
      sx={{
        flexShrink: 0,
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 1.5, md: 3 },
        py: 0.75,
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <EpisM3Text
            role="titleMedium"
            component="p"
            sx={{ mr: { sm: 1 }, flexShrink: 0 }}
            data-testid="epis2-clinical-nav-brand"
          >
            {copy.commandCenter.googleBarBrand}
          </EpisM3Text>

          <Stack
            component="nav"
            direction="row"
            spacing={0.5}
            alignItems="center"
            aria-label={copy.clinicalNav.ariaLabel}
            flexWrap="wrap"
            useFlexGap
          >
            <EpisButton
              component={Link}
              to={EPIS2_CLINICAL_HOME}
              appearance={isCensus ? 'tonal' : 'text'}
              size="small"
              data-testid="epis2-clinical-nav-census"
              sx={navButtonSx}
            >
              <span className="epis-clinical-nav-label">{copy.clinicalNav.census}</span>
            </EpisButton>
            <EpisButton
              component={Link}
              to={EPIS2_CLINICAL_HOME}
              appearance={isCensus ? 'tonal' : 'text'}
              size="small"
              data-testid="epis2-clinical-nav-search"
              sx={navButtonSx}
            >
              <span className="epis-clinical-nav-label">{copy.clinicalNav.search}</span>
            </EpisButton>
            <EpisButton
              appearance={isFicha ? 'tonal' : 'text'}
              size="small"
              disabled={!patient?.id}
              data-testid="epis2-clinical-nav-ficha"
              sx={navButtonSx}
              onClick={() => {
                if (!patient?.id) return;
                void navigate({
                  to: CICA_RETURN_ROUTES.patientChart,
                  search: { patientId: patient.id, chartMode: 'traditional' },
                });
              }}
            >
              <span className="epis-clinical-nav-label">{copy.clinicalNav.ficha}</span>
            </EpisButton>
            <EpisButton
              appearance={isPaper ? 'tonal' : 'text'}
              size="small"
              disabled={!patient?.id}
              data-testid="epis2-clinical-nav-paper"
              sx={navButtonSx}
              onClick={() => {
                if (!patient?.id) return;
                void navigate({
                  to: PAPER_STANDALONE_ROUTE,
                  search: { patientId: patient.id },
                });
              }}
            >
              <span className="epis-clinical-nav-label">{copy.clinicalNav.paper}</span>
            </EpisButton>
            <EpisButton
              appearance={isClinicalForm ? 'tonal' : 'text'}
              size="small"
              data-testid="epis2-clinical-nav-more"
              onClick={openMore}
              sx={navButtonSx}
            >
              <span className="epis-clinical-nav-label">{copy.clinicalNav.more}</span>
            </EpisButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center" useFlexGap>
          <EpisChip size="small" label={roleLabel} variant="outlined" />
          <EpisChip size="small" label={workspaceLabel} variant="filled" title={careLabel} />
          <EpisDemoBadgeChip icon={<ScienceIcon />} label={copy.demoBadge} size="small" />
          <ClinicalAppBarUserMenu />
        </Stack>
      </Stack>

      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={closeMore}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          data-testid="epis2-clinical-nav-more-command"
          onClick={() => {
            closeMore();
            void navigate({ to: '/comando' });
          }}
        >
          {copy.clinicalNav.commandLegacy}
        </MenuItem>
        <MenuItem
          data-testid="epis2-clinical-nav-more-board"
          onClick={() => {
            closeMore();
            openDashboardMode('work');
          }}
        >
          {copy.clinicalNav.boardSecondary}
        </MenuItem>
        <MenuItem
          data-testid="epis2-clinical-nav-more-settings"
          onClick={() => {
            closeMore();
            void navigate({ to: '/preferencias-apariencia' });
          }}
        >
          {copy.clinicalNav.settings}
        </MenuItem>
      </Menu>
    </Box>
  );
}
