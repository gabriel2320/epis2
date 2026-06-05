import type { GridColDef } from '@mui/x-data-grid';

const NUMERIC_CELL_CLASS = 'epis2-grid-numeric-cell';

function mergeCellClass(existing: GridColDef['cellClassName'], extra: string): GridColDef['cellClassName'] {
  if (!existing) return extra;
  if (typeof existing === 'function') {
    return (params) => {
      const base = existing(params);
      return base ? `${base} ${extra}` : extra;
    };
  }
  return `${existing} ${extra}`;
}

/** Aplica tabular-nums y alineación derecha a columnas numéricas (THEME-05). */
export function enhanceEpisDataGridColumns(columns: GridColDef[]): GridColDef[] {
  return columns.map((col) => {
    const isNumeric = col.type === 'number' || col.align === 'right';
    if (!isNumeric) return col;
    return {
      ...col,
      align: 'right',
      headerAlign: col.headerAlign ?? 'right',
      cellClassName: mergeCellClass(col.cellClassName, NUMERIC_CELL_CLASS),
    } as GridColDef;
  });
}

export const episDataGridNumericCellClass = NUMERIC_CELL_CLASS;
