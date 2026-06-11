import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';

export type PaperDocumentToolbarProps = {
  printFormat: 'letter' | 'a5';
  onPrintFormatChange: (format: 'letter' | 'a5') => void;
  onPrint?: (() => void) | undefined;
  onSave?: (() => void) | undefined;
  onSign?: (() => void) | undefined;
  onPdf?: (() => void) | undefined;
  testId?: string | undefined;
};

/** Toolbar documental — Carta/A5, guardar, firmar, imprimir (MF-DUAL-CHART-06). */
export function PaperDocumentToolbar({
  printFormat,
  onPrintFormatChange,
  onPrint,
  onSave,
  onSign,
  onPdf,
  testId = 'epis2-paper-document-toolbar',
}: PaperDocumentToolbarProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      className="epis2-paper-chart-no-print"
      flexWrap="wrap"
      alignItems="center"
      data-testid={testId}
    >
      <EpisButton
        appearance={printFormat === 'letter' ? 'filled' : 'outlined'}
        size="small"
        onClick={() => onPrintFormatChange('letter')}
        data-testid="epis2-paper-format-letter"
      >
        {copy.chartModes.printLetter}
      </EpisButton>
      <EpisButton
        appearance={printFormat === 'a5' ? 'filled' : 'outlined'}
        size="small"
        onClick={() => onPrintFormatChange('a5')}
        data-testid="epis2-paper-format-a5"
      >
        {copy.chartModes.printA5}
      </EpisButton>
      {onSave ? (
        <EpisButton appearance="outlined" size="small" onClick={onSave}>
          {copy.chartModes.actionSave}
        </EpisButton>
      ) : null}
      {onSign ? (
        <EpisButton appearance="outlined" size="small" onClick={onSign}>
          {copy.chartModes.actionSign}
        </EpisButton>
      ) : null}
      {onPrint ? (
        <EpisButton
          appearance="outlined"
          size="small"
          onClick={onPrint}
          data-testid="epis2-paper-print"
        >
          {copy.chartModes.actionPrint}
        </EpisButton>
      ) : null}
      {onPdf ? (
        <EpisButton appearance="text" size="small" onClick={onPdf}>
          PDF
        </EpisButton>
      ) : null}
    </Stack>
  );
}
