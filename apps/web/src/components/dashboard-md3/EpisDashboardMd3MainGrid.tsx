import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@epis2/epis2-ui';
import { copy } from '@epis2/design-system';

export type EpisDashboardMd3MainGridProps = {
  title?: string;
  children: ReactNode;
  bulkActions?: ReactNode;
  testId?: string;
};

/** Superficie principal — grillas compactas con scroll interno controlado. */
export function EpisDashboardMd3MainGrid({
  title,
  children,
  bulkActions,
  testId = 'epis2-dashboard-md3-main-grid',
}: EpisDashboardMd3MainGridProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        px: { xs: 1.5, md: 2 },
        py: 1.5,
        minHeight: '100%',
      }}
    >
      {title ? (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
      ) : null}
      {bulkActions ? (
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} data-testid={`${testId}-bulk`}>
          {bulkActions}
        </Stack>
      ) : null}
      {children}
    </Box>
  );
}

export type DashboardDetailSelection = {
  title: string;
  summary: string;
  patientId?: string;
};

export function EpisDashboardMd3MainGridEmpty({ message }: { message?: string }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {message ?? copy.dashboard.loading}
    </Typography>
  );
}
