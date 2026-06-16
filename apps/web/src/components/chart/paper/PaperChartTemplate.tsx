import { copy } from '@epis2/design-system';
import type { PaperFieldState } from '@epis2/clinical-forms';
import {
  Box,
  Stack,
  Typography,
  epis2PaperChartTokens,
  epis2PaperDocumentSx,
} from '@epis2/epis2-ui';
import {
  EMPTY_PAPER_CHART_DRAFT,
  PAPER_CHART_SECTION_IDS,
  paperChartSectionLabel,
  type PaperChartSectionId,
} from './paperChartSections.js';
import { PaperSection, PaperTextarea } from './fields/index.js';
import { PaperFooter } from './PaperFooter.js';
import { PaperDocumentWatermark } from './PaperDocumentWatermark.js';
import type { PatientDocumentStatus } from '../PatientIdentityBand.js';
import { PaperInstitutionalHeader } from './PaperInstitutionalHeader.js';
import { PaperPatientStrip, type PaperPatientStripProps } from './PaperPatientStrip.js';
import { PaperSectionChrome } from './paperSectionChrome.js';
import type { PaperPageLayout } from './pagination/index.js';
import { resolvePaperSectionMinRows } from './paperSectionScaffold.js';
import './paperChartPrint.css';

export type PaperChartTemplateProps = {
  values?: Partial<Record<PaperChartSectionId, string>> | undefined;
  fields?: Partial<Record<PaperChartSectionId, PaperFieldState>> | undefined;
  onSectionChange?: ((id: PaperChartSectionId, value: string) => void) | undefined;
  onConfirmSection?: ((id: PaperChartSectionId) => void) | undefined;
  printFormat?: 'letter' | 'a5' | undefined;
  patientName?: string | undefined;
  recordNumber?: string | undefined;
  patientStrip?: Omit<PaperPatientStripProps, 'patientName' | 'recordNumber'> | undefined;
  page?: number | undefined;
  totalPages?: number | undefined;
  /** Layout paginado — una hoja por entrada (MF-PA-03). */
  pageLayouts?: readonly PaperPageLayout[] | undefined;
  documentStatus?: PatientDocumentStatus | undefined;
  testId?: string | undefined;
};

function resolveSectionField(
  sectionId: PaperChartSectionId,
  values: Partial<Record<PaperChartSectionId, string>>,
  fields?: Partial<Record<PaperChartSectionId, PaperFieldState>>,
): PaperFieldState {
  const fromFields = fields?.[sectionId];
  if (fromFields) return fromFields;
  return {
    value: values[sectionId] ?? '',
    source: 'human',
    confirmed: true,
  };
}

