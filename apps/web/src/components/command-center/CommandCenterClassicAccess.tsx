import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { useEpisSession } from '../../session/EpisSessionContext.js';

/** Acceso visible al modo clásico EMR desde `/comando`. */
export function CommandCenterClassicAccess() {
  const session = useEpisSession();

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      justifyContent="center"
      data-testid="epis2-command-classic-access"
    >
      {/* primary.dark (onPrimaryContainer M3): primary no alcanza 4.5:1 sobre surfaceContainer (MF-NORM-401b). */}
      <EpisButton
        appearance="outlined"
        size="small"
        data-testid="epis2-command-open-classic"
        onClick={() => session.openClassicMode()}
        sx={{ color: 'primary.dark' }}
      >
        {copy.commandCenter.openClassicMode}
      </EpisButton>
      {session.activePatientId ? (
        <EpisButton
          appearance="text"
          size="small"
          data-testid="epis2-command-continue-classic"
          onClick={() => session.openClassicMode(session.activePatientId)}
          sx={{ color: 'primary.dark' }}
        >
          {copy.commandCenter.continueClassicMode}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
