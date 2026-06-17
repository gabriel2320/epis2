import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EpisDraftStatus } from '../clinical/EpisDraftStatus.js';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';
import { cicaTokens } from './cicaTokens.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

export type CicaPatientIdentityBandProps = {
  displayName: string;
  metaLine?: string | undefined;
  ageYears?: number | undefined;
  sexLabel?: string | undefined;
  serviceUnit?: string | undefined;
  bedLabel?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  documentStatus?: 'draft' | 'signed' | 'locked' | undefined;
  testId?: string;
};

/** Banda identidad — tabular, siempre visible en ficha CICA. */
export function CicaPatientIdentityBand({
  displayName,
  metaLine,
  ageYears,
  sexLabel,
  serviceUnit,
  bedLabel,
  allergyLabels = [],
  documentStatus = 'draft',
  testId = 'cica-patient-identity-band',
}: CicaPatientIdentityBandProps) {
  const { isDark } = useCicaThemeTokens();
  const demoDraft =
    documentStatus === 'signed' ? 'approved' : documentStatus === 'draft' ? 'draft' : undefined;

  return (
    <Box
      data-testid={testId}
      data-cica-identity-band="epis2g"
      sx={{
        flexShrink: 0,
        px: cicaTokens.shellPaddingX,
        py: 1.5,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.paper',
        minWidth: 0,
        overflowX: 'hidden',
        boxShadow: 1,
      }}
    >
      <Stack spacing={0.75} sx={{ mb: 1 }}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
          <Typography
            variant="caption"
            sx={{
              fontFamily: cicaEpis2gVisual.fontMono,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          >
            Ficha clínica
          </Typography>
          <Chip
            size="small"
            label="EMR clásico"
            sx={{
              height: 18,
              fontFamily: cicaEpis2gVisual.fontMono,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe',
              color: isDark ? cicaEpis2gVisual.accentLabelDark : cicaEpis2gVisual.accentLabel,
            }}
          />
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 1.5 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        useFlexGap
      >
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: { xs: 'normal', md: 'nowrap' },
            }}
          >
            {displayName}
            {ageYears !== undefined ? ` · ${ageYears} años` : ''}
            {sexLabel ? ` · ${sexLabel}` : ''}
          </Typography>
          {metaLine ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: { xs: 'normal', md: 'nowrap' },
              }}
            >
              {metaLine}
            </Typography>
          ) : null}
        </Stack>
        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
          sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 0 }}
        >
          {serviceUnit ? <Chip size="small" label={serviceUnit} variant="outlined" /> : null}
          {bedLabel ? <Chip size="small" label={bedLabel} variant="filled" /> : null}
          {allergyLabels.slice(0, 2).map((a) => (
            <Chip key={a} size="small" color="warning" label={a} variant="outlined" />
          ))}
          {demoDraft ? <EpisDraftStatus status={demoDraft} /> : null}
        </Stack>
      </Stack>
    </Box>
  );
}