function renderPaperSection(
  sectionId: PaperChartSectionId,
  merged: Partial<Record<PaperChartSectionId, string>>,
  fields: Partial<Record<PaperChartSectionId, PaperFieldState>> | undefined,
  onSectionChange: PaperChartTemplateProps['onSectionChange'],
  onConfirmSection: PaperChartTemplateProps['onConfirmSection'],
  patientName: string,
  recordNumber: string,
  patientStrip: PaperChartTemplateProps['patientStrip'],
) {
  const t = epis2PaperChartTokens;
  const field = resolveSectionField(sectionId, merged, fields);
  const showAiConfirm =
    field.source === 'ai_draft' && !field.confirmed && Boolean(onConfirmSection);

  return (
    <PaperSection
      key={sectionId}
      title={paperChartSectionLabel(sectionId)}
      testId={`epis2-paper-section-${sectionId}`}
    >
      <PaperSectionChrome
        sectionId={sectionId}
        patientName={patientName}
        recordNumber={recordNumber}
        patientStrip={patientStrip}
      />
      <Box className="epis2-paper-chart-ruled" sx={{ px: 2, py: 1 }}>
        <PaperTextarea
          minRows={resolvePaperSectionMinRows(sectionId)}
          value={field.value}
          onChange={onSectionChange ? (body) => onSectionChange(sectionId, body) : undefined}
          ariaLabel={paperChartSectionLabel(sectionId)}
          testId={`epis2-paper-field-${sectionId}`}
          aiDraft={field.source === 'ai_draft' && !field.confirmed}
        />
      </Box>
      {showAiConfirm ? (
        <Box sx={{ px: 2, pb: 1.5 }} className="epis2-paper-chart-no-print">
          <Typography
            sx={{
              fontFamily: t.typography.label,
              fontSize: '10px',
              color: t.paperMuted,
              display: 'block',
              mb: 0.5,
            }}
          >
            {copy.chartModes.aiDraftNotice}
          </Typography>
          <button
            type="button"
            data-testid={`epis2-paper-confirm-ai-${sectionId}`}
            onClick={() => onConfirmSection?.(sectionId)}
            style={{
              fontFamily: t.typography.label,
              fontSize: '10px',
              padding: '4px 10px',
              cursor: 'pointer',
              border: `1px solid ${t.ruledLineStrong}`,
              background: t.paperBg,
              color: t.paperInkMid,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {copy.chartModes.confirmAiDraft}
          </button>
        </Box>
      ) : null}
    </PaperSection>
  );
}

/** Plantilla ficha papel — 14 secciones institucionales (ADR-002 · visual FichaPapel v1). */
export function PaperChartTemplate({
  values = {},
  fields,
  onSectionChange,
  onConfirmSection,
  printFormat = 'letter',
  patientName = 'Paciente demo',
  recordNumber = '0000000',
  patientStrip,
  page = 1,
  totalPages = 1,
  pageLayouts,
  documentStatus = 'draft',
  testId = 'epis2-paper-chart-template',
}: PaperChartTemplateProps) {
  const merged = { ...EMPTY_PAPER_CHART_DRAFT, ...values };
  const t = epis2PaperChartTokens;
  const printClass =
    printFormat === 'a5' ? 'epis2-paper-chart-print-a5' : 'epis2-paper-chart-print-letter';

  const layouts =
    pageLayouts && pageLayouts.length > 0
      ? pageLayouts
      : [{ pageNumber: page, sections: [...PAPER_CHART_SECTION_IDS], lineCount: 0 }];

  return (
    <Box data-testid={testId}>
      {layouts.map((layout) => (
        <Box
          key={layout.pageNumber}
          data-testid={`${testId}-page-${layout.pageNumber}`}
          className={`${printClass} epis2-paper-page`}
          sx={{
            ...epis2PaperDocumentSx(printFormat),
            position: 'relative',
            ...(layout.pageNumber < layouts.length ? { mb: 2 } : undefined),
          }}
        >
          <PaperDocumentWatermark status={documentStatus} />
          {layout.pageNumber === 1 ? (
            <>
              <PaperInstitutionalHeader
                recordNumber={recordNumber}
                serviceUnit={patientStrip?.serviceUnit}
              />

              <PaperPatientStrip
                patientName={patientName}
                recordNumber={recordNumber}
                nationalId={patientStrip?.nationalId}
                ageYears={patientStrip?.ageYears}
                sexLabel={patientStrip?.sexLabel}
                serviceUnit={patientStrip?.serviceUnit}
                bedLabel={patientStrip?.bedLabel}
                admissionDate={patientStrip?.admissionDate}
                allergyLabels={patientStrip?.allergyLabels}
              />

              <Box
                className="epis2-paper-draft-notice epis2-paper-chart-no-print"
                sx={{
                  px: 2,
                  py: 0.75,
                  bgcolor: t.paperBgAlt,
                  borderBottom: `1px solid ${t.ruledLine}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: t.typography.label,
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    color: t.paperInkMid,
                  }}
                >
                  {documentStatus === 'draft'
                    ? copy.chartModes.draftNotice
                    : copy.chartModes.signedNotice}
                </Typography>
              </Box>
            </>
          ) : null}

          <Stack spacing={0}>
            {layout.sections.map((sectionId) =>
              renderPaperSection(
                sectionId,
                merged,
                fields,
                onSectionChange,
                onConfirmSection,
                patientName,
                recordNumber,
                patientStrip,
              ),
            )}
          </Stack>

          <PaperFooter
            page={layout.pageNumber}
            totalPages={totalPages}
            recordNumber={recordNumber}
          />
        </Box>
      ))}
    </Box>
  );
}
