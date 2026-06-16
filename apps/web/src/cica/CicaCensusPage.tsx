import { copy } from '@epis2/design-system';
import { CicaScreenFrame, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useEffect } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { PatientSearchResults } from '../components/patient-search/PatientSearchResults.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
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

  return (
    <CicaScreenFrame screenId="census" title={copy.clinicalNav.census} hideActionBar>
      <Stack spacing={2}>
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.commandCenter.openPatientChart}
        </EpisM3Text>
        <PatientSearchResults
          rows={patients}
          emptyMessage={patientsError != null ? copy.forms.loadPatientsError : copy.forms.searchPatient}
          onOpenChart={openChart}
        />
      </Stack>
    </CicaScreenFrame>
  );
}
