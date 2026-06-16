import { copy } from '@epis2/design-system';
import { buildClinicalContextDense } from '@epis2/clinical-domain';
import { getDemoCaseByPatientId } from '../fixtures/devFixturesBridge.js';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import type { CommandChip } from '@epis2/command-registry';
import { useAuth } from '../auth/AuthContext.js';
import { classicCommandSuggestionLabels } from '../classic-md3/commandSuggestions.js';
import { useCommandDictionarySuggestions } from '../clinical/useCommandDictionarySuggestions.js';
import { ClinicalShell } from '../components/chart/ClinicalShell.js';
import { ClinicalContextDenseStrip } from '../components/chart/ClinicalContextDenseStrip.js';
import { PaperChartMode } from '../components/chart/PaperChartMode.js';
import { TraditionalEhrMode } from '../components/chart/TraditionalEhrMode.js';
import { CommandConfirmationDialog } from '../components/CommandConfirmationDialog.js';
import { EpisClinicalContextPane } from '../components/EpisClinicalContextPane.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useOperationalMemory } from '../clinical/useOperationalMemory.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import type { ChartModeId } from '../dev/dualChartModesEnv.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { parseChartModeSearch, resolveChartMode } from '../routes/chartModeSearch.js';
import type { PatientDetailResponse } from '../api/clinicalApi.js';

function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

function demoNationalId(demoCaseCode: string | undefined): string | undefined {
  if (!demoCaseCode) return undefined;
  return `${demoCaseCode} · ${copy.chartModes.identitySyntheticId}`;
}

export type DualChartPatientPageProps = {
  patientId: string;
  detail: PatientDetailResponse;
  summaryFields: Record<string, string>;
  clinicalSummary: PatientClinicalSummaryResponse | null;
  longitudinal: PatientLongitudinalResponse | null;
  clinicalAlerts: readonly ClinicalAlert[];
  onOpenDraft: (draftId: string) => void;
  onRegisterAllergy: () => void;
  onRegisterProblem: () => void;
  onOpenResults: () => void;
  onOpenEvolution: () => void;
  onViewFullTimeline: () => void;
  probableActionChips: readonly CommandChip[];
  onProbableAction: (commandSample: string) => void;
};

