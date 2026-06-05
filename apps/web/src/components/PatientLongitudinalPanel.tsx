import { useMemo, type ReactNode } from 'react';
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { DocumentSearchPanel } from './DocumentSearchPanel.js';
import { LabObservationsGrid } from './LabObservationsGrid.js';
import { PatientClinicalCharts } from './PatientClinicalCharts.js';
import { LongitudinalNavTree } from './LongitudinalNavTree.js';
import { PatientClinicalAiPanel } from './PatientClinicalAiPanel.js';
import { buildDocumentTreeByType } from '../tree/documentTree.js';
import { exportPatientSummaryUrl } from '../api/clinicalApi.js';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  EpisTreeViewSuspense,
  ExpandMoreIcon,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export type PatientLongitudinalPanelProps = {
  data: PatientLongitudinalResponse;
  onOpenDraft?: (draftId: string) => void;
  onOpenNote?: (noteId: string) => void;
};

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      {empty ? (
        <Typography variant="body2" color="text.secondary">
          {copy.longitudinal.emptySection}
        </Typography>
      ) : (
        children
      )}
    </Paper>
  );
}

export function PatientLongitudinalPanel({
  data,
  onOpenDraft,
  onOpenNote,
}: PatientLongitudinalPanelProps) {
  return (
    <Stack spacing={2} data-testid="epis2-longitudinal-panel">
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle2">{copy.longitudinal.title}</Typography>
        <Stack direction="row" spacing={0.5}>
          <Button
            size="small"
            variant="outlined"
            component="a"
            href={exportPatientSummaryUrl(data.patientId, 'txt')}
            download
            data-testid="epis2-export-summary"
          >
            {copy.longitudinal.exportSummary}
          </Button>
          <Button
            size="small"
            variant="outlined"
            component="a"
            href={exportPatientSummaryUrl(data.patientId, 'pdf')}
            download
            data-testid="epis2-export-summary-pdf"
          >
            {copy.longitudinal.exportSummaryPdf}
          </Button>
        </Stack>
      </Stack>

      <PatientClinicalCharts data={data} />

      <LongitudinalNavTree data={data} onOpenDraft={onOpenDraft} />

      <Section title={copy.longitudinal.problems} empty={data.problems.length === 0}>
        <List dense disablePadding>
          {data.problems.map((p) => (
            <ListItem key={p.id} disablePadding>
              <ListItemText primary={p.description} secondary={p.status} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section title={copy.longitudinal.allergies} empty={data.allergies.length === 0}>
        <List dense disablePadding>
          {data.allergies.map((a) => (
            <ListItem key={a.id} disablePadding>
              <ListItemText primary={a.substance} secondary={a.severity} />
            </ListItem>
          ))}
        </List>
      </Section>

      <Section title={copy.longitudinal.observations} empty={data.observations.length === 0}>
        <LabObservationsGrid
          rows={data.observations}
          data-testid="epis2-lab-observations-grid"
        />
      </Section>

      <Section title={copy.longitudinal.medications} empty={data.medications.length === 0}>
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

      <Section title={copy.longitudinal.timeline} empty={data.timeline.length === 0}>
        <List dense disablePadding>
          {data.timeline.map((ev) => (
            <ListItem
              key={ev.id}
              disablePadding
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
    </Stack>
  );
}

function DocumentIndexTree({
  documents,
}: {
  documents: PatientLongitudinalResponse['documents'];
}) {
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
