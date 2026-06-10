import type { ReactNode } from 'react';
import {
  ClinicalBulkActionMenu,
  type ClinicalBulkActionItem,
  type ClinicalBulkActionMenuProps,
} from '@epis2/clinical-productivity';

export {
  ClinicalBulkActionMenu as EpisBulkActionMenu,
  type ClinicalBulkActionItem as EpisBulkActionMenuItem,
  type ClinicalBulkActionMenuProps as EpisBulkActionMenuProps,
};

/** @deprecated Usar ClinicalBulkActionMenu */
export function EpisProgressiveMenu({ children }: { children: ReactNode }) {
  return <div data-testid="epis2-progressive-menu">{children}</div>;
}
