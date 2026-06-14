import type {
  OperationalCatalogUsage,
  OperationalMemoryResponse,
  PatchOperationalMemoryRequest,
} from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchOperationalMemory(patientId?: string) {
  const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
  return apiFetch<OperationalMemoryResponse>(`/api/user/operational-memory${q}`);
}

export function patchOperationalMemory(
  patch: PatchOperationalMemoryRequest,
  patientId?: string,
) {
  const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
  return apiFetch<OperationalMemoryResponse>(`/api/user/operational-memory${q}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export function touchOperationalRecentPatient(input: {
  id: string;
  displayName: string;
  demoCaseCode?: string | undefined;
}) {
  return apiFetch<{ ok: true }>(`/api/user/operational-memory/recent-patients`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function bumpCatalogUsage(body: {
  domain: 'medication' | 'laboratory' | 'diagnosis';
  key: string;
}) {
  return apiFetch<{ ok: true; catalogUsage: OperationalCatalogUsage }>(
    `/api/user/operational-memory/catalog-usage`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
}
