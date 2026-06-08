import type { ReactNode } from 'react';
import { Stack } from '@epis2/epis2-ui';
import { EpisRadScreenShell } from './EpisRadScreenShell.js';

export type EpisRadGridSurfaceProps = {
  toolbar?: ReactNode;
  bulkActions?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Superficie Grid — toolbar compacto + acciones masivas bajo demanda. */
export function EpisRadGridSurface({
  toolbar,
  bulkActions,
  children,
  testId = 'epis2-rad-grid',
}: EpisRadGridSurfaceProps) {
  return (
    <EpisRadScreenShell surface="grid" testId={testId}>
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {toolbar}
        {bulkActions}
        {children}
      </Stack>
    </EpisRadScreenShell>
  );
}
