import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type EpisClassicMd3SplitPaneProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  persistKey?: string;
  testId?: string;
};

/** Pantalla dividida clásica — panel secundario de apoyo colapsable. */
export function EpisClassicMd3SplitPane({
  primary,
  secondary,
  open = false,
  onOpenChange,
  testId = 'epis2-classic-md3-split-pane',
}: EpisClassicMd3SplitPaneProps) {
  return (
    <Stack data-testid={testId} spacing={1} sx={{ height: '100%', minHeight: 0 }}>
      {onOpenChange ? (
        <Box>
          <EpisButton appearance="text" size="small" onClick={() => onOpenChange(!open)}>
            {open ? copy.classicMd3.collapseSupporting : copy.classicMd3.splitPaneToggle}
          </EpisButton>
        </Box>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          gap: open ? 1.5 : 0,
          flexDirection: { xs: 'column', lg: open ? 'row' : 'column' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>{primary}</Box>
        {open && secondary ? (
          <Box
            data-testid={`${testId}-secondary`}
            sx={{
              flex: { lg: '0 0 38%' },
              minWidth: 0,
              maxHeight: { xs: '45vh', lg: 'none' },
              overflow: 'auto',
              borderLeft: { lg: 1 },
              borderColor: 'divider',
              pl: { lg: 1.5 },
            }}
          >
            {secondary}
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
}
