import type { ReactNode } from 'react';
import { Stack } from '@epis2/epis2-ui';
import { EpisRadScreenShell } from './EpisRadScreenShell.js';

export type EpisRadDocumentSurfaceProps = {
  actionBar: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Superficie Document — vista legible + ActionBar única (sin iconos decorativos). */
export function EpisRadDocumentSurface({
  actionBar,
  children,
  testId = 'epis2-rad-document',
}: EpisRadDocumentSurfaceProps) {
  return (
    <EpisRadScreenShell surface="document" actionBar={actionBar} testId={testId}>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
        {children}
      </Stack>
    </EpisRadScreenShell>
  );
}
