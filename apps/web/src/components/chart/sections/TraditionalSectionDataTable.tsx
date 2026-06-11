import { Box, EpisM3Text, Stack } from '@epis2/epis2-ui';
import type { DemoChartSectionRow } from '@epis2/test-fixtures';

export type TraditionalSectionDataTableProps = {
  rows: readonly DemoChartSectionRow[];
  testId?: string | undefined;
};

/** Tabla densa institucional — ficha electrónica traditional (MF-TE-02). */
export function TraditionalSectionDataTable({
  rows,
  testId = 'epis2-traditional-section-table',
}: TraditionalSectionDataTableProps) {
  if (rows.length === 0) return null;

  return (
    <Stack
      component="table"
      data-testid={testId}
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        '& td, & th': {
          borderBottom: 1,
          borderColor: 'divider',
          py: 0.75,
          px: 1,
          verticalAlign: 'top',
        },
        '& th': { width: '32%', textAlign: 'left' },
      }}
    >
      <Box component="tbody">
        {rows.map((row) => (
          <Box component="tr" key={`${row.label}-${row.value}`}>
            <EpisM3Text role="labelMedium" component="th">
              {row.label}
            </EpisM3Text>
            <EpisM3Text role="bodyMedium" component="td" sx={{ whiteSpace: 'pre-wrap' }}>
              {row.value}
            </EpisM3Text>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
