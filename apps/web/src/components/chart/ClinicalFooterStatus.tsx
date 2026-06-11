import { copy } from '@epis2/design-system';
import { Stack, Typography, epis2ClinicalShellTokens } from '@epis2/epis2-ui';
import type { ChartModeId } from '../../dev/dualChartModesEnv.js';
import type { PatientDocumentStatus } from './PatientIdentityBand.js';

export type ClinicalFooterStatusProps = {
  userDisplayName?: string | undefined;
  userRoleLabel?: string | undefined;
  documentStatus?: PatientDocumentStatus | undefined;
  lastSavedAt?: Date | null | undefined;
  chartMode?: ChartModeId | undefined;
  paperPageLabel?: string | undefined;
  testId?: string | undefined;
};

function formatSavedLabel(lastSavedAt: Date | null | undefined): string {
  if (!lastSavedAt) return copy.chartModes.footerSavedJustNow;
  const elapsedSec = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
  if (elapsedSec < 15) return copy.chartModes.footerSavedJustNow;
  if (elapsedSec < 60) return `${copy.chartModes.footerSaved} hace ${elapsedSec} s`;
  const minutes = Math.floor(elapsedSec / 60);
  return `${copy.chartModes.footerSaved} hace ${minutes} min`;
}

function documentStatusFooterLabel(status: PatientDocumentStatus | undefined): string {
  if (status === 'signed') return copy.chartModes.documentStatusSigned;
  if (status === 'locked') return copy.chartModes.documentStatusLocked;
  return copy.chartModes.footerDraftUnsigned;
}

/** Capa 4 — autoguardado, estado legal y confidencialidad (canon visual §6). */
export function ClinicalFooterStatus({
  userDisplayName,
  userRoleLabel,
  documentStatus = 'draft',
  lastSavedAt = null,
  chartMode,
  paperPageLabel,
  testId = 'epis2-clinical-footer-status',
}: ClinicalFooterStatusProps) {
  const segments = [
    copy.chartModes.footerConfidential,
    copy.chartModes.footerAppVersion,
    formatSavedLabel(lastSavedAt),
    userDisplayName,
    userRoleLabel,
    documentStatusFooterLabel(documentStatus),
    chartMode === 'paper' && paperPageLabel ? paperPageLabel : undefined,
  ].filter(Boolean);

  return (
    <Stack
      data-testid={testId}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: epis2ClinicalShellTokens.footerHeight,
        px: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" color="text.secondary" noWrap>
        {segments.join(' · ')}
      </Typography>
    </Stack>
  );
}
