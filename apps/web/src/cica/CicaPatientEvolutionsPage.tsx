import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  EpisM3Text,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { filterAndGroupClinicalTimeline } from '../components/chart/timeline/clinicalTimeline.js';
import { ErrorState } from '../components/ErrorState.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

function formatEventAt(at: string): string {
  return new Date(at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

type CicaEvolutionListProps = {
  timeline: PatientLongitudinalResponse['timeline'];
  testId?: string;
};

/** Lista cronológica de evoluciones — agrupada por periodo, sin grid administrativo. */
function CicaEvolutionList({ timeline, testId = 'cica-evolutions-list' }: CicaEvolutionListProps) {
  const grouped = useMemo(() => filterAndGroupClinicalTimeline(timeline, 'evolutions'), [timeline]);

  if (grouped.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </Typography>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId} data-cica-composition="classic">
      {grouped.map((group) => (
        <Stack key={group.bucket} spacing={1} data-testid={`${testId}-period-${group.bucket}`}>
          <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
            {group.label}
          </EpisM3Text>
          <List dense disablePadding>
            {group.events.map((event) => (
              <ListItem
                key={event.id}
                disablePadding
                data-testid={`${testId}-event-${event.id}`}
                sx={{ py: 0.75 }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={`${formatEventAt(event.at)}${event.detail ? ` — ${event.detail}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      ))}
    </Stack>
  );
}

/** CICA Clean Room — evoluciones (/app/pacientes/:patientId/evoluciones). */
export function CicaPatientEvolutionsPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, longitudinal, go, goPath } = page;

  if (!patientId || !presentation) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'new-evolution',
      label: 'Nueva evolución',
      kind: 'primary',
      onClick: () => go('new-evolution', { patientId }),
    },
  ];

  return (
    <CicaPatientScreenFrame
      screenId="patient-evolutions"
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      testId="cica-patient-evolutions-screen"
    >
      <CicaEvolutionList timeline={longitudinal?.timeline ?? []} />
    </CicaPatientScreenFrame>
  );
}
