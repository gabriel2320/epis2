import { copy } from '@epis2/design-system';
import { Box, Chip, Stack, Typography, epis2ClinicalShellTokens } from '@epis2/epis2-ui';

export type PatientDocumentStatus = 'draft' | 'signed' | 'locked';

export type PatientIdentityBandProps = {
  displayName: string;
  nationalId?: string | undefined;
  ageYears?: number | undefined;
  sexLabel?: string | undefined;
  bedLabel?: string | undefined;
  serviceUnit?: string | undefined;
  admissionDate?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  documentStatus?: PatientDocumentStatus | undefined;
  metaLine?: string | undefined;
  testId?: string | undefined;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

function documentStatusLabel(status: PatientDocumentStatus): string {
  if (status === 'signed') return copy.chartModes.documentStatusSigned;
  if (status === 'locked') return copy.chartModes.documentStatusLocked;
  return copy.chartModes.documentStatusDraft;
}

function IdentityField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0} sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} noWrap lineHeight={1.3}>
        {value}
      </Typography>
    </Stack>
  );
}

/** Capa 2 — identidad paciente + alergias siempre visibles (canon visual §2). */
export function PatientIdentityBand({
  displayName,
  nationalId,
  ageYears,
  sexLabel,
  bedLabel,
  serviceUnit,
  admissionDate,
  allergyLabels = [],
  documentStatus = 'draft',
  metaLine,
  testId = 'epis2-patient-identity-band',
}: PatientIdentityBandProps) {
  const allergiesVisible = allergyLabels.length > 0;

  return (
    <Stack
      data-testid={testId}
      spacing={1}
      sx={{
        minHeight: epis2ClinicalShellTokens.identityBandMinHeight,
        px: 2,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
        <Box
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: epis2ClinicalShellTokens.institutionalNavy,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initials(displayName)}
        </Box>
        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {displayName}
          </Typography>
          {metaLine ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {metaLine}
            </Typography>
          ) : null}
        </Stack>
        <Chip
          size="small"
          variant="outlined"
          label={documentStatusLabel(documentStatus)}
          data-testid="epis2-patient-document-status"
        />
      </Stack>

      <Stack
        direction="row"
        flexWrap="wrap"
        useFlexGap
        spacing={2}
        alignItems="center"
        data-testid="epis2-patient-identity-fields"
      >
        {nationalId ? (
          <IdentityField label={copy.chartModes.identityRun} value={nationalId} />
        ) : null}
        {ageYears != null ? (
          <IdentityField label={copy.chartModes.identityAge} value={`${ageYears} años`} />
        ) : null}
        {sexLabel ? <IdentityField label={copy.chartModes.identitySex} value={sexLabel} /> : null}
        {bedLabel ? <IdentityField label={copy.chartModes.identityBed} value={bedLabel} /> : null}
        {serviceUnit ? (
          <IdentityField label={copy.chartModes.identityService} value={serviceUnit} />
        ) : null}
        {admissionDate ? (
          <IdentityField label={copy.chartModes.identityAdmission} value={admissionDate} />
        ) : null}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {copy.chartModes.identityAllergies}:
          </Typography>
          {allergiesVisible ? (
            allergyLabels.slice(0, 6).map((label) => (
              <Chip
                key={label}
                size="small"
                color="warning"
                variant="outlined"
                label={label}
                data-testid="epis2-patient-allergy-chip"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {copy.chartModes.identityNoAllergies}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
