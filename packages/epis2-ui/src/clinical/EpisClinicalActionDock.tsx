import type { ReactNode } from 'react';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { epis2ClinicalActionDockSx } from './patient-chart-tokens.js';

export type EpisClinicalActionDockProps = {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryActions?: ReactNode;
  testId?: string;
};

/** Nivel 4 — Extended FAB + acciones secundarias fijas (esquina inferior derecha). */
export function EpisClinicalActionDock({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryActions,
  testId = 'epis2-clinical-action-dock',
}: EpisClinicalActionDockProps) {
  return (
    <Stack sx={epis2ClinicalActionDockSx} data-testid={testId}>
      {secondaryActions}
      <Fab
        variant="extended"
        color="primary"
        {...(primaryDisabled ? { disabled: true } : {})}
        onClick={onPrimary}
        data-testid="epis2-clinical-action-dock-primary"
        sx={{ textTransform: 'none', fontWeight: 600, px: 3, minHeight: 48 }}
      >
        {primaryLabel}
      </Fab>
    </Stack>
  );
}

/** Variante compacta para acciones secundarias en el dock. */
export function EpisClinicalActionDockSecondary({
  label,
  onClick,
  disabled,
  testId,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <EpisButton
      appearance="tonal"
      size="small"
      {...(disabled ? { disabled: true } : {})}
      onClick={onClick}
      {...(testId ? { 'data-testid': testId } : {})}
    >
      {label}
    </EpisButton>
  );
}
