import { copy } from '@epis2/design-system';
import {
  Box,
  epis2PaperChartTokens,
  epis2PaperFieldLabelSx,
  epis2PaperPatientStripSx,
} from '@epis2/epis2-ui';

export type PaperPatientStripProps = {
  patientName: string;
  recordNumber: string;
  nationalId?: string | undefined;
  ageYears?: number | undefined;
  sexLabel?: string | undefined;
  serviceUnit?: string | undefined;
  bedLabel?: string | undefined;
  admissionDate?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  testId?: string | undefined;
};

function StripCell({ label, value }: { label: string; value: string }) {
  const t = epis2PaperChartTokens;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Box component="span" sx={{ ...epis2PaperFieldLabelSx(), mb: 0.25 }}>
        {label}
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: t.typography.body,
          fontSize: '12px',
          fontWeight: 600,
          color: t.navyHeader,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

/** Franja identidad paciente sobre la hoja — referencia FichaPapel. */
export function PaperPatientStrip({
  patientName,
  recordNumber,
  nationalId,
  ageYears,
  sexLabel,
  serviceUnit,
  bedLabel,
  admissionDate,
  allergyLabels,
  testId = 'epis2-paper-patient-strip',
}: PaperPatientStripProps) {
  const t = epis2PaperChartTokens;
  const allergies = allergyLabels?.filter(Boolean) ?? [];
  const hasAllergies = allergies.length > 0;

  const cells: { label: string; value: string }[] = [
    { label: copy.chartModes.paperStripPatient, value: patientName },
    { label: copy.chartModes.identityRun, value: nationalId ?? recordNumber },
  ];

  if (ageYears !== undefined) {
    cells.push({ label: copy.chartModes.identityAge, value: `${ageYears} años` });
  }
  if (sexLabel) {
    cells.push({ label: copy.chartModes.identitySex, value: sexLabel });
  }
  if (bedLabel) {
    cells.push({ label: copy.chartModes.identityBed, value: bedLabel });
  }
  if (serviceUnit) {
    cells.push({ label: copy.chartModes.identityService, value: serviceUnit });
  }
  if (admissionDate) {
    cells.push({ label: copy.chartModes.identityAdmission, value: admissionDate });
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2PaperPatientStripSx(),
        px: { xs: 2, md: 2.5 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, md: 3.5 },
        flexWrap: 'wrap',
      }}
    >
      {cells.map((cell) => (
        <StripCell key={cell.label} label={cell.label} value={cell.value} />
      ))}

      {hasAllergies ? (
        <Box
          sx={{
            ml: { md: 'auto' },
            bgcolor: t.allergyAlert,
            color: 'common.white',
            px: 1.5,
            py: 0.5,
            borderRadius: 0.5,
            fontFamily: t.typography.institution,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
          data-testid="epis2-paper-allergy-alert"
        >
          ⚠ {copy.chartModes.identityAllergies}: {allergies.join(', ')}
        </Box>
      ) : null}
    </Box>
  );
}
