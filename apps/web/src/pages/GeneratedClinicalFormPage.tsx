import {
  BLUEPRINT_DRAFT_TYPES,
  defaultSummaryValues,
  initialFormValues,
  validateFormValues,
  type ClinicalFormBlueprint,
} from '@epis2/clinical-forms';
import { requestDraftAssist } from '../api/aiApi.js';
import { roleHasPermission, sanitizeAiSuggestedFields, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client.js';
import { apiFetch } from '../api/client.js';
import {
  fetchPatientDetail,
  listPatients,
  type PatientListRow,
} from '../api/clinicalApi.js';
import { ClinicalFormRenderer } from '../components/ClinicalFormRenderer.js';
import { useAuth } from '../auth/AuthContext.js';

export type GeneratedClinicalFormPageProps = {
  blueprint: ClinicalFormBlueprint;
};

export function GeneratedClinicalFormPage({ blueprint }: GeneratedClinicalFormPageProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
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
  const [activePatient, setActivePatient] = useState<PatientListRow | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const canUseAiAssist = blueprint.blueprintId in BLUEPRINT_DRAFT_TYPES;

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
    try {
      const res = await listPatients();
      setPatients(res.patients);
    } catch {
      setPatients([]);
      setLoadError('No hay pacientes demo disponibles (¿API y base de datos activos?)');
    }
  }, []);

  useEffect(() => {
    if (!patientId) {
      setActivePatient(null);
      return;
    }
    void fetchPatientDetail(patientId)
      .then((res) => {
        setActivePatient(res.patient);
        if (blueprint.blueprintId === 'patient_summary') {
          setValues((prev) => ({ ...prev, ...res.clinicalContext.summaryFields }));
        }
      })
      .catch(() => setActivePatient(null));
  }, [patientId, blueprint.blueprintId]);

  const selectPatient = (id: string) => {
    void navigate({
      to: blueprint.routePath,
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
        context: { demo: copy.demoBadge },
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
      void navigate({
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
    return (
      <Alert severity="warning">
        Tu rol no puede usar este formulario.
      </Alert>
    );
  }

  if (blueprint.requiresPatient && !patientId) {
    return (
      <Stack spacing={2}>
        <Alert severity="info">{copy.forms.needsPatient}</Alert>
        {blueprint.blueprintId === 'patient_search' ? null : (
          <Button component={Link} to="/espacio/buscar-paciente" variant="contained">
            Buscar paciente
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3 }} data-testid="epis2-generated-clinical-page">
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" component="h1">
            {blueprint.label}
          </Typography>
          <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
          {activePatient ? (
            <>
              <Chip
                label={activePatient.displayName}
                size="small"
                variant="outlined"
                data-testid="epis2-active-patient"
              />
              {activePatient.demoCaseCode ? (
                <Chip
                  label={activePatient.demoCaseCode}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              ) : null}
            </>
          ) : null}
        </Stack>

        {blueprint.blueprintId === 'patient_search' ? (
          <Stack spacing={2}>
            <ClinicalFormRenderer
              blueprint={blueprint}
              values={values}
              errors={fieldErrors}
              onChange={onChange}
            />
            <Button variant="outlined" onClick={() => void loadPatients()}>
              {copy.forms.searchPatients}
            </Button>
            {loadError ? <Alert severity="warning">{loadError}</Alert> : null}
            <Stack spacing={1}>
              {patients.map((p) => (
                <Button
                  key={p.id}
                  variant="text"
                  onClick={() => selectPatient(p.id)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {p.displayName}
                  {p.demoLabel ? ` · ${p.demoLabel}` : ''}
                </Button>
              ))}
            </Stack>
          </Stack>
        ) : (
          <>
            <ClinicalFormRenderer
              blueprint={blueprint}
              values={values}
              errors={fieldErrors}
              onChange={onChange}
            />
            {blueprint.outputKind !== 'READ_ONLY_SUMMARY' &&
            blueprint.outputKind !== 'SEARCH' ? (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {canUseAiAssist ? (
                  <Button
                    variant="outlined"
                    disabled={isSuggesting}
                    onClick={() => void suggestWithAi()}
                    data-testid="epis2-ai-suggest"
                  >
                    {isSuggesting ? copy.forms.suggestingAi : copy.forms.suggestAi}
                  </Button>
                ) : null}
                <Button variant="contained" onClick={() => void saveDraft()}>
                  {copy.forms.saveDraft}
                </Button>
              </Stack>
            ) : null}
          </>
        )}

        {statusMessage ? (
          <Alert
            severity={statusMessage.includes('guardado') ? 'success' : 'info'}
            data-testid="epis2-form-status"
          >
            {statusMessage}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
