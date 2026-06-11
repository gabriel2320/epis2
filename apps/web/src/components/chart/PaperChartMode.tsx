import { copy } from '@epis2/design-system';
import { Box, Stack, epis2PaperStatusCaptionSx } from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';
import { parseChartModeSearch } from '../../routes/chartModeSearch.js';
import { usePaperChartDraft } from '../../clinical/usePaperChartDraft.js';
import type { PaperChartSectionId } from './paper/paperChartSections.js';
import { PAPER_CHART_SECTION_IDS } from './paper/paperChartSections.js';
import { PaperChartTemplate } from './paper/PaperChartTemplate.js';
import type { PaperPatientStripProps } from './paper/PaperPatientStrip.js';
import { PaperDocumentToolbar } from './PaperDocumentToolbar.js';
import { paginatePaperChart } from './paper/pagination/index.js';
import { PaperPageCanvas } from './paper/PaperPageCanvas.js';
import { PaperSectionNavigator } from './paper/PaperSectionNavigator.js';

export type PaperChartModeProps = {
  patientId?: string | undefined;
  initialValues?: Partial<Record<PaperChartSectionId, string>> | undefined;
  patientName?: string | undefined;
  recordNumber?: string | undefined;
  patientStrip?: Omit<PaperPatientStripProps, 'patientName' | 'recordNumber'> | undefined;
  testId?: string | undefined;
};

