import { copy } from '@epis2/design-system';
import { EpisButton, EpisDialog, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import { hasUnsavedClinicalWork } from '../../modes/modeTransitionSafety.js';
import { EPIS_MODES, type EpisMode } from '../../modes/episModes.js';
import { useEpisSession } from '../../session/EpisSessionContext.js';

export type EpisModeSwitcherProps = {
  compact?: boolean;
  testId?: string;
};

/** Conmutador global de modos — máximo 3 opciones visibles. */
export function EpisModeSwitcher({
  compact = false,
  testId = 'epis2-mode-switcher',
}: EpisModeSwitcherProps) {
  const session = useEpisSession();
  const [pendingMode, setPendingMode] = useState<EpisMode | null>(null);

  const disabledReason = (mode: EpisMode): string | undefined => {
    if (mode === 'classic' && !session.canOpenClassic) {
      return copy.threeModes.classicRequiresPatient;
    }
    if (mode === 'dashboard' && !session.canOpenDashboard) {
      return copy.threeModes.dashboardPermissionDenied;
    }
    return undefined;
  };

  const applyMode = (mode: EpisMode) => {
    session.setActiveMode(mode);
  };

  const onSelect = (mode: EpisMode) => {
    if (mode === session.activeMode) return;
    if (hasUnsavedClinicalWork()) {
      setPendingMode(mode);
      return;
    }
    applyMode(mode);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        data-testid={testId}
        sx={{ flexShrink: 0 }}
      >
        {!compact ? (
          <Stack
            component="span"
            sx={{
              mr: 0.5,
              display: { xs: 'none', sm: 'inline' },
              typography: 'caption',
              color: 'text.secondary',
            }}
          >
            {copy.threeModes.switcherLabel}
          </Stack>
        ) : null}
        {EPIS_MODES.map((mode) => {
          const active = session.activeMode === mode;
          const reason = disabledReason(mode);
          const disabled = mode !== 'command' && Boolean(reason);
          const label =
            mode === 'command'
              ? copy.threeModes.commandLabel
              : mode === 'classic'
                ? copy.threeModes.classicLabel
                : copy.threeModes.dashboardLabel;

          return (
            <EpisButton
              key={mode}
              appearance={active ? 'filled' : 'text'}
              size="small"
              disabled={disabled}
              title={reason}
              onClick={() => onSelect(mode)}
              data-testid={`${testId}-${mode}`}
              sx={{ minWidth: compact ? 0 : undefined, px: compact ? 1 : undefined }}
            >
              {compact ? label.split(' ')[0] : label}
            </EpisButton>
          );
        })}
      </Stack>

      <EpisDialog
        open={pendingMode !== null}
        onClose={() => setPendingMode(null)}
        data-testid="epis2-mode-transition-unsaved-dialog"
      >
        <Stack spacing={2} sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="h6">{copy.threeModes.unsavedTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {copy.threeModes.unsavedBody}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <EpisButton appearance="text" onClick={() => setPendingMode(null)}>
              {copy.threeModes.unsavedCancel}
            </EpisButton>
            <EpisButton
              appearance="filled"
              onClick={() => {
                if (pendingMode) applyMode(pendingMode);
                setPendingMode(null);
              }}
            >
              {copy.threeModes.unsavedConfirm}
            </EpisButton>
          </Stack>
        </Stack>
      </EpisDialog>
    </>
  );
}
