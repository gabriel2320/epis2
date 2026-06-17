import type {
  ClinicalLayoutAction,
  ClinicalLayoutProfile,
} from '../layout/clinical/clinicalLayoutEngine.js';
import {
  ClinicalLayoutActionBar,
  type ClinicalLayoutActionBarProps,
} from '../layout/clinical/ClinicalLayoutActionBar.js';

export type ClinicalActionBarProps = Omit<ClinicalLayoutActionBarProps, 'actions'> & {
  actions: readonly ClinicalLayoutAction[];
};

/** Alias CICA — barra de acciones gobernada (1 primaria · 2 secundarias · overflow). */
export function ClinicalActionBar(props: ClinicalActionBarProps) {
  return <ClinicalLayoutActionBar {...props} />;
}

export type { ClinicalLayoutAction, ClinicalLayoutProfile };
