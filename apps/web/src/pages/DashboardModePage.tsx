import { copy } from '@epis2/design-system';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@epis2/epis2-ui';
import {
  fetchDashboardWork,
  fetchPatientDashboard,
  fetchServiceDashboard,
} from '../api/dashboardApi.js';
import { fetchQualityDashboard } from '../api/opsApi.js';
import type {
  DashboardWorkResponse,
  PatientDashboardResponse,
  QualityDashboardResponse,
  ServiceDashboardResponse,
} from '@epis2/contracts';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { readRecentPatients } from '../clinical/recentPatients.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { DraftStatusChip } from '../components/DraftStatusChip.js';
import { PatientDashboardTab } from '../components/PatientDashboardTab.js';
import { QualityDashboardTab } from '../components/QualityDashboardTab.js';
import { ServiceDashboardTab } from '../components/ServiceDashboardTab.js';

type DashboardTab = 'work' | 'patient' | 'service' | 'quality';

export function DashboardModePage() {
  const search = useSearch({ strict: false }) as { tab?: string; patientId?: string };
  const navigate = useClinicalNavigate();
  const { hasPermission } = useAuth();
  const canQuality = hasPermission('audit.read');
  const { patient: activePatient, setPatient } = useActivePatient();
  const tab = (
    search.tab === 'patient' ||
    search.tab === 'service' ||
    (search.tab === 'quality' && canQuality)
      ? search.tab
      : 'work'
  ) as DashboardTab;
  const dashboardPatientId = search.patientId ?? activePatient?.id;

  const [work, setWork] = useState<DashboardWorkResponse | null>(null);
  const [patientBoard, setPatientBoard] = useState<PatientDashboardResponse | null>(null);
  const [serviceBoard, setServiceBoard] = useState<ServiceDashboardResponse | null>(null);
  const [qualityBoard, setQualityBoard] = useState<QualityDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [recentPatients, setRecentPatients] = useState(readRecentPatients());

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchDashboardWork();
      setWork(res);
      setRecentPatients(readRecentPatients());
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadService = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchServiceDashboard();
      setServiceBoard(res);
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQuality = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchQualityDashboard();
      setQualityBoard(res);
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPatient = useCallback(async (patientId: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchPatientDashboard(patientId);
      setPatientBoard(res);
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'work') void load();
    if (tab === 'service') void loadService();
    if (tab === 'quality' && canQuality) void loadQuality();
    if (tab === 'patient' && dashboardPatientId) void loadPatient(dashboardPatientId);
    if (tab === 'patient' && !dashboardPatientId) {
      setLoading(false);
      setPatientBoard(null);
    }
  }, [tab, load, loadService, loadQuality, loadPatient, dashboardPatientId, canQuality]);

  const setTab = (next: DashboardTab) => {
    void navigate({
      to: '/epis2/dashboard',
      search: { tab: next, patientId: dashboardPatientId },
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', px: 2, py: 3 }}>
      <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }} data-testid="epis2-dashboard-mode">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h5" component="h1">
              {copy.dashboard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {copy.dashboard.subtitle}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            data-testid="epis2-back-to-command"
            onClick={() => void navigate({ to: '/comando' })}
          >
            {copy.layout.backToCommand}
          </Button>
        </Stack>

        <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" sx={{ alignSelf: 'flex-start' }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v as DashboardTab)} variant="scrollable">
          <Tab label={copy.dashboard.tabWork} value="work" data-testid="epis2-dashboard-tab-work" />
          <Tab label={copy.dashboard.tabPatient} value="patient" data-testid="epis2-dashboard-tab-patient" />
          <Tab label={copy.dashboard.tabService} value="service" data-testid="epis2-dashboard-tab-service" />
          {canQuality ? (
            <Tab label={copy.dashboard.tabQuality} value="quality" data-testid="epis2-dashboard-tab-quality" />
          ) : null}
        </Tabs>

        {tab === 'patient' ? (
          <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
              <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
            ) : dashboardPatientId && patientBoard ? (
              <PatientDashboardTab
                data={patientBoard}
                onOpenFicha={() =>
                  void navigate({
                    to: '/espacio/ficha',
                    search: { patientId: dashboardPatientId },
                  })
                }
                onOpenDraft={(draftId) =>
                  void navigate({
                    to: '/espacio/borrador/$draftId',
                    params: { draftId },
                  })
                }
              />
            ) : (
              <Alert severity="info">{copy.dashboard.patientRequiresSelection}</Alert>
            )}
          </>
        ) : null}

        {tab === 'service' ? (
          <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
              <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
            ) : serviceBoard ? (
              <ServiceDashboardTab
                data={serviceBoard}
                onReload={() => void loadService()}
                onOpenPatient={(pid) => {
                  const p = recentPatients.find((r) => r.id === pid);
                  if (p) setPatient(p);
                  void navigate({
                    to: '/espacio/ficha',
                    search: { patientId: pid },
                  });
                }}
              />
            ) : (
              <Alert severity="info">{copy.dashboard.tabServiceSoon}</Alert>
            )}
          </>
        ) : null}

        {tab === 'quality' ? (
          <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
              <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
            ) : qualityBoard ? (
              <QualityDashboardTab data={qualityBoard} />
            ) : (
              <Alert severity="info">{copy.dashboard.tabQualityRestricted}</Alert>
            )}
          </>
        ) : null}

        {tab === 'work' ? (
          <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
              <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
            ) : (
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-my-drafts">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.myOpenDrafts}
                  </Typography>
                  {work && work.myOpenDrafts.length > 0 ? (
                    <List dense disablePadding>
                      {work.myOpenDrafts.map((d) => (
                        <ListItem key={d.id} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              void navigate({
                                to: '/espacio/borrador/$draftId',
                                params: { draftId: d.id },
                              })
                            }
                          >
                            <ListItemText
                              primary={d.title}
                              secondary={`${d.patientDisplayName} · ${d.draftType}`}
                            />
                            <DraftStatusChip status={d.status} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyDrafts}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-pending-review">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.pendingReview}
                  </Typography>
                  {work && work.pendingReview.length > 0 ? (
                    <List dense disablePadding>
                      {work.pendingReview.map((d) => (
                        <ListItem key={d.id} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              void navigate({
                                to: '/espacio/borrador/$draftId',
                                params: { draftId: d.id },
                              })
                            }
                          >
                            <ListItemText
                              primary={d.title}
                              secondary={d.patientDisplayName}
                            />
                            <DraftStatusChip status={d.status} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyReview}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-recent-patients">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.recentPatients}
                  </Typography>
                  {recentPatients.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {recentPatients.map((p) => (
                        <Chip
                          key={p.id}
                          label={p.demoCaseCode ?? p.displayName}
                          clickable
                          variant={activePatient?.id === p.id ? 'filled' : 'outlined'}
                          onClick={() => {
                            setPatient(p);
                            void navigate({ to: '/comando' });
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyRecent}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-demo-tasks">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.demoTasks}
                  </Typography>
                  <Stack spacing={1}>
                    {work?.demoTasks.map((task) => (
                      <Stack key={task.id} direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {task.label}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          disabled={task.disabled}
                          onClick={() => void navigate({ to: '/comando' })}
                        >
                          {copy.dashboard.useCommand}
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </>
        ) : null}

        <Divider />
        <Button variant="text" onClick={() => void navigate({ to: '/comando' })}>
          {copy.layout.backToCommand}
        </Button>
      </Stack>
    </Box>
  );
}
