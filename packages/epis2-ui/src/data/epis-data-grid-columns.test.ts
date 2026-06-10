import { describe, expect, it } from 'vitest';
import type { GridColDef } from '@mui/x-data-grid';
import {
  enhanceEpisDataGridColumns,
  episDataGridNumericCellClass,
} from './epis-data-grid-columns.js';

describe('enhanceEpisDataGridColumns', () => {
  it('marca columnas number con clase numérica y alineación derecha', () => {
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Nombre', flex: 1 },
      { field: 'count', headerName: 'Cantidad', type: 'number', width: 100 },
    ];
    const enhanced = enhanceEpisDataGridColumns(columns);
    expect(enhanced[0]?.align).toBeUndefined();
    expect(enhanced[1]?.align).toBe('right');
    expect(enhanced[1]?.headerAlign).toBe('right');
    expect(enhanced[1]?.cellClassName).toBe(episDataGridNumericCellClass);
  });
});
