import { copy } from '@epis2/design-system';
import { Box, Typography } from '@epis2/epis2-ui';

export type PaperFooterProps = {
  page?: number | undefined;
  totalPages?: number | undefined;
  testId?: string | undefined;
};

/** Pie legal modo papel — página N/M (MF-DUAL-CHART-06). */
export function PaperFooter({
  page = 1,
  totalPages = 7,
  testId = 'epis2-paper-footer',
}: PaperFooterProps) {
  return (
    <Box
      data-testid={testId}
      className="epis2-paper-chart-no-print"
      sx={{
        mt: 2,
        pt: 1,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      <Typography variant="caption">{copy.chartModes.footerConfidential}</Typography>
      <Typography variant="caption" data-testid={`${testId}-page`}>
        p. {page}/{totalPages}
      </Typography>
    </Box>
  );
}
