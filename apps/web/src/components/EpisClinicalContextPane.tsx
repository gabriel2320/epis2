import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';

type TimelineEvent = PatientLongitudinalResponse['timeline'][number];
import { buildContextPanelSuggestions } from '@epis2/ai-client/contextPanelSuggestions';
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
import { fetchAiStatus } from '../api/aiApi.js';
import { fetchPatientLongitudinal } from '../api/clinicalApi.js';
import { useAuth } from '../auth/AuthContext.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import { useSilentClinicalSuggestions } from '../clinical/useSilentClinicalSuggestions.js';
import {
  CLINICAL_SUMMARY_TIMELINE_KINDS,
  filterTimelineByKind,
  type TimelineKindFilter,
} from './clinical-summary/clinicalSummaryTimeline.js';
import { useClinicalContextPanelMeta } from './chart/ClinicalRightContextPanel.js';
import { ClinicalSilentSuggestionsPanel } from './cds/ClinicalSilentSuggestionsPanel.js';
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
  /** MF-TE-06 — contador eventos para panel lateral denso. */
  onTimelineCountChange?: (count: number) => void;
  /** MF-DI-06 — alertas CDS/CDR para chips silenciosos. */
  clinicalAlerts?: readonly ClinicalAlert[] | undefined;
  summaryFields?: Record<string, string> | undefined;
  longitudinalSnapshot?: Pick<
    PatientLongitudinalResponse,
    'allergies' | 'observations'
  > | null | undefined;
};

type ContextTab = 'timeline' | 'documents';

const TIMELINE_KIND_LABELS: Record<
  (typeof CLINICAL_SUMMARY_TIMELINE_KINDS)[number],
  string
> = {
  encounter: copy.clinicalSummary.timelineKindEncounter,
  note: copy.clinicalSummary.timelineKindNote,
  observation: copy.clinicalSummary.timelineKindObservation,
  document: copy.clinicalSummary.timelineKindDocument,
  draft: copy.clinicalSummary.timelineKindDraft,
};

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

/** Resumen + acciones sugeridas en panel lateral (MF-CM-05). */
function EpisClinicalContextAiSection({
  patientId,
  clinicalAlerts,
  summaryFields,
  longitudinalSnapshot,
}: {
  patientId: string;
  clinicalAlerts?: readonly ClinicalAlert[] | undefined;
  summaryFields?: Record<string, string> | undefined;
  longitudinalSnapshot?: Pick<
    PatientLongitudinalResponse,
    'allergies' | 'observations'
  > | null | undefined;
}) {
  const panelMeta = useClinicalContextPanelMeta();
  const { session } = useAuth();
  const commandContext = useCommandResolveContext('patient_chart');
  const { submit } = useClinicalCommandSubmit({ patientId, commandContext });
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchAiStatus()
      .then((status) => {
        if (cancelled) return;
        setAiAvailable(status.available);
        panelMeta?.setAiAvailable(status.available);
      })
      .catch(() => {
        if (cancelled) return;
        setAiAvailable(false);
        panelMeta?.setAiAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [panelMeta]);

  const suggestions = useMemo(
    () =>
      buildContextPanelSuggestions({
        role: session?.user.role ?? 'physician',
        aiAvailable: aiAvailable ?? false,
        activeAlertCount: commandContext.activeAlertCount,
        pendingDraftCount: commandContext.pendingDraftCount,
        traditionalSection: commandContext.traditionalSection,
      }),
    [
      session?.user.role,
      aiAvailable,
      commandContext.activeAlertCount,
      commandContext.pendingDraftCount,
      commandContext.traditionalSection,
    ],
  );

  const { suggestions: silentSuggestions, maxVisible } = useSilentClinicalSuggestions({
    alerts: clinicalAlerts,
    summaryFields,
    longitudinal: longitudinalSnapshot
      ? {
          patientId,
          readOnly: true,
          problems: [],
          allergies: longitudinalSnapshot.allergies,
          medications: [],
          observations: longitudinalSnapshot.observations,
          documents: [],
          encounters: [],
          timeline: [],
        }
      : null,
  });

  return (
    <Stack spacing={1.25} data-testid="epis2-context-ai-panel" sx={{ mb: 0.5 }}>
      <ClinicalSilentSuggestionsPanel
        suggestions={silentSuggestions}
        maxVisible={maxVisible}
        onSelectCommand={(label) => void submit(label)}
      />
      <Typography variant="subtitle2" component="h3">
        {copy.ai.panelTitle}
      </Typography>
      <EpisClinicalPeriodSummary patientId={patientId} />
      {suggestions.length > 0 ? (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Acciones sugeridas
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={0.5}
            data-testid="epis2-context-suggested-actions"
          >
            {suggestions.map((item) => (
              <EpisChip
                key={item.intent}
                label={item.labelEs}
                size="small"
                variant="outlined"
                onClick={() => void submit(item.commandText)}
                data-testid={`epis2-context-suggest-${item.intent}`}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
}

/** Panel de consulta clínica — timeline, documentos e inserción (LAYOUT-02+). */
export function EpisClinicalContextPane({
  patientId,
  defaultInsertFieldId = 'plan',
  onInsertFragment,
  onTimelineCountChange,
  clinicalAlerts,
  summaryFields,
  longitudinalSnapshot,
}: EpisClinicalContextPaneProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [fetchedLongitudinal, setFetchedLongitudinal] = useState<
    Pick<PatientLongitudinalResponse, 'allergies' | 'observations'>
  >({ allergies: [], observations: [] });
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<TimelineKindFilter>('all');
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
        setFetchedLongitudinal({
          allergies: res.allergies,
          observations: res.observations,
        });
        setSelectedId(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(copy.errors.genericMessage);
        setTimeline([]);
        setFetchedLongitudinal({ allergies: [], observations: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const filtered = useMemo(() => {
    const byKind = filterTimelineByKind(timeline, kindFilter);
    return byKind.filter((ev) => matchesTimelineQuery(ev, search));
  }, [timeline, kindFilter, search]);

  useEffect(() => {
    onTimelineCountChange?.(filtered.length);
  }, [filtered.length, onTimelineCountChange]);

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
      <EpisClinicalContextAiSection
        patientId={patientId}
        clinicalAlerts={clinicalAlerts}
        summaryFields={summaryFields}
        longitudinalSnapshot={longitudinalSnapshot ?? fetchedLongitudinal}
      />
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
          <Stack direction="row" flexWrap="wrap" gap={0.5} data-testid="epis2-context-timeline-kind-filters">
            <EpisChip
              label={copy.clinicalSummary.timelineFilterAll}
              size="small"
              variant={kindFilter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setKindFilter('all')}
              data-testid="epis2-context-kind-all"
            />
            {CLINICAL_SUMMARY_TIMELINE_KINDS.map((kind) => (
              <EpisChip
                key={kind}
                label={TIMELINE_KIND_LABELS[kind]}
                size="small"
                variant={kindFilter === kind ? 'filled' : 'outlined'}
                onClick={() => setKindFilter(kind)}
                data-testid={`epis2-context-kind-${kind}`}
              />
            ))}
          </Stack>
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
                    secondary={`${new Date(ev.at).toLocaleDateString('es-CL')} · ${TIMELINE_KIND_LABELS[ev.kind as (typeof CLINICAL_SUMMARY_TIMELINE_KINDS)[number]] ?? ev.kind}${ev.detail ? ` — ${ev.detail}` : ''}`}
                    secondaryTypographyProps={{
                      sx: {
                        fontVariantNumeric: 'tabular-nums',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      },
                    }}
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
