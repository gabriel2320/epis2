import { copy } from '@epis2/design-system';
import {
  Box,
  EpisM3Text,
  EpisTextField,
  Stack,
  Typography,
  epis2PaperChartTokens,
  epis2PaperDocumentSx,
} from '@epis2/epis2-ui';
import {
  EMPTY_PAPER_CHART_DRAFT,
  PAPER_CHART_SECTION_IDS,
  paperChartSectionLabel,
  type PaperChartSectionId,
} from './paperChartSections.js';
import './paperChartPrint.css';

export type PaperChartTemplateProps = {
  values?: Partial<Record<PaperChartSectionId, string>> | undefined;
  onSectionChange?: ((id: PaperChartSectionId, value: string) => void) | undefined;
  printFormat?: 'letter' | 'a5' | undefined;
  patientName?: string | undefined;
  recordNumber?: string | undefined;
  testId?: string | undefined;
};

/** Plantilla ficha papel — 7 secciones institucionales (ADR-002). */
export function PaperChartTemplate({
  values = {},
  onSectionChange,
  printFormat = 'letter',
  patientName = 'Paciente demo',
  recordNumber = '0000000',
  testId = 'epis2-paper-chart-template',
}: PaperChartTemplateProps) {
  const merged = { ...EMPTY_PAPER_CHART_DRAFT, ...values };
  const t = epis2PaperChartTokens;
  const printClass =
    printFormat === 'a5' ? 'epis2-paper-chart-print-a5' : 'epis2-paper-chart-print-letter';

  return (
    <Box
      data-testid={testId}
      className={printClass}
      sx={{
        ...epis2PaperDocumentSx(printFormat),
        '--epis2-paper-ruled-line': t.ruledLine,
      }}
    >
      <Box
        sx={{
          bgcolor: t.navyHeader,
          color: t.sectionHeaderColor,
          px: 3,
          py: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {copy.chartModes.institutionLine}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {patientName} · Ficha {recordNumber}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.75 }}>
          {copy.chartModes.draftNotice}
        </Typography>
      </Box>

      <Stack spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
        {PAPER_CHART_SECTION_IDS.map((sectionId) => (
          <Box
            key={sectionId}
            className="epis2-paper-chart-section"
            data-testid={`epis2-paper-section-${sectionId}`}
          >
            <EpisM3Text
              role="titleMedium"
              component="h3"
              sx={{
                bgcolor: t.sectionHeaderBg,
                color: t.sectionHeaderColor,
                px: 2,
                py: 0.75,
                borderRadius: 1,
                mb: 1.5,
              }}
            >
              {paperChartSectionLabel(sectionId)}
            </EpisM3Text>
            <Box className="epis2-paper-chart-ruled" sx={{ px: 1, py: 0.5 }}>
              <EpisTextField
                multiline
                minRows={sectionId === 'cover' ? 3 : 5}
                fullWidth
                label={paperChartSectionLabel(sectionId)}
                value={merged[sectionId]}
                onChange={(e) => onSectionChange?.(sectionId, e.target.value)}
                slotProps={{
                  htmlInput: {
                    'data-testid': `epis2-paper-field-${sectionId}`,
                    'aria-label': paperChartSectionLabel(sectionId),
                  },
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
