import { Box, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';
import { usePaperChartDraft } from '../../clinical/usePaperChartDraft.js';
import type { PaperChartSectionId } from './paper/paperChartSections.js';
import { PaperChartTemplate } from './paper/PaperChartTemplate.js';
import { PaperDocumentToolbar } from './PaperDocumentToolbar.js';
import { PaperFooter } from './paper/PaperFooter.js';
import { PaperPageCanvas } from './paper/PaperPageCanvas.js';

export type PaperChartModeProps = {
  patientId?: string | undefined;
  initialValues?: Partial<Record<PaperChartSectionId, string>> | undefined;
  patientName?: string | undefined;
  recordNumber?: string | undefined;
  testId?: string | undefined;
};

/** Modo ficha papel editable — Carta/A5 + 7 secciones + SoT PostgreSQL. */
export function PaperChartMode({
  patientId,
  initialValues,
  patientName,
  recordNumber,
  testId = 'epis2-paper-chart-mode',
}: PaperChartModeProps) {
  const navigate = useClinicalNavigate();
  const [printFormat, setPrintFormat] = useState<'letter' | 'a5'>('letter');
  const draft = usePaperChartDraft(patientId);
  const values = patientId ? draft.values : (initialValues ?? {});
  const onSectionChange = patientId
    ? draft.onSectionChange
    : (id: PaperChartSectionId, body: string) => {
        void id;
        void body;
      };

  const handlePrint = () => {
    if (patientId) {
      void navigate({
        to: '/espacio/ficha/imprimir',
        search: { patientId, printFormat, chartMode: 'paper' },
      });
      return;
    }
    window.print();
  };

  return (
    <Stack spacing={0} data-testid={testId} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2 }}>
        <PaperDocumentToolbar
          printFormat={printFormat}
          onPrintFormatChange={setPrintFormat}
          onPrint={handlePrint}
        />
      </Box>
      {draft.error ? (
        <Typography color="error" variant="body2" sx={{ px: 2 }}>
          {draft.error}
        </Typography>
      ) : null}
      <PaperPageCanvas>
        <PaperChartTemplate
          values={values}
          printFormat={printFormat}
          patientName={patientName}
          recordNumber={recordNumber}
          onSectionChange={onSectionChange}
        />
        <PaperFooter page={1} totalPages={7} />
      </PaperPageCanvas>
    </Stack>
  );
}
