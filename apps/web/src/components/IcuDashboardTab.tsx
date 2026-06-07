import type { IcuDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Button,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

export type IcuDashboardTabProps = {
  data: IcuDashboardResponse;
  onOpenPatient?: (patientId: string) => void;
  onOpenHandover?: (patientId: string) => void;
};

export function IcuDashboardTab({ data, onOpenPatient, onOpenHandover }: IcuDashboardTabProps) {
  const primaryBed = data.criticalBeds.find((b) => b.patientId);

  return (
    <Stack spacing={2} data-testid="epis2-icu-dashboard">
      <Alert severity="info">{copy.icu.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric label={copy.icu.metrics.occupied} value={String(data.metrics.occupied)} />
        <EpisMetric label={copy.icu.metrics.available} value={String(data.metrics.available)} />
        <EpisMetric
          label={copy.icu.metrics.onVentilator}
          value={String(data.metrics.onVentilator)}
        />
      </Stack>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-idc-panels">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.idcPanelsTitle}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'error' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-icu-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-bed-map">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.bedMapTitle}
        </Typography>
        <List dense>
          {data.criticalBeds.map((bed) => (
            <ListItem key={bed.bedId} disablePadding sx={{ py: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <ListItemText
                primary={`${bed.bedLabel} — ${bed.patientDisplayName ?? copy.inpatient.available}`}
                secondary={
                  bed.onVentilator
                    ? `${bed.demoCaseCode ?? ''} · ${copy.icu.onVentilator}`
                    : bed.demoCaseCode
                }
              />
              {bed.patientId && onOpenPatient ? (
                <Button
                  size="small"
                  onClick={() => onOpenPatient(bed.patientId!)}
                  data-testid={`epis2-icu-open-chart-${bed.patientId}`}
                >
                  {copy.icu.openPatientChart}
                </Button>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-flowsheet">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.flowsheetTitle}
        </Typography>
        <List dense data-testid="epis2-icu-flowsheet-hours">
          {data.flowsheetHours.map((row) => (
            <ListItem key={row.hourLabel} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.hourLabel} — FC ${row.heartRate} · PAM ${row.map} · SpO₂ ${row.spo2}%`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-hemodynamics">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.hemodynamicsTitle}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          {data.specializedPanels
            .filter((p) => p.idc === 135)
            .map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color="error"
                data-testid={`epis2-icu-idc-${panel.idc}`}
              />
            ))}
        </Stack>
        <List dense>
          {data.hemodynamics.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`PAM ${row.map} · PVC ${row.cvp} · Lactato ${row.lactate.toFixed(1)}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {primaryBed?.patientId && onOpenHandover ? (
        <Button
          size="small"
          variant="outlined"
          onClick={() => onOpenHandover(primaryBed.patientId!)}
          data-testid="epis2-icu-open-handover"
        >
          {copy.workspaces.icu.rail.handover}
        </Button>
      ) : null}
    </Stack>
  );
}
