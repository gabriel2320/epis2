import { getBlueprintById } from '@epis2/clinical-forms';
import { roleHasPermission, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisButton,
  EpisDraftStatus,
  epis2ShellContentIslandSx,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DRAFT_TYPE_TO_BLUEPRINT } from '../api/clinicalApi.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { EpisRadDocumentSurface } from '../components/rad/EpisRadDocumentSurface.js';
import { ErrorState } from '../components/ErrorState.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useClinicalNavigate, type ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import { useDraftDetailQuery } from '../query/hooks/useDraftDetailQuery.js';
import {
  useApproveDraftMutation,
  useUpdateDraftMutation,
} from '../query/hooks/useDraftMutations.js';
import { usePatientDetailQuery } from '../query/hooks/usePatientDetailQuery.js';

export function DraftReviewPage() {
  const { draftId } = useParams({ strict: false }) as { draftId: string };
  const { session, hasPermission } = useAuth();
  const { setPatient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const [message, setMessage] = useState<string | undefined>();

  const draftQuery = useDraftDetailQuery(draftId);
  const updateDraftMutation = useUpdateDraftMutation();
  const approveDraftMutation = useApproveDraftMutation();
  const draft = draftQuery.data?.draft ?? null;
  const versions = draftQuery.data?.versions ?? [];
  const patientDetailQuery = usePatientDetailQuery(draft?.patientId, Boolean(draft?.patientId));

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

  useEffect(() => {
    if (patientDetailQuery.data) {
      setPatient(patientDetailQuery.data.patient);
    }
  }, [patientDetailQuery.data, setPatient]);

  const pendingEncounterClosure =
    draft?.draftType === 'outpatient_visit' &&
    (draft.body as Record<string, unknown>).closeEncounter === 'true';

  const sendToReview = () => {
    if (!draft) return;
    updateDraftMutation.mutate(
      { draftId: draft.id, body: { status: 'ready_for_review' } },
      {
        onSuccess: () => {
          setMessage(copy.drafts.sentToReview);
          void draftQuery.refetch();
        },
        onError: () => setMessage(copy.drafts.transitionError),
      },
    );
  };

  const approve = () => {
    if (!draft) return;
    approveDraftMutation.mutate(draft.id, {
      onSuccess: () => {
        setMessage(
          pendingEncounterClosure
            ? `${copy.drafts.approvedSuccess} ${copy.drafts.encounterClosedSuccess}`
            : copy.drafts.approvedSuccess,
        );
        void draftQuery.refetch();
      },
      onError: () => setMessage(copy.drafts.approveError),
    });
  };

  const editFormRoute = draft
    ? getBlueprintById(DRAFT_TYPE_TO_BLUEPRINT[draft.draftType] ?? '')?.routePath
    : undefined;

  const error = draftQuery.isError ? copy.errors.genericMessage : undefined;

  if (error) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <ErrorState
          title={copy.errors.genericTitle}
          message={error}
          onRetry={() => void draftQuery.refetch()}
          retryLabel={copy.errors.retry}
        />
        <ClinicalPageNav />
      </Stack>
    );
  }

  if (!draft && draftQuery.isLoading) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <Typography color="text.secondary">{copy.drafts.loading}</Typography>
        <ClinicalPageNav />
      </Stack>
    );
  }

  if (!draft) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <ErrorState
          title={copy.errors.genericTitle}
          message={copy.errors.genericMessage}
          onRetry={() => void draftQuery.refetch()}
          retryLabel={copy.errors.retry}
        />
        <ClinicalPageNav />
      </Stack>
    );
  }

  const bodyPreview = Object.entries(draft.body as Record<string, string>)
    .filter(([, v]) => String(v).trim())
    .slice(0, 12);

  const approvable = canApprove && ['draft', 'editing', 'ready_for_review'].includes(draft.status);

  const documentActionBar = (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ px: 2, py: 1.5 }}>
      {canEdit && draft.status !== 'ready_for_review' ? (
        <EpisButton appearance="outlined" onClick={sendToReview}>
          {copy.drafts.sendToReview}
        </EpisButton>
      ) : null}
      {approvable ? (
        <EpisButton appearance="filled" onClick={approve} data-testid="epis2-draft-approve">
          {copy.drafts.approveHuman}
        </EpisButton>
      ) : null}
      {canEdit && editFormRoute ? (
        <EpisButton
          variant="outlined"
          size="small"
          onClick={() =>
            void navigate({
              to: editFormRoute as ClinicalFormRoutePath,
              search: { patientId: draft.patientId },
            })
          }
        >
          {copy.drafts.continueEditing}
        </EpisButton>
      ) : null}
    </Stack>
  );

  return (
    <EpisRadDocumentSurface actionBar={documentActionBar} testId="epis2-rad-draft-review">
      <Stack spacing={2} data-testid="epis2-draft-review">
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" component="h1">
            {copy.drafts.reviewTitle}
          </Typography>
          <EpisDraftStatus status={draft.status} />
        </Stack>

        <Typography variant="subtitle1">{draft.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {copy.demoBadge} · {draft.draftType}
        </Typography>

        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={draft.title}
        />

        <EpisAlert severity="warning" variant="outlined">
          {copy.drafts.approvalDisclaimer}
        </EpisAlert>

        {pendingEncounterClosure ? (
          <EpisAlert severity="info" data-testid="epis2-draft-encounter-closure">
            {copy.drafts.encounterClosureOnApprove}
          </EpisAlert>
        ) : null}

        <Stack spacing={1}>
          <Typography variant="subtitle2">{copy.drafts.contentTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {copy.drafts.previewTruncated}
          </Typography>
          <List dense>
            {bodyPreview.map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemText primary={key} secondary={value} />
              </ListItem>
            ))}
          </List>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">
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
        </Stack>

        {message ? (
          <EpisAlert severity="success" data-testid="epis2-draft-review-message">
            {message}
          </EpisAlert>
        ) : null}

        <ClinicalPageNav patientId={draft.patientId} />
      </Stack>
    </EpisRadDocumentSurface>
  );
}
