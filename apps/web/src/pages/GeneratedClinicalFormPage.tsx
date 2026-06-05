import {
  BLUEPRINT_DRAFT_TYPES,
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
  EpisClinicalForm,
  EpisClinicalFormPage,
  Stack,
} from '@epis2/epis2-ui';
import { Link, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client.js';
import { apiFetch } from '../api/client.js';
import { requestDraftAssist } from '../api/aiApi.js';
import {
  fetchPatientDetail,
  listPatients,
  pickAssistContextFromSummary,
  type PatientListRow,
} from '../api/clinicalApi.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
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
  const patientId = search.patientId;

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
  const [assistContext, setAssistContext] = useState<Record<string, string>>({});
  const canUseAiAssist = blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES;

  const draftFieldValues = useMemo(() => {
    if (blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES) {
      return values;
    }
    return undefined;
  }, [blueprint.blueprintId, values]);

  const { alerts: clinicalAlerts, loading: alertsLoading } = usePatientClinicalAlerts({
    patientId,
    blueprintId:
      blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES
        ? blueprint.blueprintId
        : undefined,
    currentFields: draftFieldValues,
    contextLabel: blueprint.label,
    debounceMs: 450,
    enabled: Boolean(patientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES),
  });

  const role = session?.user.role as ClinicalRole | undefined;
  const needsDraftWrite =
    blueprint.outputKind === 'CLINICAL_NOTE_DRAFT' || blueprint.outputKind === 'ORDER_DRAFT';
  const allowed =
    role !== undefined &&
    blueprint.allowedRoles.includes(role) &&
    (!needsDraftWrite || roleHasPermission(role, 'draft.write'));

  const onChange = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const loadPatients = useCallback(async () => {
    setLoadError(undefined);
    const term = values.identifier?.trim() || values.patientName?.trim();
    try {
      const res = await listPatients(term || undefined);
      setPatients(res.patients);
    } catch {
      setPatients([]);
      setLoadError('No hay pacientes demo disponibles (¿API y base de datos activos?)');
    }
  }, [values.identifier, values.patientName]);

  useEffect(() => {
    if (!patientId) return;
    void fetchPatientDetail(patientId)
      .then((res) => {
        pinPatient(res.patient);
        setAssistContext(pickAssistContextFromSummary(res.clinicalContext.summaryFields));
        if (blueprint.blueprintId === 'patient_summary') {
          setValues((prev) => ({ ...prev, ...res.clinicalContext.summaryFields }));
        }
      })
      .catch(() => undefined);
  }, [patientId, blueprint.blueprintId, pinPatient]);

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
      if (patientId !== undefined) assistBody.patientId = patientId;
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
      setStatusMessage('Revisa los campos obligatorios.');
      return;
    }

    const draftType = BLUEPRINT_DRAFT_TYPES[blueprint.blueprintId];
    if (!draftType || !patientId) {
      setStatusMessage('Formulario válido (demo local). Conecta paciente y API para guardar borrador.');
      return;
    }

    try {
      const created = await apiFetch<{ draft: { id: string } }>('/api/drafts', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
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
        e instanceof ApiError ? e.message : 'No se pudo guardar el borrador.',
      );
    }
  };

  if (!allowed) {
    return <EpisAlert severity="warning">Tu rol no puede usar este formulario.</EpisAlert>;
  }

  if (blueprint.requiresPatient && !patientId) {
    return (
      <Stack spacing={2}>
        <EpisAlert severity="info">{copy.forms.needsPatient}</EpisAlert>
        {blueprint.blueprintId === 'patient_search' ? null : (
          <EpisButton component={Link} to="/espacio/buscar-paciente" variant="contained">
            Buscar paciente
          </EpisButton>
        )}
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

  return (
    <EpisClinicalFormPage title={blueprint.label} headerExtra={headerExtra}>
      {patientId && blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES ? (
        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={blueprint.label}
        />
      ) : null}

      {canUseAiAssist ? <EpisAiDisclosure /> : null}

      {blueprint.blueprintId === 'patient_search' ? (
        <Stack spacing={2}>
          <EpisClinicalForm
            blueprint={blueprint}
            values={values}
            errors={fieldErrors}
            onChange={onChange}
          />
          <EpisButton variant="outlined" onClick={() => void loadPatients()}>
            {copy.forms.searchPatients}
          </EpisButton>
          {loadError ? <EpisAlert severity="warning">{loadError}</EpisAlert> : null}
          <Stack spacing={1}>
            {patients.map((p) => (
              <EpisButton
                key={p.id}
                variant="text"
                onClick={() => selectPatient(p.id)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {p.displayName}
                {p.demoLabel ? ` · ${p.demoLabel}` : ''}
              </EpisButton>
            ))}
          </Stack>
        </Stack>
      ) : (
        <>
          <EpisClinicalForm
            blueprint={blueprint}
            values={values}
            errors={fieldErrors}
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

      {statusMessage ? (
        <EpisAlert
          severity={statusMessage.includes('guardado') ? 'success' : 'info'}
          data-testid="epis2-form-status"
        >
          {statusMessage}
        </EpisAlert>
      ) : null}
    </EpisClinicalFormPage>
  );
}
