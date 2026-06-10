import type { ReactNode } from 'react';
import { EpisRadGridSurface } from './EpisRadGridSurface.js';

export type EpisRadDashboardTabShellProps = {
  hero?: ReactNode;
  bulkActions?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Tab dashboard — un bloque hero + grid compacto (MF-RAD-M3-A). */
export function EpisRadDashboardTabShell({
  hero,
  bulkActions,
  children,
  testId,
}: EpisRadDashboardTabShellProps) {
  return (
    <EpisRadGridSurface
      bulkActions={bulkActions}
      {...(testId !== undefined ? { testId } : {})}
    >
      {hero}
      {children}
    </EpisRadGridSurface>
  );
}
