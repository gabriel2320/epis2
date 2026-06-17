import { copy } from '@epis2/design-system';
import { CicaClinicalList, CicaScreenFrame, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useEffect, useMemo } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { mapPatientRowsToCicaListItems } from './cicaPatientListPresentation.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA Clean Room — censo clínico simple (/app/censo). */
export function CicaCensusPage() {
  const { go } = useCicaNavigate();
  const { setPatient: pinPatient } = useActivePatient();
  const { patients, refetch, error: patientsError } = usePatientsQuery({ enabled: true });

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const openChart = (patientId: string) => {
    const row = patients.find((p) => p.id === patientId);
    if (row) pinPatient(row);
    go('patient-summary', { patientId });
  };

  const listItems = useMemo(() => mapPatientRowsToCicaListItems(patients), [patients]);

  return (
    <CicaScreenFrame screenId="census" title={copy.clinicalNav.census} hideActionBar>
      <Stack spacing={2}>
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.commandCenter.openPatientChart}
        </EpisM3Text>
        <CicaClinicalList
          items={listItems}
          emptyMessage={
            patientsError != null ? copy.forms.loadPatientsError : copy.forms.searchPatient
          }
          actionLabel={copy.commandCenter.openPatientChart}
          onOpenItem={openChart}
          testId="cica-census-list"
        />
      </Stack>
    </CicaScreenFrame>
  );
}
