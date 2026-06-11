import { Box, Stack } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { ChartModeId } from '../../dev/dualChartModesEnv.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';
import { ChartModeSwitch } from './ChartModeSwitch.js';
import { CommandPaletteOverlay } from './CommandPaletteOverlay.js';
import { PatientChartBanner } from './PatientChartBanner.js';

export type ClinicalShellProps = {
  chartMode: ChartModeId;
  onChartModeChange: (mode: ChartModeId) => void;
  displayName: string;
  metaLine?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  children: ReactNode;
  commandQuery: string;
  onCommandQueryChange: (value: string) => void;
  onCommandSubmit: () => void;
  commandSuggestions?: readonly string[] | undefined;
  onCommandSuggestion?: ((label: string) => void) | undefined;
  testId?: string | undefined;
};

/** Shell clínico unificado — banner, modos, command bar transversal (ADR-002). */
export function ClinicalShell({
  chartMode,
  onChartModeChange,
  displayName,
  metaLine,
  allergyLabels,
  children,
  commandQuery,
  onCommandQueryChange,
  onCommandSubmit,
  commandSuggestions,
  onCommandSuggestion,
  testId = 'epis2-clinical-shell-v2',
}: ClinicalShellProps) {
  return (
    <>
      <Box
        data-testid={testId}
        sx={{
          height: '100dvh',
          maxHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <PatientChartBanner
          displayName={displayName}
          metaLine={metaLine}
          allergyLabels={allergyLabels}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
        >
          <ChartModeSwitch mode={chartMode} onChange={onChartModeChange} />
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
        <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: 'divider' }} data-testid="epis2-chart-command-dock">
          <EpisUniversalCommandBar
            variant="classic-contextual"
            embedded
            query={commandQuery}
            onQueryChange={onCommandQueryChange}
            onSubmit={onCommandSubmit}
            {...(commandSuggestions ? { suggestions: commandSuggestions } : {})}
            {...(onCommandSuggestion ? { onSuggestionSelect: onCommandSuggestion } : {})}
            testId="epis2-chart-command-bar"
          />
        </Box>
      </Box>
      <CommandPaletteOverlay />
    </>
  );
}
