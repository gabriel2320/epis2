import type { PatientLongitudinalResponse } from '@epis2/contracts';

type TimelineEvent = PatientLongitudinalResponse['timeline'][number];
import { copy } from '@epis2/design-system';
import {
  CLINICAL_CONTEXT_DRAG_MIME,
  EpisButton,
  EpisChip,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  serializeClinicalContextDrag,
  useEpisClinicalContextDragEnabled,
} from '@epis2/epis2-ui';
import { useEffect, useMemo, useState } from 'react';
import { fetchPatientLongitudinal } from '../api/clinicalApi.js';
import { EpisClinicalContextDocuments } from './EpisClinicalContextDocuments.js';
import { EpisClinicalPeriodSummary } from './EpisClinicalPeriodSummary.js';
import { ErrorState } from './ErrorState.js';

export type ClinicalContextInsertPayload = {
  text: string;
  sourceEventId: string;
  fieldId?: string;
};

export type EpisClinicalContextPaneProps = {
  patientId: string;
  /** Campo destino por defecto para el chip de inserción. */
  defaultInsertFieldId?: string;
  onInsertFragment?: (payload: ClinicalContextInsertPayload) => void;
};

type ContextTab = 'timeline' | 'documents';

function formatTimelineInsertText(ev: TimelineEvent): string {
  const date = new Date(ev.at).toLocaleDateString('es-CL');
  const detail = ev.detail?.trim();
  return detail ? `${ev.title} (${date}): ${detail}` : `${ev.title} (${date})`;
}

function matchesTimelineQuery(ev: TimelineEvent, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const hay = [ev.title, ev.detail ?? '', ev.kind].join(' ').toLowerCase();
  return hay.includes(needle);
}

/** Panel de consulta clínica — timeline, documentos e inserción (LAYOUT-02+). */
export function EpisClinicalContextPane({
  patientId,
  defaultInsertFieldId = 'plan',
  onInsertFragment,
}: EpisClinicalContextPaneProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContextTab>('timeline');
  const dragEnabled = useEpisClinicalContextDragEnabled();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    void fetchPatientLongitudinal(patientId)
      .then((res) => {
        if (cancelled) return;
        setTimeline(res.timeline);
        setSelectedId(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(copy.errors.genericMessage);
        setTimeline([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const filtered = useMemo(
    () => timeline.filter((ev) => matchesTimelineQuery(ev, search)),
    [timeline, search],
  );

  const selected = useMemo(
    () => (selectedId ? timeline.find((ev) => ev.id === selectedId) : undefined),
    [selectedId, timeline],
  );

  if (loading) {
    return (
      <Stack sx={{ p: 2 }} data-testid="epis2-clinical-context-pane">
        <Typography variant="body2" color="text.secondary">
          {copy.drafts.loading}
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack sx={{ p: 2 }} data-testid="epis2-clinical-context-pane">
        <ErrorState
          title={copy.errors.genericTitle}
          message={error}
          onRetry={() => {
            setLoading(true);
            setError(undefined);
            void fetchPatientLongitudinal(patientId)
              .then((res) => setTimeline(res.timeline))
              .catch(() => setError(copy.errors.genericMessage))
              .finally(() => setLoading(false));
          }}
          retryLabel={copy.errors.retry}
        />
      </Stack>
    );
  }

  if (selected) {
    return (
      <Stack spacing={2} sx={{ p: { xs: 2, sm: 2.5 } }} data-testid="epis2-clinical-context-pane">
        <EpisButton variant="text" size="small" onClick={() => setSelectedId(null)}>
          {copy.clinicalLayout.contextBackToList}
        </EpisButton>
        <Typography variant="subtitle2" component="h2">
          {selected.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {new Date(selected.at).toLocaleString('es-CL')} · {selected.kind}
        </Typography>
        {selected.detail ? (
          <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
            {selected.detail}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        )}
        {onInsertFragment ? (
          <EpisChip
            label={copy.clinicalLayout.insertIntoPlan}
            color="primary"
            variant="outlined"
            onClick={() =>
              onInsertFragment({
                text: formatTimelineInsertText(selected),
                sourceEventId: selected.id,
                fieldId: defaultInsertFieldId,
              })
            }
            data-testid="epis2-context-insert-chip"
          />
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}
      data-testid="epis2-clinical-context-pane"
    >
      <Typography variant="subtitle2" component="h2">
        {copy.clinicalLayout.contextPaneTitle}
      </Typography>
      <EpisClinicalPeriodSummary patientId={patientId} />
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value as ContextTab)}
        variant="fullWidth"
        data-testid="epis2-context-tabs"
      >
        <Tab
          value="timeline"
          label={copy.clinicalLayout.contextTabTimeline}
          data-testid="epis2-context-tab-timeline"
        />
        <Tab
          value="documents"
          label={copy.clinicalLayout.contextTabDocuments}
          data-testid="epis2-context-tab-documents"
        />
      </Tabs>
      {activeTab === 'timeline' ? (
        <>
          <TextField
            size="small"
            fullWidth
            placeholder={copy.clinicalLayout.contextSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ 'data-testid': 'epis2-context-search' }}
          />
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {search.trim()
                ? copy.clinicalLayout.contextSearchNoResults
                : copy.longitudinal.emptySection}
            </Typography>
          ) : (
            <List dense disablePadding data-testid="epis2-context-timeline-list">
              {filtered.map((ev) => (
                <ListItemButton
                  key={ev.id}
                  draggable={dragEnabled && Boolean(onInsertFragment)}
                  aria-grabbed={draggingId === ev.id ? true : undefined}
                  onDragStart={(e) => {
                    if (!onInsertFragment) return;
                    const text = formatTimelineInsertText(ev);
                    e.dataTransfer.setData(
                      CLINICAL_CONTEXT_DRAG_MIME,
                      serializeClinicalContextDrag({ text, sourceEventId: ev.id }),
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                    setDraggingId(ev.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  onClick={() => setSelectedId(ev.id)}
                  sx={{ borderRadius: 1 }}
                  data-testid={`epis2-context-timeline-item-${ev.id}`}
                >
                  <ListItemText
                    primary={ev.title}
                    secondary={`${new Date(ev.at).toLocaleDateString('es-CL')} · ${ev.kind}${ev.detail ? ` — ${ev.detail}` : ''}`}
                    secondaryTypographyProps={{ sx: { fontVariantNumeric: 'tabular-nums' } }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </>
      ) : (
        <EpisClinicalContextDocuments
          patientId={patientId}
          defaultInsertFieldId={defaultInsertFieldId}
          {...(onInsertFragment ? { onInsertFragment } : {})}
        />
      )}
    </Stack>
  );
}
