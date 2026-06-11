import { Box, epis2PaperInstitutionalHeaderSx, epis2PaperChartTokens } from '@epis2/epis2-ui';
import { copy } from '@epis2/design-system';

export type PaperInstitutionalHeaderProps = {
  serviceUnit?: string | undefined;
  recordNumber: string;
  testId?: string | undefined;
};

/** Cabecera institucional documento papel — referencia FichaPapel. */
export function PaperInstitutionalHeader({
  serviceUnit,
  recordNumber,
  testId = 'epis2-paper-institutional-header',
}: PaperInstitutionalHeaderProps) {
  const t = epis2PaperChartTokens;
  const serviceLine = serviceUnit ?? copy.chartModes.shellServiceDefault;

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2PaperInstitutionalHeaderSx(),
        px: { xs: 2, md: 3.5 },
        py: 1.75,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          bgcolor: '#fff',
          borderRadius: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <rect x="11" y="2" width="6" height="24" rx="1" fill={t.navyHeader} />
          <rect x="2" y="11" width="24" height="6" rx="1" fill={t.navyHeader} />
        </svg>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            fontFamily: t.typography.institution,
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            lineHeight: 1.3,
          }}
        >
          {copy.chartModes.paperInstitutionName}
        </Box>
        <Box
          sx={{
            fontFamily: t.typography.label,
            fontSize: '10px',
            opacity: 0.85,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {serviceLine} · {copy.chartModes.paperSystemLine}
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.3)',
          px: 1.5,
          py: 0.75,
          borderRadius: 0.5,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            fontFamily: t.typography.institution,
            fontSize: '10px',
            opacity: 0.75,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {copy.chartModes.paperFormLabel}
        </Box>
        <Box
          sx={{
            fontFamily: t.typography.body,
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          Nº {recordNumber}
        </Box>
      </Box>
    </Box>
  );
}
