import { lazy, Suspense } from 'react';
import { EpisLoadingState } from '../primitives/EpisLoadingState.js';
import type { EpisTreeViewProps } from './EpisTreeViewCore.js';

const LazyEpisTreeView = lazy(() =>
  import('./EpisTreeViewCore.js').then((m) => ({ default: m.EpisTreeView })),
);

export type EpisTreeViewSuspenseProps = EpisTreeViewProps & {
  loadingLabel?: string;
};

export function EpisTreeViewSuspense({ loadingLabel, ...props }: EpisTreeViewSuspenseProps) {
  return (
    <Suspense
      fallback={loadingLabel ? <EpisLoadingState label={loadingLabel} /> : <EpisLoadingState />}
    >
      <LazyEpisTreeView {...props} />
    </Suspense>
  );
}
