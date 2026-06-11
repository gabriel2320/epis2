import { copy } from '@epis2/design-system';
import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';
import { classicCommandSuggestionLabels } from '../classic-md3/commandSuggestions.js';
import { ClinicalShell } from '../components/chart/ClinicalShell.js';
import { PaperChartMode } from '../components/chart/PaperChartMode.js';
import { TraditionalEhrMode } from '../components/chart/TraditionalEhrMode.js';
import { CommandConfirmationDialog } from '../components/CommandConfirmationDialog.js';
import { EpisClinicalContextPane } from '../components/EpisClinicalContextPane.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import type { ChartModeId } from '../dev/dualChartModesEnv.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { parseChartModeSearch, resolveChartMode } from '../routes/chartModeSearch.js';
import type { PatientDetailResponse } from '../api/clinicalApi.js';

export type DualChartPatientPageProps = {
  patientId: string;
  detail: PatientDetailResponse;
  longitudinal: PatientLongitudinalResponse | null;
  clinicalAlerts: readonly ClinicalAlert[];
  onOpenDraft: (draftId: string) => void;
  onRegisterAllergy: () => void;
  onRegisterProblem: () => void;
  onOpenResults: () => void;
  onOpenEvolution: () => void;
  onViewFullTimeline: () => void;
};

/** Ficha dual ADR-002 — tradicional | papel bajo flag (MF-DUAL-CHART-03). */
export function DualChartPatientPage({
  patientId,
  detail,
  longitudinal,
  clinicalAlerts,
  onOpenDraft,
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenEvolution,
  onViewFullTimeline,
}: DualChartPatientPageProps) {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useClinicalNavigate();
  const chartSearch = parseChartModeSearch(rawSearch);
  const chartMode: ChartModeId = resolveChartMode(chartSearch);

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

  return (
    <>
      <ClinicalShell
        chartMode={chartMode}
        onChartModeChange={setChartMode}
        displayName={detail.patient.displayName}
        metaLine={metaLine}
        allergyLabels={allergyLabels}
        commandQuery={classicCommand.query}
        onCommandQueryChange={classicCommand.setQuery}
        onCommandSubmit={() => void classicCommand.submit()}
        commandSuggestions={classicCommandSuggestionLabels(classicCommand.lastResult)}
        onCommandSuggestion={(label) => void classicCommand.submit(label)}
        testId="epis2-dual-chart-ficha"
      >
        {chartMode === 'paper' ? (
          <PaperChartMode
            patientId={patientId}
            patientName={detail.patient.displayName}
            recordNumber={detail.patient.demoCaseCode ?? detail.patient.id.slice(0, 8)}
          />
        ) : (
          <TraditionalEhrMode
            summaryFields={detail.clinicalContext.summaryFields}
            longitudinal={longitudinal}
            alerts={clinicalAlerts}
            onRegisterAllergy={onRegisterAllergy}
            onRegisterProblem={onRegisterProblem}
            onOpenResults={onOpenResults}
            onOpenDraft={onOpenDraft}
            onViewFullTimeline={onViewFullTimeline}
            onOpenEvolution={onOpenEvolution}
            contextPane={<EpisClinicalContextPane patientId={patientId} />}
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