/** Modo ficha papel editable — Carta/A5 + 14 secciones + SoT PostgreSQL. */
export function PaperChartMode({
  patientId,
  initialValues,
  patientName,
  recordNumber,
  patientStrip,
  testId = 'epis2-paper-chart-mode',
}: PaperChartModeProps) {
  const navigate = useClinicalNavigate();
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const chartSearch = parseChartModeSearch(rawSearch);
  const initialSection =
    chartSearch.section && PAPER_CHART_SECTION_IDS.includes(chartSearch.section)
      ? chartSearch.section
      : 'cover';
  const [printFormat, setPrintFormat] = useState<'letter' | 'a5'>(
    chartSearch.printFormat ?? 'letter',
  );
  const [activeSectionId, setActiveSectionId] = useState<PaperChartSectionId>(initialSection);
  const [signError, setSignError] = useState<string | undefined>();
  const [signSuccess, setSignSuccess] = useState<string | undefined>();
  const [previewValues, setPreviewValues] = useState<Partial<Record<PaperChartSectionId, string>>>(
    () => initialValues ?? {},
  );
  const draft = usePaperChartDraft(patientId);
  const values = patientId ? draft.values : previewValues;
  const { totalPages } = useMemo(() => {
    const sections = PAPER_CHART_SECTION_IDS.map((sectionId) => ({
      sectionId,
      value: (patientId ? draft.values[sectionId] : previewValues[sectionId]) ?? '',
      minRows:
        sectionId === 'cover'
          ? 3
          : sectionId === 'nursing' ||
              sectionId === 'fluidBalance' ||
              sectionId === 'procedures' ||
              sectionId === 'socialWork'
            ? 10
            : 5,
    }));
    return paginatePaperChart(sections, printFormat);
  }, [patientId, draft.values, previewValues, printFormat]);
  const onSectionChange = patientId
    ? draft.onSectionChange
    : (id: PaperChartSectionId, body: string) => {
        setPreviewValues((prev) => ({ ...prev, [id]: body }));
      };

  const scrollToSection = useCallback((sectionId: PaperChartSectionId) => {
    const el = document.querySelector(`[data-testid="epis2-paper-section-${sectionId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (chartSearch.section && PAPER_CHART_SECTION_IDS.includes(chartSearch.section)) {
      setActiveSectionId(chartSearch.section);
      scrollToSection(chartSearch.section);
    }
  }, [chartSearch.section, scrollToSection]);

  const handleSectionSelect = (sectionId: PaperChartSectionId) => {
    setActiveSectionId(sectionId);
    scrollToSection(sectionId);
    if (patientId) {
      void navigate({
        to: '/espacio/ficha',
        search: { patientId, chartMode: 'paper', section: sectionId, printFormat },
      });
    }
  };

  const handlePrint = () => {
    if (patientId) {
      void navigate({
        to: '/espacio/ficha/imprimir',
        search: { patientId, printFormat, chartMode: 'paper', section: activeSectionId },
      });
      return;
    }
    window.print();
  };

  const handleSave = async () => {
    if (!patientId) return;
    setSignSuccess(undefined);
    const ok = await draft.saveNow();
    if (ok) {
      draft.setNotice(copy.chartModes.saveSuccess);
    }
  };

  const handleSign = async () => {
    if (!patientId) return;
    setSignError(undefined);
    setSignSuccess(undefined);
    if (!draft.canSign) {
      setSignError(draft.signBlockMessage ?? copy.chartModes.signBlockedAi);
      return;
    }
    const result = await draft.signDraft();
    if (result.ok) {
      setSignSuccess(copy.chartModes.signSuccess);
    } else if (result.reason === 'ai_pending') {
      setSignError(draft.signBlockMessage ?? copy.chartModes.signBlockedAi);
    }
  };

  return (
    <Stack spacing={0} data-testid={testId} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 0, pt: 0 }}>
        <PaperDocumentToolbar
          printFormat={printFormat}
          onPrintFormatChange={setPrintFormat}
          patientId={patientId}
          onPrint={handlePrint}
          onSave={patientId ? handleSave : undefined}
          onSign={patientId ? handleSign : undefined}
          onPdf={handlePrint}
          saving={draft.saving}
          signing={draft.signing}
          signDisabled={patientId ? !draft.canSign : true}
          readOnly={draft.readOnly}
        />
      </Box>
      {draft.error ? (
        <Box sx={{ px: 2, ...epis2PaperStatusCaptionSx(), color: 'error.main' }}>{draft.error}</Box>
      ) : null}
      {draft.notice ? (
        <Box sx={{ px: 2, ...epis2PaperStatusCaptionSx(), color: 'success.main' }}>{draft.notice}</Box>
      ) : null}
      {signError ? (
        <Box
          sx={{ px: 2, ...epis2PaperStatusCaptionSx(), color: 'error.main' }}
          data-testid="epis2-paper-sign-blocked"
        >
          {signError}
        </Box>
      ) : null}
      {signSuccess ? (
        <Box
          sx={{ px: 2, ...epis2PaperStatusCaptionSx(), color: 'success.main' }}
          data-testid="epis2-paper-sign-success"
        >
          {signSuccess}
        </Box>
      ) : null}
      {patientId && draft.readOnly ? (
        <Box sx={{ px: 2, ...epis2PaperStatusCaptionSx() }}>{copy.chartModes.signedNotice}</Box>
      ) : null}
      {patientId && !draft.readOnly && draft.unconfirmedAiCount > 0 ? (
        <Box sx={{ px: 2, ...epis2PaperStatusCaptionSx() }}>
          {copy.chartModes.aiDraftNotice} ({draft.unconfirmedAiCount})
        </Box>
      ) : null}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <PaperSectionNavigator
          activeSectionId={activeSectionId}
          onSectionSelect={handleSectionSelect}
          aiPendingSections={patientId ? draft.aiPendingSections : undefined}
        />
        <PaperPageCanvas>
          <PaperChartTemplate
            values={values}
            fields={patientId ? draft.fields : undefined}
            printFormat={printFormat}
            patientName={patientName}
            recordNumber={recordNumber}
            patientStrip={patientStrip}
            page={1}
            totalPages={totalPages}
            onSectionChange={patientId && !draft.readOnly ? draft.onSectionChange : onSectionChange}
            onConfirmSection={
              patientId && !draft.readOnly ? draft.confirmSection : undefined
            }
          />
        </PaperPageCanvas>
      </Box>
    </Stack>
  );
}
