import {
  BLUEPRINT_DRAFT_TYPES,
  blueprintUsesClinicalProse,
  buildContextClinicalPrefill,
  getBlueprintById,
  mergePrefillOnlyEmpty,
  scrollspySectionLabels,
} from '@epis2/clinical-forms';
import { roleHasPermission, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  CicaContextStrip,
  CicaFormGrid,
  CicaPatientIdentityBand,
  CicaScreenFrame,
  EpisClinicalFormRhf,
  EpisClinicalScrollspyLayout,
  FormProvider,
  Stack,
  useEpisClinicalBlueprintForm,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { stripDraftMetaFromBody } from '@epis2/clinical-productivity';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext.js';
import { applyServerFieldErrors } from '../clinical/applyServerFieldErrors.js';
import { GeneratedFormStatusAlert } from '../clinical/generated-form/GeneratedFormSections.js';
import { useGeneratedFormDraftPersistence } from '../clinical/generated-form/useGeneratedFormDraftPersistence.js';
import { validateGeneratedFormAdminFields } from '../clinical/generated-form/validateGeneratedFormAdmin.js';
import { ErrorState } from '../components/ErrorState.js';
import { registerUnsavedWorkProbe } from '../modes/index.js';
import { useDraftDetailQuery } from '../query/hooks/useDraftDetailQuery.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

function requireCertificateBlueprint() {
  const blueprint = getBlueprintById('medical_certificate');
  if (!blueprint) {
    throw new Error('medical_certificate blueprint missing');
  }
  return blueprint;
}

const certificateBlueprint = requireCertificateBlueprint();

/** CICA Clean Room — nuevo certificado (/app/pacientes/:patientId/documentos/nuevo). */
export function CicaNewDocumentPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, go } = page;
  const { session, isLoading: sessionLoading } = useAuth();
  const navigate = useClinicalNavigate();
  const { draftId: editingDraftId } = useSearch({ strict: false });

  const form = useEpisClinicalBlueprintForm({ blueprint: certificateBlueprint });
  const { getValues, trigger, reset, formState, setError } = form;

  useEffect(() => {
    return registerUnsavedWorkProbe(() => formState.isDirty);
  }, [formState.isDirty]);

  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const patientContextHydratedRef = useRef<string | null>(null);
  const hydratedDraftIdRef = useRef<string | null>(null);

  const editingDraftQuery = useDraftDetailQuery(editingDraftId);
  const hasEditingDraft = Boolean(editingDraftId && editingDraftQuery.data?.draft);

  const role = session?.user.role as ClinicalRole | undefined;
  const allowed =
    role !== undefined &&
    certificateBlueprint.allowedRoles.includes(role) &&
    roleHasPermission(role, 'draft.write');

  useEffect(() => {
    if (sessionLoading || allowed) return;
    void navigate({
      to: '/sin-acceso',
      search: { detail: copy.forms.forbidden },
    });
  }, [sessionLoading, allowed, navigate]);

  useEffect(() => {
    if (!editingDraftId) {
      hydratedDraftIdRef.current = null;
      return;
    }
    const draft = editingDraftQuery.data?.draft;
    if (!draft || hydratedDraftIdRef.current === editingDraftId) return;
    const expectedType = BLUEPRINT_DRAFT_TYPES[certificateBlueprint.blueprintId];
    if (!expectedType || draft.draftType !== expectedType) return;
    hydratedDraftIdRef.current = editingDraftId;
    reset(stripDraftMetaFromBody(draft.body as Record<string, unknown>) as Record<string, string>);
  }, [editingDraftId, editingDraftQuery.data, reset]);

  useEffect(() => {
    const res = detailQuery.data;
    if (!res) return;
    const hydrateKey = `${res.patient.id}:${certificateBlueprint.blueprintId}`;
    if (patientContextHydratedRef.current === hydrateKey) return;
    patientContextHydratedRef.current = hydrateKey;

    const contextPrefill = buildContextClinicalPrefill(
      certificateBlueprint.blueprintId,
      res.clinicalContext.summaryFields,
    );
    if (Object.keys(contextPrefill).length > 0) {
      reset(mergePrefillOnlyEmpty(getValues(), contextPrefill));
    }
  }, [detailQuery.data, reset, getValues]);

  const validateBeforeSave = useCallback(async () => {
    const adminErrors = validateGeneratedFormAdminFields(
      certificateBlueprint.blueprintId,
      getValues(),
    );
    for (const err of adminErrors) {
      setError(err.fieldId, { type: 'manual', message: err.message });
    }
    if (adminErrors.length > 0) {
      setStatusMessage(copy.forms.validationRequired);
      return false;
    }
    return true;
  }, [getValues, setError]);

  const { saveDraft, isSaving } = useGeneratedFormDraftPersistence({
    blueprint: certificateBlueprint,
    patientId,
    editingDraftId,
    hasEditingDraft,
    validate: trigger,
    validateBeforeSave,
    collectBody: () => getValues(),
    onStatus: setStatusMessage,
    applyServerErrors: (error) =>
      applyServerFieldErrors(
        error,
        certificateBlueprint.fields.map((field) => field.id),
        setError,
      ),
  });

  const scrollspySections = useMemo(
    () => scrollspySectionLabels(certificateBlueprint, certificateBlueprint.blueprintId),
    [],
  );

  const actions = useMemo((): ClinicalLayoutAction[] => {
    if (!patientId) return [];
    return [
      {
        id: 'back-to-documents',
        label: copy.drafts.backToFicha,
        kind: 'secondary',
        onClick: () => go('patient-documents', { patientId }),
        testId: 'cica-document-back-to-documents',
      },
      {
        id: 'save-draft',
        label: copy.forms.saveDraft,
        kind: 'primary',
        onClick: () => void saveDraft('save'),
        ...(isSaving ? { disabled: true } : {}),
        testId: 'epis2-form-save',
      },
    ];
  }, [go, isSaving, patientId, saveDraft]);

  if (!allowed) return null;

  if (!patientId || !presentation) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  return (
    <FormProvider {...form}>
      <CicaScreenFrame
        screenId="new-document"
        title={copy.print.medicalCertificateTitle}
        subtitle={statusMessage ?? copy.drafts.approvalDisclaimer}
        identityBand={<CicaPatientIdentityBand {...presentation.identity} />}
        contextStrip={<CicaContextStrip items={presentation.contextItems} />}
        actions={actions}
        testId="cica-screen-new-document"
      >
        <Stack
          spacing={2}
          data-testid="epis2-cica-certificate-form"
          data-cica-composition="classic"
          sx={{ width: '100%' }}
        >
          <CicaFormGrid prose={blueprintUsesClinicalProse(certificateBlueprint.blueprintId)}>
            <EpisClinicalScrollspyLayout sections={scrollspySections}>
              <EpisClinicalFormRhf
                blueprint={certificateBlueprint}
                clinicalProse={blueprintUsesClinicalProse(certificateBlueprint.blueprintId)}
                collapseNonPrimarySections={certificateBlueprint.sections.length > 2}
              />
            </EpisClinicalScrollspyLayout>
          </CicaFormGrid>
          <GeneratedFormStatusAlert message={statusMessage} />
        </Stack>
      </CicaScreenFrame>
    </FormProvider>
  );
}
