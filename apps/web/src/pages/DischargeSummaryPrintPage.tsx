import { copy } from '@epis2/design-system';
import {
  EpisButton,
  PrintField,
  PrintLetterDocument,
  PrintSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { readPrintPreview } from '../clinical/printPreviewStorage.js';
import { useAuth } from '../auth/AuthContext.js';
import { fetchPatientDetail, type PatientDetailResponse } from '../api/clinicalApi.js';
import { ErrorState } from '../components/ErrorState.js';

/** Vista impresión epicrisis — Carta vertical (norma §19.1, familia longitudinal). */
export function DischargeSummaryPrintPage() {
  const search = useSearch({ strict: false }) as { patientId?: string };
  const { session } = useAuth();
  const [detail, setDetail] = useState<PatientDetailResponse | null>(null);
  const [error, setError] = useState<string | undefined>();
  const values = useMemo(() => readPrintPreview('discharge_summary') ?? {}, []);

  useEffect(() => {
    if (!search.patientId) return;
    void fetchPatientDetail(search.patientId)
      .then(setDetail)
      .catch(() => setError(copy.errors.genericMessage));
  }, [search.patientId]);

  if (!search.patientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }

  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  const physician = session?.user.displayName ?? copy.print.physicianFallback;
  const patientName = detail?.patient.displayName ?? copy.print.patientFallback;

  return (
    <Stack spacing={2} data-testid="epis2-discharge-summary-print-page">
      <Stack
        direction="row"
        spacing={1}
        className="epis2-no-print"
        sx={{ '@media print': { display: 'none' } }}
      >
        <EpisButton appearance="outlined" onClick={() => window.history.back()}>
          {copy.print.backToForm}
        </EpisButton>
        <EpisButton
          appearance="filled"
          onClick={() => window.print()}
          data-testid="epis2-print-execute"
        >
          {copy.print.printLetter}
        </EpisButton>
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        className="epis2-no-print"
        sx={{ '@media print': { display: 'none' } }}
      >
        {copy.print.previewHint}
      </Typography>
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
