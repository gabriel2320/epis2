import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Toolbar, Typography } from '@epis2/epis2-ui';
import { ClinicalAppBarSettingsAction } from '../../layouts/ClinicalAppBarSettingsAction.js';
import { EpisModeSwitcher } from '../modes/EpisModeSwitcher.js';

export type EpisDashboardMd3TopBarProps = {
  clinicianLabel?: string | undefined;
  roleLabel?: string | undefined;
  serviceLabel?: string | undefined;
  timestampLabel?: string | undefined;
  onBackToCommand: () => void;
  onOpenClassicMode?: (() => void) | undefined;
  classicModeDisabled?: boolean | undefined;
  onOpenCommandPalette?: (() => void) | undefined;
  testId?: string | undefined;
};

const FORBIDDEN_ACTIONS = ['firmar', 'aprobar', 'eliminar', 'sign', 'approve', 'delete'] as const;

/** Top bar dashboard — orientación sin actos clínicos irreversibles. */
export function EpisDashboardMd3TopBar({
  clinicianLabel: _clinicianLabel,
  roleLabel: _roleLabel,
  serviceLabel,
  timestampLabel,
  onBackToCommand,
  onOpenClassicMode,
  classicModeDisabled = false,
  onOpenCommandPalette,
  testId = 'epis2-dashboard-md3-top-bar',
}: EpisDashboardMd3TopBarProps) {
  return (
    <Toolbar
      variant="dense"
      data-testid={testId}
      data-epis-forbidden-actions={FORBIDDEN_ACTIONS.join(',')}
      sx={{
        minHeight: 52,
        px: { xs: 1, sm: 2 },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        gap: 1,
        flexWrap: 'wrap',
        rowGap: 1,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mr: 0.5 }}>
        EPIS2
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
        {copy.dashboardMd3.modeLabel}
      </Typography>
      <EpisButton appearance="text" size="small" onClick={onBackToCommand}>
        {copy.dashboardMd3.backToCommand}
      </EpisButton>
      {onOpenClassicMode ? (
        <EpisButton
          appearance="text"
          size="small"
          onClick={onOpenClassicMode}
          disabled={classicModeDisabled}
          data-testid={`${testId}-classic-mode`}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {copy.dashboardMd3.openClassicMode}
        </EpisButton>
      ) : null}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1, minWidth: 0 }}>
        {serviceLabel ? (
          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
            {serviceLabel}
          </Typography>
        ) : null}
      </Stack>
      {timestampLabel ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          {timestampLabel}
        </Typography>
      ) : null}
      {onOpenCommandPalette ? (
        <EpisButton
          appearance="text"
          size="small"
          onClick={onOpenCommandPalette}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {copy.dashboardMd3.commandPalette}
        </EpisButton>
      ) : null}
      <ClinicalAppBarSettingsAction />
      <EpisModeSwitcher compact />
    </Toolbar>
  );
}
