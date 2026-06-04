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