/** Ficha dual ADR-002 — tradicional | papel bajo flag (MF-DUAL-CHART-03). */
export function DualChartPatientPage({
  patientId,
  detail,
  summaryFields,
  clinicalSummary,
  longitudinal,
  clinicalAlerts,
  onOpenDraft,
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenEvolution,
  onViewFullTimeline,
  probableActionChips,
  onProbableAction,
}: DualChartPatientPageProps) {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useClinicalNavigate();
  const { session } = useAuth();
  const chartSearch = parseChartModeSearch(rawSearch);
  const chartMode: ChartModeId = resolveChartMode(chartSearch);
  const demoCase = useMemo(() => getDemoCaseByPatientId(patientId), [patientId]);
  const [contextEventCount, setContextEventCount] = useState<number | undefined>();
  const [focusTimelineSection, setFocusTimelineSection] = useState<'navEvolution' | undefined>();

  const handleViewFullTimeline = () => {
    setFocusTimelineSection('navEvolution');
    onViewFullTimeline();
  };

  useEffect(() => {
    if (rawSearch.chartMode === 'traditional' || rawSearch.chartMode === 'paper') return;
    void navigate({
      to: '/espacio/ficha',
      search: { patientId, chartMode: 'traditional' },
      replace: true,
    });
  }, [navigate, patientId, rawSearch.chartMode]);

  const commandContext = useCommandResolveContext('patient_chart');
  const classicCommand = useClinicalCommandSubmit({
    patientId,
    commandContext,
    onResolved: () => {},
  });

  const { savedTraditionalSection, saveTraditionalSection, catalogUsage } = useOperationalMemory({
    patientId,
  });

  const dictionarySuggestions = useCommandDictionarySuggestions(classicCommand.query, {
    patientId,
    catalogUsage,
  });
  const clarificationSuggestions = classicCommandSuggestionLabels(classicCommand.lastResult);
  const commandSuggestions =
    clarificationSuggestions && clarificationSuggestions.length > 0
      ? clarificationSuggestions
      : dictionarySuggestions.length > 0
        ? [...dictionarySuggestions]
        : undefined;

  const setChartMode = (mode: ChartModeId) => {
    void navigate({
      to: '/espacio/ficha',
      search: { patientId, chartMode: mode },
    });
  };

  const allergyLabels = longitudinal?.allergies.map((a) => a.substance) ?? [];
  const metaLine = [
    detail.patient.demoCaseCode,
    detail.clinicalContext.openEncounterId ? copy.classicMd3.episodeOpen : undefined,
  ]
    .filter(Boolean)
    .join(' · ');
  const sexLabel =
    demoCase?.sex === 'F'
      ? copy.chartModes.sexFemale
      : demoCase?.sex === 'M'
        ? copy.chartModes.sexMale
        : undefined;
  const roleKey = session?.user.role as keyof typeof copy.roles | undefined;
  const userRoleLabel = roleKey ? (copy.roles[roleKey] ?? roleKey) : undefined;

  const contextDense = useMemo(() => {
    if (!longitudinal) return null;
    return buildClinicalContextDense({
      problems: longitudinal.problems,
      medications: longitudinal.medications,
      observations: longitudinal.observations,
      encounters: longitudinal.encounters,
      ultimoEncuentroAt: clinicalSummary?.ultimoEncuentroAt ?? null,
      openEncounterId: detail.clinicalContext.openEncounterId ?? null,
      careSettingLabel: demoCase?.scenario ?? copy.careSettings.ambulatory,
    });
  }, [
    longitudinal,
    clinicalSummary?.ultimoEncuentroAt,
    detail.clinicalContext.openEncounterId,
    demoCase?.scenario,
  ]);

  return (
    <>
      <ClinicalShell
        chartMode={chartMode}
        onChartModeChange={setChartMode}
        displayName={detail.patient.displayName}
        metaLine={metaLine}
        nationalId={demoNationalId(detail.patient.demoCaseCode)}
        ageYears={demoCase ? ageFromBirthDate(demoCase.birthDate) : undefined}
        sexLabel={sexLabel}
        serviceUnit={demoCase?.scenario ?? copy.chartModes.shellServiceDefault}
        headerServiceUnit={copy.careSettings.ambulatory}
        allergyLabels={allergyLabels}
        documentStatus="draft"
        userDisplayName={session?.user.displayName}
        userRoleLabel={userRoleLabel}
        onNewEvolution={onOpenEvolution}
        onNewOrder={onRegisterProblem}
        onOpenLab={onOpenResults}
        onOpenPrescription={() =>
          void navigate({
            to: '/espacio/receta',
            search: {
              patientId,
              ...(chartMode === 'paper' ? { chartMode: 'paper' as const } : {}),
            },
          })
        }
        commandQuery={classicCommand.query}
        onCommandQueryChange={classicCommand.setQuery}
        onCommandSubmit={() => void classicCommand.submit()}
        commandSuggestions={commandSuggestions}
        onCommandSuggestion={(label) => void classicCommand.submit(label)}
        contextDenseStrip={<ClinicalContextDenseStrip dense={contextDense} />}
        testId="epis2-dual-chart-ficha"
      >
        {chartMode === 'paper' ? (
          <PaperChartMode
            patientId={patientId}
            patientName={detail.patient.displayName}
            recordNumber={detail.patient.demoCaseCode ?? detail.patient.id.slice(0, 8)}
            userDisplayName={session?.user.displayName}
            patientStrip={{
              nationalId: demoNationalId(detail.patient.demoCaseCode),
              ageYears: demoCase ? ageFromBirthDate(demoCase.birthDate) : undefined,
              sexLabel,
              serviceUnit: demoCase?.scenario ?? copy.chartModes.shellServiceDefault,
              allergyLabels,
            }}
          />
        ) : (
          <TraditionalEhrMode
            demoCaseCode={detail.patient.demoCaseCode ?? demoCase?.demoCaseCode}
            summaryFields={summaryFields}
            clinicalSummary={clinicalSummary}
            longitudinal={longitudinal}
            alerts={clinicalAlerts}
            onRegisterAllergy={onRegisterAllergy}
            onRegisterProblem={onRegisterProblem}
            onOpenResults={onOpenResults}
            onOpenDraft={onOpenDraft}
            onViewFullTimeline={handleViewFullTimeline}
            onOpenEvolution={onOpenEvolution}
            probableActionChips={probableActionChips}
            onProbableAction={onProbableAction}
            initialTraditionalSection={savedTraditionalSection}
            focusTraditionalSection={focusTimelineSection}
            onTraditionalSectionPersist={saveTraditionalSection}
            contextEventCount={contextEventCount}
            contextPane={
              <EpisClinicalContextPane
                patientId={patientId}
                onTimelineCountChange={setContextEventCount}
                clinicalAlerts={clinicalAlerts}
                summaryFields={summaryFields}
                longitudinalSnapshot={
                  longitudinal
                    ? {
                        allergies: longitudinal.allergies,
                        observations: longitudinal.observations,
                      }
                    : undefined
                }
              />
            }
          />
        )}
      </ClinicalShell>
      <CommandConfirmationDialog
        pending={classicCommand.pendingConfirmation}
        onConfirm={classicCommand.confirmPending}
        onCancel={classicCommand.cancelPending}
      />
    </>
  );
}
