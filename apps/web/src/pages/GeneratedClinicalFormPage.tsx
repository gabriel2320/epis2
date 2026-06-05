import {

  BLUEPRINT_DRAFT_TYPES,

  blueprintSupportsClinicalContext,

  blueprintUsesClinicalProse,

  defaultSummaryValues,

  initialFormValues,

  validateFormValues,

  type ClinicalFormBlueprint,

} from '@epis2/clinical-forms';

import { roleHasPermission, sanitizeAiSuggestedFields, type ClinicalRole } from '@epis2/clinical-domain';

import { copy } from '@epis2/design-system';

import {

  EpisAiDisclosure,

  EpisAlert,

  EpisButton,

  EpisChip,

  Box,

  EpisClinicalFocusAppBar,

  EpisClinicalForm,

  EpisClinicalFormPage,

  EpisClinicalTwoPaneLayout,

  EpisM3Text,

  Stack,

  useEpisClinicalContextPanel,

} from '@epis2/epis2-ui';

import { Link, useSearch } from '@tanstack/react-router';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiError } from '../api/client.js';

import { apiFetch } from '../api/client.js';

import { fetchAiStatus, requestDraftAssist } from '../api/aiApi.js';

import {

  fetchPatientDetail,

  listPatients,

  pickAssistContextFromSummary,

  type PatientListRow,

} from '../api/clinicalApi.js';

import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';

import {
  EpisClinicalContextPane,
  type ClinicalContextInsertPayload,
} from '../components/EpisClinicalContextPane.js';

import { EpisClinicalSoapHints } from '../components/EpisClinicalSoapHints.js';

import { ClinicalPageNav } from '../components/ClinicalPageNav.js';

import { PatientListGrid } from '../components/PatientListGrid.js';

import { useAuth } from '../auth/AuthContext.js';

import { useActivePatient } from '../clinical/ActivePatientContext.js';

import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';

import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

