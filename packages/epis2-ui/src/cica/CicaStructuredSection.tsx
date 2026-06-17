import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import { CicaSectionBlock } from './CicaSectionBlock.js';
import {
  findEpis2gScreenStructure,
  type CicaEpis2gShell,
  type CicaEpis2gBlock,
} from './cicaEpis2gScreenStructure.js';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';
import type { CicaScreenId } from './cicaRoutes.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

export type CicaStructuredSectionProps = {
  screenId: CicaScreenId;
  /** Contenido por block.id — si falta, usa placeholder. */
  blocks?: Partial<Record<string, ReactNode>>;
  placeholder?: ReactNode;
  testId?: string;
};

function shellSx(shell: CicaEpis2gShell, canvas: string) {
  if (shell === 'patient-letter') {
    return {
      bgcolor: canvas,
      display: 'flex',
      justifyContent: 'center',
      py: 3,
      px: 2,
    } as const;
  }
  if (shell === 'system-workspace') {
    return { bgcolor: canvas, py: 3, px: { xs: 2, md: 3 } } as const;
  }
  return { bgcolor: canvas, py: 2, px: { xs: 1.5, md: 2 } } as const;
}

function renderBlocks(
  blocks: readonly CicaEpis2gBlock[],
  content: Partial<Record<string, ReactNode>>,
  placeholder: ReactNode,
  shell: CicaEpis2gShell,
) {
  const inner = blocks.map((block) => (
    <CicaSectionBlock key={block.id} {...block}>
      {content[block.id] ?? placeholder}
    </CicaSectionBlock>
  ));

  if (shell === 'patient-letter') {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 920,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 0.5,
          boxShadow: 3,
          p: { xs: 3, sm: 5 },
        }}
      >
        <Stack spacing={2}>{inner}</Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, minmax(0, 1fr))' },
        gap: 2,
        alignItems: 'start',
      }}
    >
      {inner}
    </Box>
  );
}

/** Renderiza bloques según mapa estructural epis2g. */
export function CicaStructuredSection({
  screenId,
  blocks = {},
  placeholder = null,
  testId,
}: CicaStructuredSectionProps) {
  const structure = findEpis2gScreenStructure(screenId);
  const { isDark } = useCicaThemeTokens();
  const canvas = isDark
    ? cicaEpis2gVisual.contentCanvasDark
    : cicaEpis2gVisual.contentCanvasLight;

  if (!structure) {
    return (
      <Box data-testid={testId ?? `cica-structured-${screenId}`} sx={{ p: 2 }}>
        {placeholder}
      </Box>
    );
  }

  return (
    <Box
      data-testid={testId ?? `cica-structured-${screenId}`}
      data-cica-epis2g-tab={structure.epis2gTab}
      data-cica-shell={structure.shell}
      sx={shellSx(structure.shell, canvas)}
    >
      <Box sx={{ maxWidth: structure.shell === 'system-workspace' ? 960 : '100%', mx: 'auto' }}>
        {renderBlocks(structure.blocks, blocks, placeholder, structure.shell)}
      </Box>
    </Box>
  );
}
