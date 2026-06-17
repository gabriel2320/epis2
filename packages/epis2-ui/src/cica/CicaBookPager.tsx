import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaBookPagerProps = {
  /** Etiqueta central — fecha o título de página. */
  centerLabel: string;
  onPrevious?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  previousLabel?: string;
  nextLabel?: string;
  pageHint?: string;
  testId?: string;
};

/** Navegación tipo libro — página anterior / actual / siguiente. */
export function CicaBookPager({
  centerLabel,
  onPrevious,
  onNext,
  previousLabel = '← Página anterior',
  nextLabel = 'Página siguiente →',
  pageHint,
  testId = 'cica-book-pager',
}: CicaBookPagerProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: cicaShellPaddingXSx,
        py: 1,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.default',
        flexWrap: 'wrap',
      }}
    >
      <EpisButton
        appearance="text"
        size="small"
        disabled={!onPrevious}
        onClick={onPrevious}
        data-testid={`${testId}-prev`}
      >
        {previousLabel}
      </EpisButton>
      <Stack spacing={0.25} alignItems="center" sx={{ minWidth: 0 }}>
        <EpisM3Text role="titleMedium" component="p" data-testid={`${testId}-center`}>
          {centerLabel}
        </EpisM3Text>
        {pageHint ? (
          <EpisM3Text role="labelMedium" color="text.secondary">
            {pageHint}
          </EpisM3Text>
        ) : null}
      </Stack>
      <EpisButton
        appearance="text"
        size="small"
        disabled={!onNext}
        onClick={onNext}
        data-testid={`${testId}-next`}
      >
        {nextLabel}
      </EpisButton>
    </Box>
  );
}
