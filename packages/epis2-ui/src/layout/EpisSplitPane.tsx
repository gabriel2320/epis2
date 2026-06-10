import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2Breakpoints } from '../theme/breakpoints.js';

export type EpisSplitPaneProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  /** Muestra panel secundario (p. ej. historial longitudinal). */
  secondaryOpen?: boolean;
  testId?: string;
};

/**
 * Split-screen MD3 — columna principal + panel lateral en ≥768px;
 * apilado en móvil (Vista 2 ficha clínica).
 */
export function EpisSplitPane({
  primary,
  secondary,
  secondaryOpen = false,
  testId = 'epis2-split-pane',
}: EpisSplitPaneProps) {
  const isMedium = useMediaQuery(`(min-width:${epis2Breakpoints.medium}px)`);
  const showSecondary = Boolean(secondaryOpen && secondary);

  if (!showSecondary) {
    return (
      <Box data-testid={testId} sx={{ width: '100%' }}>
        {primary}
      </Box>
    );
  }

  if (!isMedium) {
    return (
      <Box
        data-testid={testId}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        {primary}
        {secondary}
      </Box>
    );
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 2,
        width: '100%',
        alignItems: 'start',
      }}
    >
      <Box data-testid={`${testId}-primary`} sx={{ minWidth: 0 }}>
        {primary}
      </Box>
      <Box
        data-testid={`${testId}-secondary`}
        sx={{
          minWidth: 0,
          maxHeight: 'calc(100vh - 220px)',
          overflow: 'auto',
          position: 'sticky',
          top: 72,
        }}
      >
        {secondary}
      </Box>
    </Box>
  );
}
