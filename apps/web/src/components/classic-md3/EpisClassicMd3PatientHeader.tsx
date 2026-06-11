import { copy } from '@epis2/design-system';
import { Box, Chip, Stack, Typography } from '@epis2/epis2-ui';

function patientInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export type EpisClassicMd3PatientHeaderProps = {
  displayName?: string | undefined;
  metaLine?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  alertLabels?: readonly string[] | undefined;
  episodeLabel?: string | undefined;
  testId?: string | undefined;
};

/** Header clínico compacto — avatar + máx. 2 líneas, siempre visible. */
export function EpisClassicMd3PatientHeader({
  displayName,
  metaLine,
  allergyLabels = [],
  alertLabels = [],
  episodeLabel,
  testId = 'epis2-classic-md3-patient-header',
}: EpisClassicMd3PatientHeaderProps) {
  const name = displayName ?? copy.classicMd3.noPatient;

  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1.5}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 3,
        minHeight: 64,
        maxHeight: 72,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'outlineVariant',
        bgcolor: 'surfaceContainerHigh',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {patientInitials(name)}
      </Box>
      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {name}
        </Typography>
        {metaLine ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {metaLine}
          </Typography>
        ) : null}
      </Stack>
      {episodeLabel ? <Chip size="small" variant="outlined" label={episodeLabel} /> : null}
      {allergyLabels.slice(0, 3).map((label) => (
        <Chip
          key={label}
          size="small"
          variant="filled"
          label={label}
          sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}
        />
      ))}
      {alertLabels.slice(0, 2).map((label) => (
        <Chip
          key={label}
          size="small"
          variant="filled"
          label={label}
          sx={{ bgcolor: 'error.light', color: 'error.dark' }}
        />
      ))}
    </Stack>
  );
}
