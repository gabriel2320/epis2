import { copy } from '@epis2/design-system';
import { EpisChip } from '../primitives/EpisChip.js';

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  draft: 'default',
  editing: 'info',
  ready_for_review: 'warning',
  rejected: 'error',
  cancelled: 'default',
  approved: 'success',
};

export type EpisDraftStatusProps = {
  status: string;
};

export function EpisDraftStatus({ status }: EpisDraftStatusProps) {
  const label =
    copy.drafts.statusLabels[status as keyof typeof copy.drafts.statusLabels] ?? status;
  return (
    <EpisChip
      label={label}
      size="small"
      color={STATUS_COLOR[status] ?? 'default'}
      data-testid={`epis2-draft-status-${status}`}
    />
  );
}
