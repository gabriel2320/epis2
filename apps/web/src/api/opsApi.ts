import type { Hl7ValidateResponse, QualityDashboardResponse } from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchQualityDashboard() {
  return apiFetch<QualityDashboardResponse>('/api/dashboard/quality');
}

export function validateHl7Message(message: string) {
  return apiFetch<Hl7ValidateResponse>('/api/interop/hl7/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

export function quarantineHl7Message(message: string) {
  return apiFetch<{
    readOnly: true;
    quarantineId: string;
    messageType?: string;
    status: 'quarantine';
  }>('/api/interop/hl7/quarantine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}
