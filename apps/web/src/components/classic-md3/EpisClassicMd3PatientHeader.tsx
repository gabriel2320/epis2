import { copy } from '@epis2/design-system';
import { Chip, Stack, Typography } from '@epis2/epis2-ui';

export type EpisClassicMd3PatientHeaderProps = {
  displayName?: string;
  metaLine?: string;
  allergyLabels?: readonly string[];
  alertLabels?: readonly string[];
  episodeLabel?: string;
  testId?: string;
};

/** Header clínico compacto — máx. 2 líneas, siempre visible. */
export function EpisClassicMd3PatientHeader({
  displayName,
  metaLine,
  allergyLabels = [],
  alertLabels = [],
  episodeLabel,
  testId = 'epis2-classic-md3-patient-header',
}: EpisClassicMd3PatientHeaderProps) {
  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{
        minHeight: 64,
        maxHeight: 72,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: { xs: '100%', md: '40%' } }}>
        {displayName ?? copy.classicMd3.noPatient}
      </Typography>
      {metaLine ? (
        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 320 }}>
          {metaLine}
        </Typography>
      ) : null}
      {episodeLabel ? <Chip size="small" variant="outlined" label={episodeLabel} /> : null}
      {allergyLabels.slice(0, 3).map((label) => (
        <Chip key={label} size="small" color="warning" variant="outlined" label={label} />
      ))}
      {alertLabels.slice(0, 2).map((label) => (
        <Chip key={label} size="small" color="error" variant="outlined" label={label} />
      ))}
    </Stack>
  );
}
