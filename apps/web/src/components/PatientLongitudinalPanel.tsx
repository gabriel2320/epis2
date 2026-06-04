import type { ReactNode } from 'react';
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { DocumentSearchPanel } from './DocumentSearchPanel.js';
import { PatientClinicalAiPanel } from './PatientClinicalAiPanel.js';

import {
  Box,
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
}: PatientLongitudinalPanelProps) {
  return (
    <Stack spacing={2} data-testid="epis2-longitudinal-panel">
      <Typography variant="subtitle2">{copy.longitudinal.title}</Typography>

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
              sx={{ cursor: ev.kind === 'draft' && onOpenDraft ? 'pointer' : 'default' }}
              onClick={() => {
                if (ev.kind === 'draft' && ev.entityId && onOpenDraft) onOpenDraft(ev.entityId);
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
        <List dense disablePadding>
          {data.documents.map((d) => (
            <ListItem key={d.id} disablePadding>
              <ListItemText
                primary={d.title}
                secondary={`${copy.longitudinal.documentRef}: ${d.storageRef}`}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <DocumentSearchPanel patientId={data.patientId} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <PatientClinicalAiPanel patientId={data.patientId} />
        </Box>
      </Section>
    </Stack>
  );
}
