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
  Box,
  EpisAiDegradedChip,
  EpisAiDisclosure,
  EpisClinicalFormRhf,
  EpisClinicalScrollspyLayout,
  FormProvider,
  useEpisClinicalBlueprintForm,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { mergeDraftFieldMetaFromBody, stripDraftMetaFromBody } from '@epis2/clinical-productivity';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext.js';
import { applyServerFieldErrors } from '../clinical/applyServerFieldErrors.js';
import {
  buildClinicalTextBoxPatientContext,
  renderClinicalTextBoxField,
} from '../clinical/clinicalTextBoxField.js';
import { GeneratedFormStatusAlert } from '../clinical/generated-form/GeneratedFormSections.js';
import { useGeneratedFormDraftPersistence } from '../clinical/generated-form/useGeneratedFormDraftPersistence.js';
import { validateGeneratedFormAdminFields } from '../clinical/generated-form/validateGeneratedFormAdmin.js';
import { useClinicalTextBoxOrigins } from '../clinical/useClinicalTextBoxOrigins.js';
import { ErrorState } from '../components/ErrorState.js';
import { registerUnsavedWorkProbe } from '../modes/index.js';
import { useAiStatusQuery } from '../query/hooks/useAiStatusQuery.js';
import { useDraftDetailQuery } from '../query/hooks/useDraftDetailQuery.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { CicaActionFormBlueprintPage } from './CicaActionFormBlueprintPage.js';
import { NEW_EPICRISIS_BLUEPRINT } from './blueprints/actionFormScreens.blueprint.js';

function requireDischargeSummaryBlueprint() {
  const blueprint = getBlueprintById('discharge_summary');
  if (!blueprint) {
    throw new Error('discharge_summary blueprint missing');
  }
  return blueprint;
}

const dischargeSummaryBlueprint = requireDischargeSummaryBlueprint();

