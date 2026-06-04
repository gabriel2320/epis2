import type { PatientListRow } from '../api/clinicalApi.js';

const RECENT_KEY = 'epis2_recent_patients';
const MAX_RECENT = 5;

export function readRecentPatients(): PatientListRow[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PatientListRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentPatient(patient: PatientListRow) {
  const next = [patient, ...readRecentPatients().filter((p) => p.id !== patient.id)].slice(
    0,
    MAX_RECENT,
  );
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
}
