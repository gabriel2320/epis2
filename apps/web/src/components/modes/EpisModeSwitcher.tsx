import { copy } from '@epis2/design-system';
import {
  Alert,
  AssignmentIcon,
  DashboardIcon,
  EpisButton,
  EpisDialog,
  Stack,
  TerminalIcon,
  Typography,
} from '@epis2/epis2-ui';
import type { ElementType } from 'react';
import { useState } from 'react';
import { hasUnsavedClinicalWork } from '../../modes/modeTransitionSafety.js';
import { EPIS_MODES, type EpisMode } from '../../modes/episModes.js';
import { useEpisSession } from '../../session/EpisSessionContext.js';

const MODE_META: Record<
  EpisMode,
  { label: string; Icon: ElementType<{ fontSize?: 'small' | 'medium' | 'inherit' }> }
> = {
  command: { label: copy.threeModes.commandLabel, Icon: TerminalIcon },
  classic: { label: copy.threeModes.classicLabel, Icon: AssignmentIcon },
  dashboard: { label: copy.threeModes.dashboardLabel, Icon: DashboardIcon },
};

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
      <Stack spacing={0.5} data-testid={testId} sx={{ flexShrink: 0 }}>
        <Alert
          severity="warning"
          variant="outlined"
          data-testid="epis2-mode-switcher-deprecated-banner"
          sx={{ display: { xs: 'none', md: 'flex' }, py: 0, typography: 'caption' }}
        >
          {copy.threeModes.deprecatedModesBanner}
        </Alert>
        <Stack direction="row" spacing={0.5} alignItems="center">
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
            const { label, Icon } = MODE_META[mode];
            const shortLabel = label.split(' ')[0] ?? label;

            return (
              <EpisButton
                key={mode}
                appearance={active ? 'filled' : 'text'}
                size="small"
                disabled={disabled}
                title={reason ?? label}
                onClick={() => onSelect(mode)}
                data-testid={`${testId}-${mode}`}
                startIcon={<Icon fontSize="small" />}
                sx={{
                  minWidth: compact ? 40 : undefined,
                  px: compact ? { xs: 1, md: 1.5 } : undefined,
                  '& .epis-mode-label': {
                    display: compact ? { xs: 'none', md: 'inline' } : 'inline',
                  },
                }}
              >
                <span className="epis-mode-label">{compact ? shortLabel : label}</span>
              </EpisButton>
            );
          })}
        </Stack>
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
