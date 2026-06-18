import {
  EpisClinicalList,
  type EpisClinicalListItem,
  type EpisClinicalListProps,
} from '../clinical/EpisClinicalList.js';

export type CicaClinicalListItem = EpisClinicalListItem;

export type CicaClinicalListProps = Omit<EpisClinicalListProps, 'visualProfile'>;

/** Alias CICA — perfil visual epis2g sobre EpisClinicalList (MF-PONY-05). */
export function CicaClinicalList(props: CicaClinicalListProps) {
  return <EpisClinicalList visualProfile="cica" {...props} />;
}
