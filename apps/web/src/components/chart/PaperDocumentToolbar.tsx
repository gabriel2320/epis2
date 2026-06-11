import { copy } from '@epis2/design-system';
import {
  Box,
  Stack,
  epis2PaperBridgeControlSx,
  epis2PaperChromeBarSx,
  epis2PaperToolbarControlSx,
} from '@epis2/epis2-ui';
import {
  navigatePaperDocumentBridge,
  PAPER_DOCUMENT_BRIDGES,
  type PaperDocumentBridgeId,
} from '../../routes/paperDocumentBridge.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';

export type PaperDocumentToolbarProps = {
  printFormat: 'letter' | 'a5';
  onPrintFormatChange: (format: 'letter' | 'a5') => void;
  patientId?: string | undefined;
  onPrint?: (() => void) | undefined;
  onSave?: (() => void) | undefined;
  onSign?: (() => void) | undefined;
  onPdf?: (() => void) | undefined;
  saving?: boolean | undefined;
  signing?: boolean | undefined;
  signDisabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  testId?: string | undefined;
};

/** Toolbar documental — chrome FichaPapel (Carta/A5, guardar, firmar, puentes). */
export function PaperDocumentToolbar({
  printFormat,
  onPrintFormatChange,
  patientId,
  onPrint,
  onSave,
  onSign,
  onPdf,
  saving = false,
  signing = false,
  signDisabled = false,
  readOnly = false,
  testId = 'epis2-paper-document-toolbar',
}: PaperDocumentToolbarProps) {
  const navigate = useClinicalNavigate();

  const openBridge = (bridgeId: PaperDocumentBridgeId) => {
    if (!patientId) return;
    navigatePaperDocumentBridge(navigate, patientId, bridgeId);
  };

  const actionButton = (
    label: string,
    onClick: (() => void) | undefined,
    opts: { testId: string; disabled?: boolean },
  ) => {
    if (!onClick) return null;
    return (
      <Box
        component="button"
        type="button"
        data-testid={opts.testId}
        disabled={opts.disabled}
        onClick={onClick}
        sx={epis2PaperToolbarControlSx(false)}
      >
        {label}
      </Box>
    );
  };

  return (
    <Stack
      spacing={1}
      className="epis2-paper-chart-no-print"
      data-testid={testId}
      sx={epis2PaperChromeBarSx()}
    >
      <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center">
        <Box
          component="button"
          type="button"
          data-testid="epis2-paper-format-letter"
          onClick={() => onPrintFormatChange('letter')}
          sx={epis2PaperToolbarControlSx(printFormat === 'letter')}
        >
          {copy.chartModes.printLetter}
        </Box>
        <Box
          component="button"
          type="button"
          data-testid="epis2-paper-format-a5"
          onClick={() => onPrintFormatChange('a5')}
          sx={epis2PaperToolbarControlSx(printFormat === 'a5')}
        >
          {copy.chartModes.printA5}
        </Box>
        {!readOnly
          ? actionButton(
              saving ? copy.chartModes.actionSaving : copy.chartModes.actionSave,
              onSave,
              { testId: 'epis2-paper-save', disabled: saving },
            )
          : null}
        {!readOnly
          ? actionButton(
              signing ? copy.chartModes.signInProgress : copy.chartModes.actionSign,
              onSign,
              { testId: 'epis2-paper-sign', disabled: signDisabled || signing },
            )
          : null}
        {actionButton(copy.chartModes.actionPrint, onPrint, { testId: 'epis2-paper-print' })}
        {actionButton('PDF', onPdf, { testId: 'epis2-paper-pdf' })}
      </Stack>
      {patientId ? (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" data-testid="epis2-paper-doc-bridge">
          {PAPER_DOCUMENT_BRIDGES.map((bridge) => (
            <Box
              key={bridge.id}
              component="button"
              type="button"
              data-testid={bridge.testId}
              onClick={() => openBridge(bridge.id)}
              sx={epis2PaperBridgeControlSx()}
            >
              {copy.chartModes[bridge.labelKey]}
            </Box>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
