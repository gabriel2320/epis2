import { copy } from '@epis2/design-system';
import {
  CicaClinicalList,
  CicaResponsiveGrid,
  CicaScreenFrame,
  CicaStructuredSection,
  CicaSystemWorkspaceHeader,
  EpisM3Text,
  EpisTextField,
  Stack,
} from '@epis2/epis2-ui';
import { useEffect, useMemo, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { mapPatientRowsToCicaListItems } from './cicaPatientListPresentation.js';
import {
  CicaServiceFilterChips,
  matchesCicaServiceFilter,
  type CicaServiceFilter,
} from './CicaServiceFilterChips.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA Clean Room — censo clínico (/app/censo) — estructura epis2g. */
export function CicaCensusPage() {
  const { go } = useCicaNavigate();
  const { setPatient: pinPatient } = useActivePatient();
  const { patients, refetch, error: patientsError } = usePatientsQuery({ enabled: true });
  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<CicaServiceFilter>('todos');

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const openChart = (patientId: string) => {
    const row = patients.find((p) => p.id === patientId);
    if (row) pinPatient(row);
    go('patient-summary', { patientId });
  };

  const listItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const mapped = mapPatientRowsToCicaListItems(patients);
    return mapped.filter((item) => {
      const matchesQuery =
        !needle ||
        item.primaryLabel.toLowerCase().includes(needle) ||
        (item.secondaryLabel ?? '').toLowerCase().includes(needle);
      return (
        matchesQuery && matchesCicaServiceFilter(item.secondaryLabel, serviceFilter)
      );
    });
  }, [patients, query, serviceFilter]);

  return (
    <CicaScreenFrame screenId="census" hideActionBar testId="cica-screen-census">
      <CicaSystemWorkspaceHeader screenId="census" />
      <CicaStructuredSection
        screenId="census"
        blocks={{
          'search-input': (
            <CicaResponsiveGrid testId="cica-census-search-row">
              <EpisTextField
                sx={{ gridColumn: '1 / -1' }}
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.chartModes.censusCommandPlaceholder}
                inputProps={{ 'data-testid': 'cica-census-search-input' }}
              />
            </CicaResponsiveGrid>
          ),
          'service-filters': (
            <CicaServiceFilterChips value={serviceFilter} onChange={setServiceFilter} />
          ),
          'patient-list': (
            <Stack spacing={1.5}>
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
          ),
        }}
      />
    </CicaScreenFrame>
  );
}
