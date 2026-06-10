import { copy } from '@epis2/design-system';
import {
  EpisButton,
  Stack,
  Toolbar,
  Typography,
} from '@epis2/epis2-ui';
import { EpisModeSwitcher } from '../modes/EpisModeSwitcher.js';

export type EpisClassicMd3TopAppBarProps = {
  patientLabel?: string | undefined;
  clinicianLabel?: string | undefined;
  roleLabel?: string | undefined;
  serviceLabel?: string | undefined;
  timestampLabel?: string | undefined;
  onBackToCommand: () => void;
  onOpenCommandPalette?: (() => void) | undefined;
  connectivityLabel?: string | undefined;
  testId?: string | undefined;
};

/** Top app bar MD3 — orienta, no ejecuta actos clínicos irreversibles. */
export function EpisClassicMd3TopAppBar({
  patientLabel,
  clinicianLabel,
  roleLabel,
  serviceLabel,
  timestampLabel,
  onBackToCommand,
  onOpenCommandPalette,
  connectivityLabel,
  testId = 'epis2-classic-md3-top-bar',
}: EpisClassicMd3TopAppBarProps) {
  return (
    <Toolbar
      variant="dense"
      data-testid={testId}
      sx={{
        minHeight: 52,
        px: { xs: 1, sm: 2 },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        gap: 1,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mr: 1 }}>
        EPIS2
      </Typography>
      <EpisButton appearance="text" size="small" onClick={onBackToCommand}>
        {copy.classicMd3.backToCommand}
      </EpisButton>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1, minWidth: 0 }}>
        {patientLabel ? (
          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
            {patientLabel}
          </Typography>
        ) : null}
        {clinicianLabel ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {clinicianLabel}
          </Typography>
        ) : null}
        {roleLabel ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {roleLabel}
          </Typography>
        ) : null}
        {serviceLabel ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {serviceLabel}
          </Typography>
        ) : null}
      </Stack>
      {timestampLabel ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
          {timestampLabel}
        </Typography>
      ) : null}
      {connectivityLabel ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'block' } }}>
          {connectivityLabel}
        </Typography>
      ) : null}
      {onOpenCommandPalette ? (
        <EpisButton appearance="text" size="small" onClick={onOpenCommandPalette}>
          {copy.classicMd3.commandPalette}
        </EpisButton>
      ) : null}
      <EpisModeSwitcher compact />
    </Toolbar>
  );
}
