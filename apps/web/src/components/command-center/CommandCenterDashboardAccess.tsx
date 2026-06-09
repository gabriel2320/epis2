import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { useEpisSession } from '../../session/EpisSessionContext.js';

/** Acceso visible al dashboard operacional desde `/comando`. */
export function CommandCenterDashboardAccess() {
  const session = useEpisSession();

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      justifyContent="center"
      data-testid="epis2-command-dashboard-access"
    >
      <EpisButton
        appearance="outlined"
        size="small"
        data-testid="epis2-command-open-dashboard"
        disabled={!session.canOpenDashboard}
        onClick={() => session.openDashboardMode('work')}
      >
        {copy.commandCenter.openDashboard}
      </EpisButton>
    </Stack>
  );
}
