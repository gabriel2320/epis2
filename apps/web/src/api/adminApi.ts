import { apiFetch } from './client.js';

export type AdminUserRow = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  isSynthetic: boolean;
};

export type CatalogEntryRow = {
  id: string;
  catalogCode: string;
  entryCode: string;
  label: string;
  status: string;
  createdAt: string;
};

export function fetchAdminUsers() {
  return apiFetch<{ readOnly: true; users: AdminUserRow[] }>('/api/admin/users');
}

export function fetchAdminCatalogs(catalogCode?: string) {
  const q = catalogCode ? `?catalogCode=${encodeURIComponent(catalogCode)}` : '';
  return apiFetch<{ readOnly: false; entries: CatalogEntryRow[] }>(`/api/admin/catalogs${q}`);
}

export function createAdminCatalogEntry(body: {
  catalogCode: string;
  entryCode: string;
  label: string;
}) {
  return apiFetch<{ entry: CatalogEntryRow }>('/api/admin/catalogs', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchAuditEvents(limit = 50) {
  return apiFetch<{ readOnly: true; events: Array<Record<string, unknown>> }>(
    `/api/audit/events?limit=${limit}`,
  );
}

export function fetchOpsStatus() {
  return apiFetch<Record<string, unknown>>('/api/ops/status');
}
