import { copy } from '@epis2/design-system';
import { PrintA5Document, PrintField, Stack, Typography } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { PaperBridgeBackButton } from '../components/chart/paper/PaperBridgeBackButton.js';
import { navigateBackToPaperChart, parsePaperPrintSearch } from '../routes/paperDocumentBridge.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { printPriorityLabel } from '../clinical/print/printValueLabels.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión orden de imagenología — A5 vertical (norma §19.7). */
export function ImagingRequestPrintPage() {
  const { patientId, values, error, physician, patientName } =
    usePrintPagePatient('imaging_request');
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const paperSearch = parsePaperPrintSearch(rawSearch);
  const navigate = useClinicalNavigate();

  if (!patientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  return (
    <Stack spacing={2} data-testid="epis2-imaging-request-print-page">
      {paperSearch.returnChartMode === 'paper' ? (
        <PaperBridgeBackButton
          onClick={() => navigateBackToPaperChart(navigate, patientId, 'a5')}
        />
      ) : null}
      <PrintPageToolbar printLabel={copy.print.printA5} />
      <PrintA5Document
        title={copy.print.imagingRequestTitle}
        subtitle={`${patientName} · ${copy.demoBadge}`}
        footer={
          <>
            <PrintField label={copy.print.signedBy} value={physician} />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {copy.print.auditDemo}
            </Typography>
          </>
        }
      >
        <PrintField
          label={copy.print.scheduledDate}
          {...(values.scheduledDate !== undefined ? { value: values.scheduledDate } : {})}
        />
        <PrintField
          label={copy.print.modality}
          {...(values.modality !== undefined ? { value: values.modality } : {})}
        />
        <PrintField
          label={copy.print.studyDescription}
          {...(values.studyDescription !== undefined ? { value: values.studyDescription } : {})}
        />
        <PrintField
          label={copy.print.clinicalIndication}
          {...(values.clinicalIndication !== undefined ? { value: values.clinicalIndication } : {})}
        />
        <PrintField label={copy.print.priority} value={printPriorityLabel(values.priority)} />
      </PrintA5Document>
    </Stack>
  );
}
