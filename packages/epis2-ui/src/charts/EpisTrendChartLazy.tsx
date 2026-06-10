import { lazy, Suspense } from 'react';
import { EpisLoadingState } from '../primitives/EpisLoadingState.js';
import type { EpisTrendChartProps } from './EpisTrendChartCore.js';

const LazyEpisTrendChart = lazy(() =>
  import('./EpisTrendChartCore.js').then((m) => ({ default: m.EpisTrendChart })),
);

export type EpisTrendChartSuspenseProps = EpisTrendChartProps & {
  loadingLabel?: string;
};

export function EpisTrendChartSuspense({ loadingLabel, ...props }: EpisTrendChartSuspenseProps) {
  return (
    <Suspense
      fallback={loadingLabel ? <EpisLoadingState label={loadingLabel} /> : <EpisLoadingState />}
    >
      <LazyEpisTrendChart {...props} />
    </Suspense>
  );
}
