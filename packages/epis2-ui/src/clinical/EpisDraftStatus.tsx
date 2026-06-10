import { copy } from '@epis2/design-system';
import { useTheme } from '@mui/material/styles';
import type { ClinicalRoleKey } from '../theme/clinical-roles.js';
import { EpisChip } from '../primitives/EpisChip.js';

/** Estados de borrador → roles clínicos protegidos (no paleta de marca MUI). */
const STATUS_ROLE: Record<string, ClinicalRoleKey | undefined> = {
  draft: 'draft',
  editing: 'draft',
  ready_for_review: 'warning',
  rejected: 'critical',
  cancelled: undefined,
  approved: 'approved',
};

export type EpisDraftStatusProps = {
  status: string;
};

export function EpisDraftStatus({ status }: EpisDraftStatusProps) {
  const theme = useTheme();
  const label = copy.drafts.statusLabels[status as keyof typeof copy.drafts.statusLabels] ?? status;
  const roleKey = STATUS_ROLE[status];
  const role = roleKey ? theme.epis2.clinical[roleKey] : undefined;
  return (
    <EpisChip
      label={label}
      size="small"
      variant="outlined"
      {...(role
        ? {
            sx: {
              bgcolor: role.container,
              color: role.onContainer,
              borderColor: role.main,
              fontWeight: 600,
            },
          }
        : {})}
      data-testid={`epis2-draft-status-${status}`}
    />
  );
}
