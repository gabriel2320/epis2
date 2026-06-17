import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import type { ClinicalLayoutAction } from '../layout/clinical/clinicalLayoutEngine.js';
import { ClinicalActionBar } from './ClinicalActionBar.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { cicaPaperCanvasSx, cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaLetterPageShellProps = {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  onBack: () => void;
  backLabel?: string;
  actions?: readonly ClinicalLayoutAction[];
  hideActionBar?: boolean;
  children: ReactNode;
  testId?: string;
};

/**
 * Superficie documento tamaño carta — acciones clínicas mayores.
 * Sin tabs de ficha ni sidebar interno.
 */
export function CicaLetterPageShell({
  title,
  subtitle,
  statusLabel,
  onBack,
  backLabel = 'Volver a ficha',
  actions = [],
  hideActionBar = false,
  children,
  testId = 'cica-letter-page-shell',
}: CicaLetterPageShellProps) {
  return (
    <Stack
      data-testid={testId}
      data-cica-letter-page="true"
      sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: cicaShellPaddingXSx,
          py: 1,
          borderBottom: 1,
          borderColor: cicaTokens.borderColor,
          bgcolor: 'background.default',
          flexWrap: 'wrap',
        }}
      >
        <EpisButton appearance="text" size="small" onClick={onBack} data-testid={`${testId}-back`}>
          {backLabel}
        </EpisButton>
        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <EpisM3Text role="titleMedium" component="h1" data-testid={`${testId}-title`}>
            {title}
          </EpisM3Text>
          {subtitle ? (
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {subtitle}
            </EpisM3Text>
          ) : null}
        </Stack>
        {statusLabel ? (
          <EpisM3Text role="labelMedium" color="text.secondary" data-testid={`${testId}-status`}>
            {statusLabel}
          </EpisM3Text>
        ) : null}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          px: cicaShellPaddingXSx,
          py: 2,
          bgcolor: 'action.hover',
        }}
      >
        <Box
          data-testid={`${testId}-canvas`}
          sx={{
            ...cicaPaperCanvasSx(),
            width: '100%',
            maxWidth: cicaTokens.maxContentWidth,
            minHeight: 640,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>
      </Box>

      {!hideActionBar && actions.length > 0 ? <ClinicalActionBar actions={actions} /> : null}
    </Stack>
  );
}
