import { getBlueprintByRoutePath } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import { Link, useSearch } from '@tanstack/react-router';
import { useClinicalNavigate, type ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import { useCallback, useEffect, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  epis2ShellContentIslandSx,
} from '@epis2/epis2-ui';
import {
  BLUEPRINT_BY_ROUTE,
  fetchPatientDetail,
  fetchPatientLongitudinal,
  listDrafts,
  listPatients,
  type PatientDetailResponse,
  type PatientListRow,
} from '../api/clinicalApi.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { ClinicalWidgetPanel } from '../widgets/ClinicalWidgetPanel.js';
import { ErrorState } from '../components/ErrorState.js';
import { PatientListGrid } from '../components/PatientListGrid.js';
import { PatientClinicalSummaryPanel } from '../components/PatientClinicalSummaryPanel.js';
import { PatientLongitudinalPanel } from '../components/PatientLongitudinalPanel.js';
import type { PatientLongitudinalResponse } from '@epis2/contracts';

const QUICK_ROUTE_PATHS: ClinicalFormRoutePath[] = [
  '/espacio/resumen',
  '/espacio/evolucion',
  '/espacio/epicrisis',
  '/espacio/receta',
  '/espacio/laboratorio',
  '/espacio/interconsulta',
  '/espacio/imagenologia',
  '/espacio/enfermeria',
  '/espacio/mar',
  '/espacio/farmacia',
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
  const [longitudinal, setLongitudinal] = useState<PatientLongitudinalResponse | null>(null);

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
      const [res, draftRes, longRes] = await Promise.all([
        fetchPatientDetail(id),
        listDrafts({ patientId: id }),
        fetchPatientLongitudinal(id),
      ]);
      setDetail(res);
      setPatient(res.patient);
      setDrafts(draftRes.drafts);
      setLongitudinal(longRes);
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
      <Stack spacing={2} sx={epis2ShellContentIslandSx} data-testid="epis2-patient-workspace-pick">
        <Alert severity="info">{copy.activePatient.pinHint}</Alert>
        <Button variant="outlined" onClick={() => void loadPatientList()}>
          {copy.forms.searchPatients}
        </Button>
        <PatientListGrid
          rows={patients}
          emptyMessage={copy.longitudinal.emptySection}
          onSelectPatient={(id) =>
            void navigate({
              to: '/espacio/ficha',
              search: { patientId: id },
            })
          }
          data-testid="epis2-workspace-patient-grid"
        />
        <Button component={Link} to="/espacio/buscar-paciente" variant="text">
          {copy.activePatient.searchForm}
        </Button>
        <ClinicalPageNav />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <ErrorState
          title={copy.errors.genericTitle}
          message={error}
          onRetry={() => patientId && void loadDetail(patientId)}
          retryLabel={copy.errors.retry}
        />
        <ClinicalPageNav patientId={patientId} />
      </Stack>
    );
  }

  if (!detail) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <Typography color="text.secondary">{copy.drafts.loading}</Typography>
        <ClinicalPageNav patientId={patientId} />
      </Stack>
    );
  }

  return (
    <Stack sx={epis2ShellContentIslandSx} data-testid="epis2-patient-workspace">
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
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {copy.activePatient.workspaceSubtitle}
          </Typography>
        </Stack>

        <PatientClinicalSummaryPanel summaryFields={detail.clinicalContext.summaryFields} />

        <ClinicalWidgetPanel
          surface="patient-workspace"
          patientId={patientId}
          explicitlyShownWidgetIds={['patient-summary', 'active-problems']}
          data-testid="epis2-ficha-widget-panel"
        />

        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={contextLabel}
        />

        {longitudinal ? (
          <PatientLongitudinalPanel
            data={longitudinal}
            onOpenDraft={(draftId) =>
              void navigate({
                to: '/espacio/borrador/$draftId',
                params: { draftId },
              })
            }
            onOpenNote={() =>
              void navigate({
                to: '/espacio/resumen',
                search: { patientId },
              })
            }
          />
        ) : null}

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ lineHeight: 1.45 }}>
            {copy.activePatient.quickActions}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {QUICK_ROUTE_PATHS.map((path) => {
              const blueprint = getBlueprintByRoutePath(path);
              const label = blueprint?.label ?? path;
              return (
                <Button
                  key={path}
                  variant="outlined"
                  size="small"
                  sx={{ whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.45 }}
                  onClick={() => {
                    const blueprintId = BLUEPRINT_BY_ROUTE[path];
                    setAlertBlueprintId(blueprintId);
                    setAlertLabel(label);
                    navigate({
                      to: path,
                      search: { patientId },
                    });
                  }}
                >
                  {label}
                </Button>
              );
            })}
            <Button
              variant="outlined"
              size="small"
              sx={{ whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.45 }}
              onClick={() =>
                void navigate({
                  to: '/espacio/resultados',
                  search: { patientId },
                })
              }
            >
              {copy.results.openInbox}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.45 }}
              onClick={() =>
                void navigate({
                  to: '/epis2/dashboard',
                  search: { tab: 'patient', patientId },
                })
              }
            >
              {copy.dashboard.openBoard}
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ lineHeight: 1.45 }}>
            {copy.activePatient.approvedNotes}
          </Typography>
          {detail.notes.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.55 }}>
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
          <Typography variant="subtitle1" gutterBottom sx={{ lineHeight: 1.45 }}>
            {copy.activePatient.pendingDrafts}
          </Typography>
          {drafts.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.55 }}>
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
    </Stack>
  );
}
