import { copy } from '@epis2/design-system';
import { Box, EpisButton, EpisM3Text, Stack, epis2TraditionalChartTokens } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type ClinicalRightContextPanelProps = {
  children: ReactNode;
  open?: boolean | undefined;
  onToggle?: (() => void) | undefined;
  testId?: string | undefined;
};

/** Panel lateral colapsable — pendientes, labs, IA (MF-DUAL-CHART-05). */
export function ClinicalRightContextPanel({
  children,
  open = true,
  onToggle,
  testId = 'epis2-clinical-right-context-panel',
}: ClinicalRightContextPanelProps) {
  const t = epis2TraditionalChartTokens;

  if (!open) {
    return (
      <Box
        data-testid={`${testId}-collapsed`}
        sx={{
          width: 40,
          flexShrink: 0,
          borderLeft: t.borderSubtle,
          borderColor: t.borderColor,
          bgcolor: 'background.paper',
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 2,
        }}
      >
        <EpisButton
          appearance="text"
          size="small"
          onClick={onToggle}
          title={copy.chartModes.contextExpand}
          data-testid={`${testId}-expand`}
          sx={{ minWidth: 32, px: 0.5 }}
        >
          ‹
        </EpisButton>
      </Box>
    );
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        width: t.contextPaneWidth,
        flexShrink: 0,
        borderLeft: t.borderSubtle,
        borderColor: t.borderColor,
        bgcolor: 'background.paper',
        overflow: 'auto',
        p: 2,
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <EpisM3Text role="titleMedium" component="h2">
          {copy.chartModes.contextPaneTitle}
        </EpisM3Text>
        {onToggle ? (
          <EpisButton
            appearance="text"
            size="small"
            onClick={onToggle}
            title={copy.chartModes.contextCollapse}
            data-testid={`${testId}-collapse`}
          >
            ›
          </EpisButton>
        ) : null}
      </Stack>
      {children}
    </Box>
  );
}
