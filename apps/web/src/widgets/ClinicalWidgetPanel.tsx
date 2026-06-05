import { Box } from '@epis2/epis2-ui';
import {
  resolveVisibleWidgets,
  WIDGET_GRID_COLUMNS,
  type WidgetSurface,
} from '@epis2/epis2-widgets';
import { useMemo } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { buildWidgetContext } from './buildWidgetContext.js';
import { ClinicalWidgetCard } from './ClinicalWidgetCard.js';
import { listWidgetCandidatesForSurface } from './widgetSurface.js';

export type ClinicalWidgetPanelProps = {
  surface: WidgetSurface;
  patientId?: string;
  explicitlyShownWidgetIds?: readonly string[];
  'data-testid'?: string;
};

export function ClinicalWidgetPanel({
  surface,
  patientId,
  explicitlyShownWidgetIds,
  'data-testid': testId = 'epis2-widget-panel',
}: ClinicalWidgetPanelProps) {
  const { session } = useAuth();

  const visibleWidgets = useMemo(() => {
    const context = buildWidgetContext({
      surface,
      session,
      patientId,
      explicitlyShownWidgetIds,
    });
    const candidates = listWidgetCandidatesForSurface(surface);
    const resolved = resolveVisibleWidgets(candidates, context);
    return candidates
      .map((definition, index) => ({
        definition,
        visibility: resolved[index]!,
      }))
      .filter((entry) => entry.visibility.visible);
  }, [surface, session, patientId, explicitlyShownWidgetIds]);

  if (visibleWidgets.length === 0) return null;

  return (
    <Box
      data-testid={testId}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${WIDGET_GRID_COLUMNS}, minmax(0, 1fr))`,
        gap: 2,
        width: '100%',
      }}
    >
      {visibleWidgets.map(({ definition, visibility }) => (
        <ClinicalWidgetCard
          key={definition.id}
          definition={definition}
          visibility={visibility}
          patientId={patientId}
        />
      ))}
    </Box>
  );
}
