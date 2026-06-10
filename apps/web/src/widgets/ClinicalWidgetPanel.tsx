import {
  Epis2WidgetGrid,
  EpisDraggableWidgetGrid,
  EpisM3Text,
  EpisButton,
  Stack,
  TextField,
  parseWidgetLayoutImport,
  serializeWidgetLayoutToJson,
  useWidgetLayoutOrder,
} from '@epis2/epis2-ui';
import { resolveVisibleWidgets, type WidgetSurface } from '@epis2/epis2-widgets';
import { copy } from '@epis2/design-system';
import { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { buildWidgetContext } from './buildWidgetContext.js';
import { ClinicalWidgetCard } from './ClinicalWidgetCard.js';
import { listWidgetCandidatesForSurface } from './widgetSurface.js';

export type ClinicalWidgetPanelProps = {
  surface: WidgetSurface;
  patientId?: string;
  explicitlyShownWidgetIds?: readonly string[];
  reorderable?: boolean;
  'data-testid'?: string;
};

export function ClinicalWidgetPanel({
  surface,
  patientId,
  explicitlyShownWidgetIds,
  reorderable = true,
  'data-testid': testId = 'epis2-widget-panel',
}: ClinicalWidgetPanelProps) {
  const { session } = useAuth();
  const { setOrder, sortByPreference } = useWidgetLayoutOrder(surface);
  const [layoutImportJson, setLayoutImportJson] = useState('');
  const [layoutError, setLayoutError] = useState<string | null>(null);

  const visibleWidgets = useMemo(() => {
    const context = buildWidgetContext({
      surface,
      session,
      patientId,
      explicitlyShownWidgetIds,
    });
    const candidates = listWidgetCandidatesForSurface(surface);
    const resolved = resolveVisibleWidgets(candidates, context);
    const entries = candidates
      .map((definition, index) => ({
        definition,
        visibility: resolved[index]!,
      }))
      .filter((entry) => entry.visibility.visible)
      .map((entry) => ({
        id: entry.definition.id,
        definition: entry.definition,
        visibility: entry.visibility,
      }));
    return sortByPreference(entries);
  }, [surface, session, patientId, explicitlyShownWidgetIds, sortByPreference]);

  if (visibleWidgets.length === 0) return null;

  const exportLayout = () => {
    const json = serializeWidgetLayoutToJson(
      surface,
      visibleWidgets.map((entry) => entry.id),
    );
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `epis2-widget-layout-${surface}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importLayout = () => {
    const result = parseWidgetLayoutImport(layoutImportJson, surface);
    if (!result.ok) {
      setLayoutError(result.errors.join(' · '));
      return;
    }
    setLayoutError(null);
    setOrder(result.document.widgetIds);
  };

  const toolbar = reorderable ? (
    <Stack spacing={1} sx={{ mb: 1 }} data-testid="epis2-widget-layout-toolbar">
      <EpisM3Text role="labelLarge" color="text.secondary">
        {copy.widgetLayout.hint}
      </EpisM3Text>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
        <TextField
          size="small"
          fullWidth
          placeholder={copy.widgetLayout.importPlaceholder}
          value={layoutImportJson}
          onChange={(e) => setLayoutImportJson(e.target.value)}
          data-testid="epis2-widget-layout-import-json"
        />
        <EpisButton appearance="outlined" size="small" onClick={exportLayout}>
          {copy.widgetLayout.export}
        </EpisButton>
        <EpisButton
          appearance="filled"
          size="small"
          onClick={importLayout}
          disabled={!layoutImportJson.trim()}
        >
          {copy.widgetLayout.import}
        </EpisButton>
      </Stack>
      {layoutError ? (
        <EpisM3Text role="bodyMedium" color="error.main">
          {layoutError}
        </EpisM3Text>
      ) : null}
    </Stack>
  ) : null;

  const items = visibleWidgets.map(({ id, definition, visibility }) => ({
    id,
    node: (
      <ClinicalWidgetCard
        key={id}
        definition={definition}
        visibility={visibility}
        patientId={patientId}
      />
    ),
  }));

  return (
    <Stack data-testid={testId}>
      {toolbar}
      {reorderable ? (
        <EpisDraggableWidgetGrid
          items={items}
          onReorder={setOrder}
          data-testid={`${testId}-grid`}
        />
      ) : (
        <Epis2WidgetGrid data-testid={`${testId}-grid`}>
          {items.map((item) => (
            <Stack key={item.id} sx={{ gridColumn: 'span 12' }}>
              {item.node}
            </Stack>
          ))}
        </Epis2WidgetGrid>
      )}
    </Stack>
  );
}
