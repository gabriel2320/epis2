import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import type { CommandChip } from '@epis2/command-registry';
import { isSurgicalHistoryDescription } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { Box, EpisButton, EpisChip, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import { patientSummaryFieldLabel } from '../../clinical/patientSummaryFieldLabels.js';
import { ClinicalSummaryStickyBanner } from './ClinicalSummaryStickyBanner.js';
import {
  formatAllergyLine,
  formatLabObservedAt,
  formatMedicationLine,
  partitionMedicationZones,
  selectLabHighlights,
} from './clinicalSummaryData.js';
import {
  CLINICAL_SUMMARY_TIMELINE_KINDS,
  filterTimelineByKind,
  formatTimelinePreviewLines,
  type TimelineKindFilter,
} from './clinicalSummaryTimeline.js';
import {
  clinicalSummaryCardIcon,
  type ClinicalSummaryIconKey,
} from './clinicalSummaryCardIcons.js';
import { EpisClinicalSummaryCard, type ClinicalSummarySurface } from './EpisClinicalSummaryCard.js';
import { ClinicalProbableActionsPanel } from '../chart/ClinicalProbableActionsPanel.js';

export type PatientClinicalSummaryGridProps = {
  /** Perfil visual — traditional en ficha EMR dual; calm en modo clásico MD3. */
  surfaceProfile?: ClinicalSummarySurface | undefined;
  /** CICA-L-02 — presupuesto 5 bloques; oculta chips/quick actions/filtros densos. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  summaryFields: Record<string, string>;
  clinicalSummary?: PatientClinicalSummaryResponse | null | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  alerts?: readonly ClinicalAlert[] | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  onRegisterProblem?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  onViewFullTimeline?: (() => void) | undefined;
  onOpenEvolution?: (() => void) | undefined;
  probableActionChips?: readonly CommandChip[] | undefined;
  onProbableAction?: ((commandSample: string) => void) | undefined;
  testId?: string;
};

const NOW_KEYS = ['recentEvents', 'pendingItems', 'clinicalAlerts'] as const;
const CONTEXT_KEYS = ['activeProblems', 'coveragePrevision'] as const;

const FIELD_ICON_KEYS: Partial<Record<string, ClinicalSummaryIconKey>> = {
  recentEvents: 'events',
  pendingItems: 'drafts',
  clinicalAlerts: 'alerts',
  activeProblems: 'problems',
  activeMedications: 'medications',
  relevantLabs: 'labs',
  coveragePrevision: 'problems',
};

const TIMELINE_KIND_LABELS: Record<(typeof CLINICAL_SUMMARY_TIMELINE_KINDS)[number], string> = {
  encounter: copy.clinicalSummary.timelineKindEncounter,
  note: copy.clinicalSummary.timelineKindNote,
  observation: copy.clinicalSummary.timelineKindObservation,
  document: copy.clinicalSummary.timelineKindDocument,
  draft: copy.clinicalSummary.timelineKindDraft,
};

function calmLeadingIcon(surface: ClinicalSummarySurface, key?: ClinicalSummaryIconKey) {
  return surface === 'calm' && key ? clinicalSummaryCardIcon(key) : undefined;
}

function formatTimelinePreview(events: PatientLongitudinalResponse['timeline'], max = 3): string {
  const text = formatTimelinePreviewLines(events, max);
  return text || copy.longitudinal.emptySection;
}

/** Grid de tarjetas-resumen — responde en 2 scrolls: ahora + contexto (MD3 / EHR benchmark). */
export function PatientClinicalSummaryGrid({
  summaryFields,
  clinicalSummary,
  longitudinal,
  alerts = [],
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenDraft,
  onViewFullTimeline,
  onOpenEvolution,
  probableActionChips,
  onProbableAction,
  testId = 'epis2-clinical-summary-grid',
  surfaceProfile = 'calm',
  compositionMode = 'default',
}: PatientClinicalSummaryGridProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const effectiveSurface: ClinicalSummarySurface = cicaClassic ? 'clinical-flat' : surfaceProfile;
  const nowKeys = cicaClassic
    ? (['pendingItems', 'clinicalAlerts'] as const)
    : NOW_KEYS;
  const [timelineFilter, setTimelineFilter] = useState<TimelineKindFilter>('all');
  const clinicalProblems = useMemo(
    () => longitudinal?.problems.filter((p) => !isSurgicalHistoryDescription(p.description)) ?? [],
    [longitudinal?.problems],
  );
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
  const draftEvents = longitudinal?.timeline.filter((e) => e.kind === 'draft') ?? [];
  const firstDraftId = draftEvents[0]?.entityId;
  const medicationZones = useMemo(
    () => partitionMedicationZones(longitudinal?.medications ?? []),
    [longitudinal?.medications],
  );
  const labHighlights = useMemo(
    () => selectLabHighlights(longitudinal?.observations ?? []),
    [longitudinal?.observations],
  );
  const filteredTimeline = useMemo(
    () => filterTimelineByKind(longitudinal?.timeline ?? [], timelineFilter),
    [longitudinal?.timeline, timelineFilter],
  );
  const hasStructuredMeds =
    medicationZones.active.length > 0 ||
    medicationZones.prn.length > 0 ||
    medicationZones.suspended.length > 0;

  const renderFieldCard = (
    key: string,
    severity: 'default' | 'warning' | 'critical' = 'default',
  ) => {
    const value = summaryFields[key]?.trim();
    if (!value) return null;
    return (
      <EpisClinicalSummaryCard
        key={key}
        title={patientSummaryFieldLabel(key)}
        severity={severity}
        surface={effectiveSurface}
        leadingIcon={calmLeadingIcon(surfaceProfile, FIELD_ICON_KEYS[key])}
        testId={`${testId}-${key}`}
      >
        {value}
      </EpisClinicalSummaryCard>
    );
  };

  const renderMedicationZone = (
    zoneKey: 'active' | 'prn' | 'suspended',
    title: string,
    items: typeof medicationZones.active,
  ) => {
    if (items.length === 0) return null;
    return (
      <EpisClinicalSummaryCard
        key={zoneKey}
        title={title}
        surface={effectiveSurface}
        leadingIcon={calmLeadingIcon(surfaceProfile, 'medications')}
        testId={`${testId}-meds-${zoneKey}`}
      >
        {items.map(formatMedicationLine).join('\n')}
      </EpisClinicalSummaryCard>
    );
  };

  return (
    <Stack
      spacing={2.5}
      data-testid={testId}
      {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}
    >
      <ClinicalSummaryStickyBanner
        alerts={alerts}
        allergies={longitudinal?.allergies}
        previsionResumen={clinicalSummary?.previsionResumen}
        hospitalizado={clinicalSummary?.hospitalizado}
        surface={effectiveSurface}
      />
      {criticalAlerts.length > 0 ? (
        <EpisClinicalSummaryCard
          title={copy.clinicalSummary.criticalAlerts}
          severity="critical"
          surface={effectiveSurface}
          leadingIcon={calmLeadingIcon(surfaceProfile, 'alerts')}
          testId={`${testId}-live-alerts`}
          actionLabel={copy.clinicalSummary.viewAlerts}
          onAction={onOpenEvolution}
        >
          {criticalAlerts.map((a) => a.message).join(' · ')}
        </EpisClinicalSummaryCard>
      ) : null}

      {probableActionChips && probableActionChips.length > 0 && onProbableAction && !cicaClassic ? (
        <ClinicalProbableActionsPanel chips={probableActionChips} onSelect={onProbableAction} />
      ) : null}

      <Box>
        <EpisM3Text role="titleMedium" component="h2" sx={{ mb: 1.5 }}>
          {copy.clinicalSummary.nowSection}
        </EpisM3Text>
        <Box
          sx={{
            display: 'grid',
            gap: cicaClassic ? 0 : 2,
            gridTemplateColumns: cicaClassic
              ? '1fr'
              : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {nowKeys.map((key) =>
            renderFieldCard(key, key === 'clinicalAlerts' ? 'warning' : 'default'),
          )}
          {longitudinal && longitudinal.allergies.length > 0 ? (
            <EpisClinicalSummaryCard
              title={copy.longitudinal.allergies}
              severity="warning"
              surface={effectiveSurface}
              leadingIcon={calmLeadingIcon(surfaceProfile, 'allergies')}
              testId={`${testId}-allergies`}
              actionLabel={copy.clinicalSummary.manageAllergies}
              onAction={onRegisterAllergy}
            >
              {longitudinal.allergies.slice(0, 5).map(formatAllergyLine).join('\n')}
            </EpisClinicalSummaryCard>
          ) : onRegisterAllergy ? (
            <EpisClinicalSummaryCard
              title={copy.longitudinal.allergies}
              surface={effectiveSurface}
              testId={`${testId}-allergies-empty`}
              actionLabel={copy.longitudinal.registerAllergy}
              onAction={onRegisterAllergy}
            >
              {copy.longitudinal.emptySection}
            </EpisClinicalSummaryCard>
          ) : null}
          {draftEvents.length > 0 && onOpenDraft && firstDraftId ? (
            <EpisClinicalSummaryCard
              title={copy.clinicalSummary.pendingDrafts}
              surface={effectiveSurface}
              testId={`${testId}-drafts`}
              actionLabel={copy.activePatient.openDraft}
              onAction={() => onOpenDraft(firstDraftId)}
            >
              {draftEvents.length === 1
                ? draftEvents[0]!.title
                : copy.clinicalSummary.draftCount.replace('{count}', String(draftEvents.length))}
            </EpisClinicalSummaryCard>
          ) : null}
        </Box>
      </Box>

      <Box>
        <EpisM3Text role="titleMedium" component="h2" sx={{ mb: 1.5 }}>
          {copy.clinicalSummary.contextSection}
        </EpisM3Text>
        <Box
          sx={{
            display: 'grid',
            gap: cicaClassic ? 0 : 2,
            gridTemplateColumns: cicaClassic
              ? '1fr'
              : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {CONTEXT_KEYS.map((key) => renderFieldCard(key))}
          {hasStructuredMeds ? (
            <>
              {renderMedicationZone(
                'active',
                copy.clinicalSummary.medsActiveZone,
                medicationZones.active,
              )}
              {!cicaClassic
                ? renderMedicationZone(
                    'prn',
                    copy.clinicalSummary.medsPrnZone,
                    medicationZones.prn,
                  )
                : null}
              {!cicaClassic
                ? renderMedicationZone(
                    'suspended',
                    copy.clinicalSummary.medsSuspendedZone,
                    medicationZones.suspended,
                  )
                : null}
            </>
          ) : (
            renderFieldCard('activeMedications')
          )}
          {labHighlights.length > 0
            ? (cicaClassic ? labHighlights.slice(0, 1) : labHighlights).map((lab, index) => (
                <Box
                  key={lab.id}
                  {...(surfaceProfile === 'calm' && index === 0
                    ? { sx: { gridColumn: { md: 'span 2' } } }
                    : {})}
                >
                  <EpisClinicalSummaryCard
                    title={lab.label}
                    surface={effectiveSurface}
                    leadingIcon={calmLeadingIcon(surfaceProfile, 'labs')}
                    meta={copy.clinicalSummary.labsHighlight}
                    highlightValue={lab.valueText}
                    highlightMeta={formatLabObservedAt(lab.observedAt)}
                    testId={`${testId}-lab-${lab.id}`}
                    actionLabel={onOpenResults ? copy.clinicalSummary.openLabs : undefined}
                    onAction={onOpenResults}
                  />
                </Box>
              ))
            : renderFieldCard('relevantLabs')}
          {clinicalProblems.length > 0 ? (
            <EpisClinicalSummaryCard
              title={copy.activePatient.summaryActiveProblems}
              surface={effectiveSurface}
              leadingIcon={calmLeadingIcon(surfaceProfile, 'problems')}
              testId={`${testId}-problems`}
              actionLabel={copy.clinicalSummary.manageProblems}
              onAction={onRegisterProblem}
            >
              {clinicalProblems
                .slice(0, 3)
                .map((p) => `${p.description}${p.status ? ` (${p.status})` : ''}`)
                .join('\n')}
            </EpisClinicalSummaryCard>
          ) : null}
          {longitudinal && longitudinal.timeline.length > 0 ? (
            <Box {...(surfaceProfile === 'calm' ? { sx: { gridColumn: { md: 'span 2' } } } : {})}>
              {!cicaClassic ? (
                <Stack spacing={1} sx={{ mb: 1 }} direction="row" flexWrap="wrap" useFlexGap>
                  <EpisChip
                    label={copy.clinicalSummary.timelineFilterAll}
                    size="small"
                    color={timelineFilter === 'all' ? 'primary' : 'default'}
                    variant={timelineFilter === 'all' ? 'filled' : 'outlined'}
                    onClick={() => setTimelineFilter('all')}
                    data-testid={`${testId}-timeline-filter-all`}
                  />
                  {CLINICAL_SUMMARY_TIMELINE_KINDS.map((kind) => (
                    <EpisChip
                      key={kind}
                      label={TIMELINE_KIND_LABELS[kind]}
                      size="small"
                      color={timelineFilter === kind ? 'primary' : 'default'}
                      variant={timelineFilter === kind ? 'filled' : 'outlined'}
                      onClick={() => setTimelineFilter(kind)}
                      data-testid={`${testId}-timeline-filter-${kind}`}
                    />
                  ))}
                </Stack>
              ) : null}
              <EpisClinicalSummaryCard
                title={copy.activePatient.recentActivityTitle}
                surface={effectiveSurface}
                leadingIcon={calmLeadingIcon(surfaceProfile, 'timeline')}
                meta={copy.clinicalSummary.lastEvents}
                testId={`${testId}-timeline`}
                actionLabel={copy.activePatient.viewFullTimeline}
                onAction={onViewFullTimeline}
              >
                {formatTimelinePreview(filteredTimeline)}
              </EpisClinicalSummaryCard>
            </Box>
          ) : null}
        </Box>
      </Box>

      {!cicaClassic && (onOpenEvolution || onOpenResults || onRegisterProblem) && (
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          <EpisM3Text role="labelMedium" color="text.secondary">
            {copy.clinicalSummary.quickActions}:
          </EpisM3Text>
          {onOpenEvolution ? (
            <EpisButton appearance="text" size="small" onClick={onOpenEvolution}>
              {copy.clinicalSummary.registerEvolution}
            </EpisButton>
          ) : null}
          {onOpenResults ? (
            <EpisButton appearance="text" size="small" onClick={onOpenResults}>
              {copy.longitudinal.viewResults}
            </EpisButton>
          ) : null}
          {onRegisterProblem ? (
            <EpisButton appearance="text" size="small" onClick={onRegisterProblem}>
              {copy.longitudinal.registerProblem}
            </EpisButton>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
}
