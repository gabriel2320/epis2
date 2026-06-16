/**
 * PR-AEST-PATIENT-SEARCH-01 — Censo limpio: una intención = buscar paciente y abrir ficha.
 * @see docs/design/EPIS2_CICA.md · layout profile patient-search
 */
import { copy } from '@epis2/design-system';
import {
  Box,
  ClinicalScreen,
  Collapse,
  EpisButton,
  EpisM3Text,
  EpisTextField,
  Stack,
} from '@epis2/epis2-ui';
import { useCallback, useEffect, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { PatientSearchResults } from '../components/patient-search/PatientSearchResults.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';

export function PatientSearchScreen() {
  const { setPatient: pinPatient } = useActivePatient();
  const navigate = useClinicalNavigate();

  const [query, setQuery] = useState('');
  const [identifierFilter, setIdentifierFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadError, setLoadError] = useState<string | undefined>();

  const { patients, refetch, isFetching, error: patientsError } = usePatientsQuery({
    search: searchTerm,
    enabled: fetchEnabled,
  });

  useEffect(() => {
    if (patientsError) {
      setLoadError(copy.forms.loadPatientsError);
    } else {
      setLoadError(undefined);
    }
  }, [patientsError]);

  const runSearch = useCallback(() => {
    const trimmed = query.trim();
    const idTrimmed = identifierFilter.trim();
    const combined = [trimmed, idTrimmed].filter(Boolean).join(' ').trim();
    setSearchTerm(combined || undefined);
    setFetchEnabled(true);
    void refetch();
  }, [query, identifierFilter, refetch]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const openChart = (patientId: string) => {
    const row = patients.find((p) => p.id === patientId);
    if (row) pinPatient(row);
    void navigate({
      to: '/espacio/ficha',
      search: isDualChartModesEnabled()
        ? { patientId, chartMode: 'traditional' }
        : { patientId },
    });
  };

  return (
    <Box
      data-testid="epis2-patient-search-screen"
      data-cica-composition="patient-search"
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        bgcolor: 'background.default',
      }}
    >
      <ClinicalScreen
        profile="patient-search"
        title={copy.patientSearch.title}
        subtitle={copy.patientSearch.subtitle}
        testId="epis2-generated-clinical-page"
        hideActionBar
      >
          <Stack spacing={3} data-testid="epis2-patient-search-hero">
            <EpisM3Text role="headlineLarge" component="h2">
              {copy.patientSearch.heroQuestion}
            </EpisM3Text>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="stretch">
              <EpisTextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.chartModes.censusCommandPlaceholder}
                inputProps={{ 'data-testid': 'epis2-patient-search-hero-input' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runSearch();
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: 52,
                    borderRadius: 2,
                  },
                }}
              />
              <EpisButton
                variant="contained"
                size="large"
                onClick={runSearch}
                disabled={isFetching}
                data-testid="epis2-patient-search-submit"
                sx={{ minHeight: 52, px: 3, flexShrink: 0 }}
              >
                {copy.patientSearch.searchAction}
              </EpisButton>
            </Stack>

            <Box>
              <EpisButton
                appearance="text"
                size="small"
                onClick={() => setShowAdvanced((v) => !v)}
                data-testid="epis2-patient-search-more-filters"
              >
                {copy.patientSearch.moreFilters}
              </EpisButton>
              <Collapse in={showAdvanced}>
                <Box sx={{ pt: 1.5, maxWidth: 420 }}>
                  <EpisTextField
                    fullWidth
                    size="small"
                    label={copy.patientSearch.identifierLabel}
                    placeholder={copy.patientSearch.identifierPlaceholder}
                    value={identifierFilter}
                    onChange={(e) => setIdentifierFilter(e.target.value)}
                    inputProps={{ 'data-testid': 'epis2-patient-search-identifier' }}
                  />
                </Box>
              </Collapse>
            </Box>
          </Stack>

          {loadError ? (
            <EpisM3Text role="bodyMedium" color="error.main">
              {loadError}
            </EpisM3Text>
          ) : null}

          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <EpisM3Text role="titleMedium" component="h2">
              {copy.patientSearch.resultsHeading}
            </EpisM3Text>
            <PatientSearchResults
              rows={patients}
              emptyMessage={copy.longitudinal.emptySection}
              onOpenChart={openChart}
            />
          </Stack>
        </ClinicalScreen>
    </Box>
  );
}
