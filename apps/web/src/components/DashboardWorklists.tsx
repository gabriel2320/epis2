import type { DashboardWorkResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, Stack } from '@epis2/epis2-ui';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';

export type DashboardWorklistsProps = {
  work: DashboardWorkResponse;
  onOpenDraft: (draftId: string) => void;
};

export function DashboardWorklists({ work, onOpenDraft }: DashboardWorklistsProps) {
  return (
    <Stack spacing={3}>
      <EpisWorkspaceSection title={copy.dashboard.myOpenDrafts} testId="epis2-dashboard-my-drafts">
        <WorklistDraftGrid
          rows={work.myOpenDrafts}
          emptyMessage={copy.dashboard.emptyDrafts}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-dashboard-my-drafts-grid"
        />
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.dashboard.pendingReview} testId="epis2-dashboard-pending-review">
        <WorklistDraftGrid
          rows={work.pendingReview}
          emptyMessage={copy.dashboard.emptyReview}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-dashboard-pending-review-grid"
        />
      </EpisWorkspaceSection>
    </Stack>
  );
}
