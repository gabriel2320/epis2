import { lazy, Suspense } from 'react';
import { EpisLoadingState } from '../primitives/EpisLoadingState.js';
import type { EpisDataGridProps } from './EpisDataGridCore.js';

const LazyEpisDataGrid = lazy(() =>
  import('./EpisDataGridCore.js').then((m) => ({ default: m.EpisDataGrid })),
);

export type EpisDataGridSuspenseProps = EpisDataGridProps;

export function EpisDataGridSuspense(props: EpisDataGridSuspenseProps) {
  const { loadingLabel, ...gridProps } = props;
  return (
    <Suspense
      fallback={loadingLabel ? <EpisLoadingState label={loadingLabel} /> : <EpisLoadingState />}
    >
      <LazyEpisDataGrid {...gridProps} />
    </Suspense>
  );
}
