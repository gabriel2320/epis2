import type {
  ClinicalAlert,
  PatientClinicalSummaryResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
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
import {
  clinicalSummaryCardIcon,
  type ClinicalSummaryIconKey,
} from './clinicalSummaryCardIcons.js';
import { EpisClinicalSummaryCard, type ClinicalSummarySurface } from './EpisClinicalSummaryCard.js';

export type PatientClinicalSummaryGridProps = {
  /** Perfil visual — traditional en ficha EMR dual; calm en modo clásico MD3. */
  surfaceProfile?: ClinicalSummarySurface | undefined;
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

function calmLeadingIcon(surface: ClinicalSummarySurface, key?: ClinicalSummaryIconKey) {
  return surface === 'calm' && key ? clinicalSummaryCardIcon(key) : undefined;
}

function formatTimelinePreview(events: PatientLongitudinalResponse['timeline'], max = 3): string {
  const items = events.slice(0, max);
  if (items.length === 0) return copy.longitudinal.emptySection;
  return items
    .map(
      (e) =>
        `${new Date(e.at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })} — ${e.title}`,
    )
    .join('\n');
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
  testId = 'epis2-clinical-summary-grid',
  surfaceProfile = 'calm',
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
        surface={surfaceProfile}
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
        surface={surfaceProfile}
        leadingIcon={calmLeadingIcon(surfaceProfile, 'medications')}
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
        previsionResumen={clinicalSummary?.previsionResumen}
        hospitalizado={clinicalSummary?.hospitalizado}
      />
      {criticalAlerts.length > 0 ? (
        <EpisClinicalSummaryCard
          title={copy.clinicalSummary.criticalAlerts}
          severity="critical"
          surface={surfaceProfile}
          leadingIcon={calmLeadingIcon(surfaceProfile, 'alerts')}
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
              surface={surfaceProfile}
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
              surface={surfaceProfile}
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
              surface={surfaceProfile}
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
          {labHighlights.length > 0
            ? labHighlights.map((lab, index) => (
                <Box
                  key={lab.id}
                  {...(surfaceProfile === 'calm' && index === 0
                    ? { sx: { gridColumn: { md: 'span 2' } } }
                    : {})}
                >
                  <EpisClinicalSummaryCard
                    title={lab.label}
                    surface={surfaceProfile}
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
              surface={surfaceProfile}
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
              <EpisClinicalSummaryCard
                title={copy.activePatient.recentActivityTitle}
                surface={surfaceProfile}
                leadingIcon={calmLeadingIcon(surfaceProfile, 'timeline')}
                meta={copy.clinicalSummary.lastEvents}
                testId={`${testId}-timeline`}
                actionLabel={copy.activePatient.viewFullTimeline}
                onAction={onViewFullTimeline}
              >
                {formatTimelinePreview(longitudinal.timeline)}
              </EpisClinicalSummaryCard>
            </Box>
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
