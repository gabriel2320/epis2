import type { PatientDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';
export type PatientDashboardTabProps = {
  data: PatientDashboardResponse;
  onOpenFicha: () => void;
  onOpenDraft: (draftId: string) => void;
};

export function PatientDashboardTab({ data, onOpenFicha, onOpenDraft }: PatientDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-dashboard-patient">
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h6">{data.displayName}</Typography>
          {data.demoCaseCode ? (
            <Typography variant="caption" color="text.secondary">
              {data.demoCaseCode} · {copy.demoBadge}
            </Typography>
          ) : null}
        </Box>
        <Button size="small" variant="outlined" onClick={onOpenFicha}>
          {copy.dashboard.viewFullRecord}
        </Button>
      </Stack>

      {data.allergies.length > 0 ? (
        <Alert severity="warning">
          {copy.longitudinal.allergies}: {data.allergies.map((a) => a.substance).join(', ')}
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.longitudinal.problems}
        </Typography>
        {data.activeProblems.length > 0 ? (
          <List dense disablePadding>
            {data.activeProblems.map((p) => (
              <ListItem key={p} disablePadding>
                <ListItemText primary={p} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.dashboard.pendingReview}
        </Typography>
        <WorklistDraftGrid
          rows={data.pendingDrafts}
          showPatientColumn={false}
          showUpdatedColumn={false}
          emptyMessage={copy.dashboard.emptyDrafts}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-dashboard-patient-drafts-grid"
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.longitudinal.timeline}
        </Typography>
        <List dense disablePadding>
          {data.timelinePreview.map((ev) => (
            <ListItem key={ev.id} disablePadding>
              <ListItemText
                primary={ev.title}
                secondary={new Date(ev.at).toLocaleString('es-CL')}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
