import type { ClinicalAlert } from '@epis2/contracts';
import { copy } from '@epis2/design-system';

import {
  Alert,
  AlertTitle,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export type ClinicalAlertsPanelProps = {
  alerts: ClinicalAlert[];
  loading?: boolean;
  hintBlueprintLabel?: string;
};

function alertSeverity(severity: ClinicalAlert['severity']): 'error' | 'warning' | 'info' {
  if (severity === 'critical') return 'error';
  return 'warning';
}

export function ClinicalAlertsPanel({
  alerts,
  loading = false,
  hintBlueprintLabel,
}: ClinicalAlertsPanelProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, width: '100%' }}
      data-testid="epis2-clinical-alerts"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">{copy.commandCenter.clinicalAlertsTitle}</Typography>
        {hintBlueprintLabel ? (
          <Chip size="small" label={hintBlueprintLabel} variant="outlined" />
        ) : null}
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        {copy.commandCenter.clinicalAlertsHint}
      </Typography>

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          {copy.commandCenter.clinicalAlertsLoading}
        </Typography>
      ) : null}

      {!loading && alerts.length === 0 ? (
        <Alert severity="success" variant="outlined">
          {copy.commandCenter.clinicalAlertsEmpty}
        </Alert>
      ) : null}

      <Stack spacing={1}>
        {alerts.map((alert) => (
          <Alert
            key={`${alert.ruleId}-${alert.message}`}
            severity={alertSeverity(alert.severity)}
            variant="outlined"
            data-testid={`epis2-clinical-alert-${alert.ruleId}`}
          >
            <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {alert.message}
              <Chip
                size="small"
                label={
                  alert.source === 'cdr'
                    ? copy.commandCenter.alertSourceCdr
                    : copy.commandCenter.alertSourceCds
                }
                color={alert.source === 'cdr' ? 'secondary' : 'default'}
              />
            </AlertTitle>
            {alert.detail}
          </Alert>
        ))}
      </Stack>
    </Paper>
  );
}
