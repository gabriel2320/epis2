import { copy } from '@epis2/design-system';
import {
  Alert,
  Chip,
  EpisDashboardShell,
  type EpisDashboardTab,
  EpisLoadingState,
  EpisMetric,
  EpisTaskList,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
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
import { useClinicalNavigate, type DashboardTab } from '../routes/clinicalNavigate.js';
import { PatientDashboardTab } from '../components/PatientDashboardTab.js';
import { QualityDashboardTab } from '../components/QualityDashboardTab.js';
import { ServiceDashboardTab } from '../components/ServiceDashboardTab.js';

const LazyDashboardWorklists = lazy(() =>
  import('../components/DashboardWorklists.js').then((m) => ({
    default: m.DashboardWorklists,
  })),
);

export function DashboardModeContent() {
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
      search: {
        tab: next,
        ...(dashboardPatientId ? { patientId: dashboardPatientId } : {}),
      },
    });
  };

  const tabs = useMemo((): EpisDashboardTab[] => {
    const items: EpisDashboardTab[] = [
      {
        value: 'work',
        label: copy.dashboard.tabWork,
        'data-testid': 'epis2-dashboard-tab-work',
      },
      {
        value: 'patient',
        label: copy.dashboard.tabPatient,
        'data-testid': 'epis2-dashboard-tab-patient',
      },
      {
        value: 'service',
        label: copy.dashboard.tabService,
        'data-testid': 'epis2-dashboard-tab-service',
      },
    ];
    if (canQuality) {
      items.push({
        value: 'quality',
        label: copy.dashboard.tabQuality,
        'data-testid': 'epis2-dashboard-tab-quality',
      });
    }
    return items;
  }, [canQuality]);

  const goCommand = () => void navigate({ to: '/comando' });

  let panel: ReactNode = null;

  if (tab === 'patient') {
    panel = (
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
    );
  } else if (tab === 'service') {
    panel = (
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
    );
  } else if (tab === 'quality') {
    panel = (
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
    );
  } else {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : (
          <Stack spacing={3}>
            {work ? (
              <>
                <Stack direction="row" flexWrap="wrap" gap={2} data-testid="epis2-dashboard-work-metrics">
                  <EpisMetric
                    label={copy.dashboard.metricOpenDrafts}
                    value={work.myOpenDrafts.length}
                    data-testid="epis2-metric-open-drafts"
                  />
                  <EpisMetric
                    label={copy.dashboard.metricPendingReview}
                    value={work.pendingReview.length}
                    data-testid="epis2-metric-pending-review"
                  />
                  <EpisMetric
                    label={copy.dashboard.metricDemoTasks}
                    value={work.demoTasks.length}
                    data-testid="epis2-metric-demo-tasks"
                  />
                </Stack>
                <Suspense fallback={<EpisLoadingState label={copy.dashboard.gridLoading} />}>
                  <LazyDashboardWorklists
                    work={work}
                    onOpenDraft={(draftId) =>
                      void navigate({
                        to: '/espacio/borrador/$draftId',
                        params: { draftId },
                      })
                    }
                  />
                </Suspense>
                <Stack spacing={1} data-testid="epis2-dashboard-recent-patients">
                  <Typography variant="subtitle2">{copy.dashboard.recentPatients}</Typography>
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
                            goCommand();
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyRecent}
                    </Typography>
                  )}
                </Stack>
                <EpisTaskList
                  title={copy.dashboard.demoTasks}
                  items={work.demoTasks.map((task) => ({
                    id: task.id,
                    label: task.label,
                    actionLabel: copy.dashboard.useCommand,
                    disabled: task.disabled,
                    onAction: goCommand,
                  }))}
                  data-testid="epis2-dashboard-demo-tasks"
                />
              </>
            ) : null}
          </Stack>
        )}
      </>
    );
  }

  return (
    <EpisDashboardShell
      title={copy.dashboard.title}
      subtitle={copy.dashboard.subtitle}
      demoBadge={copy.demoBadge}
      tabs={tabs}
      activeTab={tab}
      onTabChange={(v) => setTab(v as DashboardTab)}
      onBackToCommand={goCommand}
      backLabel={copy.layout.backToCommand}
      data-testid="epis2-dashboard-mode"
    >
      {panel}
    </EpisDashboardShell>
  );
}
