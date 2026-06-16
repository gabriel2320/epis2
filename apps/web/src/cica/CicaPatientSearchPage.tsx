import { copy } from '@epis2/design-system';
import { CicaResponsiveGrid, CicaScreenFrame, EpisButton, EpisM3Text, EpisTextField, Stack } from '@epis2/epis2-ui';
import { useCallback, useEffect, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { PatientSearchResults } from '../components/patient-search/PatientSearchResults.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA Clean Room — buscar paciente (sala blanca /app/buscar). */
export function CicaPatientSearchPage() {
  const { go } = useCicaNavigate();
  const { setPatient: pinPatient } = useActivePatient();

  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { patients, refetch, isFetching, error: patientsError } = usePatientsQuery({
    search: searchTerm,
    enabled: true,
  });

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const runSearch = useCallback(() => {
    const trimmed = query.trim();
    setSearchTerm(trimmed || undefined);
    void refetch();
  }, [query, refetch]);

  const openChart = (patientId: string) => {
    const row = patients.find((p) => p.id === patientId);
    if (row) pinPatient(row);
    go('patient-summary', { patientId });
  };

  const emptyMessage =
    patientsError != null
      ? copy.forms.loadPatientsError
      : searchTerm
        ? copy.patientSearch.resultsHeading
        : copy.forms.searchPatient;

  return (
    <CicaScreenFrame
      screenId="patient-search"
      title={copy.patientSearch.title}
      subtitle={copy.patientSearch.subtitle}
      hideActionBar
    >
      <Stack spacing={3} data-testid="cica-patient-search-hero">
        <EpisM3Text role="headlineLarge" component="h2">
          {copy.patientSearch.heroQuestion}
        </EpisM3Text>

        <CicaResponsiveGrid testId="cica-patient-search-row">
          <EpisTextField
            sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 10' } }}
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.chartModes.censusCommandPlaceholder}
            inputProps={{ 'data-testid': 'cica-patient-search-input' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSearch();
            }}
          />
          <EpisButton
            variant="contained"
            onClick={runSearch}
            disabled={isFetching}
            data-testid="cica-patient-search-submit"
            sx={{
              gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 2' },
              flexShrink: 0,
              minWidth: { sm: 120 },
              alignSelf: { md: 'stretch' },
            }}
          >
            {copy.patientSearch.searchAction}
          </EpisButton>
        </CicaResponsiveGrid>

        <Stack spacing={1.5} sx={{ width: '100%', minWidth: 0 }}>
          <EpisM3Text role="titleMedium" component="h3">
            {copy.patientSearch.resultsHeading}
          </EpisM3Text>
          <PatientSearchResults
            rows={patients}
            emptyMessage={emptyMessage}
            onOpenChart={openChart}
          />
        </Stack>
      </Stack>
    </CicaScreenFrame>
  );
}
