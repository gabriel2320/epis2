import { Box, epis2PaperChartTokens, epis2PaperFieldLabelSx } from '@epis2/epis2-ui';

export type PaperRuleBlockProps = {
  lines?: number | undefined;
  label?: string | undefined;
  testId?: string | undefined;
};

/** Bloque de líneas pautadas vacías (FichaPapel RuleBlock). */
export function PaperRuleBlock({ lines = 4, label, testId }: PaperRuleBlockProps) {
  const t = epis2PaperChartTokens;

  return (
    <Box data-testid={testId} className="epis2-paper-rule-block" sx={{ py: 0.5 }}>
      {label ? (
        <Box component="span" sx={{ ...epis2PaperFieldLabelSx(), display: 'block', mb: 0.75 }}>
          {label}
        </Box>
      ) : null}
      {Array.from({ length: lines }).map((_, index) => (
        <Box
          key={index}
          sx={{
            borderBottom: `1px solid ${t.ruledLine}`,
            minHeight: 22,
            mb: 0.75,
            fontFamily: t.typography.body,
            fontSize: '12px',
            px: 0.5,
          }}
        >
          {'\u00a0'}
        </Box>
      ))}
    </Box>
  );
}
