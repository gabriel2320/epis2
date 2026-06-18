import { copy } from '@epis2/design-system';
import { EpisClinicalList } from '@epis2/epis2-ui';
import type { PatientListRow } from '../../api/clinicalApi.js';
import { mapPatientRowsToClinicalListItems } from '../../clinical/patientListRowPresentation.js';

export type PatientSearchResultsProps = {
  rows: PatientListRow[];
  emptyMessage: string;
  onOpenChart: (patientId: string) => void;
};

/** Lista clínica de resultados — EpisClinicalList perfil legacy (MF-PONY-05). */
export function PatientSearchResults({
  rows,
  emptyMessage,
  onOpenChart,
}: PatientSearchResultsProps) {
  return (
    <EpisClinicalList
      visualProfile="default"
      items={mapPatientRowsToClinicalListItems(rows)}
      emptyMessage={emptyMessage}
      actionLabel={copy.commandCenter.openPatientChart}
      onOpenItem={onOpenChart}
    />
  );
}
