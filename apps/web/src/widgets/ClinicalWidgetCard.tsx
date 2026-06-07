import { copy } from '@epis2/design-system';
import {
  Epis2WidgetActions,
  Epis2WidgetAiDisclosure,
  Epis2WidgetBody,
  Epis2WidgetEmpty,
  Epis2WidgetError,
  Epis2WidgetHeader,
  Epis2WidgetLoading,
  Epis2WidgetOffline,
  Epis2WidgetSurface,
  EpisM3Text,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  useEpis2WidgetLayoutBreakpoint,
  useEpis2ThemePreferences,
} from '@epis2/epis2-ui';
import {
  DEMO_ACTIVE_PROBLEMS,
  DEMO_PATIENT_SUMMARY,
  resolveWidgetPlacement,
  type WidgetDefinition,
  type WidgetVisibility,
} from '@epis2/epis2-widgets';
import { useMemo } from 'react';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
import { usePatientLongitudinalQuery } from '../query/hooks/usePatientLongitudinalQuery.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { useWidgetActions } from './useWidgetActions.js';

export type ClinicalWidgetCardProps = {
  definition: WidgetDefinition;
  visibility: WidgetVisibility;
  patientId?: string;
};

type WidgetLoadState = 'idle' | 'loading' | 'ready' | 'error';

export function ClinicalWidgetCard({ definition, visibility, patientId }: ClinicalWidgetCardProps) {
  const { patient: activePatient } = useActivePatient();
  const { preferences } = useEpis2ThemePreferences();
  const layoutBreakpoint = useEpis2WidgetLayoutBreakpoint();
  const runAction = useWidgetActions(patientId);
  const placement = resolveWidgetPlacement(
    definition.defaultSize,
    layoutBreakpoint,
    preferences.motion === 'reduced',
  );

  const shouldFetch = visibility.shouldFetch;
  const fetchDrafts = shouldFetch && definition.id === 'pending-drafts';
  const fetchLongitudinal =
    shouldFetch &&
    Boolean(patientId) &&
    (definition.id === 'patient-summary' || definition.id === 'active-problems');

  const draftsQuery = useDraftsQuery(patientId ? { patientId } : undefined, fetchDrafts);
  const longitudinalQuery = usePatientLongitudinalQuery(patientId, fetchLongitudinal);

  const draftRows = useMemo(
    () =>
      (draftsQuery.data ?? [])
        .filter((d) => d.status !== 'approved' && d.status !== 'cancelled')
        .map((d) => ({
          id: d.id,
          title: d.title,
          status: d.status,
        })),
    [draftsQuery.data],
  );

  const summaryLines = useMemo(() => {
    if (definition.id !== 'patient-summary') return [];
    const longRes = longitudinalQuery.data;
    if (!longRes) return [];
    const highlights = [
      ...longRes.problems.slice(0, 2).map((p) => p.description),
      ...longRes.allergies.slice(0, 1).map((a) => `Alergia: ${a.substance}`),
    ];
    return highlights.length > 0 ? highlights : [...DEMO_PATIENT_SUMMARY.highlights];
  }, [definition.id, longitudinalQuery.data]);

  const problemLines = useMemo(() => {
    if (definition.id !== 'active-problems') return [];
    const longRes = longitudinalQuery.data;
    if (!longRes) return [];
    const problems = longRes.problems.map((p) => p.description);
    return problems.length > 0 ? problems : [...DEMO_ACTIVE_PROBLEMS];
  }, [definition.id, longitudinalQuery.data]);

  const loadState: WidgetLoadState = (() => {
    if (!shouldFetch) return 'idle';
    if (definition.id === 'pending-drafts') {
      if (draftsQuery.isLoading) return 'loading';
      if (draftsQuery.isError) return 'error';
      return 'ready';
    }
    if (definition.id === 'patient-summary' || definition.id === 'active-problems') {
      if (!patientId) return 'ready';
      if (longitudinalQuery.isLoading) return 'loading';
      if (longitudinalQuery.isError) return 'error';
      return 'ready';
    }
    return 'ready';
  })();

  if (!visibility.visible) return null;

  const headerActions = definition.actions.map((action, index) => ({
    id: `${definition.id}-action-${index}`,
    label: action.label,
    onClick: () => runAction(action),
  }));

  const body = (() => {
    if (visibility.presentation === 'offline') {
      return <Epis2WidgetOffline message={definition.copy.offline} />;
    }
    if (loadState === 'loading') {
      return <Epis2WidgetLoading message={definition.copy.loading} />;
    }
    if (loadState === 'error') {
      return <Epis2WidgetError message={definition.copy.error} />;
    }

    switch (definition.id) {
      case 'patient-context': {
        const p = activePatient;
        if (!p) {
          return <Epis2WidgetEmpty message={definition.copy.empty} />;
        }
        return (
          <Stack spacing={0.5}>
            <EpisM3Text role="bodyMedium" fontWeight={600}>
              {p.displayName}
            </EpisM3Text>
            {p.demoCaseCode ? (
              <EpisM3Text role="bodyMedium" color="text.secondary">
                {p.demoCaseCode}
              </EpisM3Text>
            ) : null}
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {copy.activePatient.workspaceSubtitle}
            </EpisM3Text>
          </Stack>
        );
      }
      case 'pending-drafts': {
        if (draftRows.length === 0) {
          return <Epis2WidgetEmpty message={copy.dashboard.emptyDrafts} />;
        }
        return (
          <List dense disablePadding>
            {draftRows.slice(0, 4).map((row) => (
              <ListItemButton
                key={row.id}
                sx={{ borderRadius: 1, mb: 0.5 }}
                onClick={() =>
                  runAction(
                    { kind: 'navigate', label: '', route: '/espacio/borrador/$draftId' },
                    row.id,
                  )
                }
              >
                <ListItemText primary={row.title} secondary={row.status} />
              </ListItemButton>
            ))}
          </List>
        );
      }
      case 'patient-summary': {
        if (summaryLines.length === 0) {
          return <Epis2WidgetEmpty message={definition.copy.empty} />;
        }
        return (
          <List dense disablePadding>
            {summaryLines.map((line) => (
              <ListItemButton key={line} disableRipple sx={{ borderRadius: 1 }}>
                <ListItemText primary={line} />
              </ListItemButton>
            ))}
          </List>
        );
      }
      case 'active-problems': {
        if (problemLines.length === 0) {
          return <Epis2WidgetEmpty message={definition.copy.empty} />;
        }
        return (
          <List dense disablePadding>
            {problemLines.map((line) => (
              <ListItemButton key={line} disableRipple sx={{ borderRadius: 1 }}>
                <ListItemText primary={line} />
              </ListItemButton>
            ))}
          </List>
        );
      }
      default:
        return <Epis2WidgetEmpty message={definition.copy.empty} />;
    }
  })();

  return (
    <Epis2WidgetSurface
      columnSpan={placement.columnSpan}
      minHeight={placement.minHeight}
      gridTransition={placement.transition}
      testId={`epis2-widget-${definition.id}`}
    >
      <Epis2WidgetHeader
        title={definition.label}
        description={definition.description}
        badge={copy.demoBadge}
      />
      <Epis2WidgetBody>{body}</Epis2WidgetBody>
      {definition.id !== 'pending-drafts' ? (
        <Epis2WidgetActions actions={headerActions} />
      ) : null}
      {definition.copy.aiDisclosure ? (
        <Epis2WidgetAiDisclosure message={definition.copy.aiDisclosure} />
      ) : null}
    </Epis2WidgetSurface>
  );
}
