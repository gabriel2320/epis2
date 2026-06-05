import type {
  DocumentSearchResponse,
  PatientClinicalAlertsResponse,
  PatientLongitudinalResponse,
} from '@epis2/contracts';
import { apiFetch } from './client.js';

export type PatientListRow = {
  id: string;
  displayName: string;
  isSynthetic?: boolean;
  demoLabel?: string;
  demoCaseCode?: string;
};

export type PatientDetailResponse = {
  patient: PatientListRow;
  clinicalContext: {
    demoCaseCode?: string;
    openEncounterId?: string;
    problems: { description: string }[];
    observations: { label: string; valueText: string }[];
    summaryFields: Record<string, string>;
  };
  notes: {
    id: string;
    noteType: string;
    title: string;
    createdAt: string;
    createdBy: string;
  }[];
};

export function listPatients(query?: string) {
  const q = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
  return apiFetch<{ patients: PatientListRow[] }>(`/api/patients${q}`);
}

export function fetchPatientDetail(patientId: string) {
  return apiFetch<PatientDetailResponse>(`/api/patients/${patientId}`);
}

export function fetchPatientLongitudinal(patientId: string) {
  return apiFetch<PatientLongitudinalResponse>(`/api/patients/${patientId}/longitudinal`);
}

export function searchPatientDocuments(patientId: string, query: string) {
  const q = encodeURIComponent(query.trim());
  return apiFetch<DocumentSearchResponse>(
    `/api/patients/${patientId}/documents/search?q=${q}`,
  );
}

export function intakePatientDocument(
  patientId: string,
  body: {
    title: string;
    documentType: 'pdf' | 'txt' | 'image' | 'referral' | 'lab_report' | 'other';
    textContent?: string;
    mimeType?: string;
    filename?: string;
  },
) {
  return apiFetch<{ document: { id: string; title: string; ocrPending: boolean } }>(
    `/api/patients/${patientId}/documents/intake`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export function exportPatientSummaryUrl(patientId: string, format: 'txt' | 'pdf' = 'txt') {
  const q = format === 'pdf' ? '?format=pdf' : '';
  return `/api/patients/${patientId}/export/summary${q}`;
}

/** Blueprint EPIS2 alineado a intent del command-registry (para CDR contextual). */
export const INTENT_TO_ASSIST_BLUEPRINT: Record<string, string> = {
  create_evolution_draft: 'evolution_note',
  prepare_discharge_draft: 'discharge_summary',
  prepare_prescription: 'prescription',
  request_laboratory: 'lab_request',
  request_referral: 'referral',
  request_imaging: 'imaging_request',
  create_nursing_note: 'nursing_note',
  record_medication_administration: 'medication_administration',
  prepare_pharmacy_review: 'pharmacy_validation',
};

export const BLUEPRINT_BY_ROUTE: Record<string, string> = {
  '/espacio/evolucion': 'evolution_note',
  '/espacio/epicrisis': 'discharge_summary',
  '/espacio/receta': 'prescription',
  '/espacio/laboratorio': 'lab_request',
  '/espacio/interconsulta': 'referral',
  '/espacio/imagenologia': 'imaging_request',
  '/espacio/enfermeria': 'nursing_note',
  '/espacio/mar': 'medication_administration',
  '/espacio/farmacia': 'pharmacy_validation',
};

export const DRAFT_TYPE_TO_BLUEPRINT: Record<string, string> = {
  evolution_note: 'evolution_note',
  discharge_summary: 'discharge_summary',
  prescription: 'prescription',
  lab_request: 'lab_request',
  referral: 'referral',
  imaging_request: 'imaging_request',
  nursing_note: 'nursing_note',
  medication_administration: 'medication_administration',
  pharmacy_validation: 'pharmacy_validation',
};

const SUMMARY_CONTEXT_KEYS = [
  'activeProblems',
  'recentEvents',
  'relevantLabs',
  'activeMedications',
  'pendingItems',
  'clinicalAlerts',
] as const;

/** Subconjunto de resumen demo para contexto de asistencia IA. */
export function pickAssistContextFromSummary(
  summaryFields: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of SUMMARY_CONTEXT_KEYS) {
    const value = summaryFields[key]?.trim();
    if (value) out[key] = value;
  }
  return out;
}

export function fetchPatientClinicalAlerts(
  patientId: string,
  options?: { blueprintId?: string; currentFields?: Record<string, string> },
) {
  const params = new URLSearchParams();
  if (options?.blueprintId) params.set('blueprintId', options.blueprintId);
  if (options?.currentFields && Object.keys(options.currentFields).length > 0) {
    params.set('fields', JSON.stringify(options.currentFields));
  }
  const q = params.toString();
  return apiFetch<PatientClinicalAlertsResponse>(
    `/api/patients/${patientId}/clinical-alerts${q ? `?${q}` : ''}`,
  );
}

export type ClinicalDraftSummary = {
  id: string;
  patientId: string;
  draftType: string;
  status: string;
  title: string;
  updatedAt: string;
};

export type DraftVersionRow = {
  versionNo: number;
  status: string;
  title: string;
  createdAt: string;
  createdBy: string;
};

export type ClinicalDraftDetail = {
  id: string;
  patientId: string;
  draftType: string;
  status: string;
  title: string;
  body: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export function listDrafts(params?: { patientId?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params?.patientId) search.set('patientId', params.patientId);
  if (params?.status) search.set('status', params.status);
  const q = search.toString();
  return apiFetch<{ drafts: ClinicalDraftSummary[] }>(
    `/api/drafts${q ? `?${q}` : ''}`,
  );
}

export function fetchDraftDetail(draftId: string) {
  return apiFetch<{
    draft: ClinicalDraftDetail;
    versions: DraftVersionRow[];
  }>(`/api/drafts/${draftId}`);
}

export function updateDraft(
  draftId: string,
  body: { title?: string; body?: Record<string, unknown>; status?: string },
) {
  return apiFetch<{ draft: ClinicalDraftDetail }>(`/api/drafts/${draftId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function approveDraft(draftId: string) {
  return apiFetch<{ draft: ClinicalDraftDetail; note: { id: string; title: string } }>(
    `/api/drafts/${draftId}/approve`,
    { method: 'POST', body: '{}' },
  );
}
