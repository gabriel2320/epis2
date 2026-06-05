import { copy } from '@epis2/design-system';
import { EpisLoadingState } from '@epis2/epis2-ui';
import { lazy, Suspense } from 'react';

const LazyDashboardModeContent = lazy(() =>
  import('../dashboard/DashboardModeContent.js').then((m) => ({
    default: m.DashboardModeContent,
  })),
);

export function DashboardModePage() {
  return (
    <Suspense fallback={<EpisLoadingState label={copy.dashboard.loading} />}>
      <LazyDashboardModeContent />
    </Suspense>
  );
}
