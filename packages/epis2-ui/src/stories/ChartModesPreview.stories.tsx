import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Stack,
  Typography,
  epis2PaperDocumentSx,
  epis2TraditionalChartShellSx,
} from '../theme/theme.js';
import { epis2PaperChartTokens, epis2TraditionalChartTokens } from '../theme/chart-modes-tokens.js';

function TraditionalPreview() {
  const t = epis2TraditionalChartTokens;
  return (
    <Box sx={{ ...epis2TraditionalChartShellSx(), p: 2, minHeight: 320 }}>
      <Stack direction="row" spacing={2} sx={{ height: '100%' }}>
        <Box
          sx={{
            width: t.navWidth,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            p: 1,
          }}
        >
          <Typography variant="body2">Resumen</Typography>
          <Typography variant="body2">Medicación</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
          Área central EMR tradicional (demo)
        </Box>
      </Stack>
    </Box>
  );
}

function PaperPreview({ format = 'letter' as 'letter' | 'a5' }) {
  const t = epis2PaperChartTokens;
  return (
    <Box sx={{ p: 2, bgcolor: t.paperCanvasBg }}>
      <Box
        className="epis2-paper-page epis2-paper-chart-print-letter epis2-paper-chart-ruled"
        sx={{ ...epis2PaperDocumentSx(format) }}
      >
        <Box
          sx={{
            bgcolor: t.navyHeader,
            color: t.sectionHeaderColor,
            px: 2,
            py: 1.5,
            borderBottom: `3px solid ${t.navyMid}`,
            fontFamily: t.typography.institution,
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          I. Carátula — EPIS2 demo
        </Box>
        <Box sx={{ px: 2, py: 2, minHeight: 120, fontFamily: t.typography.body, fontSize: '12px' }}>
          Documento clínico editable — {format === 'letter' ? 'Carta' : 'A5'}
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            mt: 0,
            px: 2,
            py: 0.75,
            bgcolor: t.paperBgAlt,
            borderTop: `1px solid ${t.ruledLine}`,
            fontFamily: t.typography.label,
            fontSize: '9px',
            color: t.paperMuted,
          }}
        >
          <span>Confidencial — demo</span>
          <span style={{ fontFamily: t.typography.body }}>p. 1/3</span>
        </Stack>
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Ficha/Modos dual ADR-002',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const TraditionalEhr: StoryObj = {
  render: () => <TraditionalPreview />,
};

export const PaperDocumentLetter: StoryObj = {
  render: () => <PaperPreview format="letter" />,
};

export const PaperDocumentA5: StoryObj = {
  render: () => <PaperPreview format="a5" />,
};

/** Alias legacy Storybook */
export const PaperDocument: StoryObj = {
  render: () => <PaperPreview format="letter" />,
};

export const PaperA5: StoryObj = {
  render: () => <PaperPreview format="a5" />,
};
