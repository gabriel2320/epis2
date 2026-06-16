import { copy } from '@epis2/design-system';
import { Box, Typography, epis2PaperChartTokens } from '@epis2/epis2-ui';
import type { PatientDocumentStatus } from '../PatientIdentityBand.js';

export type PaperDocumentWatermarkProps = {
  status: PatientDocumentStatus;
  testId?: string;
};

function watermarkLabel(status: PatientDocumentStatus): string | null {
  if (status === 'signed' || status === 'locked') {
    return copy.chartModes.paperWatermarkSigned;
  }
  if (status === 'draft') {
    return copy.print.statusDraftDocument;
  }
  return null;
}

/** Marca de agua diagonal — confianza visual borrador vs aprobado (PROG-UX-LAB MF-UXLAB-02). */
export function PaperDocumentWatermark({
  status,
  testId = 'epis2-paper-document-watermark',
}: PaperDocumentWatermarkProps) {
  const label = watermarkLabel(status);
  if (!label) return null;
  const t = epis2PaperChartTokens;

  return (
    <Box
      data-testid={testId}
      data-watermark-status={status}
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-32deg)',
          fontFamily: t.typography.label,
          fontSize: { xs: '0.95rem', md: '1.25rem' },
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: t.paperInkMid,
          opacity: status === 'draft' ? 0.16 : 0.11,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          maxWidth: '92%',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