import type { ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';



export type GeneratedClinicalFormPageProps = {

  blueprint: ClinicalFormBlueprint;

};



export function GeneratedClinicalFormPage({ blueprint }: GeneratedClinicalFormPageProps) {

  const { session } = useAuth();

  const { patient: activePatient, setPatient: pinPatient } = useActivePatient();

  const navigate = useClinicalNavigate();

  const search = useSearch({ strict: false }) as { patientId?: string };

  const urlPatientId = search.patientId;

  const effectivePatientId = urlPatientId ?? activePatient?.id;



  const seed = useMemo(() => {

    if (blueprint.blueprintId === 'patient_summary') {

      return defaultSummaryValues();

    }

    return undefined;

  }, [blueprint.blueprintId]);



  const [values, setValues] = useState(() => initialFormValues(blueprint, seed));

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [statusMessage, setStatusMessage] = useState<string | undefined>();

  const [patients, setPatients] = useState<PatientListRow[]>([]);

  const [loadError, setLoadError] = useState<string | undefined>();

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);

  const [assistContext, setAssistContext] = useState<Record<string, string>>({});

  const canUseAiAssist = blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES;
  const clinicalProse = blueprintUsesClinicalProse(blueprint.blueprintId);
  const supportsClinicalContext = blueprintSupportsClinicalContext(blueprint.blueprintId);
  const { contextOpen, setContextOpen } = useEpisClinicalContextPanel();



  const { alerts: clinicalAlerts, loading: alertsLoading } = usePatientClinicalAlerts({

    patientId: effectivePatientId,

    blueprintId:

      blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES

        ? blueprint.blueprintId

        : undefined,

    contextLabel: blueprint.label,

    enabled: Boolean(effectivePatientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES),

  });



  const role = session?.user.role as ClinicalRole | undefined;

  const needsDraftWrite =

    blueprint.outputKind === 'CLINICAL_NOTE_DRAFT' || blueprint.outputKind === 'ORDER_DRAFT';

  const allowed =

    role !== undefined &&

    blueprint.allowedRoles.includes(role) &&

    (!needsDraftWrite || roleHasPermission(role, 'draft.write'));



  useEffect(() => {
    if (!supportsClinicalContext) return;
    void fetchAiStatus()
      .then((res) => setAiAvailable(res.available))
      .catch(() => setAiAvailable(false));
  }, [supportsClinicalContext]);

  useEffect(() => {

    if (urlPatientId || !activePatient?.id || !blueprint.requiresPatient) return;

    navigate({

      to: blueprint.routePath as ClinicalFormRoutePath,

      search: { patientId: activePatient.id },

    });

  }, [urlPatientId, activePatient?.id, blueprint.requiresPatient, blueprint.routePath, navigate]);



  const onChange = useCallback((fieldId: string, value: string) => {

    setValues((prev) => ({ ...prev, [fieldId]: value }));

    setFieldErrors((prev) => {

      const next = { ...prev };

      delete next[fieldId];

      return next;

    });

  }, []);



  const insertContextFragment = useCallback((payload: ClinicalContextInsertPayload) => {

    const fieldId = payload.fieldId ?? 'plan';

    const line = payload.text.trim();

    if (!line) return;

    setValues((prev) => {

      const current = prev[fieldId]?.trim();

      return {

        ...prev,

        [fieldId]: current ? `${current}\n${line}` : line,

      };

    });

    setStatusMessage(copy.clinicalLayout.insertSuccess);

  }, []);



  const loadPatients = useCallback(async () => {

    setLoadError(undefined);

    const term = values.identifier?.trim() || values.patientName?.trim();

    try {

      const res = await listPatients(term || undefined);

      setPatients(res.patients);

    } catch {

      setPatients([]);

      setLoadError(copy.forms.loadPatientsError);

    }

  }, [values.identifier, values.patientName]);



  useEffect(() => {

    if (!effectivePatientId) return;

    void fetchPatientDetail(effectivePatientId)

      .then((res) => {

        pinPatient(res.patient);

        setAssistContext(pickAssistContextFromSummary(res.clinicalContext.summaryFields));

        if (blueprint.blueprintId === 'patient_summary') {

          setValues((prev) => ({ ...prev, ...res.clinicalContext.summaryFields }));

        }

      })

      .catch(() => undefined);

  }, [effectivePatientId, blueprint.blueprintId, pinPatient]);



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



  const suggestWithAi = async () => {

    setIsSuggesting(true);

    setStatusMessage(undefined);

    try {

      const assistBody: Parameters<typeof requestDraftAssist>[0] = {

        blueprintId: blueprint.blueprintId,

        currentFields: values,

        context: { demo: copy.demoBadge, ...assistContext },

      };

      if (effectivePatientId !== undefined) assistBody.patientId = effectivePatientId;

      const result = await requestDraftAssist(assistBody);

      if (result.status === 'success') {

        setValues((prev) => {

          const next = { ...prev };

          for (const [key, value] of Object.entries(

            sanitizeAiSuggestedFields(result.suggestedFields),

          )) {

            if (!next[key]?.trim()) {

              next[key] = value;

            }

          }

          return next;

        });

        setStatusMessage(copy.forms.aiApplied);

        return;

      }

      if (result.status === 'rejected') {

        setStatusMessage(result.message || copy.forms.aiRejected);

        return;

      }

      setStatusMessage(result.message || copy.forms.aiUnavailable);

    } catch (e) {

      if (e instanceof ApiError && (e.status === 503 || e.status === 422)) {

        setStatusMessage(e.message || copy.forms.aiUnavailable);

      } else {

        setStatusMessage(copy.forms.aiUnavailable);

      }

    } finally {

      setIsSuggesting(false);

    }

  };



  const saveDraft = async () => {

    setStatusMessage(undefined);

    const validation = validateFormValues(blueprint, values);

    if (!validation.valid) {

      const map: Record<string, string> = {};

      for (const e of validation.errors) {

        map[e.fieldId] = e.message;

      }

      setFieldErrors(map);

      setStatusMessage(copy.forms.validationRequired);

      return;

    }



    const draftType = BLUEPRINT_DRAFT_TYPES[blueprint.blueprintId];

    if (!draftType || !effectivePatientId) {

      setStatusMessage(copy.forms.demoValidLocal);

      return;

    }



    try {

      const created = await apiFetch<{ draft: { id: string } }>('/api/drafts', {

        method: 'POST',

        body: JSON.stringify({

          patientId: effectivePatientId,

          draftType,

          title: blueprint.label,

          body: values,

        }),

      });

      navigate({

        to: '/espacio/borrador/$draftId',

        params: { draftId: created.draft.id },

      });

    } catch (e) {

      setStatusMessage(

        e instanceof ApiError ? e.message : copy.forms.saveDraftError,

      );

    }

  };



  useEffect(() => {
    if (!allowed) {
      void navigate({
        to: '/sin-acceso',
        search: { detail: copy.forms.forbidden },
      });
    }
  }, [allowed, navigate]);

  if (!allowed) {
    return null;
  }



  if (blueprint.requiresPatient && !effectivePatientId) {

    return (

      <Stack spacing={2}>

        <EpisAlert severity="info">{copy.forms.needsPatient}</EpisAlert>

        <Stack direction="row" spacing={1} flexWrap="wrap">

          <EpisButton component={Link} to="/espacio/buscar-paciente" variant="contained">

            {copy.forms.searchPatient}

          </EpisButton>

          <EpisButton component={Link} to="/espacio/ficha" variant="outlined">

            {copy.activePatient.pickPatient}

          </EpisButton>

        </Stack>

        <ClinicalPageNav />

      </Stack>

    );

  }



  const headerExtra = (

    <>

      <EpisChip label={copy.demoBadge} size="small" color="warning" variant="outlined" />

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

              color="warning"

              variant="outlined"

            />

          ) : null}

        </>

      ) : null}

    </>

  );



  if (supportsClinicalContext) {

    return (

      <Box data-testid="epis2-generated-clinical-page" sx={{ width: '100%' }}>

        <EpisClinicalTwoPaneLayout

          appBar={

            <EpisClinicalFocusAppBar

              patientName={activePatient?.displayName}

              patientMeta={headerExtra}

              contextOpen={contextOpen}

              onContextOpenChange={setContextOpen}

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

          actionPane={

            <Stack

              spacing={3}

              sx={{

                maxWidth: contextOpen ? '100%' : 640,

                mx: 'auto',

                width: '100%',

              }}

            >

              <EpisM3Text role="titleLarge" component="h1">

                {blueprint.label}

              </EpisM3Text>

              {canUseAiAssist ? <EpisAiDisclosure /> : null}

              <EpisClinicalSoapHints

                blueprintId={blueprint.blueprintId}

                values={values}

                aiAvailable={aiAvailable}

              />

              <EpisClinicalForm

                blueprint={blueprint}

                values={values}

                errors={fieldErrors}

                clinicalProse={clinicalProse}

                onChange={onChange}

              />

              {canUseAiAssist ? (

                <EpisButton

                  variant="outlined"

                  disabled={isSuggesting}

                  onClick={() => void suggestWithAi()}

                  data-testid="epis2-ai-suggest"

                >

                  {isSuggesting ? copy.forms.suggestingAi : copy.forms.suggestAi}

                </EpisButton>

              ) : null}

              {effectivePatientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES ? (

                <ClinicalAlertsPanel

                  alerts={clinicalAlerts}

                  loading={alertsLoading}

                  hintBlueprintLabel={blueprint.label}

                />

              ) : null}

              {statusMessage ? (

                <EpisAlert

                  severity={statusMessage.includes('guardado') ? 'success' : 'info'}

                  data-testid="epis2-form-status"

                >

                  {statusMessage}

                </EpisAlert>

              ) : null}

            </Stack>

          }

          contextPane={

            effectivePatientId ? (

              <EpisClinicalContextPane

                patientId={effectivePatientId}

                onInsertFragment={insertContextFragment}

              />

            ) : null

          }

          contextOpen={contextOpen}

          onContextOpenChange={setContextOpen}

          footer={

            <Stack spacing={2}>

              <EpisButton variant="contained" onClick={() => void saveDraft()}>

                {copy.forms.saveDraft}

              </EpisButton>

              <ClinicalPageNav patientId={effectivePatientId} />

            </Stack>

          }

        />

      </Box>

    );

  }



  return (

    <EpisClinicalFormPage title={blueprint.label} headerExtra={headerExtra}>

      {canUseAiAssist ? <EpisAiDisclosure /> : null}



      {blueprint.blueprintId === 'patient_search' ? (

        <Stack spacing={2}>

          <EpisClinicalForm

            blueprint={blueprint}

            values={values}

            errors={fieldErrors}

            clinicalProse={clinicalProse}

            onChange={onChange}

          />

          <EpisButton variant="outlined" onClick={() => void loadPatients()}>

            {copy.forms.searchPatients}

          </EpisButton>

          {loadError ? <EpisAlert severity="warning">{loadError}</EpisAlert> : null}

          <PatientListGrid

            rows={patients}

            emptyMessage={copy.longitudinal.emptySection}

            onSelectPatient={selectPatient}

            data-testid="epis2-patient-search-grid"

          />

        </Stack>

      ) : (

        <>

          <EpisClinicalForm

            blueprint={blueprint}

            values={values}

            errors={fieldErrors}

            clinicalProse={clinicalProse}

            onChange={onChange}

          />

          {blueprint.outputKind !== 'READ_ONLY_SUMMARY' &&

          blueprint.outputKind !== 'SEARCH' ? (

            <Stack direction="row" spacing={1} flexWrap="wrap">

              {canUseAiAssist ? (

                <EpisButton

                  variant="outlined"

                  disabled={isSuggesting}

                  onClick={() => void suggestWithAi()}

                  data-testid="epis2-ai-suggest"

                >

                  {isSuggesting ? copy.forms.suggestingAi : copy.forms.suggestAi}

                </EpisButton>

              ) : null}

              <EpisButton variant="contained" onClick={() => void saveDraft()}>

                {copy.forms.saveDraft}

              </EpisButton>

            </Stack>

          ) : null}

        </>

      )}



      {effectivePatientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES ? (

        <ClinicalAlertsPanel

          alerts={clinicalAlerts}

          loading={alertsLoading}

          hintBlueprintLabel={blueprint.label}

        />

      ) : null}



      {statusMessage ? (

        <EpisAlert

          severity={statusMessage.includes('guardado') ? 'success' : 'info'}

          data-testid="epis2-form-status"

        >

          {statusMessage}

        </EpisAlert>

      ) : null}



      <ClinicalPageNav patientId={effectivePatientId} />

    </EpisClinicalFormPage>

  );

}


