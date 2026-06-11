import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import type { ChartModeId } from '../../dev/dualChartModesEnv.js';

export type ChartModeSwitchProps = {
  mode: ChartModeId;
  onChange: (mode: ChartModeId) => void;
  testId?: string | undefined;
};

/** Alternancia ficha electrónica ↔ ficha papel. */
export function ChartModeSwitch({
  mode,
  onChange,
  testId = 'epis2-chart-mode-switch',
}: ChartModeSwitchProps) {
  return (
    <Stack direction="row" spacing={1} data-testid={testId} role="group" aria-label="Modo de ficha">
      <EpisButton
        appearance={mode === 'traditional' ? 'filled' : 'outlined'}
        size="small"
        onClick={() => onChange('traditional')}
        data-testid="epis2-chart-mode-traditional"
      >
        {copy.chartModes.traditional}
      </EpisButton>
      <EpisButton
        appearance={mode === 'paper' ? 'filled' : 'outlined'}
        size="small"
        onClick={() => onChange('paper')}
        data-testid="epis2-chart-mode-paper"
      >
        {copy.chartModes.paper}
      </EpisButton>
    </Stack>
  );
}
