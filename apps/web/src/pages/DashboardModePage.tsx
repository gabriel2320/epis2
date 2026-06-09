import { copy } from '@epis2/design-system';
import { EpisLoadingState } from '@epis2/epis2-ui';
import { lazy, Suspense } from 'react';
import { EpisModeGuard } from '../modes/EpisModeGuard.js';

const LazyDashboardModeContent = lazy(() =>
  import('../dashboard/DashboardModeContent.js').then((m) => ({
    default: m.DashboardModeContent,
  })),
);

export function DashboardModePage() {
  return (
    <EpisModeGuard enforceDashboardPermission>
      <Suspense fallback={<EpisLoadingState label={copy.dashboard.loading} />}>
        <LazyDashboardModeContent />
      </Suspense>
    </EpisModeGuard>
  );
}
