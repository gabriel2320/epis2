import type { EpisClinicalListItem } from '@epis2/epis2-ui';
import {
  mapPatientRowsToClinicalListItems,
  patientListRowMeta,
} from '../clinical/patientListRowPresentation.js';

export { patientListRowMeta };

/** @deprecated alias — usar mapPatientRowsToClinicalListItems */
export function mapPatientRowsToCicaListItems(
  rows: Parameters<typeof mapPatientRowsToClinicalListItems>[0],
): EpisClinicalListItem[] {
  return mapPatientRowsToClinicalListItems(rows);
}
