export type ClinicalDenseTabularRow = {
  id: string;
  item: string;
  detail: string;
  status: string;
};

/** Filas label/value → grid denso MAR/órdenes (MF-TE-07). */
export function mapLabelValueRowsToDenseTabular(
  rows: readonly { label: string; value: string }[],
  defaultStatus = 'Activa',
): ClinicalDenseTabularRow[] {
  return rows.map((row, index) => ({
    id: `dense-${index}-${row.label}`,
    item: row.label,
    detail: row.value,
    status: defaultStatus,
  }));
}

/** MAR — zona en status, medicamento en detail (longitudinal). */
export function mapMarRowsToDenseTabular(
  rows: readonly { label: string; value: string }[],
): ClinicalDenseTabularRow[] {
  return rows.map((row, index) => ({
    id: `mar-${index}-${row.label}`,
    item: row.value.split('·')[0]?.trim() ?? row.value,
    detail: row.value,
    status: row.label,
  }));
}
