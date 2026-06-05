import { copy } from '@epis2/design-system';
import { EpisAlert } from '../primitives/EpisAlert.js';
import { EpisButton } from '../primitives/EpisButton.js';
import Stack from '@mui/material/Stack';
export type EpisApprovalGateProps = {
  status: string;
  canEdit: boolean;
  canApprove: boolean;
  showSendToReview: boolean;
  onSendToReview?: () => void;
  onApprove?: () => void;
  message?: string;
};

/**
 * Puerta de aprobación humana — transiciones de borrador auditadas.
 */
export function EpisApprovalGate({
  status,
  canEdit,
  canApprove,
  showSendToReview,
  onSendToReview,
  onApprove,
  message,
}: EpisApprovalGateProps) {
  const approvable = canApprove && ['draft', 'editing', 'ready_for_review'].includes(status);

  return (
    <Stack spacing={2} data-testid="epis2-approval-gate">
      <EpisAlert severity="warning" variant="outlined">
        {copy.drafts.approvalDisclaimer}
      </EpisAlert>

      {canEdit && showSendToReview ? (
        <EpisButton variant="outlined" onClick={onSendToReview}>
          {copy.drafts.sendToReview}
        </EpisButton>
      ) : null}

      {approvable ? (
        <EpisButton
          variant="contained"
          color="primary"
          onClick={onApprove}
          data-testid="epis2-draft-approve"
        >
          {copy.drafts.approveHuman}
        </EpisButton>
      ) : null}

      {message ? (
        <EpisAlert severity="success" data-testid="epis2-draft-review-message">
          {message}
        </EpisAlert>
      ) : null}
    </Stack>
  );
}
