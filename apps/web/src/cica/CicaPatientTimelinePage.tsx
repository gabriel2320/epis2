import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { filterAndGroupClinicalTimeline } from '../components/chart/timeline/clinicalTimeline.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_TIMELINE_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

type CicaTimelineListProps = {
  timeline: PatientLongitudinalResponse['timeline'];
  testId?: string;
};

/** Línea de tiempo completa — agrupada por periodo. */
function CicaTimelineList({ timeline, testId = 'cica-patient-timeline-list' }: CicaTimelineListProps) {
  const grouped = useMemo(() => filterAndGroupClinicalTimeline(timeline, 'all'), [timeline]);

  if (grouped.length === 0) {
    return (
      <EpisM3Text role="bodyMedium" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </EpisM3Text>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId} data-cica-composition="classic">
      {grouped.map((group) => (
        <Stack key={group.bucket} spacing={0.5} data-testid={`${testId}-period-${group.bucket}`}>
          <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
            {group.label}
          </EpisM3Text>
          {group.events.map((event) => (
            <EpisM3Text key={event.id} role="bodyMedium" component="p">
              {event.title}
              {event.detail ? ` — ${event.detail}` : ''}
            </EpisM3Text>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

/** CICA Clean Room — línea de tiempo (/app/pacientes/:patientId/linea-de-tiempo). */
export function CicaPatientTimelinePage() {
  const page = useCicaPatientPage();
  const { patientId, longitudinal } = page;

  if (!patientId) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_TIMELINE_BLUEPRINT}
      testId="cica-patient-timeline-screen"
      slots={{
        timeline: <CicaTimelineList timeline={longitudinal?.timeline ?? []} />,
      }}
    />
  );
}
