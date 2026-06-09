import { copy } from '@epis2/design-system';
import { PrintA5Document, PrintField, Stack, Typography } from '@epis2/epis2-ui';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
import { ErrorState } from '../components/ErrorState.js';

const CERTIFICATE_LABELS: Record<string, string> = {
  reposo: 'Certificado de reposo',
  asistencia: 'Certificado de asistencia',
  salud: 'Certificado de salud / aptitud',
};

function labelForCertificateType(value: string | undefined): string {
  if (!value) return '—';
  const key = value.split('|')[0] ?? value;
  return CERTIFICATE_LABELS[key] ?? value;
}

export function MedicalCertificatePrintPage() {
  const { patientId, values, error, physician, patientName } =
    usePrintPagePatient('medical_certificate');

  if (!patientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  return (
    <Stack spacing={2} data-testid="epis2-medical-certificate-print-page">
      <PrintPageToolbar printLabel={copy.print.printA5} />
      <PrintA5Document
        title={copy.print.medicalCertificateTitle}
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
        <PrintField label={copy.print.certificateType} value={labelForCertificateType(values.certificateType)} />
        <PrintField label={copy.print.diagnosis} value={values.diagnosisSummary} />
        <PrintField label={copy.print.restDays} value={values.restDays} />
        <PrintField label={copy.print.validFrom} value={values.validFrom} />
        <PrintField label={copy.print.validUntil} value={values.validUntil} />
        <PrintField label={copy.print.instructions} value={values.instructions} />
      </PrintA5Document>
    </Stack>
  );
}
