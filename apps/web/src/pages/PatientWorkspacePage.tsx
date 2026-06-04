import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useSearch } from '@tanstack/react-router';
import { useClinicalNavigate, type ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import { useCallback, useEffect, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import {
  BLUEPRINT_BY_ROUTE,
  fetchPatientDetail,
  listDrafts,
  listPatients,
  type PatientDetailResponse,
  type PatientListRow,
} from '../api/clinicalApi.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { PatientClinicalSummaryPanel } from '../components/PatientClinicalSummaryPanel.js';

const QUICK_ROUTES: { path: ClinicalFormRoutePath; label: string }[] = [
  { path: '/espacio/resumen', label: 'Resumen clínico' },
  { path: '/espacio/evolucion', label: 'Evolución' },
  { path: '/espacio/epicrisis', label: 'Epicrisis' },
  { path: '/espacio/receta', label: 'Receta' },
  { path: '/espacio/laboratorio', label: 'Laboratorio' },
];

export function PatientWorkspacePage() {
  const search = useSearch({ strict: false }) as { patientId?: string };
  const navigate = useClinicalNavigate();
  const { patient: active, setPatient } = useActivePatient();
  const [detail, setDetail] = useState<PatientDetailResponse | null>(null);
  const [drafts, setDrafts] = useState<Awaited<ReturnType<typeof listDrafts>>['drafts']>([]);
  const [patients, setPatients] = useState<PatientListRow[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [alertBlueprintId, setAlertBlueprintId] = useState<string | undefined>();
  const [alertLabel, setAlertLabel] = useState<string | undefined>();

  const patientId = search.patientId ?? active?.id;

  const { alerts: clinicalAlerts, loading: alertsLoading, contextLabel } =
    usePatientClinicalAlerts({
      patientId,
      blueprintId: alertBlueprintId,
      contextLabel: alertLabel,
    });

  const loadDetail = useCallback(async (id: string) => {
    setError(undefined);
    try {
      const [res, draftRes] = await Promise.all([
        fetchPatientDetail(id),
        listDrafts({ patientId: id }),
      ]);
      setDetail(res);
      setPatient(res.patient);
      setDrafts(draftRes.drafts);
      setAlertBlueprintId(undefined);
      setAlertLabel(undefined);
    } catch {
      setError(copy.errors.genericMessage);
    }
  }, [setPatient]);

  useEffect(() => {
    if (patientId) {
      void loadDetail(patientId);
    }
  }, [patientId, loadDetail]);

  const loadPatientList = async () => {
    try {
      const res = await listPatients();
      setPatients(res.patients);
    } catch {
      setPatients([]);
    }
  };

  if (!patientId) {
    return (
      <Stack spacing={2} data-testid="epis2-patient-workspace-pick">
        <Alert severity="info">{copy.activePatient.pinHint}</Alert>
        <Button variant="outlined" onClick={() => void loadPatientList()}>
          {copy.forms.searchPatients}
        </Button>
        <List dense>
          {patients.map((p) => (
            <ListItem key={p.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  void navigate({
                    to: '/espacio/ficha',
                    search: { patientId: p.id },
                  })
                }
              >
                <ListItemText
                  primary={p.displayName}
                  secondary={p.demoCaseCode ? `${p.demoCaseCode} · ${copy.demoBadge}` : copy.demoBadge}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button component={Link} to="/espacio/buscar-paciente" variant="text">
          {copy.activePatient.searchForm}
        </Button>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!detail) {
    return <Typography color="text.secondary">{copy.drafts.loading}</Typography>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 3 }} data-testid="epis2-patient-workspace">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="h5" component="h1">
              {detail.patient.displayName}
            </Typography>
            <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
            {detail.patient.demoCaseCode ? (
              <Chip label={detail.patient.demoCaseCode} size="small" />
            ) : null}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {copy.activePatient.workspaceSubtitle}
          </Typography>
        </Stack>

        <PatientClinicalSummaryPanel summaryFields={detail.clinicalContext.summaryFields} />

        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={contextLabel}
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {copy.activePatient.quickActions}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {QUICK_ROUTES.map((action) => (
              <Button
                key={action.path}
                variant="outlined"
                size="small"
                onClick={() => {
                  const blueprintId = BLUEPRINT_BY_ROUTE[action.path];
                  setAlertBlueprintId(blueprintId);
                  setAlertLabel(action.label);
                  navigate({
                    to: action.path,
                    search: { patientId },
                  });
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {copy.activePatient.approvedNotes}
          </Typography>
          {detail.notes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.activePatient.noNotes}
            </Typography>
          ) : (
            <List dense>
              {detail.notes.map((note) => (
                <ListItem key={note.id} disablePadding>
                  <ListItemText primary={note.title} secondary={note.noteType} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {copy.activePatient.pendingDrafts}
          </Typography>
          {drafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.activePatient.noDrafts}
            </Typography>
          ) : (
            <List dense>
              {drafts.map((d) => (
                <ListItem
                  key={d.id}
                  disablePadding
                  secondaryAction={
                    <Button
                      size="small"
                      onClick={() =>
                        void navigate({
                          to: '/espacio/borrador/$draftId',
                          params: { draftId: d.id },
                        })
                      }
                    >
                      {copy.activePatient.openDraft}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={d.title}
                    secondary={`${d.draftType} · ${
                      d.status in copy.drafts.statusLabels
                        ? copy.drafts.statusLabels[
                            d.status as keyof typeof copy.drafts.statusLabels
                          ]
                        : d.status
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button component={Link} to="/comando" variant="contained">
            {copy.layout.backToCommand}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setPatient(null);
              void navigate({ to: '/espacio/ficha', search: { patientId: undefined } });
            }}
          >
            {copy.activePatient.change}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
