import type { IcuDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisWorkspaceSection,
  Alert,
  Button,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
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
      <EpisWorkspaceSection title={copy.icu.idcPanelsTitle} testId="epis2-icu-idc-panels">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.specializedPanelsTitle} testId="epis2-icu-specialized-idc-panels">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.specializedPanels.map((panel) => (
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.bedMapTitle} testId="epis2-icu-bed-map">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.flowsheetTitle} testId="epis2-icu-flowsheet">
        <List dense data-testid="epis2-icu-flowsheet-hours">
          {data.flowsheetHours.map((row) => (
            <ListItem key={row.hourLabel} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.hourLabel} — FC ${row.heartRate} · PAM ${row.map} · SpO₂ ${row.spo2}%`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.hemodynamicsTitle} testId="epis2-icu-hemodynamics">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.fluidBalanceTitle} testId="epis2-icu-fluid-balance">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.ventilationTitle} testId="epis2-icu-ventilation">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.invasiveLinesTitle} testId="epis2-icu-invasive-lines">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.neurologicalTitle} testId="epis2-icu-neurological">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.severityScalesTitle} testId="epis2-icu-severity-scales">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.vasoactiveTitle} testId="epis2-icu-vasoactive">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.sedoanalgesiaTitle} testId="epis2-icu-sedoanalgesia">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.spontaneousVentTitle} testId="epis2-icu-spontaneous-vent">
        <List dense data-testid="epis2-icu-spontaneous-vent-rows">
          {data.spontaneousVentTrials.length === 0 ? (
            <ListItem disablePadding>
              <ListItemText primary={copy.icu.noSpecializedCases} />
            </ListItem>
          ) : (
            data.spontaneousVentTrials.map((row) => (
              <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={row.patientDisplayName}
                  secondary={`${row.trialType} · ${row.durationMin} min · ${row.outcome}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.renalTherapyTitle} testId="epis2-icu-renal-therapy">
        <List dense>
          {data.renalTherapies.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.modality} · UF ${row.ultrafiltrationMl} mL · ${row.anticoagulation}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.parenteralNutritionTitle} testId="epis2-icu-parenteral-nutrition">
        <List dense>
          {data.parenteralNutrition.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.caloriesKcal} kcal · ${row.proteinG} g proteína · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.enteralNutritionTitle} testId="epis2-icu-enteral-nutrition">
        <List dense>
          {data.enteralNutrition.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.route} · ${row.rateMlH} mL/h · Residuo ${row.gastricResidualMl} mL`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.brainDeathTitle} testId="epis2-icu-brain-death">
        <Typography variant="body2" color="text.secondary">
          {data.brainDeathChecklists.length === 0
            ? copy.icu.noSpecializedCases
            : data.brainDeathChecklists.map((r) => r.patientDisplayName).join(', ')}
        </Typography>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.organProcurementTitle} testId="epis2-icu-organ-procurement">
        <Typography variant="body2" color="text.secondary">
          {copy.icu.noSpecializedCases}
        </Typography>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.icuDiaryTitle} testId="epis2-icu-diary">
        <List dense data-testid="epis2-icu-diary-rows">
          {data.icuDiaryEntries.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.entrySummary} · ${row.authorRole}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.deliriumTitle} testId="epis2-icu-delirium">
        <List dense data-testid="epis2-icu-delirium-rows">
          {data.deliriumScreenings.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`CAM-ICU ${row.camIcuScore} · ${row.intervention}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.proneProtocolTitle} testId="epis2-icu-prone-protocol">
        <List dense data-testid="epis2-icu-prone-protocol-rows">
          {data.proneProtocols.length === 0 ? (
            <ListItem disablePadding>
              <ListItemText primary={copy.icu.noSpecializedCases} />
            </ListItem>
          ) : (
            data.proneProtocols.map((row) => (
              <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={row.patientDisplayName}
                  secondary={`${row.sessionHours} h · P/F ${row.pao2Fio2Ratio} · ${row.status}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.icu.dischargeActionsTitle} testId="epis2-icu-discharge-actions">
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
      </EpisWorkspaceSection>
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
