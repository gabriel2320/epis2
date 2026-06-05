import type {
  DashboardWorkResponse,
  NursingDashboardResponse,
  PatientDashboardResponse,
  PharmacyDashboardResponse,
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

export function fetchNursingDashboard() {
  return apiFetch<NursingDashboardResponse>('/api/dashboard/nursing');
}

export function fetchPharmacyDashboard() {
  return apiFetch<PharmacyDashboardResponse>('/api/dashboard/pharmacy');
}

export function acknowledgeCriticalResult(criticalId: string) {
  return apiFetch<{ id: string; acknowledgedAt: string; readOnly: true }>(
    `/api/inpatient/critical-results/${criticalId}/acknowledge`,
    { method: 'POST' },
  );
}

export function createInpatientAdmission(body: {
  patientId: string;
  bedId: string;
  unitCode?: string;
}) {
  return apiFetch<{ admission: { id: string; bedLabel: string } }>(
    '/api/inpatient/admissions',
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export function transferInpatientAdmission(admissionId: string, targetBedId: string) {
  return apiFetch<{ toBedLabel: string }>(
    `/api/inpatient/admissions/${admissionId}/transfer`,
    { method: 'POST', body: JSON.stringify({ targetBedId }) },
  );
}

export function dischargeInpatientAdmission(admissionId: string) {
  return apiFetch<{ patientId: string; epicrisisRoute: string }>(
    `/api/inpatient/admissions/${admissionId}/discharge`,
    { method: 'POST' },
  );
}
