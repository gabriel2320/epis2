import { copy } from '@epis2/design-system';
import { Typography } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { classicCommandSuggestionLabels } from '../../classic-md3/commandSuggestions.js';
import { useClinicalCommandSubmit } from '../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../clinical/useCommandResolveContext.js';
import { parseChartMode, type ChartModeId } from '../../dev/dualChartModesEnv.js';
import { CommandConfirmationDialog } from '../../components/CommandConfirmationDialog.js';
import { ClinicalShell } from '../../components/chart/ClinicalShell.js';
import { PaperChartMode } from '../../components/chart/PaperChartMode.js';
import { TraditionalEhrMode } from '../../components/chart/TraditionalEhrMode.js';

const DEMO_PATIENT = {
  displayName: 'Paciente Demo — Elena M. Fuentes',
  metaLine: 'DEMO-005 · Consulta ambulatoria',
  nationalId: 'DEMO-005 · Identificador demo',
  ageYears: 77,
  sexLabel: 'Femenino',
  serviceUnit: 'Bacteriemia en evaluación — FA y polifarmacia (demo)',
  allergyLabels: ['Penicilina'],
  summaryFields: {
    activeProblems: 'Infección respiratoria (demo)',
    activeMedications: 'Ceftriaxona 1 g IV (demo)',
    relevantLabs: 'PCR elevada (demo)',
  },
};

/** Preview ADR-002 — `/dev/chart-modes` bajo flag. */
export function DualChartModesPreviewPage() {
  const search = useSearch({ strict: false }) as { chartMode?: string };
  const [chartMode, setChartMode] = useState<ChartModeId>(parseChartMode(search.chartMode));
  const commandContext = useCommandResolveContext('patient_chart');
  const classicCommand = useClinicalCommandSubmit({
    patientId: 'preview-patient',
    commandContext,
  });

  return (
    <>
      <ClinicalShell
        chartMode={chartMode}
        onChartModeChange={setChartMode}
        displayName={DEMO_PATIENT.displayName}
        metaLine={DEMO_PATIENT.metaLine}
        nationalId={DEMO_PATIENT.nationalId}
        ageYears={DEMO_PATIENT.ageYears}
        sexLabel={DEMO_PATIENT.sexLabel}
        serviceUnit={DEMO_PATIENT.serviceUnit}
        allergyLabels={DEMO_PATIENT.allergyLabels}
        commandQuery={classicCommand.query}
        onCommandQueryChange={classicCommand.setQuery}
        onCommandSubmit={() => void classicCommand.submit()}
        commandSuggestions={classicCommandSuggestionLabels(classicCommand.lastResult)}
        onCommandSuggestion={(label: string) => void classicCommand.submit(label)}
        showDemoBadge
      >
        {chartMode === 'paper' ? (
          <PaperChartMode
            patientName={DEMO_PATIENT.displayName}
            recordNumber="DEMO-005"
            initialValues={{ anamnesis: 'Motivo de consulta demo…' }}
          />
        ) : (
          <TraditionalEhrMode
            summaryFields={DEMO_PATIENT.summaryFields}
            contextPane={
              <Typography variant="body2" color="text.secondary">
                {copy.chartModes.contextPaneTitle} — panel demo IA local (Ollama) sin PHI.
              </Typography>
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
