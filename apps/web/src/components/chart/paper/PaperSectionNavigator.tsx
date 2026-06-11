import { copy } from '@epis2/design-system';
import { Box, epis2PaperChartTokens, epis2PaperNavTabSx } from '@epis2/epis2-ui';
import {
  PAPER_CHART_SECTION_IDS,
  paperChartSectionLabel,
  type PaperChartSectionId,
} from './paperChartSections.js';

export type PaperSectionNavigatorProps = {
  activeSectionId: PaperChartSectionId;
  onSectionSelect: (sectionId: PaperChartSectionId) => void;
  aiPendingSections?: Partial<Record<PaperChartSectionId, boolean>> | undefined;
  testId?: string | undefined;
};

/** Índice lateral I–VII — pestañas documento (FichaPapel). */
export function PaperSectionNavigator({
  activeSectionId,
  onSectionSelect,
  aiPendingSections,
  testId = 'epis2-paper-section-navigator',
}: PaperSectionNavigatorProps) {
  const t = epis2PaperChartTokens;

  return (
    <Box
      component="nav"
      aria-label={copy.chartModes.paperNavAria}
      data-testid={testId}
      className="epis2-paper-chart-no-print"
      sx={{
        width: { xs: '100%', md: 220 },
        flexShrink: 0,
        borderRight: { md: `1px solid ${t.ruledLine}` },
        bgcolor: { md: t.paperBgAlt },
        px: { xs: 1, md: 0 },
        py: { xs: 1, md: 0 },
        overflow: 'auto',
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          fontFamily: t.typography.label,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: t.paperMuted,
          fontSize: '11px',
          px: 1.5,
          py: 1.25,
          borderBottom: `1px solid ${t.ruledLine}`,
        }}
      >
        {copy.chartModes.paperNavTitle}
      </Box>
      {PAPER_CHART_SECTION_IDS.map((sectionId) => {
        const active = sectionId === activeSectionId;
        const aiPending = aiPendingSections?.[sectionId];
        return (
          <Box
            key={sectionId}
            component="button"
            type="button"
            data-testid={`epis2-paper-nav-${sectionId}`}
            aria-current={active ? 'true' : undefined}
            onClick={() => onSectionSelect(sectionId)}
            sx={{
              ...epis2PaperNavTabSx(active),
              display: 'block',
              width: { xs: 'auto', md: '100%' },
              textAlign: 'left',
              border: 0,
              cursor: 'pointer',
              px: 1.75,
              py: 1.125,
              borderRight: { xs: `1px solid ${t.ruledLine}`, md: 'none' },
              whiteSpace: 'nowrap',
            }}
          >
            {paperChartSectionLabel(sectionId)}
            {aiPending ? (
              <Box component="span" sx={{ ml: 0.5, opacity: 0.85, fontSize: '10px' }}>
                · IA
              </Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}
