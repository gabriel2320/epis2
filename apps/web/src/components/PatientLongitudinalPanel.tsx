import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { isSurgicalHistoryDescription, stripSurgicalHistoryPrefix } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { DocumentSearchPanel } from './DocumentSearchPanel.js';
import { LabObservationsGrid } from './LabObservationsGrid.js';
import { PatientClinicalCharts } from './PatientClinicalCharts.js';
import { LongitudinalNavTree } from './LongitudinalNavTree.js';
import { PatientClinicalAiPanel } from './PatientClinicalAiPanel.js';
import { buildDocumentTreeByType } from '../tree/documentTree.js';
import { downloadPatientSummaryExport } from '../api/clinicalApi.js';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  EpisTreeViewSuspense,
  EpisWorkspaceSection,
  ExpandMoreIcon,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export type HistoryFocusSection = 'timeline' | 'documents';

export type PatientLongitudinalPanelProps = {
  data: PatientLongitudinalResponse;
  focusSection?: HistoryFocusSection | null;
  onOpenDraft?: (draftId: string) => void;
  onOpenNote?: (noteId: string) => void;
  onRegisterAllergy?: () => void;
  onRegisterProblem?: () => void;
  onRegisterSurgicalHistory?: () => void;
  onOpenResults?: () => void;
  onAdmitHospital?: () => void;
  onTransferNote?: () => void;
  onNursingNote?: () => void;
  onOpenServiceOrders?: () => void;
  onOpenServiceCensus?: () => void;
  onOpenNursingMar?: () => void;
};

function Section({
  title,
  empty,
  children,
  testId,
}: {
  title: string;
  empty: boolean;
  children: ReactNode;
  testId?: string | undefined;
}) {
  return (
    <EpisWorkspaceSection title={title} {...(testId !== undefined ? { testId } : {})}>
      {empty ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: children ? 1 : 0 }}>
          {copy.longitudinal.emptySection}
        </Typography>
      ) : null}
      {children}
    </EpisWorkspaceSection>
  );
}

