import type { DashboardWorkResponse, PatientDashboardResponse } from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchDashboardWork() {
  return apiFetch<DashboardWorkResponse>('/api/dashboard/work');
}

export function fetchPatientDashboard(patientId: string) {
  return apiFetch<PatientDashboardResponse>(`/api/dashboard/patient/${patientId}`);
}
