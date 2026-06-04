import type {
  DashboardWorkResponse,
  PatientDashboardResponse,
  ServiceDashboardResponse,
} from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchDashboardWork() {
  return apiFetch<DashboardWorkResponse>('/api/dashboard/work');
}

export function fetchPatientDashboard(patientId: string) {
  return apiFetch<PatientDashboardResponse>(`/api/dashboard/patient/${patientId}`);
}

export function fetchServiceDashboard(unitCode?: string) {
  const q = unitCode ? `?unit=${encodeURIComponent(unitCode)}` : '';
  return apiFetch<ServiceDashboardResponse>(`/api/dashboard/service${q}`);
}

export function acknowledgeCriticalResult(criticalId: string) {
  return apiFetch<{ id: string; acknowledgedAt: string; readOnly: true }>(
    `/api/inpatient/critical-results/${criticalId}/acknowledge`,
    { method: 'POST' },
  );
}
