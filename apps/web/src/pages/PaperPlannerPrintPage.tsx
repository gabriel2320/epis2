import { copy } from '@epis2/design-system';
import { Stack } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { PaperPageCanvas } from '../components/chart/paper/PaperPageCanvas.js';
import {
  DailyClinicalPage,
  MonthlyClinicalPage,
  WeeklyClinicalPage,
} from '../components/chart/paper/planner/index.js';
import type { PaperPlannerView } from '../components/chart/paper/planner/types.js';
import { isPaperPlannerView } from '../components/chart/paper/planner/types.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión agenda papel — día/semana/mes (MF-PAPER-PLANNER-03). */
export function PaperPlannerPrintPage() {
  const search = useSearch({ strict: false }) as {
    patientId?: string;
    printFormat?: string;
    plannerView?: string;
    chartMode?: string;
  };
  const plannerView: PaperPlannerView =
    typeof search.plannerView === 'string' && isPaperPlannerView(search.plannerView)
      ? search.plannerView
      : 'day';
  const { patientId, error: patientError } = usePrintPagePatient('paper_chart');
  const resolvedPatientId = search.patientId ?? patientId;

  if (!resolvedPatientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (patientError) {
    return <ErrorState title={copy.errors.genericTitle} message={patientError} />;
  }

  const printLabel = copy.chartModes.paperPlanner.printAgenda;

  return (
    <PaperPageCanvas>
      <Stack spacing={2} data-testid="epis2-paper-planner-print-page" sx={{ width: '100%' }}>
        <PrintPageToolbar printLabel={printLabel} />
        {plannerView === 'week' ? (
          <WeeklyClinicalPage />
        ) : plannerView === 'month' ? (
          <MonthlyClinicalPage />
        ) : (
          <DailyClinicalPage />
        )}
      </Stack>
    </PaperPageCanvas>
  );
}
