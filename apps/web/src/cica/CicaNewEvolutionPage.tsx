import {
  BLUEPRINT_DRAFT_TYPES,
  blueprintUsesClinicalProse,
  buildContextClinicalPrefill,
  buildLiveTemplatePrefill,
  canSuggestLiveTemplate,
  EPIS2_LIVE_TEMPLATES,
  getBlueprintById,
  materializeLiveTemplateBlueprint,
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
import { NEW_EVOLUTION_BLUEPRINT } from './blueprints/actionFormScreens.blueprint.js';

function requireEvolutionBlueprint() {
  const blueprint = getBlueprintById('evolution_note');
  if (!blueprint) {
    throw new Error('evolution_note blueprint missing');
  }
  return blueprint;
}

const evolutionBlueprint = requireEvolutionBlueprint();

/** CICA Clean Room — nueva evolución SOAP (/app/pacientes/:patientId/evoluciones/nueva). */
export function CicaNewEvolutionPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, go } = page;
  const { session, isLoading: sessionLoading } = useAuth();
  const navigate = useClinicalNavigate();
  const { draftId: editingDraftId } = useSearch({ strict: false });

  const summaryFields = detailQuery.data?.clinicalContext.summaryFields ?? {};
  const activeLiveTemplateId = useMemo(
    () =>
      EPIS2_LIVE_TEMPLATES.find(
        (template) =>
          template.blueprintId === evolutionBlueprint.blueprintId &&
          canSuggestLiveTemplate(template.templateId, summaryFields),
      )?.templateId,
    [summaryFields],
  );

  const effectiveBlueprint = useMemo(() => {
    if (!activeLiveTemplateId) return evolutionBlueprint;
    return (
      materializeLiveTemplateBlueprint(activeLiveTemplateId, evolutionBlueprint, summaryFields) ??
      evolutionBlueprint
    );
  }, [activeLiveTemplateId, summaryFields]);

  const form = useEpisClinicalBlueprintForm({ blueprint: effectiveBlueprint });
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
    evolutionBlueprint.allowedRoles.includes(role) &&
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
    const expectedType = BLUEPRINT_DRAFT_TYPES[evolutionBlueprint.blueprintId];
    if (!expectedType || draft.draftType !== expectedType) return;
    hydratedDraftIdRef.current = editingDraftId;
    const rawBody = draft.body as Record<string, unknown>;
    loadFieldMeta(mergeDraftFieldMetaFromBody(rawBody));
    reset(stripDraftMetaFromBody(rawBody) as Record<string, string>);
  }, [editingDraftId, editingDraftQuery.data, loadFieldMeta, reset]);

  useEffect(() => {
    const res = detailQuery.data;
    if (!res) return;
    const hydrateKey = `${res.patient.id}:${evolutionBlueprint.blueprintId}`;
    if (patientContextHydratedRef.current === hydrateKey) return;
    patientContextHydratedRef.current = hydrateKey;

    const contextPrefill = buildContextClinicalPrefill(
      evolutionBlueprint.blueprintId,
      res.clinicalContext.summaryFields,
    );
    if (Object.keys(contextPrefill).length > 0) {
      reset(mergePrefillOnlyEmpty(getValues(), contextPrefill));
    }
    if (activeLiveTemplateId) {
      const livePrefill = buildLiveTemplatePrefill(
        activeLiveTemplateId,
        res.clinicalContext.summaryFields,
      );
      if (Object.keys(livePrefill).length > 0) {
        reset(mergePrefillOnlyEmpty(getValues(), livePrefill));
      }
    }
  }, [detailQuery.data, reset, activeLiveTemplateId, getValues]);

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
      evolutionBlueprint.blueprintId,
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
    blueprint: evolutionBlueprint,
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
        evolutionBlueprint.fields.map((field) => field.id),
        setError,
      ),
  });

  const scrollspySections = useMemo(
    () => scrollspySectionLabels(effectiveBlueprint, evolutionBlueprint.blueprintId),
    [effectiveBlueprint],
  );

  const canPersistDraft = Boolean(
    BLUEPRINT_DRAFT_TYPES[evolutionBlueprint.blueprintId] && patientId,
  );

  const actions = useMemo((): ClinicalLayoutAction[] => {
    if (!patientId) return [];
    return [
      {
        id: 'back-to-chart',
        label: copy.drafts.backToFicha,
        kind: 'secondary',
        onClick: () => go('patient-summary', { patientId }),
        testId: 'cica-evolution-back-to-chart',
      },
      {
        id: 'save-draft',
        label: copy.forms.saveDraft,
        kind: 'primary',
        onClick: () => void saveDraft('save'),
        ...(isSaving ? { disabled: true } : {}),
        testId: 'epis2-form-save',
      },
      ...(canPersistDraft
        ? [
            {
              id: 'sign',
              label: copy.forms.sign,
              kind: 'secondary' as const,
              onClick: () => void saveDraft('sign'),
              ...(isSaving ? { disabled: true } : {}),
              testId: 'epis2-form-sign',
            },
          ]
        : []),
    ];
  }, [canPersistDraft, go, isSaving, patientId, saveDraft]);

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
      <CicaActionFormBlueprintPage
        blueprint={NEW_EVOLUTION_BLUEPRINT}
        title={copy.clinicalSummary.registerEvolution}
        subtitle={statusMessage ?? copy.drafts.approvalDisclaimer}
        identityBand={<CicaPatientIdentityBand {...presentation.identity} />}
        contextStrip={<CicaContextStrip items={presentation.contextItems} />}
        actions={actions}
        testId="cica-screen-new-evolution"
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
                prose={blueprintUsesClinicalProse(evolutionBlueprint.blueprintId)}
                testId="epis2-cica-evolution-form"
              >
                <EpisClinicalScrollspyLayout sections={scrollspySections}>
                  <EpisClinicalFormRhf
                    blueprint={effectiveBlueprint}
                    clinicalProse={blueprintUsesClinicalProse(evolutionBlueprint.blueprintId)}
                    clinicalDropEnabled
                    collapseNonPrimarySections={effectiveBlueprint.sections.length > 2}
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
