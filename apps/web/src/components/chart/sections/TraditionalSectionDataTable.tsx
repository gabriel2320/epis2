import { Box, EpisM3Text, Stack, epis2ClassicClinicalTableSx } from '@epis2/epis2-ui';
import type { DemoChartSectionRow } from '../../../fixtures/devFixturesBridge.js';

export type TraditionalSectionDataTableProps = {
  rows: readonly DemoChartSectionRow[];
  testId?: string | undefined;
};

/** Tabla clínica legible — filas label/valor sin aspecto administrativo. */
export function TraditionalSectionDataTable({
  rows,
  testId = 'epis2-traditional-section-table',
}: TraditionalSectionDataTableProps) {
  if (rows.length === 0) return null;

  return (
    <Stack component="table" data-testid={testId} sx={epis2ClassicClinicalTableSx()}>
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
