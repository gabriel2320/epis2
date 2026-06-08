import { useCallback, useMemo, useState } from 'react';

/** Selección múltiple RAD — sin lógica clínica. */
export function useRadBulkSelection(initial: readonly string[] = []) {
  const [selectedIds, setSelectedIds] = useState<string[]>([...initial]);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const selectedCount = selectedIds.length;

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  return {
    selectedIds,
    selectedCount,
    setSelectedIds,
    clearSelection,
    isSelected,
  };
}
