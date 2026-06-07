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
  onOpenEpicrisis?: (patientId: string) => void;
};

export function IcuDashboardTab({
  data,
  onOpenPatient,
  onOpenHandover,
  onOpenEpicrisis,
}: IcuDashboardTabProps) {
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
        <EpisMetric
          label={copy.icu.metrics.netFluidBalance}
          value={`${data.metrics.netFluidBalanceMl} mL`}
          data-testid="epis2-icu-net-fluid-balance"
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
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-fluid-balance">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.fluidBalanceTitle}
        </Typography>
        <List dense data-testid="epis2-icu-fluid-balance-rows">
          {data.fluidBalance.map((row) => (
            <ListItem key={row.shiftLabel} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.shiftLabel}
                secondary={`${copy.icu.fluidIntake} ${row.intakeMl} mL · ${copy.icu.fluidOutput} ${row.outputMl} mL · ${row.balanceMl >= 0 ? '+' : ''}${row.balanceMl} mL`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-ventilation">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.ventilationTitle}
        </Typography>
        {data.ventilation.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-icu-ventilation-rows">
            {data.ventilation.map((row) => (
              <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.patientDisplayName} — ${row.mode}`}
                  secondary={`FiO₂ ${row.fio2Percent}% · PEEP ${row.peep} · PIP ${row.pip}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-invasive-lines">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.invasiveLinesTitle}
        </Typography>
        <List dense data-testid="epis2-icu-invasive-lines-rows">
          {data.invasiveLines.map((row, index) => (
            <ListItem
              key={`${row.patientId}-${row.lineType}-${index}`}
              disablePadding
              sx={{ py: 0.25, flexWrap: 'wrap', gap: 0.5 }}
            >
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.lineType}`}
                secondary={`${row.site} · ${row.daysInPlace} d`}
              />
              {onOpenPatient ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => onOpenPatient(row.patientId)}
                  data-testid={`epis2-icu-invasive-open-${row.patientId}`}
                >
                  {copy.icu.openPatientChart}
                </Button>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-neurological">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.neurologicalTitle}
        </Typography>
        <List dense data-testid="epis2-icu-neurological-rows">
          {data.neurological.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`GCS ${row.gcsTotal} · ${row.pupils} · ${row.motorResponse}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-severity-scales">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.severityScalesTitle}
        </Typography>
        <List dense data-testid="epis2-icu-severity-scales-rows">
          {data.severityScales.map((row, index) => (
            <ListItem
              key={`${row.patientDisplayName}-${row.scaleName}-${index}`}
              disablePadding
              sx={{ py: 0.25 }}
            >
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.scaleName} ${row.score}`}
                secondary={row.interpretation}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-vasoactive">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.vasoactiveTitle}
        </Typography>
        <List dense data-testid="epis2-icu-vasoactive-rows">
          {data.vasoactive.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.agent}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.agent}`}
                secondary={`${row.rateMcgKgMin} mcg/kg/min · PAM objetivo ${row.mapTarget}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-sedoanalgesia">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.sedoanalgesiaTitle}
        </Typography>
        {data.sedoanalgesia.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-icu-sedoanalgesia-rows">
            {data.sedoanalgesia.map((row) => (
              <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={row.patientDisplayName}
                  secondary={`${row.sedative} · ${row.analgesic} · RASS ${row.rassScore}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-icu-discharge-actions">
        <Typography variant="subtitle2" gutterBottom>
          {copy.icu.dischargeActionsTitle}
        </Typography>
        <Stack spacing={1}>
          {data.criticalBeds
            .filter((bed) => bed.patientId)
            .map((bed) => (
              <Stack
                key={bed.bedId}
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
              >
                <Typography variant="body2">
                  {bed.patientDisplayName} — {bed.bedLabel}
                </Typography>
                {onOpenEpicrisis ? (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onOpenEpicrisis(bed.patientId!)}
                    data-testid={`epis2-icu-prepare-epicrisis-${bed.patientId}`}
                  >
                    {copy.icu.prepareUciDischarge}
                  </Button>
                ) : null}
              </Stack>
            ))}
        </Stack>
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
