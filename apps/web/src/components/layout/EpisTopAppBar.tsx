import type { ComponentProps } from 'react';
import { ClinicalGlobalTopBar } from '../../layouts/ClinicalGlobalTopBar.js';

export type EpisTopAppBarProps = ComponentProps<typeof ClinicalGlobalTopBar>;

/** Top app bar fija — delega en ClinicalGlobalTopBar (sin duplicar lógica). */
export function EpisTopAppBar(props: EpisTopAppBarProps) {
  return <ClinicalGlobalTopBar {...props} />;
}
