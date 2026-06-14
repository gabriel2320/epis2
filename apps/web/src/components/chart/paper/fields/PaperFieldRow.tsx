import { Box, epis2PaperFieldLabelSx, epis2PaperFieldValueSx } from '@epis2/epis2-ui';

export type PaperFieldCell = {
  label: string;
  value: string;
  wide?: boolean | undefined;
};

export type PaperFieldRowProps = {
  fields: readonly PaperFieldCell[];
  testId?: string | undefined;
};

/** Fila tabulada clínica — grid label/valor (FichaPapel). */
export function PaperFieldRow({ fields, testId }: PaperFieldRowProps) {
  return (
    <Box
      className="epis2-paper-field-row"
      data-testid={testId}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(4, minmax(0, 1fr))',
        },
        columnGap: '20px',
        rowGap: '12px',
        alignItems: 'end',
      }}
    >
      {fields.map((field) => (
        <Box
          key={field.label}
          sx={{ gridColumn: field.wide ? { xs: '1 / -1', sm: '1 / -1' } : undefined }}
        >
          <Box
            component="span"
            className="epis2-paper-label"
            sx={{ ...epis2PaperFieldLabelSx(), display: 'block', mb: 0.25 }}
          >
            {field.label}
          </Box>
          <Box
            component="span"
            className="epis2-paper-value"
            sx={{ ...epis2PaperFieldValueSx(), display: 'block' }}
          >
            {field.value || '\u00a0'}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
