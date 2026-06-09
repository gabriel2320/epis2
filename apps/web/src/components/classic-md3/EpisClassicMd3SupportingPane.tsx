import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type EpisClassicMd3SupportingPaneProps = {
  children: ReactNode;
  open?: boolean;
  onToggle?: () => void;
  testId?: string;
};

/** Supporting pane MD3 — contexto, no compite con panel principal. */
export function EpisClassicMd3SupportingPane({
  children,
  open = true,
  onToggle,
  testId = 'epis2-classic-md3-supporting-pane',
}: EpisClassicMd3SupportingPaneProps) {
  if (!open) return null;

  return (
    <Box
      component="aside"
      data-testid={testId}
      sx={{
        width: { md: 340, lg: 360 },
        maxWidth: '100%',
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        minHeight: 0,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1 }}>
        <Typography variant="subtitle2">{copy.classicMd3.supportingPaneTitle}</Typography>
        {onToggle ? (
          <EpisButton appearance="text" size="small" onClick={onToggle}>
            {copy.classicMd3.collapseSupporting}
          </EpisButton>
        ) : null}
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1.5, pb: 1.5 }}>{children}</Box>
    </Box>
  );
}
