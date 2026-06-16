/**
 * FASE 3 PROG-AESTHETIC-RESET — resumen clínico tabulado (máx. 5 bloques CICA).
 */
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { isSurgicalHistoryDescription } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { Box, ClinicalSection, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { getDemoChartSectionRows } from '../../fixtures/devFixturesBridge.js';
import {
  formatLabObservedAt,
  formatMedicationLine,
  partitionMedicationZones,
  selectLabHighlights,
} from '../clinical-summary/clinicalSummaryData.js';
import { formatTimelinePreviewLines } from '../clinical-summary/clinicalSummaryTimeline.js';

export type ClassicChartSummaryPanelProps = {
  demoCaseCode?: string | undefined;
  summaryFields?: Record<string, string> | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onViewFullTimeline?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDocuments?: (() => void) | undefined;
  testId?: string;
};

function blockBody(text: string | undefined, empty = copy.longitudinal.emptySection): string {
  const trimmed = text?.trim();
  return trimmed || empty;
}

/** Cinco bloques canónicos del tab Resumen — sin grid dashboard ni quick actions. */
export function ClassicChartSummaryPanel({
  demoCaseCode,
  summaryFields = {},
  longitudinal,
  onViewFullTimeline,
  onOpenResults,
  onOpenDocuments,
  testId = 'epis2-classic-summary-panel',
}: ClassicChartSummaryPanelProps) {
  const clinicalProblems = useMemo(
    () => longitudinal?.problems.filter((p) => !isSurgicalHistoryDescription(p.description)) ?? [],
    [longitudinal?.problems],
  );

  const diagnosesText = useMemo(() => {
    if (clinicalProblems.length > 0) {
      return clinicalProblems
        .slice(0, 4)
        .map((p) => `${p.description}${p.status ? ` (${p.status})` : ''}`)
        .join('\n');
    }
    return summaryFields.activeProblems;
  }, [clinicalProblems, summaryFields.activeProblems]);

  const evolutionText = useMemo(() => {
    const notes = longitudinal?.timeline.filter((e) => e.kind === 'note') ?? [];
    if (notes.length > 0) {
      return formatTimelinePreviewLines(notes, 2);
    }
    return summaryFields.recentEvents;
  }, [longitudinal?.timeline, summaryFields.recentEvents]);

  const ordersText = useMemo(() => {
    const demoRows = demoCaseCode ? getDemoChartSectionRows(demoCaseCode, 'navOrders') : [];
    if (demoRows.length > 0) {
      return demoRows
        .slice(0, 4)
        .map((row) => Object.values(row).filter(Boolean).join(' · '))
        .join('\n');
    }
    const zones = partitionMedicationZones(longitudinal?.medications ?? []);
    if (zones.active.length > 0) {
      return zones.active.slice(0, 4).map(formatMedicationLine).join('\n');
    }
    return summaryFields.pendingItems ?? summaryFields.activeMedications;
  }, [demoCaseCode, longitudinal?.medications, summaryFields.pendingItems, summaryFields.activeMedications]);

  const examsText = useMemo(() => {
    const labs = selectLabHighlights(longitudinal?.observations ?? []);
    if (labs.length > 0) {
      const lab = labs[0]!;
      return `${lab.label}: ${lab.valueText} (${formatLabObservedAt(lab.observedAt)})`;
    }
    return summaryFields.relevantLabs;
  }, [longitudinal?.observations, summaryFields.relevantLabs]);

  const documentsText = useMemo(() => {
    const docs = longitudinal?.timeline.filter((e) => e.kind === 'document' || e.kind === 'draft') ?? [];
    if (docs.length > 0) {
      return formatTimelinePreviewLines(docs, 3);
    }
    return undefined;
  }, [longitudinal?.timeline]);

  const blocks = [
    {
      id: 'diagnoses',
      title: copy.clinicalSummary.classicBlocks.activeDiagnoses,
      body: blockBody(diagnosesText),
    },
    {
      id: 'evolution',
      title: copy.clinicalSummary.classicBlocks.lastEvolution,
      body: blockBody(evolutionText),
      link: onViewFullTimeline ? copy.activePatient.viewFullTimeline : undefined,
      onLink: onViewFullTimeline,
    },
    {
      id: 'orders',
      title: copy.clinicalSummary.classicBlocks.activeOrders,
      body: blockBody(ordersText),
    },
    {
      id: 'exams',
      title: copy.clinicalSummary.classicBlocks.relevantExams,
      body: blockBody(examsText),
      link: onOpenResults ? copy.clinicalSummary.openLabs : undefined,
      onLink: onOpenResults,
    },
    {
      id: 'documents',
      title: copy.clinicalSummary.classicBlocks.recentDocuments,
      body: blockBody(documentsText, copy.longitudinal.emptySection),
      link: onOpenDocuments ? copy.chartModes.navDocuments : undefined,
      onLink: onOpenDocuments,
    },
  ] as const;

  return (
    <Stack
      spacing={0}
      data-testid={testId}
      data-cica-composition="classic"
      data-cica-summary-blocks={blocks.length}
      sx={{ pb: 2 }}
    >
      {blocks.map((block) => (
        <ClinicalSection
          key={block.id}
          title={block.title}
          testId={`${testId}-${block.id}`}
          depth={1}
        >
          <EpisM3Text
            role="bodyMedium"
            component="p"
            sx={{ whiteSpace: 'pre-line', fontSize: '0.8125rem', lineHeight: 1.5 }}
          >
            {block.body}
          </EpisM3Text>
          {'link' in block && block.link && block.onLink ? (
            <Box sx={{ pt: 1 }}>
              <Box
                component="button"
                type="button"
                onClick={block.onLink}
                data-testid={`${testId}-${block.id}-link`}
                sx={{
                  border: 'none',
                  background: 'none',
                  p: 0,
                  cursor: 'pointer',
                  color: 'primary.main',
                  textDecoration: 'underline',
                  font: 'inherit',
                  fontSize: '0.8125rem',
                }}
              >
                {block.link}
              </Box>
            </Box>
          ) : null}
        </ClinicalSection>
      ))}
    </Stack>
  );
}
