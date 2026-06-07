import { copy } from '@epis2/design-system';
import {
  Alert,
  Chip,
  EpisAppShellLayout,
  EpisDashboardShell,
  type EpisDashboardTab,
  EpisLoadingState,
  EpisMetric,
  EpisTaskList,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { readRecentPatients } from '../clinical/recentPatients.js';
import { useDashboardQueries } from '../query/hooks/useDashboardQueries.js';
import { useClinicalNavigate, type DashboardTab } from '../routes/clinicalNavigate.js';
import {
  Epis2NavigationRailFooter,
  useEpis2NavigationRailItems,
} from '../navigation/epis2NavigationRail.js';
import { ClinicalGlobalTopBar } from '../layouts/ClinicalGlobalTopBar.js';
import { PatientDashboardTab } from '../components/PatientDashboardTab.js';
import { QualityDashboardTab } from '../components/QualityDashboardTab.js';
import { NursingDashboardTab } from '../components/NursingDashboardTab.js';
import { PharmacyDashboardTab } from '../components/PharmacyDashboardTab.js';
import { ServiceDashboardTab } from '../components/ServiceDashboardTab.js';
import { ReceptionDashboardTab } from '../components/ReceptionDashboardTab.js';
import { EmergencyDashboardTab } from '../components/EmergencyDashboardTab.js';
import { IcuDashboardTab } from '../components/IcuDashboardTab.js';
import { OrDashboardTab } from '../components/OrDashboardTab.js';
import { ApsDashboardTab } from '../components/ApsDashboardTab.js';
import { SpecialtyDashboardTab } from '../components/SpecialtyDashboardTab.js';

const LazyDashboardWorklists = lazy(() =>
  import('../components/DashboardWorklists.js').then((m) => ({
    default: m.DashboardWorklists,
  })),
);

export function DashboardModeContent() {
  const search = useSearch({ strict: false }) as { tab?: string; patientId?: string };
  const navigate = useClinicalNavigate();
  const railItems = useEpis2NavigationRailItems();
  const { session, hasPermission } = useAuth();
  const role = session?.user.role;
  const canQuality = hasPermission('audit.read');
  const canNursing =
    role === 'nurse' || role === 'physician' || role === 'admin';
  const canPharmacy =
    role === 'pharmacist' || role === 'physician' || role === 'admin';
  const canReception = role === 'admin' || role === 'nurse' || role === 'physician';
  const canEmergency = role === 'admin' || role === 'nurse' || role === 'physician';
  const canIcu = role === 'admin' || role === 'nurse' || role === 'physician';
  const canOr = role === 'admin' || role === 'nurse' || role === 'physician';
  const canAps = role === 'admin' || role === 'nurse' || role === 'physician';
  const canSpecialty = role === 'admin' || role === 'nurse' || role === 'physician';
  const { patient: activePatient, setPatient } = useActivePatient();
  const tab = (
    search.tab === 'patient' ||
    search.tab === 'service' ||
    (search.tab === 'reception' && canReception) ||
    (search.tab === 'emergency' && canEmergency) ||
    (search.tab === 'icu' && canIcu) ||
    (search.tab === 'or' && canOr) ||
    (search.tab === 'aps' && canAps) ||
    (search.tab === 'specialty' && canSpecialty) ||
    (search.tab === 'nursing' && canNursing) ||
    (search.tab === 'pharmacy' && canPharmacy) ||
    (search.tab === 'quality' && canQuality)
      ? search.tab
      : 'work'
  ) as DashboardTab;
  const dashboardPatientId = search.patientId ?? activePatient?.id;

  const dashboardQueries = useDashboardQueries({
    tab,
    patientId: dashboardPatientId,
    canQuality,
    canNursing,
    canPharmacy,
    canReception,
    canEmergency,
    canIcu,
    canOr,
    canAps,
    canSpecialty,
  });

  const [recentPatients, setRecentPatients] = useState(readRecentPatients());

  useEffect(() => {
    if (dashboardQueries.work.data) {
      setRecentPatients(readRecentPatients());
    }
  }, [dashboardQueries.work.data]);

  const loading =
    tab === 'patient' && !dashboardPatientId ? false : dashboardQueries.active.isLoading;
  const error = dashboardQueries.active.isError ? copy.errors.genericMessage : undefined;
  const work = dashboardQueries.work.data ?? null;
  const patientBoard = dashboardQueries.patient.data ?? null;
  const serviceBoard = dashboardQueries.service.data ?? null;
  const nursingBoard = dashboardQueries.nursing.data ?? null;
  const pharmacyBoard = dashboardQueries.pharmacy.data ?? null;
  const qualityBoard = dashboardQueries.quality.data ?? null;
  const receptionBoard = dashboardQueries.reception.data ?? null;
  const emergencyBoard = dashboardQueries.emergency.data ?? null;
  const icuBoard = dashboardQueries.icu.data ?? null;
  const orBoard = dashboardQueries.or.data ?? null;
  const apsBoard = dashboardQueries.aps.data ?? null;
  const specialtyBoard = dashboardQueries.specialty.data ?? null;

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
    if (canNursing) {
      items.push({
        value: 'nursing',
        label: copy.dashboard.tabNursing,
        'data-testid': 'epis2-dashboard-tab-nursing',
      });
    }
    if (canPharmacy) {
      items.push({
        value: 'pharmacy',
        label: copy.dashboard.tabPharmacy,
        'data-testid': 'epis2-dashboard-tab-pharmacy',
      });
    }
    if (canQuality) {
      items.push({
        value: 'quality',
        label: copy.dashboard.tabQuality,
        'data-testid': 'epis2-dashboard-tab-quality',
      });
    }
    if (canReception) {
      items.push({
        value: 'reception',
        label: copy.dashboard.tabReception,
        'data-testid': 'epis2-dashboard-tab-reception',
      });
    }
    if (canEmergency) {
      items.push({
        value: 'emergency',
        label: copy.dashboard.tabEmergency,
        'data-testid': 'epis2-dashboard-tab-emergency',
      });
    }
    if (canIcu) {
      items.push({
        value: 'icu',
        label: copy.dashboard.tabIcu,
        'data-testid': 'epis2-dashboard-tab-icu',
      });
    }
    if (canOr) {
      items.push({
        value: 'or',
        label: copy.dashboard.tabOr,
        'data-testid': 'epis2-dashboard-tab-or',
      });
    }
    if (canAps) {
      items.push({
        value: 'aps',
        label: copy.dashboard.tabAps,
        'data-testid': 'epis2-dashboard-tab-aps',
      });
    }
    if (canSpecialty) {
      items.push({
        value: 'specialty',
        label: copy.dashboard.tabSpecialty,
        'data-testid': 'epis2-dashboard-tab-specialty',
      });
    }
    return items;
  }, [canQuality, canNursing, canPharmacy, canReception, canEmergency, canIcu, canOr, canAps, canSpecialty]);

  const openPatient = (pid: string) => {
    const p = recentPatients.find((r) => r.id === pid);
    if (p) setPatient(p);
    void navigate({
      to: '/espacio/ficha',
      search: { patientId: pid },
    });
  };

  const openReconciliation = (pid: string) => {
    const p = recentPatients.find((r) => r.id === pid);
    if (p) setPatient(p);
    void navigate({
      to: '/espacio/conciliacion',
      search: { patientId: pid },
    });
  };

  const openDraft = (draftId: string) => {
    void navigate({
      to: '/espacio/borrador/$draftId',
      params: { draftId },
    });
  };

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
          <Stack spacing={2}>
            <Alert severity="info">{copy.dashboard.patientRequiresSelection}</Alert>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={copy.dashboard.pickPatientAction}
                clickable
                variant="outlined"
                onClick={() => void navigate({ to: '/espacio/ficha' })}
              />
              <Chip
                label={copy.dashboard.searchPatientAction}
                clickable
                color="primary"
                onClick={() => void navigate({ to: '/espacio/buscar-paciente' })}
              />
            </Stack>
          </Stack>
        )}
      </>
    );
  } else if (tab === 'nursing') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : nursingBoard ? (
          <NursingDashboardTab
            data={nursingBoard}
            onOpenPatient={openPatient}
            onOpenDraft={openDraft}
            onOpenMarForm={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/mar',
                search: { patientId: pid },
              });
            }}
          />
        ) : (
          <Alert severity="info">{copy.dashboard.loading}</Alert>
        )}
      </>
    );
  } else if (tab === 'pharmacy') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : pharmacyBoard ? (
          <PharmacyDashboardTab
            data={pharmacyBoard}
            onOpenPatient={openPatient}
            onOpenDraft={openDraft}
            onOpenReconciliation={openReconciliation}
          />
        ) : (
          <Alert severity="info">{copy.dashboard.loading}</Alert>
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
            activePatientId={activePatient?.id}
            onReload={() => void dashboardQueries.service.refetch()}
            onOpenPatient={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/ficha',
                search: { patientId: pid },
              });
            }}
            onOpenEpicrisis={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/epicrisis',
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
  } else if (tab === 'reception') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : receptionBoard ? (
          <ReceptionDashboardTab
            data={receptionBoard}
            onOpenPatientSearch={() => void navigate({ to: '/espacio/buscar-paciente' })}
          />
        ) : null}
      </>
    );
  } else if (tab === 'emergency') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : emergencyBoard ? (
          <EmergencyDashboardTab
            data={emergencyBoard}
            activePatientId={activePatient?.id}
            onOpenPatient={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/ficha',
                search: { patientId: pid },
              });
            }}
            onOpenEpicrisis={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/epicrisis',
                search: { patientId: pid },
              });
            }}
          />
        ) : null}
      </>
    );
  } else if (tab === 'icu') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : icuBoard ? (
          <IcuDashboardTab
            data={icuBoard}
            onOpenPatient={openPatient}
            onOpenEpicrisis={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/epicrisis',
                search: { patientId: pid },
              });
            }}
            onOpenHandover={(pid) => {
              const p = recentPatients.find((r) => r.id === pid);
              if (p) setPatient(p);
              void navigate({
                to: '/espacio/enfermeria',
                search: { patientId: pid },
              });
            }}
          />
        ) : null}
      </>
    );
  } else if (tab === 'or') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : orBoard ? (
          <OrDashboardTab data={orBoard} onOpenPatient={openPatient} />
        ) : null}
      </>
    );
  } else if (tab === 'aps') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : apsBoard ? (
          <ApsDashboardTab data={apsBoard} onOpenPatient={openPatient} />
        ) : null}
      </>
    );
  } else if (tab === 'specialty') {
    panel = (
      <>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
        ) : specialtyBoard ? (
          <SpecialtyDashboardTab data={specialtyBoard} />
        ) : null}
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
                            void navigate({
                              to: '/espacio/ficha',
                              search: { patientId: p.id },
                            });
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
    <EpisAppShellLayout
      railItems={railItems}
      railFooter={<Epis2NavigationRailFooter />}
      appBar={<ClinicalGlobalTopBar active="dashboard" />}
      testId="epis2-dashboard-shell"
    >
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
    </EpisAppShellLayout>
  );
}
