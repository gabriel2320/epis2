import { copy } from '@epis2/design-system';
import {
  Box,
  Collapse,
  EpisButton,
  Stack,
  epis2ClinicalShellTokens,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
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

/** Capa 3 — modos, comando NL y acciones globales colapsables (MF-NORM-03). */
export function ClinicalActionBar({
  chartMode,
  onChartModeChange,
  commandBar,
  onSaveDraft,
  onSign,
  onPrint,
  testId = 'epis2-clinical-action-bar',
}: ClinicalActionBarProps) {
  const [moreOpen, setMoreOpen] = useState(false);

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
        <Box sx={{ flex: 1, minWidth: 0 }}>{commandBar}</Box>
        <EpisButton
          size="small"
          appearance="text"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          data-testid="epis2-chart-action-more-toggle"
          sx={{ display: { xs: 'none', lg: 'inline-flex' }, flexShrink: 0 }}
        >
          {moreOpen ? copy.chartModes.actionMoreClose : copy.chartModes.actionMoreOpen}
        </EpisButton>
      </Stack>
      <Collapse in={moreOpen} sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
          <EpisButton
            size="small"
            appearance="tonal"
            onClick={onSaveDraft}
            data-testid="epis2-chart-action-save"
          >
            {copy.chartModes.actionSave}
          </EpisButton>
          <EpisButton
            size="small"
            appearance="outlined"
            onClick={onSign}
            data-testid="epis2-chart-action-sign"
          >
            {copy.chartModes.actionSign}
          </EpisButton>
          <EpisButton
            size="small"
            appearance="filled"
            onClick={onPrint}
            data-testid="epis2-chart-action-print"
          >
            {copy.chartModes.actionPrint}
          </EpisButton>
        </Stack>
      </Collapse>
      <Stack
        direction="row"
        flexWrap="wrap"
        useFlexGap
        spacing={1}
        alignItems="center"
        sx={{ display: { xs: 'flex', lg: 'none' }, pt: 0.5 }}
      >
        <EpisButton
          size="small"
          appearance="tonal"
          onClick={onSaveDraft}
          data-testid="epis2-chart-action-save-mobile"
        >
          {copy.chartModes.actionSave}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="outlined"
          onClick={onSign}
          data-testid="epis2-chart-action-sign-mobile"
        >
          {copy.chartModes.actionSign}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="filled"
          onClick={onPrint}
          data-testid="epis2-chart-action-print-mobile"
        >
          {copy.chartModes.actionPrint}
        </EpisButton>
      </Stack>
    </Stack>
  );
}
