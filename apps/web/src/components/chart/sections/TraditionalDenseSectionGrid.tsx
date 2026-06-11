import {
  ClinicalDataGrid,
  type ClinicalGridColDef,
} from '@epis2/clinical-productivity';
import type { ClinicalDenseTabularRow } from '@epis2/clinical-productivity';
import { useMemo } from 'react';

export type TraditionalDenseSectionGridProps = {
  rows: readonly ClinicalDenseTabularRow[];
  variant: 'orders' | 'mar';
  testId?: string | undefined;
};

const STATUS_HEADER: Record<TraditionalDenseSectionGridProps['variant'], string> = {
  orders: 'Estado',
  mar: 'Zona',
};

/** Grid denso órdenes/MAR — ClinicalDataGrid compacto (MF-TE-07). */
export function TraditionalDenseSectionGrid({
  rows,
  variant,
  testId = 'epis2-traditional-dense-grid',
}: TraditionalDenseSectionGridProps) {
  const columns = useMemo<ClinicalGridColDef[]>(
    () => [
      {
        field: 'item',
        headerName: variant === 'mar' ? 'Medicamento' : 'Indicación',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'detail',
        headerName: 'Detalle',
        flex: 1.4,
        minWidth: 180,
      },
      {
        field: 'status',
        headerName: STATUS_HEADER[variant],
        width: 110,
      },
    ],
    [variant],
  );

  if (rows.length === 0) return null;

  return (
    <ClinicalDataGrid
      rows={[...rows]}
      columns={columns}
      hideFooter
      height={Math.min(320, 44 + rows.length * 36)}
      data-testid={testId}
    />
  );
}
