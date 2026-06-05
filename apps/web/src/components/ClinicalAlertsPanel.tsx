import type { ClinicalAlert } from '@epis2/contracts';
import { copy } from '@epis2/design-system';

import {
  Alert,
  AlertTitle,
  Box,
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
  const showEmpty = !loading && alerts.length === 0;
  const showInitialLoading = loading && alerts.length === 0;

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{
        width: '100%',
        py: { xs: 2, sm: 2.5 },
        px: { xs: 2, sm: 2.5 },
        bgcolor: 'background.default',
        boxShadow: 'none',
        backgroundImage: 'none',
        borderRadius: 2,
        border: 'none',
      }}
      data-testid="epis2-clinical-alerts"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5, px: 0.5 }}>
        <Typography variant="subtitle1">{copy.commandCenter.clinicalAlertsTitle}</Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {loading && alerts.length > 0 ? (
            <Chip size="small" label={copy.commandCenter.clinicalAlertsLoading} variant="outlined" />
          ) : null}
          {hintBlueprintLabel ? (
            <Chip size="small" label={hintBlueprintLabel} variant="outlined" />
          ) : null}
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.secondary" display="block" sx={{ mb: 2, px: 0.5, lineHeight: 1.55 }}>
        {copy.commandCenter.clinicalAlertsHint}
      </Typography>

      <Box sx={{ minHeight: 48 }}>
        {showInitialLoading ? (
          <Typography variant="body2" color="text.secondary">
            {copy.commandCenter.clinicalAlertsLoading}
          </Typography>
        ) : null}

        {showEmpty ? (
          <Alert severity="success" variant="outlined">
            {copy.commandCenter.clinicalAlertsEmpty}
          </Alert>
        ) : null}

        {alerts.length > 0 ? (
          <Stack spacing={1} sx={{ opacity: loading ? 0.72 : 1, transition: 'none' }}>
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
        ) : null}
      </Box>
    </Paper>
  );
}
