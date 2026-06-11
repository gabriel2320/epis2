import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack, epis2ClinicalShellTokens } from '@epis2/epis2-ui';
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
  testId?: string | undefined;
};

/** Capa 3 — modos, acciones frecuentes y slot comando (canon visual §3). */
export function ClinicalActionBar({
  chartMode,
  onChartModeChange,
  commandBar,
  onNewEvolution,
  onNewOrder,
  onOpenLab,
  onOpenPrescription,
  onSaveDraft,
  onSign,
  onPrint,
  testId = 'epis2-clinical-action-bar',
}: ClinicalActionBarProps) {
  return (
    <Stack
      data-testid={testId}
      spacing={1}
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
        <Box sx={{ flex: 1, minWidth: 0 }}>{commandBar}</Box>
      </Stack>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} alignItems="center">
        <EpisButton size="small" appearance="outlined" onClick={onNewEvolution} data-testid="epis2-chart-action-evolution">
          + {copy.chartModes.actionEvolution}
        </EpisButton>
        <EpisButton size="small" appearance="outlined" onClick={onNewOrder} data-testid="epis2-chart-action-order">
          + {copy.chartModes.actionOrder}
        </EpisButton>
        <EpisButton size="small" appearance="outlined" onClick={onOpenLab} data-testid="epis2-chart-action-lab">
          + {copy.chartModes.actionLab}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="outlined"
          onClick={onOpenPrescription}
          data-testid="epis2-chart-action-prescription"
        >
          + {copy.chartModes.actionPrescription}
        </EpisButton>
        <Box sx={{ flex: 1 }} />
        <EpisButton size="small" appearance="tonal" onClick={onSaveDraft} data-testid="epis2-chart-action-save">
          {copy.chartModes.actionSave}
        </EpisButton>
        <EpisButton size="small" appearance="outlined" onClick={onSign} data-testid="epis2-chart-action-sign">
          {copy.chartModes.actionSign}
        </EpisButton>
        <EpisButton size="small" appearance="filled" onClick={onPrint} data-testid="epis2-chart-action-print">
          {copy.chartModes.actionPrint}
        </EpisButton>
      </Stack>
    </Stack>
  );
}
