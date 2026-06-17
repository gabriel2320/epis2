import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisChip,
  EpisM3Text,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import {
  CLINICAL_TIMELINE_FILTERS,
  CLINICAL_TIMELINE_FILTER_LABELS_ES,
  filterAndGroupClinicalTimeline,
  type ClinicalTimelineFilter,
} from './clinicalTimeline.js';

export type ClinicalFilterableTimelineProps = {
  timeline: PatientLongitudinalResponse['timeline'];
  onOpenDraft?: ((draftId: string) => void) | undefined;
  /** CICA-L-03 — filtros reducidos (Todos + Evoluciones). */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string;
};

/** MF-DI-08 — timeline agrupado temporalmente con filtros clínicos. */
export function ClinicalFilterableTimeline({
  timeline,
  onOpenDraft,
  compositionMode = 'default',
  testId = 'epis2-clinical-filterable-timeline',
}: ClinicalFilterableTimelineProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const filterOptions = cicaClassic
    ? (['all', 'evolutions'] as const satisfies readonly ClinicalTimelineFilter[])
    : CLINICAL_TIMELINE_FILTERS;
  const [filter, setFilter] = useState<ClinicalTimelineFilter>('all');

  const grouped = useMemo(
    () => filterAndGroupClinicalTimeline(timeline, filter),
    [timeline, filter],
  );

  if (timeline.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </Typography>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId}>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
        {filterOptions.map((value) => (
          <EpisChip
            key={value}
            size="small"
            label={CLINICAL_TIMELINE_FILTER_LABELS_ES[value]}
            color={filter === value ? 'primary' : 'default'}
            variant={filter === value ? 'filled' : 'outlined'}
            onClick={() => setFilter(value)}
            data-testid={`${testId}-filter-${value}`}
          />
        ))}
      </Stack>

      {grouped.length === 0 ? (
        <Typography variant="body2" color="text.secondary" data-testid={`${testId}-empty-filter`}>
          {copy.clinicalLayout.contextSearchNoResults}
        </Typography>
      ) : (
        grouped.map((group) => (
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
                  sx={{
                    cursor:
                      event.kind === 'draft' && event.entityId && onOpenDraft
                        ? 'pointer'
                        : 'default',
                    py: 0.75,
                  }}
                  onClick={() => {
                    if (event.kind === 'draft' && event.entityId && onOpenDraft) {
                      onOpenDraft(event.entityId);
                    }
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${new Date(event.at).toLocaleString('es-CL', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}${event.detail ? ` — ${event.detail}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Stack>
        ))
      )}
    </Stack>
  );
}
