import { copy } from '@epis2/design-system';
import { Box, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';
import { usePaperChartDraft } from '../../clinical/usePaperChartDraft.js';
import type { PaperChartSectionId } from './paper/paperChartSections.js';
import { PaperChartTemplate } from './paper/PaperChartTemplate.js';

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

  return (
    <Stack spacing={2} data-testid={testId} sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2 }}>
      <Stack direction="row" spacing={1} className="epis2-paper-chart-no-print" flexWrap="wrap">
        <EpisButton
          appearance={printFormat === 'letter' ? 'filled' : 'outlined'}
          size="small"
          onClick={() => setPrintFormat('letter')}
          data-testid="epis2-paper-format-letter"
        >
          {copy.chartModes.printLetter}
        </EpisButton>
        <EpisButton
          appearance={printFormat === 'a5' ? 'filled' : 'outlined'}
          size="small"
          onClick={() => setPrintFormat('a5')}
          data-testid="epis2-paper-format-a5"
        >
          {copy.chartModes.printA5}
        </EpisButton>
        {patientId ? (
          <EpisButton
            appearance="outlined"
            size="small"
            onClick={() =>
              void navigate({
                to: '/espacio/ficha/imprimir',
                search: { patientId, printFormat, chartMode: 'paper' },
              })
            }
            data-testid="epis2-paper-print-preview"
          >
            {copy.chartModes.printPreview}
          </EpisButton>
        ) : (
          <EpisButton
            appearance="outlined"
            size="small"
            onClick={() => window.print()}
            data-testid="epis2-paper-print"
          >
            {copy.chartModes.printPreview}
          </EpisButton>
        )}
      </Stack>
      {draft.error ? (
        <Typography color="error" variant="body2">
          {draft.error}
        </Typography>
      ) : null}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <PaperChartTemplate
          values={values}
          printFormat={printFormat}
          patientName={patientName}
          recordNumber={recordNumber}
          onSectionChange={onSectionChange}
        />
      </Box>
    </Stack>
  );
}
