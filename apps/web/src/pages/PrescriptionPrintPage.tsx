import { copy } from '@epis2/design-system';
import { PrintA5Document, PrintField, Stack, Typography } from '@epis2/epis2-ui';
import { usePrintPagePatient } from '../clinical/print/usePrintPagePatient.js';
import { PrintPageToolbar } from '../clinical/print/PrintPageToolbar.js';
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
  const { patientId, values, error, physician, patientName } = usePrintPagePatient('prescription');

  if (!patientId) {
    return <ErrorState title={copy.errors.genericTitle} message={copy.forms.needsPatient} />;
  }
  if (error) {
    return <ErrorState title={copy.errors.genericTitle} message={error} />;
  }

  return (
    <Stack spacing={2} data-testid="epis2-prescription-print-page">
      <PrintPageToolbar printLabel={copy.print.printA5} />
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
        <PrintField
          label={copy.print.medication}
          {...(values.medication !== undefined ? { value: values.medication } : {})}
        />
        <PrintField
          label={copy.print.dose}
          {...(values.dose !== undefined ? { value: values.dose } : {})}
        />
        <PrintField
          label={copy.print.quantity}
          {...(values.quantity !== undefined ? { value: values.quantity } : {})}
        />
        <PrintField label={copy.print.route} value={labelForRoute(values.route)} />
        <PrintField
          label={copy.print.frequency}
          {...(values.frequency !== undefined ? { value: values.frequency } : {})}
        />
        <PrintField
          label={copy.print.duration}
          {...(values.duration !== undefined ? { value: values.duration } : {})}
        />
        <PrintField
          label={copy.print.patientInstructions}
          {...(values.patientInstructions !== undefined
            ? { value: values.patientInstructions }
            : {})}
        />
      </PrintA5Document>
    </Stack>
  );
}
