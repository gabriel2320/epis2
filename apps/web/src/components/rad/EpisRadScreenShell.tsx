import type { ReactNode } from 'react';
import { EpisClinicalWorkspaceShell } from '../layout/EpisClinicalWorkspaceShell.js';
import type { EpisRadSurface } from '../../design/radDiscipline.js';

export type EpisRadScreenShellProps = {
  surface: EpisRadSurface;
  commandBar?: ReactNode;
  actionBar?: ReactNode;
  supportingPane?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/**
 * Selector de superficie RAD — delega layout sin lógica clínica.
 */
export function EpisRadScreenShell({
  surface,
  commandBar,
  actionBar,
  supportingPane,
  children,
  testId = 'epis2-rad-screen-shell',
}: EpisRadScreenShellProps) {
  const screenKind =
    surface === 'form' ? 'form' : surface === 'document' ? 'document' : 'workspace';

  return (
    <EpisClinicalWorkspaceShell
      screenKind={screenKind}
      {...(commandBar ? { commandBar } : {})}
      {...(actionBar ? { actionBar } : {})}
      {...(supportingPane ? { supportingPane } : {})}
      testId={testId}
    >
      {children}
    </EpisClinicalWorkspaceShell>
  );
}
