import { copy } from '@epis2/design-system';
import { Box, epis2PaperBridgeControlSx } from '@epis2/epis2-ui';

export type PaperBridgeBackButtonProps = {
  label?: string | undefined;
  onClick: () => void;
  testId?: string | undefined;
};

/** Retorno ficha papel desde vista print — chrome FichaPapel (MF-PAPER-07). */
export function PaperBridgeBackButton({
  label = copy.chartModes.paper,
  onClick,
  testId = 'epis2-paper-back-to-chart',
}: PaperBridgeBackButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      className="epis2-no-print epis2-paper-chart-no-print"
      data-testid={testId}
      onClick={onClick}
      sx={epis2PaperBridgeControlSx()}
    >
      ← {label}
    </Box>
  );
}
