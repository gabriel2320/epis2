import type { PatientListRow } from '../../api/clinicalApi.js';
import { copy } from '@epis2/design-system';
import { EpisButton, EpisM3Text, Stack, Box } from '@epis2/epis2-ui';
import { getPrimaryNarrativeForDemoCode } from '../../clinical/demoNarrativePresentation.js';
import { getDemoShiftCensusPresentation } from '../../clinical/demoShiftCensusPresentation.js';

export type PatientSearchResultsProps = {
  rows: PatientListRow[];
  emptyMessage: string;
  onOpenChart: (patientId: string) => void;
};

function resultMeta(row: PatientListRow): string {
  const parts: string[] = [];
  const narrative = row.demoCaseCode
    ? getPrimaryNarrativeForDemoCode(row.demoCaseCode)
    : undefined;
  const census = row.demoCaseCode
    ? getDemoShiftCensusPresentation(row.demoCaseCode)
    : undefined;

  if (narrative?.settingEs) parts.push(narrative.settingEs);
  if (row.demoCaseCode) parts.push(row.demoCaseCode);
  if (census?.pendingLabelEs) parts.push(census.pendingLabelEs);

  return parts.join(' · ') || row.demoLabel || '—';
}

/** Lista clínica de resultados — sin grid ni gráficos (PR-AEST-PATIENT-SEARCH-01). */
export function PatientSearchResults({ rows, emptyMessage, onOpenChart }: PatientSearchResultsProps) {
  if (rows.length === 0) {
    return (
      <EpisM3Text role="bodyMedium" color="text.secondary" data-testid="epis2-patient-search-empty">
        {emptyMessage}
      </EpisM3Text>
    );
  }

  return (
    <Stack spacing={1.5} data-testid="epis2-patient-search-results">
      {rows.map((row) => (
        <Box
          key={row.id}
          data-testid={`epis2-patient-search-result-${row.id}`}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            py: 2,
            px: 2,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={0.25} minWidth={0}>
            <EpisM3Text role="titleMedium" component="h3">
              {row.displayName}
            </EpisM3Text>
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {resultMeta(row)}
            </EpisM3Text>
          </Stack>
          <EpisButton
            variant="outlined"
            size="medium"
            onClick={() => onOpenChart(row.id)}
            data-testid={`epis2-patient-search-open-${row.id}`}
            sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            {copy.commandCenter.openPatientChart}
          </EpisButton>
        </Box>
      ))}
    </Stack>
  );
}
