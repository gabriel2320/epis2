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

function PaperPreview() {
  const t = epis2PaperChartTokens;
  return (
    <Box sx={{ p: 2, bgcolor: epis2TraditionalChartTokens.shellBg }}>
      <Box sx={{ ...epis2PaperDocumentSx('letter'), p: 3 }}>
        <Box
          sx={{ bgcolor: t.navyHeader, color: t.sectionHeaderColor, p: 2, mb: 2, borderRadius: 1 }}
        >
          I. Carátula — EPIS2 demo
        </Box>
        <Typography variant="body2">Documento clínico editable — Carta</Typography>
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

export const PaperDocument: StoryObj = {
  render: () => <PaperPreview />,
};

export const PaperA5: StoryObj = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ ...epis2PaperDocumentSx('a5'), p: 2 }}>Vista A5 demo</Box>
    </Box>
  ),
};
