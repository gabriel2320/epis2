import { Box, epis2PaperChartTokens, epis2PaperSignatureLineSx } from '@epis2/epis2-ui';

export type PaperSignatureSlot = {
  label: string;
  name?: string | undefined;
};

export type PaperSignatureBlockProps = {
  signatures: readonly PaperSignatureSlot[];
  testId?: string | undefined;
};

/** Bloque firmas al pie de epicrisis / alta (FichaPapel). */
export function PaperSignatureBlock({ signatures, testId }: PaperSignatureBlockProps) {
  const t = epis2PaperChartTokens;

  return (
    <Box
      data-testid={testId}
      className="epis2-paper-signature-block"
      sx={{
        px: 2,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      {signatures.map((sig) => (
        <Box key={sig.label} sx={{ textAlign: 'center', minWidth: 160 }}>
          <Box sx={epis2PaperSignatureLineSx()}>{sig.label}</Box>
          {sig.name ? (
            <Box
              sx={{
                fontFamily: t.typography.label,
                fontSize: '9px',
                color: t.paperMuted,
                mt: 0.5,
              }}
            >
              {sig.name}
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}
