import { copy } from '@epis2/design-system';
import { detectChronicFocus } from '@epis2/clinical-forms';
import { getProbablePatientActionChips, inferPatientCareSetting } from '@epis2/command-registry';
import { getDemoCaseByPatientId } from '@epis2/test-fixtures';
import { Link, useSearch } from '@tanstack/react-router';
import { classicModeToDualChartSearch, useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { Alert, EpisButton, Stack, Typography, epis2ShellContentIslandSx } from '@epis2/epis2-ui';
import { ClassicMd3WorkspaceLayout } from '../components/classic-md3/ClassicMd3WorkspaceLayout.js';
import { PatientClinicalSummaryGrid } from '../components/clinical-summary/PatientClinicalSummaryGrid.js';
import { useClassicMd3Mode } from '../modes/index.js';
import { useEpisSession } from '../session/EpisSessionContext.js';
import { classicCommandSuggestionLabels } from '../classic-md3/commandSuggestions.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import { EpisClinicalWorkspaceShell } from '../components/layout/EpisClinicalWorkspaceShell.js';
import { EpisSplitWorkspace } from '../components/layout/EpisSplitWorkspace.js';
import { INTENT_TO_ASSIST_BLUEPRINT } from '../api/clinicalApi.js';
import { usePatientDetailQuery } from '../query/hooks/usePatientDetailQuery.js';
import { usePatientClinicalSummaryQuery } from '../query/hooks/usePatientClinicalSummaryQuery.js';
import { usePatientLongitudinalQuery } from '../query/hooks/usePatientLongitudinalQuery.js';
import { mergeClinicalSummaryFields } from '../clinical/mergeClinicalSummaryFields.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { ErrorState } from '../components/ErrorState.js';
import { PatientListGrid } from '../components/PatientListGrid.js';
import { PatientClinicalSummaryPanel } from '../components/PatientClinicalSummaryPanel.js';
import { PatientLongitudinalPanel } from '../components/PatientLongitudinalPanel.js';
import { PatientRecentActivityBlock } from '../components/PatientRecentActivityBlock.js';
import { PatientSummaryAntecedentsBlock } from '../components/PatientSummaryAntecedentsBlock.js';
import { PatientSummaryDocumentsBlock } from '../components/PatientSummaryDocumentsBlock.js';
import { PatientWorkspaceCommandPanel } from '../components/PatientWorkspaceCommandPanel.js';
import { CommandConfirmationDialog } from '../components/CommandConfirmationDialog.js';
import { ClinicalProbableActionsPanel } from '../components/chart/ClinicalProbableActionsPanel.js';
import { DualChartPatientPage } from './DualChartPatientPage.js';
import { useEffect, useMemo, useState } from 'react';

export function PatientWorkspacePage() {
  const search = useSearch({ strict: false }) as {
    patientId?: string;
    mode?: string;
    chartMode?: string;
  };
  const navigate = useClinicalNavigate();
  const { session } = useAuth();
  const { openDashboardMode } = useEpisSession();
  const isClassicMode = useClassicMd3Mode();
  const isDualChart = isDualChartModesEnabled();
  const { patient: active, setPatient } = useActivePatient();
  const [alertBlueprintId, setAlertBlueprintId] = useState<string | undefined>();
  const [alertLabel, setAlertLabel] = useState<string | undefined>();
  const [patientsFetchEnabled, setPatientsFetchEnabled] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyFocus, setHistoryFocus] = useState<'timeline' | 'documents' | null>(null);
  const [supportingOpen, setSupportingOpen] = useState(true);

  const openHistory = (focus: 'timeline' | 'documents' | null = null) => {
    setHistoryFocus(focus);
    setHistoryOpen(true);
  };

  const patientId = search.patientId ?? active?.id;
  const commandContext = useCommandResolveContext('patient_chart');
  const classicCommand = useClinicalCommandSubmit({
    ...(patientId ? { patientId } : {}),
    commandContext,
    onResolved: (result) => {
      setAlertBlueprintId(INTENT_TO_ASSIST_BLUEPRINT[result.intent]);
      setAlertLabel(result.labelEs);
    },
  });

  const detailQuery = usePatientDetailQuery(patientId);
  const longitudinalQuery = usePatientLongitudinalQuery(patientId, Boolean(patientId));
  const clinicalSummaryQuery = usePatientClinicalSummaryQuery(patientId, Boolean(patientId));
  const { patients, refetch: refetchPatients } = usePatientsQuery({
    enabled: patientsFetchEnabled,
  });

  const {
    alerts: clinicalAlerts,
    loading: alertsLoading,
    contextLabel,
  } = usePatientClinicalAlerts({
    patientId,
    blueprintId: alertBlueprintId,
    contextLabel: alertLabel,
  });

  useEffect(() => {
    if (detailQuery.data) {
      setPatient(detailQuery.data.patient);
      setAlertBlueprintId(undefined);
      setAlertLabel(undefined);
    }
  }, [detailQuery.data, setPatient]);

  /** MF-DUAL-CHART-07: legacy ?mode=classic → chartMode=traditional cuando dual ficha activo. */
  useEffect(() => {
    if (!isDualChartModesEnabled() || search.mode !== 'classic' || !patientId) return;
    void navigate({
      to: '/espacio/ficha',
      search: classicModeToDualChartSearch(patientId),
      replace: true,
    });
  }, [navigate, patientId, search.mode]);

  const loadPatientList = () => {
    setPatientsFetchEnabled(true);
    void refetchPatients();
  };

  const detail = detailQuery.data ?? null;
  const longitudinal = longitudinalQuery.data ?? null;
  const clinicalSummary = clinicalSummaryQuery.data ?? null;
  const summaryFields = useMemo(
    () =>
      detail
        ? mergeClinicalSummaryFields(detail.clinicalContext.summaryFields, clinicalSummary)
        : {},
    [detail, clinicalSummary],
  );
  const error = detailQuery.isError ? copy.errors.genericMessage : undefined;
  const demoCase = useMemo(
    () => (patientId ? getDemoCaseByPatientId(patientId) : undefined),
    [patientId],
  );
  const pendingDraftCount = useMemo(
    () => longitudinal?.timeline.filter((event) => event.kind === 'draft').length ?? 0,
    [longitudinal?.timeline],
  );
  const chronicFocus = useMemo(() => {
    if (!summaryFields || Object.keys(summaryFields).length === 0) return null;
    return detectChronicFocus(summaryFields);
  }, [summaryFields]);
  const probableActionChips = useMemo(() => {
    if (!session || !patientId) return [];
    const chartMode = search.chartMode === 'paper' ? 'paper' : ('traditional' as const);
    return getProbablePatientActionChips({
      role: session.user.role,
      permissions: session.permissions,
      careSetting: inferPatientCareSetting({
        hospitalizado: clinicalSummary?.hospitalizado,
        scenarioLabel: demoCase?.scenario,
      }),
      context: {
        workspace: 'patient_chart',
        chartMode: isDualChart ? chartMode : 'traditional',
        pendingDraftCount,
        activeAlertCount: clinicalAlerts.length,
      },
      chronicFocus,
    });
  }, [
    session,
    patientId,
    clinicalSummary?.hospitalizado,
    demoCase?.scenario,
    pendingDraftCount,
    clinicalAlerts.length,
    chronicFocus,
    isDualChart,
    search.chartMode,
  ]);
  const onProbableAction = (label: string) => void classicCommand.submit(label);

  const openDraft = (draftId: string) => {
    void navigate({
      to: '/espacio/borrador/$draftId',
      params: { draftId },
    });
  };

  const longitudinalNav = {
    onOpenDraft: openDraft,
    onOpenNote: () => void navigate({ to: '/espacio/resumen', search: { patientId: patientId! } }),
    onRegisterAllergy: () =>
      void navigate({ to: '/espacio/alergia', search: { patientId: patientId! } }),
    onRegisterProblem: () =>
      void navigate({ to: '/espacio/problema', search: { patientId: patientId! } }),
    onRegisterSurgicalHistory: () =>
      void navigate({ to: '/espacio/problema', search: { patientId: patientId! } }),
    onOpenResults: () =>
      void navigate({ to: '/espacio/resultados', search: { patientId: patientId! } }),
    onAdmitHospital: () =>
      void navigate({ to: '/espacio/ingreso', search: { patientId: patientId! } }),
    onTransferNote: () =>
      void navigate({ to: '/espacio/traslado', search: { patientId: patientId! } }),
    onNursingNote: () =>
      void navigate({ to: '/espacio/enfermeria', search: { patientId: patientId! } }),
    onOpenServiceOrders: () => openDashboardMode('service'),
    onOpenServiceCensus: () => openDashboardMode('service'),
    onOpenNursingMar: () => openDashboardMode('nursing'),
  };

  if (!patientId) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx} data-testid="epis2-patient-workspace-pick">
        <Alert severity="info">{copy.activePatient.pinHint}</Alert>
        <EpisButton appearance="outlined" onClick={() => void loadPatientList()}>
          {copy.forms.searchPatients}
        </EpisButton>
        <PatientListGrid
          rows={patients}
          emptyMessage={copy.longitudinal.emptySection}
          onSelectPatient={(id) =>
            void navigate({
              to: '/espacio/ficha',
              search: { patientId: id, chartMode: 'traditional' },
            })
          }
          data-testid="epis2-workspace-patient-grid"
        />
        <EpisButton component={Link} to="/espacio/buscar-paciente" appearance="text">
          {copy.activePatient.searchForm}
        </EpisButton>
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
          onRetry={() => patientId && void detailQuery.refetch()}
          retryLabel={copy.errors.retry}
        />
        <ClinicalPageNav patientId={patientId} />
      </Stack>
    );
  }

  if (detailQuery.isLoading || !detail) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <Typography color="text.secondary">{copy.drafts.loading}</Typography>
      </Stack>
    );
  }

  const showAlerts = alertsLoading || clinicalAlerts.length > 0;

  const primaryColumn = (
    <Stack spacing={2}>
      <PatientClinicalSummaryPanel summaryFields={summaryFields} />

      {probableActionChips.length > 0 ? (
        <ClinicalProbableActionsPanel chips={probableActionChips} onSelect={onProbableAction} />
      ) : null}

      {showAlerts ? (
        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={contextLabel}
        />
      ) : null}

      {longitudinal ? (
        <>
          <PatientSummaryAntecedentsBlock
            allergies={longitudinal.allergies}
            problems={longitudinal.problems}
            onRegisterAllergy={longitudinalNav.onRegisterAllergy}
            onRegisterProblem={longitudinalNav.onRegisterProblem}
          />
          <PatientSummaryDocumentsBlock
            documents={longitudinal.documents}
            onViewDocumentIndex={() => openHistory('documents')}
          />
        </>
      ) : null}

      <PatientRecentActivityBlock
        events={longitudinal?.timeline ?? []}
        onOpenDraft={openDraft}
        onViewFullTimeline={() => openHistory('timeline')}
      />
    </Stack>
  );

  const secondaryColumn = longitudinal ? (
    <PatientLongitudinalPanel
      data={longitudinal}
      focusSection={historyOpen ? historyFocus : null}
      {...longitudinalNav}
    />
  ) : (
    <Typography color="text.secondary">{copy.drafts.loading}</Typography>
  );

  const allergyLabels = longitudinal?.allergies.map((a) => a.substance) ?? [];
  const alertLabels = clinicalAlerts.filter((a) => a.severity === 'critical').map((a) => a.message);
  const metaLine = [
    detail.patient.demoCaseCode,
    detail.clinicalContext.openEncounterId ? copy.classicMd3.episodeOpen : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

  const openSupportingTimeline = () => {
    setHistoryFocus('timeline');
    setSupportingOpen(true);
  };

  if (isClassicMode) {
    return (
      <>
        <ClassicMd3WorkspaceLayout
          patientId={patientId}
          patientDisplayName={detail.patient.displayName}
          metaLine={metaLine}
          allergyLabels={allergyLabels}
          alertLabels={alertLabels}
          supportingOpen={supportingOpen}
          onSupportingToggle={() => setSupportingOpen((v) => !v)}
          mainContent={
            <PatientClinicalSummaryGrid
              summaryFields={summaryFields}
              clinicalSummary={clinicalSummary}
              longitudinal={longitudinal}
              alerts={clinicalAlerts}
              onRegisterAllergy={longitudinalNav.onRegisterAllergy}
              onRegisterProblem={longitudinalNav.onRegisterProblem}
              onOpenResults={longitudinalNav.onOpenResults}
              onOpenDraft={openDraft}
              onViewFullTimeline={openSupportingTimeline}
              onOpenEvolution={longitudinalNav.onOpenNote}
              probableActionChips={probableActionChips}
              onProbableAction={onProbableAction}
            />
          }
          supportingContent={
            longitudinal ? (
              <PatientLongitudinalPanel
                data={longitudinal}
                focusSection={historyFocus}
                {...longitudinalNav}
              />
            ) : (
              <Typography color="text.secondary">{copy.drafts.loading}</Typography>
            )
          }
          commandQuery={classicCommand.query}
          onCommandQueryChange={classicCommand.setQuery}
          onCommandSubmit={() => void classicCommand.submit()}
          commandSuggestions={classicCommandSuggestionLabels(classicCommand.lastResult)}
          onCommandSuggestion={(label) => void classicCommand.submit(label)}
        />
        <CommandConfirmationDialog
          pending={classicCommand.pendingConfirmation}
          onConfirm={classicCommand.confirmPending}
          onCancel={classicCommand.cancelPending}
        />
      </>
    );
  }

  if (isDualChart) {
    return (
      <DualChartPatientPage
        patientId={patientId}
        detail={detail}
        summaryFields={summaryFields}
        clinicalSummary={clinicalSummary}
        longitudinal={longitudinal}
        clinicalAlerts={clinicalAlerts}
        onOpenDraft={openDraft}
        onRegisterAllergy={longitudinalNav.onRegisterAllergy}
        onRegisterProblem={longitudinalNav.onRegisterProblem}
        onOpenResults={longitudinalNav.onOpenResults}
        onOpenEvolution={longitudinalNav.onOpenNote}
        onViewFullTimeline={openSupportingTimeline}
        probableActionChips={probableActionChips}
        onProbableAction={onProbableAction}
      />
    );
  }

  return (
    <>
      <EpisClinicalWorkspaceShell screenKind="workspace" testId="epis2-patient-workspace">
        <EpisSplitWorkspace
          persistKey="patient-ficha-history"
          primary={primaryColumn}
          secondary={secondaryColumn}
          open={historyOpen}
          onOpenChange={(open) => {
            setHistoryOpen(open);
            if (!open) setHistoryFocus(null);
          }}
          openLabel={copy.activePatient.viewFullHistory}
          closeLabel={copy.activePatient.hideFullHistory}
          toggleTestId="epis2-ficha-history"
          testId="epis2-ficha-split"
        />
      </EpisClinicalWorkspaceShell>

      <PatientWorkspaceCommandPanel
        patientId={patientId}
        onResolved={(intent, labelEs) => {
          setAlertBlueprintId(INTENT_TO_ASSIST_BLUEPRINT[intent]);
          setAlertLabel(labelEs);
        }}
      />
    </>
  );
}
