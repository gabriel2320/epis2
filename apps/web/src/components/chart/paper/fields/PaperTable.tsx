import { Box, epis2PaperTableBodyCellSx, epis2PaperTableHeaderCellSx } from '@epis2/epis2-ui';

export type PaperTableColumn = {
  key: string;
  label: string;
  width?: string | undefined;
};

export type PaperTableProps = {
  columns: readonly PaperTableColumn[];
  rows: readonly Record<string, string>[];
  testId?: string | undefined;
};

/** Tabla clínica institucional — cabecera navy claro (FichaPapel). */
export function PaperTable({ columns, rows, testId }: PaperTableProps) {
  return (
    <Box
      component="table"
      data-testid={testId}
      className="epis2-paper-table"
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px',
        mb: 1,
      }}
    >
      <Box component="thead">
        <Box component="tr">
          {columns.map((col) => (
            <Box
              component="th"
              key={col.key}
              sx={{
                ...epis2PaperTableHeaderCellSx(),
                ...(col.width ? { width: col.width } : {}),
              }}
            >
              {col.label}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {rows.map((row, rowIndex) => (
          <Box component="tr" key={`row-${rowIndex}`}>
            {columns.map((col) => (
              <Box component="td" key={col.key} sx={epis2PaperTableBodyCellSx()}>
                {row[col.key]?.trim() ? row[col.key] : '\u00a0'}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
