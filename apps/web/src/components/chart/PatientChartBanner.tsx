import { copy } from '@epis2/design-system';
import { Box, Chip, Stack, Typography } from '@epis2/epis2-ui';

export type PatientChartBannerProps = {
  displayName: string;
  metaLine?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  testId?: string | undefined;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

/** Banner superior de paciente — ADR-002 ClinicalShell. */
export function PatientChartBanner({
  displayName,
  metaLine,
  allergyLabels = [],
  testId = 'epis2-patient-chart-banner',
}: PatientChartBannerProps) {
  return (
    <Stack
      data-testid={testId}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        minHeight: 72,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
        }}
      >
        {initials(displayName)}
      </Box>
      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h6" fontWeight={600} noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {metaLine ?? copy.chartModes.bannerMeta}
        </Typography>
      </Stack>
      {allergyLabels.slice(0, 4).map((label) => (
        <Chip key={label} size="small" color="warning" variant="outlined" label={label} />
      ))}
    </Stack>
  );
}
