import type { CommandResolveResponse as CommandResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Box,
  EpisButton,
  EpisDialog,
  EpisM3Text,
  Stack,
} from '@epis2/epis2-ui';

type CommandConfirmationDialogProps = {
  pending: Extract<CommandResponse, { status: 'needs_confirmation' }> | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/** CE-2: confirmación explícita antes de abrir formularios order/sign. */
export function CommandConfirmationDialog({
  pending,
  onConfirm,
  onCancel,
}: CommandConfirmationDialogProps) {
  return (
    <EpisDialog
      open={pending !== null}
      onClose={onCancel}
      data-testid="epis2-command-confirmation-dialog"
    >
      <Box sx={{ p: 3, minWidth: 320, maxWidth: 480 }}>
        <EpisM3Text role="titleMedium" sx={{ mb: 1 }}>
          {copy.commandCenter.needsConfirmationTitle}
        </EpisM3Text>
        <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {pending?.message}
        </EpisM3Text>
        {pending ? (
          <EpisM3Text role="labelMedium" color="text.secondary" sx={{ mt: 1.5 }}>
            {pending.labelEs}
          </EpisM3Text>
        ) : null}
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2.5 }}>
          <EpisButton onClick={onCancel}>{copy.commandCenter.needsConfirmationCancel}</EpisButton>
          <EpisButton
            variant="contained"
            onClick={onConfirm}
            data-testid="epis2-command-confirm"
          >
            {copy.commandCenter.needsConfirmationConfirm}
          </EpisButton>
        </Stack>
      </Box>
    </EpisDialog>
  );
}
