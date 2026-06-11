import { copy } from '@epis2/design-system';
import { PrintField, PrintLetterDocument, PrintSection, Stack, Typography } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { PaperBridgeBackButton } from '../components/chart/paper/PaperBridgeBackButton.js';
import { navigateBackToPaperChart, parsePaperPrintSearch } from '../routes/paperDocumentBridge.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión epicrisis — Carta vertical (norma §19.1, familia longitudinal). */
export function DischargeSummaryPrintPage() {
  const { patientId, values, error, physician, patientName } =
    usePrintPagePatient('discharge_summary');
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
    <Stack spacing={2} data-testid="epis2-discharge-summary-print-page">
      {paperSearch.returnChartMode === 'paper' ? (
        <PaperBridgeBackButton onClick={() => navigateBackToPaperChart(navigate, patientId, 'letter')} />
      ) : null}
      <PrintPageToolbar printLabel={copy.print.printLetter} />
      <PrintLetterDocument
        title={copy.print.dischargeSummaryTitle}
        subtitle={`${patientName} · ${copy.demoBadge}`}
        status={copy.print.statusDraftDocument}
        footer={
          <>
            <PrintField label={copy.print.signedBy} value={physician} />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {copy.print.auditDemo}
            </Typography>
          </>
        }
      >
        <PrintSection title={copy.print.sectionDiagnoses}>
          <PrintField
            label={copy.print.diagnosis}
            {...(values.diagnoses !== undefined ? { value: values.diagnoses } : {})}
          />
        </PrintSection>
        <PrintSection title={copy.print.sectionHospitalization}>
          <PrintField
            label={copy.print.dischargeDate}
            {...(values.dischargeDate !== undefined ? { value: values.dischargeDate } : {})}
          />
          <PrintField
            label={copy.print.hospitalizationSummary}
            {...(values.hospitalizationSummary !== undefined
              ? { value: values.hospitalizationSummary }
              : {})}
          />
          <PrintField
            label={copy.print.evolution}
            {...(values.evolution !== undefined ? { value: values.evolution } : {})}
          />
        </PrintSection>
        <PrintSection title={copy.print.sectionDischarge}>
          <PrintField
            label={copy.print.dischargeMedications}
            {...(values.dischargeMedications !== undefined
              ? { value: values.dischargeMedications }
              : {})}
          />
          <PrintField
            label={copy.print.instructions}
            {...(values.instructions !== undefined ? { value: values.instructions } : {})}
          />
          <PrintField
            label={copy.print.followUpPlan}
            {...(values.followUpPlan !== undefined ? { value: values.followUpPlan } : {})}
          />
        </PrintSection>
      </PrintLetterDocument>
    </Stack>
  );
}
