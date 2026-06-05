import { roleHasPermission, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  Box,
  EpisAlert,
  EpisApprovalGate,
  EpisButton,
  EpisCard,
  EpisDraftStatus,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { Link, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import {
  approveDraft,
  DRAFT_TYPE_TO_BLUEPRINT,
  fetchDraftDetail,
  updateDraft,
  type ClinicalDraftDetail,
  type DraftVersionRow,
} from '../api/clinicalApi.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { useAuth } from '../auth/AuthContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';

export function DraftReviewPage() {
  const { draftId } = useParams({ strict: false }) as { draftId: string };
  const { session, hasPermission } = useAuth();
  const [draft, setDraft] = useState<ClinicalDraftDetail | null>(null);
  const [versions, setVersions] = useState<DraftVersionRow[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const role = session?.user.role as ClinicalRole | undefined;
  const canApprove = hasPermission('draft.approve');
  const canEdit =
    role !== undefined &&
    roleHasPermission(role, 'draft.write') &&
    draft !== null &&
    !['approved', 'cancelled'].includes(draft.status);

  const draftBodyFields = draft
    ? Object.fromEntries(
        Object.entries(draft.body).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      )
    : undefined;

  const { alerts: clinicalAlerts, loading: alertsLoading } = usePatientClinicalAlerts({
    patientId: draft?.patientId,
    blueprintId: draft ? DRAFT_TYPE_TO_BLUEPRINT[draft.draftType] : undefined,
    currentFields: draftBodyFields,
    contextLabel: draft?.title,
    enabled: Boolean(draft?.patientId),
  });

  const load = useCallback(async () => {
    setError(undefined);
    try {
      const res = await fetchDraftDetail(draftId);
      setDraft(res.draft);
      setVersions(res.versions);
    } catch {
      setError(copy.errors.genericMessage);
    }
  }, [draftId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sendToReview = async () => {
    if (!draft) return;
    try {
      const res = await updateDraft(draft.id, { status: 'ready_for_review' });
      setDraft(res.draft);
      setMessage(copy.drafts.sentToReview);
      await load();
    } catch {
      setMessage(copy.drafts.transitionError);
    }
  };

  const approve = async () => {
    if (!draft) return;
    try {
      const res = await approveDraft(draft.id);
      setDraft(res.draft);
      setMessage(copy.drafts.approvedSuccess);
      await load();
    } catch {
      setMessage(copy.drafts.approveError);
    }
  };

  if (error) {
    return <EpisAlert severity="error">{error}</EpisAlert>;
  }

  if (!draft) {
    return <Typography color="text.secondary">{copy.drafts.loading}</Typography>;
  }

  const bodyPreview = Object.entries(draft.body as Record<string, string>)
    .filter(([, v]) => String(v).trim())
    .slice(0, 12);

  return (
    <EpisCard variant="outlined" sx={{ p: 3 }} data-testid="epis2-draft-review">
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" component="h1">
            {copy.drafts.reviewTitle}
          </Typography>
          <EpisDraftStatus status={draft.status} />
        </Stack>

        <Typography variant="subtitle1">{draft.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {copy.demoBadge} · {draft.draftType}
        </Typography>

        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={draft.title}
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {copy.drafts.contentTitle}
          </Typography>
          <List dense>
            {bodyPreview.map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemText primary={key} secondary={value} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {copy.drafts.versionsTitle} ({versions.length})
          </Typography>
          <List dense data-testid="epis2-draft-versions">
            {versions.map((v) => (
              <ListItem key={v.versionNo} disablePadding>
                <ListItemText
                  primary={`v${v.versionNo} · ${copy.drafts.statusLabels[v.status as keyof typeof copy.drafts.statusLabels] ?? v.status}`}
                  secondary={new Date(v.createdAt).toLocaleString('es-CL')}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <EpisApprovalGate
          status={draft.status}
          canEdit={canEdit}
          canApprove={canApprove}
          showSendToReview={draft.status !== 'ready_for_review'}
          onSendToReview={() => void sendToReview()}
          onApprove={() => void approve()}
          message={message}
        />

        <EpisButton component={Link} to="/comando" size="small">
          {copy.layout.backToCommand}
        </EpisButton>
      </Stack>
    </EpisCard>
  );
}
