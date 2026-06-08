import type { ReactNode } from 'react';
import { Stack } from '@epis2/epis2-ui';
import { useRadTabIndex } from '../../design/useRadTabIndex.js';
import { EpisRadScreenShell } from './EpisRadScreenShell.js';

export type EpisRadFormSurfaceProps = {
  title?: ReactNode;
  commandBar?: ReactNode;
  actionBar: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Superficie Form — campos + ActionBar única + TabIndex lógico. */
export function EpisRadFormSurface({
  title,
  commandBar,
  actionBar,
  children,
  testId = 'epis2-rad-form',
}: EpisRadFormSurfaceProps) {
  const { next } = useRadTabIndex('formFields');

  return (
    <EpisRadScreenShell
      surface="form"
      {...(commandBar ? { commandBar } : {})}
      actionBar={actionBar}
      testId={testId}
    >
      <Stack spacing={2} sx={{ width: '100%' }} data-epis-rad-tabindex-base={next()}>
        {title}
        {children}
      </Stack>
    </EpisRadScreenShell>
  );
}
