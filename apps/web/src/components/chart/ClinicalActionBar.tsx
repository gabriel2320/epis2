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
  testId?: string | undefined;
};

/** Capa 3 — modo, comando y una acción primaria (MF-AEST-01). */
export function ClinicalActionBar({
  chartMode,
  onChartModeChange,
  commandBar,
  statusChips,
  onSaveDraft,
  onSign,
  onPrint,
  testId = 'epis2-clinical-action-bar',
}: ClinicalActionBarProps) {
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
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        minHeight: epis2ClinicalShellTokens.actionBarMinHeight,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={1}
        useFlexGap
      >
        <ChartModeSwitch mode={chartMode} onChange={onChartModeChange} />
        {statusChips}
        <Box sx={{ flex: 1, minWidth: 0 }}>{commandBar}</Box>
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
