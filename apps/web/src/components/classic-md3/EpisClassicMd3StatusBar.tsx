import { copy } from '@epis2/design-system';
import { Stack, Typography } from '@epis2/epis2-ui';

export type EpisClassicMd3StatusBarProps = {
  draftStatusLabel?: string;
  lastSavedLabel?: string;
  userLabel?: string;
  roleLabel?: string;
  aiStatusLabel?: string;
  dbStatusLabel?: string;
  environmentLabel?: string;
  lastAuditLabel?: string;
  testId?: string;
};

/** Barra de estado compacta — sin botones clínicos principales. */
export function EpisClassicMd3StatusBar({
  draftStatusLabel,
  lastSavedLabel,
  userLabel,
  roleLabel,
  aiStatusLabel,
  dbStatusLabel,
  environmentLabel,
  lastAuditLabel,
  testId = 'epis2-classic-md3-status-bar',
}: EpisClassicMd3StatusBarProps) {
  const parts = [
    copy.classicMd3.modeLabel,
    draftStatusLabel,
    lastSavedLabel,
    userLabel,
    roleLabel,
    aiStatusLabel,
    dbStatusLabel,
    environmentLabel,
    lastAuditLabel,
  ].filter(Boolean);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      flexWrap="wrap"
      useFlexGap
      data-testid={testId}
      sx={{
        minHeight: 32,
        px: 2,
        py: 0.5,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        alignItems: 'center',
      }}
    >
      {parts.map((part) => (
        <Typography key={part} variant="caption" color="text.secondary">
          {part}
        </Typography>
      ))}
    </Stack>
  );
}
