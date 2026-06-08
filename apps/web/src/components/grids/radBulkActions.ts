import { copy } from '@epis2/design-system';
import type { EpisBulkActionMenuItem } from '../actions/EpisBulkActionMenu.js';

/** Acciones bulk RAD reutilizables — sin lógica clínica. */
export function copySelectionBulkAction(
  selectedIds: readonly string[],
  lines: string[],
): EpisBulkActionMenuItem {
  return {
    id: 'copy-selection',
    label: copy.uiSimplify.bulkCopySelection,
    onClick: async () => {
      await copyLinesToClipboard(lines);
    },
  };
}

export function markReviewedBulkAction(): EpisBulkActionMenuItem {
  return {
    id: 'mark-reviewed',
    label: copy.uiSimplify.bulkMarkReviewed,
    onClick: () => {
      /* borrador operativo Fase A */
    },
  };
}

export async function copyLinesToClipboard(lines: string[]): Promise<void> {
  if (lines.length === 0) return;
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
  } catch {
    /* noop en test */
  }
}
