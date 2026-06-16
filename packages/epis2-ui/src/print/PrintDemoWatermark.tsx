import Box from '@mui/material/Box';

/** Marca de agua visible en vista e impresión — documentos demo sintéticos. */
export function PrintDemoWatermark() {
  return (
    <Box
      data-testid="epis2-print-demo-watermark"
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        '&::before': {
          content: '"DEMO · SINTÉTICO"',
          position: 'absolute',
          top: '42%',
          left: '8%',
          transform: 'rotate(-32deg)',
          fontSize: '32pt',
          fontWeight: 700,
          opacity: 0.1,
          color: 'text.disabled',
          letterSpacing: '0.08em',
        },
      }}
    />
  );
}
