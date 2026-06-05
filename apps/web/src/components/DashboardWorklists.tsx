import type { DashboardWorkResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Paper, Stack, Typography } from '@epis2/epis2-ui';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';

export type DashboardWorklistsProps = {
  work: DashboardWorkResponse;
  onOpenDraft: (draftId: string) => void;
};

export function DashboardWorklists({ work, onOpenDraft }: DashboardWorklistsProps) {
  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-my-drafts">
        <Typography variant="subtitle2" gutterBottom>
          {copy.dashboard.myOpenDrafts}
        </Typography>
        <WorklistDraftGrid
          rows={work.myOpenDrafts}
          emptyMessage={copy.dashboard.emptyDrafts}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-dashboard-my-drafts-grid"
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-pending-review">
        <Typography variant="subtitle2" gutterBottom>
          {copy.dashboard.pendingReview}
        </Typography>
        <WorklistDraftGrid
          rows={work.pendingReview}
          emptyMessage={copy.dashboard.emptyReview}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-dashboard-pending-review-grid"
        />
      </Paper>
    </Stack>
  );
}
