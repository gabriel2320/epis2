import { copy } from '@epis2/design-system';
import {
  PrintField,
  PrintLetterDocument,
  PrintSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión epicrisis — Carta vertical (norma §19.1, familia longitudinal). */
export function DischargeSummaryPrintPage() {
  const { patientId, values, error, physician, patientName } =
    usePrintPagePatient('discharge_summary');

  if (!patientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  return (
    <Stack spacing={2} data-testid="epis2-discharge-summary-print-page">
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
          <PrintField label={copy.print.diagnosis} value={values.diagnoses} />
        </PrintSection>
        <PrintSection title={copy.print.sectionHospitalization}>
          <PrintField label={copy.print.dischargeDate} value={values.dischargeDate} />
          <PrintField
            label={copy.print.hospitalizationSummary}
            value={values.hospitalizationSummary}
          />
          <PrintField label={copy.print.evolution} value={values.evolution} />
        </PrintSection>
        <PrintSection title={copy.print.sectionDischarge}>
          <PrintField
            label={copy.print.dischargeMedications}
            value={values.dischargeMedications}
          />
          <PrintField label={copy.print.instructions} value={values.instructions} />
          <PrintField label={copy.print.followUpPlan} value={values.followUpPlan} />
        </PrintSection>
      </PrintLetterDocument>
    </Stack>
  );
}