export function PatientLongitudinalPanel({
  data,
  focusSection,
  onOpenDraft,
  onOpenNote,
  onRegisterAllergy,
  onRegisterProblem,
  onRegisterSurgicalHistory,
  onOpenResults,
  onAdmitHospital,
  onTransferNote,
  onNursingNote,
  onOpenServiceOrders,
  onOpenServiceCensus,
  onOpenNursingMar,
}: PatientLongitudinalPanelProps) {
  const [exporting, setExporting] = useState<'txt' | 'pdf' | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const clinicalProblems = useMemo(
    () => data.problems.filter((p) => !isSurgicalHistoryDescription(p.description)),
    [data.problems],
  );
  const surgicalHistory = useMemo(
    () => data.problems.filter((p) => isSurgicalHistoryDescription(p.description)),
    [data.problems],
  );

  useEffect(() => {
    if (!focusSection) return;
    const target = focusSection === 'timeline' ? timelineRef.current : documentsRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focusSection]);

  return (
    <Stack spacing={2} data-testid="epis2-longitudinal-panel">
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle2">{copy.longitudinal.title}</Typography>
        <Stack direction="row" spacing={0.5}>
          <Button
            size="small"
            variant="outlined"
            disabled={exporting !== null}
            data-testid="epis2-export-summary"
            onClick={() => {
              setExporting('txt');
              void downloadPatientSummaryExport(data.patientId, 'txt').finally(() =>
                setExporting(null),
              );
            }}
          >
            {exporting === 'txt'
              ? copy.longitudinal.exportDownloading
              : copy.longitudinal.exportSummary}
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={exporting !== null}
            data-testid="epis2-export-summary-pdf"
            onClick={() => {
              setExporting('pdf');
              void downloadPatientSummaryExport(data.patientId, 'pdf').finally(() =>
                setExporting(null),
              );
            }}
          >
            {exporting === 'pdf'
              ? copy.longitudinal.exportDownloading
              : copy.longitudinal.exportSummaryPdf}
          </Button>
        </Stack>
      </Stack>

      <PatientClinicalCharts data={data} />

      <LongitudinalNavTree data={data} onOpenDraft={onOpenDraft} />

      <Section title={copy.longitudinal.problems} empty={clinicalProblems.length === 0}>
        {clinicalProblems.length === 0 && onRegisterProblem ? (
          <Button
            size="small"
            variant="outlined"
            onClick={onRegisterProblem}
            data-testid="epis2-longitudinal-register-problem"
            sx={{ mb: 1 }}
          >
            {copy.longitudinal.registerProblem}
          </Button>
        ) : null}
        <List dense disablePadding>
          {clinicalProblems.map((p) => (
            <ListItem key={p.id} disablePadding>
              <ListItemText primary={p.description} secondary={p.status} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section
        title={copy.longitudinal.surgicalHistory}
        empty={surgicalHistory.length === 0}
        testId="epis2-longitudinal-surgical-history"
      >
        {surgicalHistory.length === 0 && onRegisterSurgicalHistory ? (
          <Button
            size="small"
            variant="outlined"
            onClick={onRegisterSurgicalHistory}
            data-testid="epis2-longitudinal-register-surgical-history"
            sx={{ mb: 1 }}
          >
            {copy.longitudinal.registerSurgicalHistory}
          </Button>
        ) : null}
        <List dense disablePadding>
          {surgicalHistory.map((p) => (
            <ListItem key={p.id} disablePadding>
              <ListItemText
                primary={stripSurgicalHistoryPrefix(p.description)}
                secondary={p.status}
              />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section title={copy.longitudinal.allergies} empty={data.allergies.length === 0}>
        {data.allergies.length === 0 && onRegisterAllergy ? (
          <Button
            size="small"
            variant="outlined"
            onClick={onRegisterAllergy}
            data-testid="epis2-longitudinal-register-allergy"
            sx={{ mb: 1 }}
          >
            {copy.longitudinal.registerAllergy}
          </Button>
        ) : null}
        <List dense disablePadding>
          {data.allergies.map((a) => (
            <ListItem key={a.id} disablePadding>
              <ListItemText primary={a.substance} secondary={a.severity} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section
        title={copy.longitudinal.observations}
        empty={data.observations.length === 0}
        testId="epis2-longitudinal-observations"
      >
        {onOpenResults ? (
          <Button
            size="small"
            variant="text"
            onClick={onOpenResults}
            data-testid="epis2-longitudinal-open-results"
            sx={{ mb: 1 }}
          >
            {copy.longitudinal.viewResults}
          </Button>
        ) : null}
        <LabObservationsGrid rows={data.observations} data-testid="epis2-lab-observations-grid" />
      </Section>

      <Section
        title={copy.longitudinal.medications}
        empty={data.medications.length === 0}
        testId="epis2-longitudinal-medications"
      >
        <List dense disablePadding>
          {data.medications.map((m) => (
            <ListItem key={m.id} disablePadding>
              <ListItemText
                primary={m.name}
                secondary={[m.doseText, m.route, m.status].filter(Boolean).join(' · ')}
              />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section
        title={copy.longitudinal.hospitalization}
        empty={false}
        testId="epis2-longitudinal-hospitalization"
      >
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {onAdmitHospital ? (
            <Button
              size="small"
              variant="outlined"
              onClick={onAdmitHospital}
              data-testid="epis2-longitudinal-admit-hospital"
            >
              {copy.longitudinal.admitHospital}
            </Button>
          ) : null}
          {onTransferNote ? (
            <Button
              size="small"
              variant="outlined"
              onClick={onTransferNote}
              data-testid="epis2-longitudinal-transfer-note"
            >
              {copy.longitudinal.transferNote}
            </Button>
          ) : null}
          {onNursingNote ? (
            <Button
              size="small"
              variant="outlined"
              onClick={onNursingNote}
              data-testid="epis2-longitudinal-nursing-note"
            >
              {copy.longitudinal.nursingNote}
            </Button>
          ) : null}
          {onOpenServiceOrders ? (
            <Button
              size="small"
              variant="text"
              onClick={onOpenServiceOrders}
              data-testid="epis2-longitudinal-open-service-orders"
            >
              {copy.longitudinal.viewActiveOrders}
            </Button>
          ) : null}
          {onOpenServiceCensus ? (
            <Button
              size="small"
              variant="text"
              onClick={onOpenServiceCensus}
              data-testid="epis2-longitudinal-open-service-census"
            >
              {copy.longitudinal.viewServiceCensus}
            </Button>
          ) : null}
          {onOpenNursingMar ? (
            <Button
              size="small"
              variant="text"
              onClick={onOpenNursingMar}
              data-testid="epis2-longitudinal-open-nursing-mar"
            >
              {copy.longitudinal.viewNursingMar}
            </Button>
          ) : null}
        </Stack>
      </Section>

      <Box ref={timelineRef}>
        <Section
          title={copy.longitudinal.timeline}
          empty={data.timeline.length === 0}
          testId="epis2-longitudinal-timeline"
        >
          <List dense disablePadding>
            {data.timeline.map((ev) => (
              <ListItem
                key={ev.id}
                disablePadding
                data-testid={`epis2-longitudinal-timeline-item-${ev.id}`}
                sx={{
                  cursor:
                    (ev.kind === 'draft' && onOpenDraft) || (ev.kind === 'note' && onOpenNote)
                      ? 'pointer'
                      : 'default',
                }}
                onClick={() => {
                  if (ev.kind === 'draft' && ev.entityId && onOpenDraft) onOpenDraft(ev.entityId);
                  if (ev.kind === 'note' && onOpenNote) onOpenNote(ev.entityId ?? '');
                }}
              >
                <ListItemText
                  primary={ev.title}
                  secondary={`${new Date(ev.at).toLocaleString('es-CL')} · ${ev.kind}${ev.detail ? ` — ${ev.detail}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Section>
      </Box>

      <Box ref={documentsRef}>
        <Section title={copy.longitudinal.documents} empty={data.documents.length === 0}>
          <DocumentIndexTree documents={data.documents} />
          <Box sx={{ mt: 2 }}>
            <DocumentSearchPanel patientId={data.patientId} />
          </Box>
          <Accordion
            disableGutters
            elevation={0}
            defaultExpanded={false}
            sx={{
              mt: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'transparent',
              '&:before': { display: 'none' },
            }}
            data-testid="epis2-patient-ai-panel-accordion"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">{copy.ai.panelTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <PatientClinicalAiPanel patientId={data.patientId} />
            </AccordionDetails>
          </Accordion>
        </Section>
      </Box>
    </Stack>
  );
}

function DocumentIndexTree({ documents }: { documents: PatientLongitudinalResponse['documents'] }) {
  const items = useMemo(
    () =>
      buildDocumentTreeByType(
        documents.map((d) => ({
          id: d.id,
          title: d.title,
          documentType: d.documentType,
          snippet: `${copy.longitudinal.documentRef}: ${d.storageRef}`,
        })),
      ),
    [documents],
  );
  const defaultExpanded = useMemo(() => items.map((n) => n.id), [items]);

  return (
    <EpisTreeViewSuspense
      items={items}
      defaultExpandedItems={defaultExpanded}
      emptyMessage={copy.tree.empty}
      loadingLabel={copy.dashboard.gridLoading}
      data-testid="epis2-longitudinal-documents-tree"
    />
  );
}
