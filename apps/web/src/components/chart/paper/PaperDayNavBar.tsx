import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack, epis2PaperChromeBarSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperDayNavBarProps = {
  paperDate: string;
  onPreviousDay: () => void;
  onToday: () => void;
  onNextDay: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  testId?: string | undefined;
};

function formatDayLabel(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** MF-AEST-03 — navegación temporal mínima del modo papel. */
export function PaperDayNavBar({
  paperDate,
  onPreviousDay,
  onToday,
  onNextDay,
  leading,
  trailing,
  testId = 'epis2-paper-day-nav',
}: PaperDayNavBarProps) {
  const t = copy.chartModes.paperStandalone;

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2PaperChromeBarSx(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 2,
        py: 1,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>{leading}</Box>
      <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap flexWrap="wrap">
        <EpisButton
          size="small"
          appearance="text"
          onClick={onPreviousDay}
          data-testid="epis2-paper-day-prev"
        >
          {t.dayPrevious}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="outlined"
          onClick={onToday}
          data-testid="epis2-paper-day-today"
          aria-label={`${t.dayToday}: ${formatDayLabel(paperDate)}`}
        >
          {t.dayToday}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="text"
          onClick={onNextDay}
          data-testid="epis2-paper-day-next"
        >
          {t.dayNext}
        </EpisButton>
        <Box
          component="span"
          sx={{ typography: 'body2', color: 'text.secondary', px: 0.5 }}
          data-testid="epis2-paper-day-label"
        >
          {formatDayLabel(paperDate)}
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{trailing}</Box>
    </Box>
  );
}
