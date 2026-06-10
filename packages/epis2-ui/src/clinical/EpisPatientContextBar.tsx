import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2PatientContextBarSx } from './patient-chart-tokens.js';

export type EpisPatientContextAlert = {
  id: string;
  label: string;
  severity: 'critical' | 'warning';
};

export type EpisPatientContextBarProps = {
  displayName: string;
  meta?: string;
  alerts?: EpisPatientContextAlert[];
  trailing?: ReactNode;
  testId?: string;
};

/** Nivel 1 — Top App Bar inmutable del paciente (sticky, no desaparece al scroll). */
export function EpisPatientContextBar({
  displayName,
  meta,
  alerts = [],
  trailing,
  testId = 'epis2-patient-context-bar',
}: EpisPatientContextBarProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      gap={1}
      sx={epis2PatientContextBarSx}
      data-testid={testId}
    >
      <EpisM3Text
        role="titleLarge"
        component="h1"
        noWrap
        sx={{ maxWidth: { xs: '100%', sm: 360 } }}
      >
        {displayName}
      </EpisM3Text>
      {meta ? (
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {meta}
        </EpisM3Text>
      ) : null}
      {alerts.map((alert) => (
        <EpisChip
          key={alert.id}
          label={alert.label}
          size="small"
          color={alert.severity === 'critical' ? 'error' : 'warning'}
          variant="filled"
          data-testid={`epis2-patient-alert-${alert.id}`}
        />
      ))}
      <Stack direction="row" spacing={1} sx={{ ml: 'auto' }} alignItems="center">
        {trailing}
      </Stack>
    </Stack>
  );
}
