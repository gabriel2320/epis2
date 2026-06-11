import { copy } from '@epis2/design-system';
import { Stack } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { usePaperChartDraft } from '../clinical/usePaperChartDraft.js';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { PaperChartTemplate } from '../components/chart/paper/PaperChartTemplate.js';
import { PaperPageCanvas } from '../components/chart/paper/PaperPageCanvas.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión ficha papel — Carta / A5 (ADR-002 · visual FichaPapel). */
export function PaperChartPrintPage() {
  const search = useSearch({ strict: false }) as {
    patientId?: string;
    printFormat?: string;
    chartMode?: string;
  };
  const printFormat = search.printFormat === 'a5' ? 'a5' : 'letter';
  const { patientId, error: patientError, patientName } = usePrintPagePatient('paper_chart');
  const resolvedPatientId = search.patientId ?? patientId;
  const { values, loading, error: draftError, readOnly } = usePaperChartDraft(resolvedPatientId);

  if (!resolvedPatientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (patientError || draftError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={patientError ?? draftError ?? copy.errors.genericMessage}
      />
    );
  }

  const printLabel = printFormat === 'a5' ? copy.chartModes.printA5 : copy.chartModes.printLetter;

  return (
    <PaperPageCanvas>
      <Stack spacing={2} data-testid="epis2-paper-chart-print-page" sx={{ width: '100%' }}>
        <PrintPageToolbar printLabel={printLabel} />
        {readOnly ? (
          <Stack component="span" className="epis2-no-print" sx={{ fontSize: '11px', color: 'text.secondary' }}>
            {copy.chartModes.signedNotice}
          </Stack>
        ) : null}
        {loading ? (
          <Stack component="span" sx={{ color: 'text.secondary' }}>
            {copy.drafts.loading}
          </Stack>
        ) : (
          <PaperChartTemplate
            values={values}
            printFormat={printFormat}
            patientName={patientName}
            recordNumber={resolvedPatientId.slice(0, 8)}
          />
        )}
      </Stack>
    </PaperPageCanvas>
  );
}