/** CICA Clean Room — nueva epicrisis (/app/pacientes/:patientId/epicrisis/nueva). */
export function CicaNewEpicrisisPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, go } = page;
  const { session, isLoading: sessionLoading } = useAuth();
  const navigate = useClinicalNavigate();
  const { draftId: editingDraftId } = useSearch({ strict: false });

  const summaryFields = detailQuery.data?.clinicalContext.summaryFields ?? {};
  const form = useEpisClinicalBlueprintForm({ blueprint: dischargeSummaryBlueprint });
  const { getValues, trigger, reset, formState, setError } = form;

  useEffect(() => {
    return registerUnsavedWorkProbe(() => formState.isDirty);
  }, [formState.isDirty]);

  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const patientContextHydratedRef = useRef<string | null>(null);
  const hydratedDraftIdRef = useRef<string | null>(null);

  const { aiAvailable: aiStatusAvailable } = useAiStatusQuery();
  const editingDraftQuery = useDraftDetailQuery(editingDraftId);
  const hasEditingDraft = Boolean(editingDraftId && editingDraftQuery.data?.draft);
  const aiAvailable = aiStatusAvailable ?? false;
  const { recordFieldOrigin, attachToDraftBody, loadFieldMeta } = useClinicalTextBoxOrigins();

  const role = session?.user.role as ClinicalRole | undefined;
  const allowed =
    role !== undefined &&
    dischargeSummaryBlueprint.allowedRoles.includes(role) &&
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
    const expectedType = BLUEPRINT_DRAFT_TYPES[dischargeSummaryBlueprint.blueprintId];
    if (!expectedType || draft.draftType !== expectedType) return;
    hydratedDraftIdRef.current = editingDraftId;
    const rawBody = draft.body as Record<string, unknown>;
    loadFieldMeta(mergeDraftFieldMetaFromBody(rawBody));
    reset(stripDraftMetaFromBody(rawBody) as Record<string, string>);
  }, [editingDraftId, editingDraftQuery.data, loadFieldMeta, reset]);

  useEffect(() => {
    const res = detailQuery.data;
    if (!res) return;
    const hydrateKey = `${res.patient.id}:${dischargeSummaryBlueprint.blueprintId}`;
    if (patientContextHydratedRef.current === hydrateKey) return;
    patientContextHydratedRef.current = hydrateKey;

    const contextPrefill = buildContextClinicalPrefill(
      dischargeSummaryBlueprint.blueprintId,
      res.clinicalContext.summaryFields,
    );
    if (Object.keys(contextPrefill).length > 0) {
      reset(mergePrefillOnlyEmpty(getValues(), contextPrefill));
    }
  }, [detailQuery.data, reset, getValues]);

  const textBoxPatientContext = useMemo(
    () =>
      buildClinicalTextBoxPatientContext({
        displayName: detailQuery.data?.patient.displayName,
        ...(Object.keys(summaryFields).length > 0 ? { structuredSummary: summaryFields } : {}),
        ...(summaryFields.activeMedications
          ? {
              activeMedications: summaryFields.activeMedications
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            }
          : {}),
        ...(summaryFields.relevantLabs
          ? {
              recentLabs: summaryFields.relevantLabs
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            }
          : {}),
      }),
    [detailQuery.data?.patient.displayName, summaryFields],
  );

  const renderClinicalTextBox = useCallback(
    (props: {
      field: import('@epis2/clinical-forms').FormField;
      value: string;
      error?: string;
      onChange: (value: string) => void;
    }) =>
      renderClinicalTextBoxField(
        props.field,
        props.value,
        (next, meta) => {
          props.onChange(next);
          if (meta) recordFieldOrigin(props.field.id, meta);
        },
        {
          ...(props.error ? { error: props.error } : {}),
          patientContext: textBoxPatientContext,
          patientId,
          aiAvailable,
        },
      ),
    [textBoxPatientContext, recordFieldOrigin, patientId, aiAvailable],
  );

  const validateBeforeSave = useCallback(async () => {
    const adminErrors = validateGeneratedFormAdminFields(
      dischargeSummaryBlueprint.blueprintId,
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
    blueprint: dischargeSummaryBlueprint,
    patientId,
    editingDraftId,
    hasEditingDraft,
    validate: trigger,
    validateBeforeSave,
    collectBody: () => attachToDraftBody(getValues()),
    onStatus: setStatusMessage,
    applyServerErrors: (error) =>
      applyServerFieldErrors(
        error,
        dischargeSummaryBlueprint.fields.map((field) => field.id),
        setError,
      ),
  });

  const scrollspySections = useMemo(
    () => scrollspySectionLabels(dischargeSummaryBlueprint, dischargeSummaryBlueprint.blueprintId),
    [],
  );

  const actions = useMemo((): ClinicalLayoutAction[] => {
    if (!patientId) return [];
    return [
      {
        id: 'back-to-chart',
        label: copy.drafts.backToFicha,
        kind: 'secondary',
        onClick: () => go('patient-summary', { patientId }),
        testId: 'cica-epicrisis-back-to-chart',
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

  const canPersistDraft = Boolean(
    BLUEPRINT_DRAFT_TYPES[dischargeSummaryBlueprint.blueprintId] && patientId,
  );

  return (
    <FormProvider {...form}>
      <CicaActionFormBlueprintPage
        blueprint={NEW_EPICRISIS_BLUEPRINT}
        title={copy.print.dischargeSummaryTitle}
        subtitle={statusMessage ?? copy.drafts.approvalDisclaimer}
        identityBand={<CicaPatientIdentityBand {...presentation.identity} />}
        contextStrip={<CicaContextStrip items={presentation.contextItems} />}
        actions={actions}
        testId="cica-screen-new-epicrisis"
        slots={{
          assist: canPersistDraft ? (
            aiAvailable ? (
              <EpisAiDisclosure />
            ) : (
              <EpisAiDegradedChip />
            )
          ) : null,
          form: (
            <Box data-cica-composition="classic" sx={{ width: '100%' }}>
              <CicaFormGrid
                prose={blueprintUsesClinicalProse(dischargeSummaryBlueprint.blueprintId)}
                testId="epis2-cica-epicrisis-form"
              >
                <EpisClinicalScrollspyLayout sections={scrollspySections}>
                  <EpisClinicalFormRhf
                    blueprint={dischargeSummaryBlueprint}
                    clinicalProse={blueprintUsesClinicalProse(
                      dischargeSummaryBlueprint.blueprintId,
                    )}
                    clinicalDropEnabled
                    collapseNonPrimarySections={dischargeSummaryBlueprint.sections.length > 2}
                    renderClinicalTextBox={renderClinicalTextBox}
                  />
                </EpisClinicalScrollspyLayout>
              </CicaFormGrid>
            </Box>
          ),
          status: <GeneratedFormStatusAlert message={statusMessage} />,
        }}
      />
    </FormProvider>
  );
}
