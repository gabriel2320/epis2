import { copy } from '@epis2/design-system';
import { EpisChip, Stack, Typography } from '@epis2/epis2-ui';
import { useRouterState } from '@tanstack/react-router';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { areDesignAgentsEnabled } from '../lab/design-agents/designAgentsEnv.js';
import { useEpisSession } from '../session/EpisSessionContext.js';
import { iconBudgetForScreen, screenKindForRoute } from '../quality/uiDensityRules.js';
import { isDesignModeEnabled } from './designModeEnv.js';
import { auditForLocation } from './radScreenRegistry.js';
import { radSurfaceForPath } from './radDiscipline.js';

/** Overlay dev — clasificación RAD/MD3 de la pantalla actual. */
export function EpisDesignModeOverlay() {
  const enabled = isDesignModeEnabled();
  const { location } = useRouterState();
  const pathname = location.pathname;
  const search = location.searchStr ?? '';
  const session = useEpisSession();

  useEffect(() => {
    if (!enabled) {
      document.documentElement.removeAttribute('data-epis-design-mode');
      return;
    }
    document.documentElement.setAttribute('data-epis-design-mode', 'true');
    return () => {
      document.documentElement.removeAttribute('data-epis-design-mode');
    };
  }, [enabled]);

  if (!enabled) return null;

  const audit = auditForLocation(pathname, search);
  const surface = audit?.surface ?? radSurfaceForPath(pathname);
  const kind = screenKindForRoute(pathname);
  const iconBudget = iconBudgetForScreen(kind);
  const isClassic =
    document.documentElement.getAttribute('data-epis-classic-md3') === 'true' ||
    new URLSearchParams(search).get('mode') === 'classic' ||
    new URLSearchParams(search).get('view') === 'classic';
  const isDashboardMd3 =
    document.documentElement.getAttribute('data-epis-dashboard-md3') === 'true' ||
    new URLSearchParams(search).get('mode') === 'dashboard';
  const isCommandCenter = pathname === '/comando' || pathname.startsWith('/comando');
  const agentsEnabled = areDesignAgentsEnabled();

  return createPortal(
    <Stack
      direction="row"
      spacing={0.75}
      flexWrap="wrap"
      alignItems="center"
      data-testid="epis2-design-mode-overlay"
      sx={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        px: 1.5,
        py: 1,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: 420,
      }}
    >
      <Typography variant="caption" fontWeight={700}>
        {copy.designMode.label}
      </Typography>
      <EpisChip size="small" label={`RAD: ${surface}`} variant="filled" />
      <EpisChip size="small" label={`MD3: ${kind}`} variant="outlined" />
      {isClassic ? (
        <>
          <EpisChip size="small" label={copy.classicMd3.modeLabel} variant="outlined" />
          <EpisChip size="small" label="supporting-pane" variant="outlined" />
          <EpisChip size="small" label="scroll: main-pane-only" variant="outlined" />
        </>
      ) : isCommandCenter ? (
        <EpisChip size="small" label="command-center / search" variant="outlined" />
      ) : isDashboardMd3 ? (
        <>
          <EpisChip size="small" label={copy.dashboardMd3.modeLabel} variant="outlined" />
          <EpisChip size="small" label="list-detail + supporting-pane" variant="outlined" />
          <EpisChip size="small" label="scroll: main-grid-only" variant="outlined" />
        </>
      ) : null}
      <EpisChip
        size="small"
        label={agentsEnabled ? 'agentes IA: on' : 'agentes IA: off'}
        variant="outlined"
      />
      {session.activeMode ? (
        <EpisChip size="small" label={`activeMode: ${session.activeMode}`} variant="outlined" />
      ) : null}
      {session.previousMode ? (
        <EpisChip size="small" label={`prev: ${session.previousMode}`} variant="outlined" />
      ) : null}
      <EpisChip
        size="small"
        label={`patient: ${session.activePatientId ? 'sí' : 'no'}`}
        variant="outlined"
      />
      <EpisChip size="small" label={`iconos ≤${iconBudget}`} variant="outlined" />
      {audit ? (
        <Typography variant="caption" color="text.secondary" sx={{ width: '100%' }}>
          {audit.primaryTask} · {copy.designMode.migration[audit.migration]}
        </Typography>
      ) : null}
    </Stack>,
    document.body,
  );
}

export function EpisDesignModeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <EpisDesignModeOverlay />
    </>
  );
}
