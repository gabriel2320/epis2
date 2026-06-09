import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';

/** Toolbar de vista print — oculta en impresión (norma §4.2: sin controles en papel). */
export function PrintPageToolbar({ printLabel }: { printLabel: string }) {
  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        className="epis2-no-print"
        sx={{ '@media print': { display: 'none' } }}
      >
        <EpisButton appearance="outlined" onClick={() => window.history.back()}>
          {copy.print.backToForm}
        </EpisButton>
        <EpisButton
          appearance="filled"
          onClick={() => window.print()}
          data-testid="epis2-print-execute"
        >
          {printLabel}
        </EpisButton>
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        className="epis2-no-print"
        sx={{ '@media print': { display: 'none' } }}
      >
        {copy.print.previewHint}
      </Typography>
    </>
  );
}
