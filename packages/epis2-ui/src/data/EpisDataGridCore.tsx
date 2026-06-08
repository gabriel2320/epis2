import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
  type GridRowParams,
} from '@mui/x-data-grid';
import { esES as dataGridEsES } from '@mui/x-data-grid/locales';
import { useMemo } from 'react';
import { epis2TonalContainerSx } from '../theme/epis2-elevation.js';
import { enhanceEpisDataGridColumns, episDataGridNumericCellClass } from './epis-data-grid-columns.js';

export type { GridColDef, GridRowParams };

export type EpisDataGridRow = { id: string } & Record<string, unknown>;

export type EpisDataGridProps = {
  rows: EpisDataGridRow[];
  columns: GridColDef[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  loadingLabel?: string;
  onRowClick?: (row: EpisDataGridRow) => void;
  height?: number;
  hideFooter?: boolean;
  checkboxSelection?: boolean;
  selectedRowIds?: readonly string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  'data-testid'?: string;
  getRowId?: DataGridProps['getRowId'];
};

function NoRowsOverlay({ message }: { message: string }) {
  return (
    <Stack alignItems="center" justifyContent="center" height="100%" py={3}>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Stack>
  );
}

export function EpisDataGrid({
  rows,
  columns,
  loading = false,
  error,
  emptyMessage = 'Sin registros.',
  onRowClick,
  height = 280,
  hideFooter,
  checkboxSelection = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  'data-testid': testId,
  getRowId,
}: EpisDataGridProps) {
  if (error) {
    return (
      <Alert severity="error" data-testid={testId ? `${testId}-error` : undefined}>
        {error}
      </Alert>
    );
  }

  const showFooter = hideFooter !== undefined ? !hideFooter : rows.length > 10;
  const gridColumns = useMemo(() => enhanceEpisDataGridColumns(columns), [columns]);

  const rowClickHandler = onRowClick
    ? (params: GridRowParams) => onRowClick(params.row as EpisDataGridRow)
    : undefined;

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2TonalContainerSx,
        width: '100%',
        minHeight: rows.length === 0 && !loading ? height : undefined,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={rows}
        columns={gridColumns}
        loading={loading}
        {...(getRowId ? { getRowId } : {})}
        localeText={dataGridEsES.components.MuiDataGrid.defaultProps.localeText}
        density="compact"
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        hideFooter={!showFooter}
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        {...(checkboxSelection ? { checkboxSelection: true } : {})}
        {...(selectedRowIds && onSelectedRowIdsChange
          ? {
              rowSelectionModel: [...selectedRowIds],
              onRowSelectionModelChange: (model) => onSelectedRowIdsChange([...model].map(String)),
            }
          : {})}
        {...(rowClickHandler ? { onRowClick: rowClickHandler } : {})}
        sx={{
          minHeight: height,
          border: 0,
          '--DataGrid-containerBackground': 'transparent',
          '& .MuiDataGrid-row': { cursor: onRowClick ? 'pointer' : 'default' },
          [`& .${episDataGridNumericCellClass}`]: {
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
          },
        }}
        slots={{
          noRowsOverlay: () => <NoRowsOverlay message={emptyMessage} />,
        }}
      />
    </Box>
  );
}
