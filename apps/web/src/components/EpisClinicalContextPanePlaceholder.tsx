import { copy } from '@epis2/design-system';
import { Stack, Typography } from '@epis2/epis2-ui';

/** Panel de contexto LAYOUT-01 — placeholder hasta timeline LAYOUT-02. */
export function EpisClinicalContextPanePlaceholder() {
  return (
    <Stack
      spacing={2}
      sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}
      data-testid="epis2-clinical-context-pane"
    >
      <Typography variant="subtitle2" component="h2">
        {copy.clinicalLayout.contextPaneTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
        {copy.clinicalLayout.contextPanePlaceholder}
      </Typography>
    </Stack>
  );
}
