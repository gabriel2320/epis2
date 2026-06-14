import type { PostSaveMicrojourneyAction } from '@epis2/clinical-productivity';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';

export type PostSaveMicrojourneyPanelProps = {
  actions: readonly PostSaveMicrojourneyAction[];
  onDismiss?: (() => void) | undefined;
};

/** MF-DI-09 — chips de siguiente paso tras guardar borrador. */
export function PostSaveMicrojourneyPanel({ actions, onDismiss }: PostSaveMicrojourneyPanelProps) {
  const navigate = useClinicalNavigate();
  if (actions.length === 0) return null;

  return (
    <Stack
      spacing={1}
      data-testid="epis2-post-save-microjourneys"
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="subtitle2">Siguiente paso sugerido</Typography>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
        {actions.map((action) => (
          <EpisButton
            key={action.id}
            appearance="outlined"
            size="small"
            data-testid={action.testId}
            onClick={() => {
              void navigate({
                to: action.routePath as never,
                search: action.search as never,
              });
              onDismiss?.();
            }}
          >
            {action.labelEs}
          </EpisButton>
        ))}
        {onDismiss ? (
          <EpisButton appearance="text" size="small" onClick={onDismiss}>
            Cerrar
          </EpisButton>
        ) : null}
      </Stack>
    </Stack>
  );
}
