import { copy } from '@epis2/design-system';
import { Box, EpisPrimaryActionBar, Stack, epis2ClinicalShellTokens } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { ChartModeId } from '../../dev/dualChartModesEnv.js';
import { ChartModeSwitch } from './ChartModeSwitch.js';

export type ClinicalActionBarProps = {
  chartMode: ChartModeId;
  onChartModeChange: (mode: ChartModeId) => void;
  commandBar: ReactNode;
  onNewEvolution?: (() => void) | undefined;
  onNewOrder?: (() => void) | undefined;
  onOpenLab?: (() => void) | undefined;
  onOpenPrescription?: (() => void) | undefined;
  onSaveDraft?: (() => void) | undefined;
  onSign?: (() => void) | undefined;
  onPrint?: (() => void) | undefined;
  statusChips?: ReactNode | undefined;
  /** Oculta switch papel y command bar visible — flujo CICA minimal. */
  minimal?: boolean | undefined;
  testId?: string | undefined;
};

/** Capa transversal — modo + estado IA; comando vía paleta en minimal. */
export function ClinicalActionBar({
  chartMode,
  onChartModeChange,
  commandBar,
  statusChips,
  onSaveDraft,
  onSign,
  onPrint,
  minimal = false,
  testId = 'epis2-clinical-action-bar',
}: ClinicalActionBarProps) {
  if (minimal && !onSaveDraft) {
    return statusChips ? (
      <Stack
        data-testid={testId}
        direction="row"
        justifyContent="flex-end"
        sx={{
          px: { xs: 2, md: 3 },
          py: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
          minHeight: 32,
        }}
      >
        {statusChips}
      </Stack>
    ) : null;
  }

  const overflow = [
    ...(onSign
      ? [
          {
            id: 'sign',
            label: copy.chartModes.actionSign,
            onClick: onSign,
            testId: 'epis2-chart-action-sign',
          },
        ]
      : []),
    ...(onPrint
      ? [
          {
            id: 'print',
            label: copy.chartModes.actionPrint,
            onClick: onPrint,
            testId: 'epis2-chart-action-print',
          },
        ]
      : []),
  ];

  return (
    <Stack
      data-testid={testId}
      spacing={0.5}
      sx={{
        px: { xs: 2, md: 3 },
        py: minimal ? 0.75 : 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        minHeight: minimal ? 40 : epis2ClinicalShellTokens.actionBarMinHeight,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={1}
        useFlexGap
      >
        {!minimal ? (
          <ChartModeSwitch mode={chartMode} onChange={onChartModeChange} />
        ) : null}
        {statusChips}
        {!minimal ? <Box sx={{ flex: 1, minWidth: 0 }}>{commandBar}</Box> : null}
      </Stack>
      {onSaveDraft ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
          <EpisPrimaryActionBar
            primary={{
              id: 'save-draft',
              label: copy.chartModes.actionSave,
              onClick: onSaveDraft,
              appearance: 'tonal',
              testId: 'epis2-chart-action-save',
            }}
            overflow={overflow}
            overflowLabel={copy.chartModes.actionMoreOpen}
            testId="epis2-chart-primary-action-bar"
          />
        </Box>
      ) : null}
    </Stack>
  );
}
