import { copy } from '@epis2/design-system';

import {
  Chip,
} from '@epis2/epis2-ui';
const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  draft: 'default',
  editing: 'info',
  ready_for_review: 'warning',
  rejected: 'error',
  cancelled: 'default',
  approved: 'success',
};

export function DraftStatusChip({ status }: { status: string }) {
  const label =
    copy.drafts.statusLabels[status as keyof typeof copy.drafts.statusLabels] ?? status;
  return (
    <Chip
      label={label}
      size="small"
      color={STATUS_COLOR[status] ?? 'default'}
      data-testid={`epis2-draft-status-${status}`}
    />
  );
}
