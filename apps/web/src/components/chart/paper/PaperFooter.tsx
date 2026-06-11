import { copy } from '@epis2/design-system';
import { Box, epis2PaperChartTokens, epis2PaperFooterSx } from '@epis2/epis2-ui';

export type PaperFooterProps = {
  page?: number | undefined;
  totalPages?: number | undefined;
  recordNumber?: string | undefined;
  testId?: string | undefined;
};

/** Pie legal modo papel — fondo marfil oscuro + p. N/M (FichaPapel). */
export function PaperFooter({
  page = 1,
  totalPages = 1,
  recordNumber,
  testId = 'epis2-paper-footer',
}: PaperFooterProps) {
  const t = epis2PaperChartTokens;
  const pageLabel = `p. ${page}/${totalPages}`;

  return (
    <Box
      data-testid={testId}
      className="epis2-paper-chart-footer epis2-paper-page-footer"
      sx={{
        ...epis2PaperFooterSx(),
        px: 2.5,
        py: 0.75,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        breakInside: 'avoid-page',
      }}
    >
      <Box
        sx={{
          fontFamily: t.typography.label,
          fontSize: '9px',
          letterSpacing: '0.06em',
          color: t.paperMuted,
        }}
      >
        {copy.chartModes.footerConfidential}
      </Box>
      <Box
        data-testid={`${testId}-page`}
        sx={{
          fontFamily: t.typography.body,
          fontSize: '9px',
          color: t.paperMuted,
        }}
      >
        {recordNumber ? `Ficha Nº ${recordNumber} · ` : ''}
        {pageLabel}
      </Box>
    </Box>
  );
}
