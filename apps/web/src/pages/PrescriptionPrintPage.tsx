import { copy } from '@epis2/design-system';
import { PrintA5Document, PrintField, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { readPrintPreview } from '../clinical/printPreviewStorage.js';
import { useAuth } from '../auth/AuthContext.js';
import { fetchPatientDetail, type PatientDetailResponse } from '../api/clinicalApi.js';
import { ErrorState } from '../components/ErrorState.js';

const ROUTE_LABELS: Record<string, string> = {
  oral: 'Oral',
  intravenosa: 'Intravenosa',
  topica: 'Tópica',
};

function labelForRoute(value: string | undefined): string {
  if (!value) return '—';
  const key = value.split('|')[0] ?? value;
  return ROUTE_LABELS[key] ?? value;
}

export function PrescriptionPrintPage() {
  const search = useSearch({ strict: false }) as { patientId?: string };
  const { session } = useAuth();
  const [detail, setDetail] = useState<PatientDetailResponse | null>(null);
  const [error, setError] = useState<string | undefined>();
  const values = useMemo(() => readPrintPreview('prescription') ?? {}, []);

  useEffect(() => {
    if (!search.patientId) return;
    void fetchPatientDetail(search.patientId)
      .then(setDetail)
      .catch(() => setError(copy.errors.genericMessage));
  }, [search.patientId]);

  if (!search.patientId) {
    return (
      <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />
    );
  }

  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  const physician = session?.user.displayName ?? copy.print.physicianFallback;
  const patientName = detail?.patient.displayName ?? copy.print.patientFallback;

  return (
    <Stack spacing={2} data-testid="epis2-prescription-print-page">
      <Stack direction="row" spacing={1} className="epis2-no-print" sx={{ '@media print': { display: 'none' } }}>
        <EpisButton appearance="outlined" onClick={() => window.history.back()}>
          {copy.print.backToForm}
        </EpisButton>
        <EpisButton appearance="filled" onClick={() => window.print()} data-testid="epis2-print-execute">
          {copy.print.printA5}
        </EpisButton>
      </Stack>
      <Typography variant="body2" color="text.secondary" className="epis2-no-print" sx={{ '@media print': { display: 'none' } }}>
        {copy.print.previewHint}
      </Typography>
      <PrintA5Document
        title={copy.print.prescriptionTitle}
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
        <PrintField label={copy.print.medication} value={values.medication} />
        <PrintField label={copy.print.dose} value={values.dose} />
        <PrintField label={copy.print.quantity} value={values.quantity} />
        <PrintField label={copy.print.route} value={labelForRoute(values.route)} />
        <PrintField label={copy.print.frequency} value={values.frequency} />
        <PrintField label={copy.print.duration} value={values.duration} />
        <PrintField label={copy.print.patientInstructions} value={values.patientInstructions} />
      </PrintA5Document>
    </Stack>
  );
}
