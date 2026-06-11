import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';
import { isSurgicalHistoryDescription } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { Box, EpisButton, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { patientSummaryFieldLabel } from '../../clinical/patientSummaryFieldLabels.js';
import { ClinicalSummaryStickyBanner } from './ClinicalSummaryStickyBanner.js';
import {
  formatAllergyLine,
  formatLabObservedAt,
  formatMedicationLine,
  partitionMedicationZones,
  selectLabHighlights,
} from './clinicalSummaryData.js';
import { EpisClinicalSummaryCard } from './EpisClinicalSummaryCard.js';

export type PatientClinicalSummaryGridProps = {
  summaryFields: Record<string, string>;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  alerts?: readonly ClinicalAlert[] | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  onRegisterProblem?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  onViewFullTimeline?: (() => void) | undefined;
  onOpenEvolution?: (() => void) | undefined;
  testId?: string;
};

const NOW_KEYS = ['recentEvents', 'pendingItems', 'clinicalAlerts'] as const;
const CONTEXT_KEYS = ['activeProblems'] as const;

function formatTimelinePreview(
  events: PatientLongitudinalResponse['timeline'],
  max = 3,
): string {
  const items = events.slice(0, max);
  if (items.length === 0) return copy.longitudinal.emptySection;
  return items
    .map((e) => `${new Date(e.at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })} — ${e.title}`)
    .join('\n');
}

/** Grid de tarjetas-resumen — responde en 2 scrolls: ahora + contexto (MD3 / EHR benchmark). */
export function PatientClinicalSummaryGrid({
  summaryFields,
  longitudinal,
  alerts = [],
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenDraft,
  onViewFullTimeline,
  onOpenEvolution,
  testId = 'epis2-clinical-summary-grid',
}: PatientClinicalSummaryGridProps) {
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
  const hasStructuredMeds =
    medicationZones.active.length > 0 ||
    medicationZones.prn.length > 0 ||
    medicationZones.suspended.length > 0;

  const renderFieldCard = (key: string, severity: 'default' | 'warning' | 'critical' = 'default') => {
    const value = summaryFields[key]?.trim();
    if (!value) return null;
    return (
      <EpisClinicalSummaryCard
        key={key}
        title={patientSummaryFieldLabel(key)}
        severity={severity}
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
        testId={`${testId}-meds-${zoneKey}`}
      >
        {items.map(formatMedicationLine).join('\n')}
      </EpisClinicalSummaryCard>
    );
  };

  return (
    <Stack spacing={2.5} data-testid={testId}>
      <ClinicalSummaryStickyBanner
        alerts={alerts}
        allergies={longitudinal?.allergies}
      />
      {criticalAlerts.length > 0 ? (
        <EpisClinicalSummaryCard
          title={copy.clinicalSummary.criticalAlerts}
          severity="critical"
          testId={`${testId}-live-alerts`}
          actionLabel={copy.clinicalSummary.viewAlerts}
          onAction={onOpenEvolution}
        >
          {criticalAlerts.map((a) => a.message).join(' · ')}
        </EpisClinicalSummaryCard>
      ) : null}

      <Box>
        <EpisM3Text role="titleMedium" component="h2" sx={{ mb: 1.5 }}>
          {copy.clinicalSummary.nowSection}
        </EpisM3Text>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {NOW_KEYS.map((key) =>
            renderFieldCard(key, key === 'clinicalAlerts' ? 'warning' : 'default'),
          )}
          {longitudinal && longitudinal.allergies.length > 0 ? (
            <EpisClinicalSummaryCard
              title={copy.longitudinal.allergies}
              severity="warning"
              testId={`${testId}-allergies`}
              actionLabel={copy.clinicalSummary.manageAllergies}
              onAction={onRegisterAllergy}
            >
              {longitudinal.allergies
                .slice(0, 5)
                .map(formatAllergyLine)
                .join('\n')}
            </EpisClinicalSummaryCard>
          ) : onRegisterAllergy ? (
            <EpisClinicalSummaryCard
              title={copy.longitudinal.allergies}
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
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
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
              {renderMedicationZone('prn', copy.clinicalSummary.medsPrnZone, medicationZones.prn)}
              {renderMedicationZone(
                'suspended',
                copy.clinicalSummary.medsSuspendedZone,
                medicationZones.suspended,
              )}
            </>
          ) : (
            renderFieldCard('activeMedications')
          )}
          {labHighlights.length > 0 ? (
            labHighlights.map((lab) => (
              <EpisClinicalSummaryCard
                key={lab.id}
                title={lab.label}
                meta={copy.clinicalSummary.labsHighlight}
                highlightValue={lab.valueText}
                highlightMeta={formatLabObservedAt(lab.observedAt)}
                testId={`${testId}-lab-${lab.id}`}
                actionLabel={onOpenResults ? copy.clinicalSummary.openLabs : undefined}
                onAction={onOpenResults}
              />
            ))
          ) : (
            renderFieldCard('relevantLabs')
          )}
          {clinicalProblems.length > 0 ? (
            <EpisClinicalSummaryCard
              title={copy.activePatient.summaryActiveProblems}
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
            <EpisClinicalSummaryCard
              title={copy.activePatient.recentActivityTitle}
              meta={copy.clinicalSummary.lastEvents}
              testId={`${testId}-timeline`}
              actionLabel={copy.activePatient.viewFullTimeline}
              onAction={onViewFullTimeline}
            >
              {formatTimelinePreview(longitudinal.timeline)}
            </EpisClinicalSummaryCard>
          ) : null}
        </Box>
      </Box>

      {(onOpenEvolution || onOpenResults || onRegisterProblem) && (
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
