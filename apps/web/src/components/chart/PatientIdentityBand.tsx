import { copy } from '@epis2/design-system';
import {
  Box,
  Chip,
  EpisDemoBadgeChip,
  EpisDraftStatus,
  ScienceIcon,
  Stack,
  Typography,
  epis2ClinicalShellTokens,
} from '@epis2/epis2-ui';

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
  showDemoBadge?: boolean | undefined;
  /** compact = ficha CICA dentro de ClinicalNavStrip (sin avatar grande). */
  variant?: 'default' | 'compact' | undefined;
  testId?: string | undefined;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

function documentStatusToDraft(status: PatientDocumentStatus): string | undefined {
  if (status === 'signed') return 'approved';
  if (status === 'draft') return 'draft';
  return undefined;
}

function documentStatusLabel(status: PatientDocumentStatus): string {
  if (status === 'signed') return copy.chartModes.documentStatusSigned;
  if (status === 'locked') return copy.chartModes.documentStatusLocked;
  return copy.chartModes.documentStatusDraft;
}

function IdentityField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0} sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" lineHeight={1.2} sx={{ fontSize: '0.6875rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} noWrap lineHeight={1.3} sx={{ fontSize: '0.8125rem' }}>
        {value}
      </Typography>
    </Stack>
  );
}

/** Banda identidad paciente — tabular, siempre visible en ficha clásica. */
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
  showDemoBadge = false,
  variant = 'default',
  testId = 'epis2-patient-identity-band',
}: PatientIdentityBandProps) {
  const compact = variant === 'compact';
  const allergiesVisible = allergyLabels.length > 0;
  const draftStatus = documentStatusToDraft(documentStatus);

  return (
    <Stack
      data-testid={testId}
      spacing={compact ? 0.75 : 1}
      sx={{
        minHeight: compact ? 56 : epis2ClinicalShellTokens.identityBandMinHeight,
        px: { xs: 2, md: 3 },
        py: compact ? 1 : 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
        {!compact ? (
          <Box
            aria-hidden
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            {initials(displayName)}
          </Box>
        ) : null}
        <Stack spacing={0.15} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant={compact ? 'subtitle1' : 'h6'}
            fontWeight={600}
            noWrap
            sx={{ fontSize: compact ? '1rem' : undefined, lineHeight: 1.25 }}
          >
            {displayName}
          </Typography>
          {metaLine ? (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
              {metaLine}
            </Typography>
          ) : null}
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
          {showDemoBadge ? (
            <EpisDemoBadgeChip
              icon={<ScienceIcon fontSize="small" />}
              label={copy.demoBadge}
              data-testid="epis2-patient-identity-demo-badge"
            />
          ) : null}
          {draftStatus ? (
            <EpisDraftStatus status={draftStatus} />
          ) : (
            <Chip
              size="small"
              variant="outlined"
              label={documentStatusLabel(documentStatus)}
              data-testid="epis2-patient-document-status"
            />
          )}
        </Stack>
      </Stack>

      <Stack
        direction="row"
        flexWrap="wrap"
        useFlexGap
        spacing={compact ? 1.5 : 2}
        alignItems="center"
        data-testid="epis2-patient-identity-fields"
        sx={{
          ...(compact
            ? {
                '& > *:not(:last-child)': {
                  pr: 1.5,
                  borderRight: 1,
                  borderColor: 'divider',
                },
              }
            : {}),
        }}
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
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
            {copy.chartModes.identityAllergies}:
          </Typography>
          {allergiesVisible ? (
            allergyLabels.slice(0, 4).map((label) => (
              <Chip
                key={label}
                size="small"
                color="warning"
                variant="outlined"
                label={label}
                data-testid="epis2-patient-allergy-chip"
                sx={{
                  height: 22,
                  fontSize: '0.6875rem',
                  borderColor: epis2ClinicalShellTokens.allergyChipBorder,
                  bgcolor: epis2ClinicalShellTokens.allergyChipBg,
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              {copy.chartModes.identityNoAllergies}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
