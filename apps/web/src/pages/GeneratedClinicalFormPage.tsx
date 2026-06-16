import {
  BLUEPRINT_DRAFT_TYPES,
  blueprintSupportsClinicalContext,
  blueprintUsesClinicalProse,
  blueprintUsesScrollspyLayout,
  buildCommandSlotPrefill,
  buildContextClinicalPrefill,
  buildLiveTemplatePrefill,
  canSuggestLiveTemplate,
  defaultClinicalContextInsertField,
  defaultSummaryValues,
  EPIS2_LIVE_TEMPLATES,
  materializeLiveTemplateBlueprint,
  mergePrefillOnlyEmpty,
  scrollspySectionLabels,
  type ClinicalFormBlueprint,
} from '@epis2/clinical-forms';
import { roleHasPermission, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  EpisAiDisclosure,
  EpisAlert,
  EpisButton,
  EpisChip,
  EpisDemoBadgeChip,
  Box,
  EpisClinicalFocusAppBar,
  EpisClinicalFormRhf,
  EpisClinicalFormActionBar,
  EpisClinicalFormFooter,
  EpisClinicalFormPage,
  EpisClinicalScrollspyLayout,
  EpisClinicalTwoPaneLayout,
  epis2ClinicalFormContentMaxWidthSx,
  EpisM3Text,
  FormProvider,
  Stack,
  useEpisClinicalBlueprintForm,
  useEpisClinicalContextPanel,
} from '@epis2/epis2-ui';
import { Link, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  commandSlotsFromFormSearch,
  hasCommandSlotSearchParams,
} from '../clinical/commandFormSearch.js';
import type { ClinicalFormSearch } from '../routes/clinicalNavigate.js';
import { pickAssistContextFromSummary } from '../api/clinicalApi.js';
import { useAiStatusQuery } from '../query/hooks/useAiStatusQuery.js';
import { useDraftDetailQuery } from '../query/hooks/useDraftDetailQuery.js';
import { usePatientDetailQuery } from '../query/hooks/usePatientDetailQuery.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import {
  EpisClinicalContextPane,
  type ClinicalContextInsertPayload,
} from '../components/EpisClinicalContextPane.js';
import { EpisClinicalSoapHints } from '../components/EpisClinicalSoapHints.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { PatientListGrid } from '../components/PatientListGrid.js';
import { ShiftContextStrip } from '../components/census/ShiftContextStrip.js';
import { PatientSearchAutocomplete } from '../components/PatientSearchAutocomplete.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { applyServerFieldErrors } from '../clinical/applyServerFieldErrors.js';
import {
  buildClinicalTextBoxPatientContext,
  renderClinicalTextBoxField,
} from '../clinical/clinicalTextBoxField.js';
import { MedicationCatalogAutocomplete } from '../clinical/MedicationCatalogAutocomplete.js';
import { useClinicalTextBoxOrigins } from '../clinical/useClinicalTextBoxOrigins.js';
import {
  mergeDraftFieldMetaFromBody,
  resolvePostSaveMicrojourneys,
  stripDraftMetaFromBody,
  type PostSaveMicrojourneyAction,
} from '@epis2/clinical-productivity';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import type { ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { PRINTABLE_BLUEPRINTS } from '../clinical/print/printableBlueprints.js';
import { registerUnsavedWorkProbe, useClassicMd3Mode } from '../modes/index.js';
import { ClassicMd3ClinicalPageShell } from '../components/classic-md3/ClassicMd3ClinicalPageShell.js';
import {
  GeneratedFormClinicalAlerts,
  GeneratedFormPostSaveMicrojourneys,
  GeneratedFormStatusAlert,
} from '../clinical/generated-form/GeneratedFormSections.js';
import { useGeneratedFormAiAssist } from '../clinical/generated-form/useGeneratedFormAiAssist.js';
import { useGeneratedFormDraftPersistence } from '../clinical/generated-form/useGeneratedFormDraftPersistence.js';
import { validateGeneratedFormAdminFields } from '../clinical/generated-form/validateGeneratedFormAdmin.js';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';
import { TraditionalEhrMode } from '../components/chart/TraditionalEhrMode.js';
import { usePatientLongitudinalQuery } from '../query/hooks/usePatientLongitudinalQuery.js';
import { usePatientClinicalSummaryQuery } from '../query/hooks/usePatientClinicalSummaryQuery.js';
import { navigateBackToPaperChartFromPrescriptionForm } from './prescriptionTripleViewNav.js';

export type GeneratedClinicalFormPageProps = {
  blueprint: ClinicalFormBlueprint;
};

export function GeneratedClinicalFormPage({ blueprint }: GeneratedClinicalFormPageProps) {
  const { session, isLoading: sessionLoading } = useAuth();
  const { patient: activePatient, setPatient: pinPatient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const search = useSearch({ strict: false }) as ClinicalFormSearch;
  const isClassicMode = useClassicMd3Mode();

  const urlPatientId = search.patientId;
  const editingDraftId = search.draftId;
  const effectivePatientId = urlPatientId ?? activePatient?.id;

  const seed = useMemo(() => {
    const slotPrefill = buildCommandSlotPrefill(
      blueprint.blueprintId,
      commandSlotsFromFormSearch(search),
    );
    if (blueprint.blueprintId === 'patient_summary') {
      return { ...defaultSummaryValues(), ...slotPrefill };
    }
    if (Object.keys(slotPrefill).length === 0) return undefined;
    return slotPrefill;
  }, [
    blueprint.blueprintId,
    search.patientHint,
    search.medicationHint,
    search.studyHint,
    search.specialtyHint,
    search.bodySiteHint,
    search.urgencyHint,
    search.clinicalReasonHint,
    search.noteHint,
  ]);

  const commandSlots = useMemo(
    () => commandSlotsFromFormSearch(search),
    [
      search.patientHint,
      search.medicationHint,
      search.studyHint,
      search.specialtyHint,
      search.bodySiteHint,
      search.urgencyHint,
      search.clinicalReasonHint,
      search.noteHint,
    ],
  );

  const commandSlotsInUrl = useMemo(
    () => hasCommandSlotSearchParams(search),
    [
      search.patientHint,
      search.medicationHint,
      search.studyHint,
      search.specialtyHint,
      search.bodySiteHint,
      search.urgencyHint,
      search.clinicalReasonHint,
      search.noteHint,
    ],
  );

  const patientDetailQuery = usePatientDetailQuery(effectivePatientId);
  const summaryFieldsForLive = patientDetailQuery.data?.clinicalContext.summaryFields ?? {};
  const activeLiveTemplateId = useMemo(() => {
    if (blueprint.blueprintId !== 'evolution_note') return undefined;
    return EPIS2_LIVE_TEMPLATES.find(
      (template) =>
        template.blueprintId === blueprint.blueprintId &&
        canSuggestLiveTemplate(template.templateId, summaryFieldsForLive),
    )?.templateId;
  }, [blueprint.blueprintId, summaryFieldsForLive]);

  const effectiveBlueprint = useMemo(() => {
    if (!activeLiveTemplateId) return blueprint;
    return (
      materializeLiveTemplateBlueprint(activeLiveTemplateId, blueprint, summaryFieldsForLive) ??
      blueprint
    );
  }, [blueprint, activeLiveTemplateId, summaryFieldsForLive]);

  const useTraditionalEvolutionShell =
    isDualChartModesEnabled() &&
    effectiveBlueprint.blueprintId === 'evolution_note' &&
    Boolean(effectivePatientId);

  const longitudinalQuery = usePatientLongitudinalQuery(
    effectivePatientId,
    useTraditionalEvolutionShell,
  );
  const clinicalSummaryQuery = usePatientClinicalSummaryQuery(
    effectivePatientId,
    useTraditionalEvolutionShell,
  );

  const form = useEpisClinicalBlueprintForm({
    blueprint: effectiveBlueprint,
    ...(seed !== undefined ? { seed } : {}),
  });
  const { watch, setValue, getValues, trigger, reset, formState, setError } = form;

  useEffect(() => {
    return registerUnsavedWorkProbe(() => formState.isDirty);
  }, [formState.isDirty]);

  const values = watch();
  const printable = PRINTABLE_BLUEPRINTS[blueprint.blueprintId];

  const [showCommandPrefillBadge] = useState(() => hasCommandSlotSearchParams(search));
  const [showContextPrefillBadge, setShowContextPrefillBadge] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [postSaveActions, setPostSaveActions] = useState<PostSaveMicrojourneyAction[]>([]);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [patientSearch, setPatientSearch] = useState<string | undefined>();
  const [patientLookupQuery, setPatientLookupQuery] = useState('');
  const [patientsFetchEnabled, setPatientsFetchEnabled] = useState(false);
  const [assistContext, setAssistContext] = useState<Record<string, string>>({});

  const { aiAvailable: aiStatusAvailable } = useAiStatusQuery();
  const {
    patients,
    refetch: refetchPatients,
    isFetching: patientsFetching,
  } = usePatientsQuery({
    search: patientSearch,
    enabled: patientsFetchEnabled,
  });
  const editingDraftQuery = useDraftDetailQuery(editingDraftId);
  const { recordFieldOrigin, attachToDraftBody, loadFieldMeta } = useClinicalTextBoxOrigins();
  const hydratedDraftIdRef = useRef<string | null>(null);
  const patientContextHydratedRef = useRef<string | null>(null);
  const commandSlotsStrippedRef = useRef(false);

  useEffect(() => {
    if (!editingDraftId) {
      hydratedDraftIdRef.current = null;
      return;
    }
    const draft = editingDraftQuery.data?.draft;
    if (!draft || hydratedDraftIdRef.current === editingDraftId) return;
    const expectedType = BLUEPRINT_DRAFT_TYPES[blueprint.blueprintId];
    if (!expectedType || draft.draftType !== expectedType) return;
    hydratedDraftIdRef.current = editingDraftId;
    const rawBody = draft.body as Record<string, unknown>;
    loadFieldMeta(mergeDraftFieldMetaFromBody(rawBody));
    reset(stripDraftMetaFromBody(rawBody) as Record<string, string>);
  }, [editingDraftId, editingDraftQuery.data, blueprint.blueprintId, loadFieldMeta, reset]);

  const canUseAiAssist = blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES;
  const clinicalProse = blueprintUsesClinicalProse(blueprint.blueprintId);
  const supportsClinicalContext = blueprintSupportsClinicalContext(blueprint.blueprintId);
  const aiAvailable = canUseAiAssist ? (aiStatusAvailable ?? false) : false;
  const usesScrollspyShell =
    supportsClinicalContext || blueprintUsesScrollspyLayout(blueprint.blueprintId);
  const contextStorageKey = useMemo(
    () =>
      effectivePatientId && supportsClinicalContext
        ? `epis2-clinical-context:${effectivePatientId}:${blueprint.blueprintId}`
        : undefined,
    [effectivePatientId, supportsClinicalContext, blueprint.blueprintId],
  );
  const { contextOpen, setContextOpen } = useEpisClinicalContextPanel({
    ...(contextStorageKey !== undefined ? { storageKey: contextStorageKey } : {}),
  });
  const defaultContextInsertFieldId = blueprintSupportsClinicalContext(blueprint.blueprintId)
    ? defaultClinicalContextInsertField(blueprint.blueprintId)
    : 'plan';

  const scrollspySections = useMemo(
    () => scrollspySectionLabels(effectiveBlueprint, blueprint.blueprintId),
    [effectiveBlueprint, blueprint.blueprintId],
  );

  const textBoxPatientContext = useMemo(() => {
    const summary = patientDetailQuery.data?.clinicalContext.summaryFields;
    return buildClinicalTextBoxPatientContext({
      displayName: activePatient?.displayName,
      ...(summary ? { structuredSummary: summary } : {}),
      ...(summary?.activeMedications
        ? {
            activeMedications: summary.activeMedications
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean),
          }
        : {}),
      ...(summary?.relevantLabs
        ? {
            recentLabs: summary.relevantLabs
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean),
          }
        : {}),
    });
  }, [activePatient?.displayName, patientDetailQuery.data?.clinicalContext.summaryFields]);

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
          patientId: effectivePatientId,
          aiAvailable,
        },
      ),
    [textBoxPatientContext, recordFieldOrigin, effectivePatientId, aiAvailable],
  );

  // MF-184: campos text con catalogAutocomplete → autocomplete del catálogo promovido.
  const renderCatalogField = useCallback(
    (props: {
      field: import('@epis2/clinical-forms').FormField;
      value: string;
      error?: string;
      onChange: (value: string) => void;
    }) => {
      if (props.field.catalogAutocomplete !== 'medication') return null;
      return (
        <MedicationCatalogAutocomplete
          label={props.field.label}
          value={props.value}
          required={Boolean(props.field.required)}
          {...(props.error ? { error: props.error } : {})}
          onChange={props.onChange}
        />
      );
    },
    [],
  );

  const { alerts: clinicalAlerts, loading: alertsLoading } = usePatientClinicalAlerts({
    patientId: effectivePatientId,
    blueprintId: blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES ? blueprint.blueprintId : undefined,
    contextLabel: blueprint.label,
    enabled: Boolean(effectivePatientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES),
  });
  const showClinicalAlerts = Boolean(
    effectivePatientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES,
  );

  const role = session?.user.role as ClinicalRole | undefined;
  const needsDraftWrite =
    blueprint.outputKind === 'CLINICAL_NOTE_DRAFT' || blueprint.outputKind === 'ORDER_DRAFT';
  const allowed =
    role !== undefined &&
    blueprint.allowedRoles.includes(role) &&
    (!needsDraftWrite || roleHasPermission(role, 'draft.write'));

  useEffect(() => {
    if (urlPatientId || !activePatient?.id || !blueprint.requiresPatient) return;
    navigate({
      to: blueprint.routePath as ClinicalFormRoutePath,
      search: { patientId: activePatient.id },
    });
  }, [urlPatientId, activePatient?.id, blueprint.requiresPatient, blueprint.routePath, navigate]);

  const insertContextFragment = useCallback(
    (payload: ClinicalContextInsertPayload) => {
      const fieldId = payload.fieldId ?? defaultContextInsertFieldId;
      const line = payload.text.trim();
      if (!line) return;
      const current = getValues(fieldId)?.trim();
      setValue(fieldId, current ? `${current}\n${line}` : line, { shouldDirty: true });
      setStatusMessage(copy.clinicalLayout.insertSuccess);
    },
    [defaultContextInsertFieldId, getValues, setValue],
  );

  const onClinicalDrop = useCallback(
    (fieldId: string, payload: { text: string; sourceEventId: string }) => {
      insertContextFragment({ ...payload, fieldId });
    },
    [insertContextFragment],
  );

  const loadPatients = useCallback(() => {
    setLoadError(undefined);
    const current = getValues();
    const term = current.identifier?.trim() || current.patientName?.trim();
    setPatientSearch(term || undefined);
    setPatientsFetchEnabled(true);
    void refetchPatients().catch(() => {
      setLoadError(copy.forms.loadPatientsError);
    });
  }, [getValues, refetchPatients]);

  useEffect(() => {
    if (blueprint.blueprintId !== 'patient_search') return;
    const trimmed = patientLookupQuery.trim();
    if (trimmed.length < 2) {
      setPatientsFetchEnabled(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setPatientSearch(trimmed);
      setPatientsFetchEnabled(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [blueprint.blueprintId, patientLookupQuery]);

  useEffect(() => {
    const res = patientDetailQuery.data;
    if (!res) return;
    const hydrateKey = `${res.patient.id}:${blueprint.blueprintId}:${editingDraftId ?? ''}`;
    if (patientContextHydratedRef.current === hydrateKey) return;
    patientContextHydratedRef.current = hydrateKey;

    pinPatient(res.patient);
    setAssistContext(pickAssistContextFromSummary(res.clinicalContext.summaryFields));
    if (blueprint.blueprintId === 'patient_summary') {
      reset({ ...getValues(), ...res.clinicalContext.summaryFields });
      return;
    }
    const contextPrefill = buildContextClinicalPrefill(
      blueprint.blueprintId,
      res.clinicalContext.summaryFields,
      { slots: commandSlots },
    );
    if (Object.keys(contextPrefill).length > 0) {
      reset(mergePrefillOnlyEmpty(getValues(), contextPrefill));
      if (!editingDraftId) {
        setShowContextPrefillBadge(true);
      }
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
  }, [
    patientDetailQuery.data,
    blueprint.blueprintId,
    pinPatient,
    reset,
    commandSlots,
    editingDraftId,
    activeLiveTemplateId,
    getValues,
  ]);

  useEffect(() => {
    if (!commandSlotsInUrl) {
      commandSlotsStrippedRef.current = false;
      return;
    }
    if (commandSlotsStrippedRef.current) return;
    commandSlotsStrippedRef.current = true;
    navigate({
      to: blueprint.routePath as ClinicalFormRoutePath,
      search: urlPatientId ? { patientId: urlPatientId } : {},
      replace: true,
    });
  }, [blueprint.routePath, navigate, commandSlotsInUrl, urlPatientId]);

  const selectPatient = (id: string) => {
    const row = patients.find((p) => p.id === id);
    if (row) pinPatient(row);
    if (blueprint.blueprintId === 'patient_search') {
      navigate({ to: '/espacio/ficha', search: { patientId: id } });
      return;
    }
    navigate({
      to: blueprint.routePath as ClinicalFormRoutePath,
      search: { patientId: id },
    });
  };

  const { isSuggesting, suggestWithAi } = useGeneratedFormAiAssist({
    blueprintId: blueprint.blueprintId,
    collectFields: getValues,
    applyIfEmpty: (fieldId, value) => {
      if (!getValues(fieldId)?.trim()) {
        setValue(fieldId, value, { shouldDirty: true });
      }
    },
    assistContext,
    patientId: effectivePatientId,
    onStatus: setStatusMessage,
  });

  const summaryFieldsForJourneys = patientDetailQuery.data?.clinicalContext.summaryFields;

  const validateBeforeSave = useCallback(async () => {
    const adminErrors = validateGeneratedFormAdminFields(blueprint.blueprintId, getValues());
    for (const err of adminErrors) {
      setError(err.fieldId, { type: 'manual', message: err.message });
    }
    if (adminErrors.length > 0) {
      setStatusMessage(copy.forms.validationRequired);
      return false;
    }
    return true;
  }, [blueprint.blueprintId, getValues, setError]);

  const handleDraftSaved = useCallback(() => {
    setPostSaveActions(
      resolvePostSaveMicrojourneys({
        blueprintId: blueprint.blueprintId,
        patientId: effectivePatientId,
        summaryFields: summaryFieldsForJourneys,
      }),
    );
  }, [blueprint.blueprintId, effectivePatientId, summaryFieldsForJourneys]);

  const { saveDraft, isSaving } = useGeneratedFormDraftPersistence({
    blueprint,
    patientId: effectivePatientId,
    editingDraftId,
    hasEditingDraft: Boolean(editingDraftQuery.data?.draft),
    validate: trigger,
    validateBeforeSave,
    onDraftSaved: handleDraftSaved,
    collectBody: () => attachToDraftBody(getValues()),
    onStatus: setStatusMessage,
    applyServerErrors: (e) =>
      applyServerFieldErrors(
        e,
        blueprint.fields.map((f) => f.id),
        setError,
      ),
  });

  const canPersistDraft = Boolean(
    BLUEPRINT_DRAFT_TYPES[blueprint.blueprintId] && effectivePatientId,
  );
  const showDraftActions =
    blueprint.outputKind !== 'READ_ONLY_SUMMARY' && blueprint.outputKind !== 'SEARCH';

  const formActionOverflow = canUseAiAssist
    ? [
        {
          id: 'ai-suggest',
          label: isSuggesting ? copy.forms.suggestingAi : copy.forms.suggestAi,
          onClick: () => void suggestWithAi(),
          disabled: isSuggesting,
          testId: 'epis2-ai-suggest',
        },
      ]
    : [];

  const formActionBar = showDraftActions ? (
    <EpisClinicalFormActionBar
      saveLabel={copy.forms.save}
      onSave={() => saveDraft('save')}
      saveDisabled={isSaving}
      {...(canPersistDraft ? { signLabel: copy.forms.sign, onSign: () => saveDraft('sign') } : {})}
      signDisabled={isSaving}
      overflow={formActionOverflow}
      overflowAriaLabel={copy.forms.moreActions}
    />
  ) : null;

  useEffect(() => {
    // No decidir acceso mientras la sesión aún carga (carga fría tras goto/refresh):
    // con bundle de producción el primer render gana la carrera y redirigía a /sin-acceso.
    if (sessionLoading || allowed) return;
    void navigate({
      to: '/sin-acceso',
      search: { detail: copy.forms.forbidden },
    });
  }, [sessionLoading, allowed, navigate]);

  if (!allowed) {
    return null;
  }

  if (blueprint.requiresPatient && !effectivePatientId) {
    return (
      <Stack spacing={2}>
        <EpisAlert severity="info">{copy.forms.needsPatient}</EpisAlert>
        <EpisClinicalFormFooter
          actions={
            <>
              <EpisButton component={Link} to="/espacio/buscar-paciente" appearance="filled">
                {copy.forms.searchPatient}
              </EpisButton>
              <EpisButton component={Link} to="/espacio/ficha" appearance="outlined">
                {copy.activePatient.pickPatient}
              </EpisButton>
            </>
          }
        />
        <ClinicalPageNav />
      </Stack>
    );
  }

  const headerExtra = (
    <>
      <EpisDemoBadgeChip label={copy.demoBadge} />
      {activeLiveTemplateId ? (
        <EpisChip
          label={
            EPIS2_LIVE_TEMPLATES.find((t) => t.templateId === activeLiveTemplateId)?.label ??
            activeLiveTemplateId
          }
          size="small"
          color="primary"
          variant="outlined"
          data-testid={`epis2-live-template-${activeLiveTemplateId}`}
        />
      ) : null}
      {showCommandPrefillBadge || showContextPrefillBadge ? (
        <EpisChip
          label={copy.forms.commandPrefillBadge}
          size="small"
          color="info"
          variant="outlined"
          data-testid="epis2-command-prefill-badge"
        />
      ) : null}
      {activePatient ? (
        <>
          <EpisChip
            label={activePatient.displayName}
            size="small"
            variant="outlined"
            data-testid="epis2-active-patient"
          />
          {activePatient.demoCaseCode ? (
            <EpisChip
              label={activePatient.demoCaseCode}
              size="small"
              color="secondary"
              variant="outlined"
            />
          ) : null}
        </>
      ) : null}
      {blueprint.blueprintId === 'prescription' &&
      search.chartMode === 'paper' &&
      effectivePatientId ? (
        <EpisButton
          appearance="outlined"
          size="small"
          data-testid="epis2-prescription-back-paper"
          onClick={() => navigateBackToPaperChartFromPrescriptionForm(navigate, effectivePatientId)}
        >
          {copy.chartModes.paper}
        </EpisButton>
      ) : null}
      {printable && effectivePatientId ? (
        <EpisButton
          appearance="outlined"
          size="small"
          data-testid={`epis2-print-preview-${blueprint.blueprintId}`}
          onClick={() => {
            writePrintPreview(blueprint.blueprintId, values);
            void navigate({
              to: printable.to,
              search: { patientId: effectivePatientId },
            });
          }}
        >
          {printable.ctaLabel}
        </EpisButton>
      ) : null}
    </>
  );

  if (usesScrollspyShell) {
    const scrollspyMain = (
      <Stack
        spacing={3}
        sx={{
          ...(contextOpen ? { maxWidth: '100%' } : epis2ClinicalFormContentMaxWidthSx),
          width: '100%',
        }}
      >
        <EpisM3Text role="titleLarge" component="h1">
          {effectiveBlueprint.label}
        </EpisM3Text>
        {canUseAiAssist ? <EpisAiDisclosure /> : null}
        <EpisClinicalSoapHints
          blueprintId={blueprint.blueprintId}
          values={values}
          aiAvailable={aiAvailable}
        />
        <EpisClinicalScrollspyLayout sections={scrollspySections}>
          <EpisClinicalFormRhf
            blueprint={effectiveBlueprint}
            clinicalProse={clinicalProse}
            clinicalDropEnabled
            onClinicalDrop={onClinicalDrop}
            collapseNonPrimarySections={effectiveBlueprint.sections.length > 2}
            renderClinicalTextBox={renderClinicalTextBox}
            renderCatalogField={renderCatalogField}
          />
        </EpisClinicalScrollspyLayout>
        <GeneratedFormClinicalAlerts
          enabled={showClinicalAlerts}
          alerts={clinicalAlerts}
          loading={alertsLoading}
          label={blueprint.label}
          blueprintId={blueprint.blueprintId}
        />
        <GeneratedFormStatusAlert message={statusMessage} />
        <GeneratedFormPostSaveMicrojourneys
          actions={postSaveActions}
          onDismiss={() => setPostSaveActions([])}
        />
      </Stack>
    );

    const scrollspyMainClassic = (
      <>
        {scrollspyMain}
        <EpisClinicalFormFooter actions={formActionBar} />
      </>
    );

    const scrollspyContext = effectivePatientId ? (
      <EpisClinicalContextPane
        patientId={effectivePatientId}
        defaultInsertFieldId={defaultContextInsertFieldId}
        onInsertFragment={insertContextFragment}
      />
    ) : null;

    if (isClassicMode && effectivePatientId) {
      return (
        <FormProvider {...form}>
          <ClassicMd3ClinicalPageShell
            patientId={effectivePatientId}
            draftStatusLabel={statusMessage ?? copy.clinicalLayout.draftStatus}
            mainContent={scrollspyMainClassic}
            supportingContent={supportsClinicalContext ? scrollspyContext : undefined}
          />
        </FormProvider>
      );
    }

    const twoPaneLayout = (
      <Box data-testid="epis2-generated-clinical-page" sx={{ width: '100%' }}>
        <EpisClinicalTwoPaneLayout
          appBar={
            <EpisClinicalFocusAppBar
              {...(activePatient?.displayName !== undefined
                ? { patientName: activePatient.displayName }
                : {})}
              patientMeta={headerExtra}
              contextOpen={contextOpen}
              onContextOpenChange={setContextOpen}
              showContextToggle={supportsClinicalContext}
              contextOpenLabel={copy.clinicalLayout.splitOpen}
              contextCloseLabel={copy.clinicalLayout.splitClose}
              contextOpenAria={copy.clinicalLayout.splitOpenAria}
              contextCloseAria={copy.clinicalLayout.splitCloseAria}
              trailing={
                <EpisChip
                  label={copy.clinicalLayout.draftStatus}
                  size="small"
                  variant="outlined"
                  data-testid="epis2-draft-status-chip"
                />
              }
            />
          }
          actionPane={scrollspyMain}
          contextPane={scrollspyContext}
          contextOpen={contextOpen}
          onContextOpenChange={setContextOpen}
          footer={
            <EpisClinicalFormFooter
              actions={formActionBar}
              trailing={<ClinicalPageNav patientId={effectivePatientId} />}
            />
          }
        />
      </Box>
    );

    if (useTraditionalEvolutionShell) {
      return (
        <FormProvider {...form}>
          <TraditionalEhrMode
            demoCaseCode={patientDetailQuery.data?.patient.demoCaseCode}
            summaryFields={summaryFieldsForLive}
            clinicalSummary={clinicalSummaryQuery.data ?? null}
            longitudinal={longitudinalQuery.data ?? null}
            alerts={clinicalAlerts}
            initialTraditionalSection="navEvolution"
            focusTraditionalSection="navEvolution"
            mainContent={twoPaneLayout}
            contextPane={scrollspyContext}
            testId="epis2-evolution-traditional-shell"
          />
        </FormProvider>
      );
    }

    return <FormProvider {...form}>{twoPaneLayout}</FormProvider>;
  }

  if (isClassicMode && effectivePatientId && blueprint.blueprintId !== 'patient_search') {
    return (
      <FormProvider {...form}>
        <ClassicMd3ClinicalPageShell
          patientId={effectivePatientId}
          draftStatusLabel={statusMessage ?? copy.clinicalLayout.draftStatus}
          mainContent={
            <>
              <EpisM3Text role="titleLarge" component="h1">
                {blueprint.label}
              </EpisM3Text>
              {canUseAiAssist ? <EpisAiDisclosure /> : null}
              <EpisClinicalFormRhf
                blueprint={effectiveBlueprint}
                clinicalProse={clinicalProse}
                collapseNonPrimarySections={effectiveBlueprint.sections.length > 2}
                renderClinicalTextBox={renderClinicalTextBox}
                renderCatalogField={renderCatalogField}
              />
              {showDraftActions ? <EpisClinicalFormFooter actions={formActionBar} /> : null}
              <GeneratedFormClinicalAlerts
                enabled={showClinicalAlerts}
                alerts={clinicalAlerts}
                loading={alertsLoading}
                label={blueprint.label}
                blueprintId={blueprint.blueprintId}
              />
              <GeneratedFormStatusAlert message={statusMessage} />
              <GeneratedFormPostSaveMicrojourneys
                actions={postSaveActions}
                onDismiss={() => setPostSaveActions([])}
              />
            </>
          }
        />
      </FormProvider>
    );
  }

  return (
    <FormProvider {...form}>
      <EpisClinicalFormPage title={blueprint.label} headerExtra={headerExtra}>
        {canUseAiAssist ? <EpisAiDisclosure /> : null}

        {blueprint.blueprintId === 'patient_search' ? (
          <Stack spacing={2}>
            <ShiftContextStrip />
            <PatientSearchAutocomplete
              patients={patients}
              query={patientLookupQuery}
              onQueryChange={setPatientLookupQuery}
              onSelectPatient={(row) => selectPatient(row.id)}
              loading={patientsFetching}
            />
            <EpisClinicalFormRhf
              blueprint={effectiveBlueprint}
              clinicalProse={clinicalProse}
              collapseNonPrimarySections={blueprint.sections.length > 2}
              renderClinicalTextBox={renderClinicalTextBox}
              renderCatalogField={renderCatalogField}
            />
            <EpisButton variant="outlined" onClick={() => void loadPatients()}>
              {copy.forms.searchPatients}
            </EpisButton>
            {loadError ? <EpisAlert severity="warning">{loadError}</EpisAlert> : null}
            <PatientListGrid
              rows={patients}
              emptyMessage={copy.longitudinal.emptySection}
              onSelectPatient={selectPatient}
              censusNarrative
              data-testid="epis2-patient-search-grid"
            />
          </Stack>
        ) : (
          <>
            <EpisClinicalFormRhf
              blueprint={effectiveBlueprint}
              clinicalProse={clinicalProse}
              collapseNonPrimarySections={blueprint.sections.length > 2}
              renderClinicalTextBox={renderClinicalTextBox}
              renderCatalogField={renderCatalogField}
            />
            {showDraftActions ? <EpisClinicalFormFooter actions={formActionBar} /> : null}
          </>
        )}

        <GeneratedFormClinicalAlerts
          enabled={showClinicalAlerts}
          alerts={clinicalAlerts}
          loading={alertsLoading}
          label={blueprint.label}
          blueprintId={blueprint.blueprintId}
        />
        <GeneratedFormStatusAlert message={statusMessage} />
        <GeneratedFormPostSaveMicrojourneys
          actions={postSaveActions}
          onDismiss={() => setPostSaveActions([])}
        />

        <ClinicalPageNav patientId={effectivePatientId} />
      </EpisClinicalFormPage>
    </FormProvider>
  );
}
