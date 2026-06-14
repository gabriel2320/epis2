import type { OperationalRecentPatient } from '@epis2/contracts';
import type { PatientListRow } from '../api/clinicalApi.js';
import { touchOperationalRecentPatient } from '../api/userOperationalMemoryApi.js';

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

export function hydrateRecentPatientsFromServer(rows: readonly OperationalRecentPatient[]) {
  if (rows.length === 0) return;
  const mapped: PatientListRow[] = rows.map((row) => ({
    id: row.id,
    displayName: row.displayName,
    ...(row.demoCaseCode ? { demoCaseCode: row.demoCaseCode } : {}),
  }));
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(mapped.slice(0, MAX_RECENT)));
}

export function pushRecentPatient(patient: PatientListRow) {
  const next = [patient, ...readRecentPatients().filter((p) => p.id !== patient.id)].slice(
    0,
    MAX_RECENT,
  );
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
  queueOperationalRecentPatientSync(patient);
}

let recentSyncTimer: ReturnType<typeof setTimeout> | undefined;

/** Sincroniza recientes con servidor (best-effort). */
export function queueOperationalRecentPatientSync(patient: PatientListRow) {
  if (recentSyncTimer) clearTimeout(recentSyncTimer);
  recentSyncTimer = setTimeout(() => {
    const sync = touchOperationalRecentPatient({
      id: patient.id,
      displayName: patient.displayName,
      ...(patient.demoCaseCode ? { demoCaseCode: patient.demoCaseCode } : {}),
    });
    if (sync) {
      void sync.catch(() => {
        /* offline — sessionStorage es cache local */
      });
    }
  }, 400);
}
